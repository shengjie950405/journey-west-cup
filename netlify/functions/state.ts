import { getDeployStore, getStore } from '@netlify/blobs';
import { applyPatch, canApply, emptyState, parsePatch } from '../../shared/state';
import type { Player, Role, Score, SchedOverride, TeamId, TournamentState } from '../../shared/types';

const STORE_NAME = 'journey-west-cup';

/**
 * Production writes to the global store; previews and branch deploys get their
 * own deploy-scoped store, so testing never touches live tournament data.
 */
function store() {
  const opts = { name: STORE_NAME, consistency: 'strong' as const };
  const ctx = (globalThis as { Netlify?: { context?: { deploy?: { context?: string } } } })
    .Netlify?.context?.deploy?.context;
  return ctx === 'production' ? getStore(opts) : getDeployStore(opts);
}

/**
 * Roles come from PINs held in Netlify environment variables — never shipped
 * to the browser. A missing or unknown PIN is just a spectator.
 */
function roleFor(pin: unknown): Role {
  if (typeof pin !== 'string' || !pin) return 'player';
  if (process.env.ADMIN_PIN && pin === process.env.ADMIN_PIN) return 'admin';
  if (process.env.CAPTAIN_PIN && pin === process.env.CAPTAIN_PIN) return 'captain';
  return 'player';
}

const SNAPSHOT = 'snapshot';

// One blob per entity. Writers only ever touch their own key, so a captain
// saving a roster can never clobber a score written a moment earlier.
const keyScore = (id: string) => `e/score/${id}`;
const keySched = (id: string) => `e/sched/${id}`;
const keyName = (id: string) => `e/name/${id}`;
const keyRoster = (id: string) => `e/roster/${id}`;

type Blobs = ReturnType<typeof store>;

/**
 * Rebuilds the aggregate snapshot from the per-entity blobs, which are the
 * source of truth. Runs after each write (writes are rare); readers then need
 * only a single GET.
 */
async function rebuild(s: Blobs, prev: TournamentState): Promise<TournamentState> {
  const { blobs } = await s.list({ prefix: 'e/' });

  const next: TournamentState = {
    ...emptyState(),
    audit: prev.audit,
    rev: Date.now(),
    updatedAt: new Date().toISOString(),
  };

  await Promise.all(
    blobs.map(async ({ key }) => {
      const value = await s.get(key, { type: 'json' });
      if (value == null) return;
      const [, kind, id] = key.split('/');
      if (kind === 'score') next.scores[id] = value as Score;
      else if (kind === 'sched') next.sched[id] = value as SchedOverride;
      else if (kind === 'name') next.teamNames[id as TeamId] = value as string;
      else if (kind === 'roster') next.rosters[id as TeamId] = value as Player[];
    }),
  );

  return next;
}

async function readSnapshot(s: Blobs): Promise<TournamentState> {
  const snap = (await s.get(SNAPSHOT, { type: 'json' })) as TournamentState | null;
  return snap ?? emptyState();
}

export default async (req: Request): Promise<Response> => {
  const s = store();

  if (req.method === 'GET') {
    return Response.json(
      { state: await readSnapshot(s) },
      { headers: { 'cache-control': 'no-store' } },
    );
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'method_not_allowed' }, { status: 405 });
  }

  let body: { pin?: unknown; patch?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad_json' }, { status: 400 });
  }

  const role = roleFor(body.pin);
  const patch = parsePatch(body.patch);
  if (!patch) return Response.json({ error: 'bad_patch' }, { status: 400 });

  // The UI hides what a role cannot do; this is what actually enforces it.
  if (!canApply(role, patch.kind)) {
    return Response.json({ error: 'forbidden', role }, { status: 403 });
  }

  const prev = await readSnapshot(s);

  if (patch.kind === 'reset') {
    const { blobs } = await s.list({ prefix: 'e/' });
    await Promise.all(blobs.map(({ key }) => s.delete(key)));
  } else if (patch.kind === 'score') {
    await s.setJSON(keyScore(patch.gameId), patch.value);
    if (patch.sched) await s.setJSON(keySched(patch.gameId), patch.sched);
    else await s.delete(keySched(patch.gameId));
  } else if (patch.kind === 'clearScore') {
    await s.delete(keyScore(patch.gameId));
  } else if (patch.kind === 'teamName') {
    await s.setJSON(keyName(patch.teamId), patch.value);
  } else if (patch.kind === 'roster') {
    await s.setJSON(keyRoster(patch.teamId), patch.value);
  }

  // Recompose from the entity blobs, then re-apply the patch to record the audit
  // entry. Re-applying is idempotent — the entity write above already landed.
  // Two writers racing here both see each other's entities; at worst one audit
  // line is lost, never a score.
  const rebuilt = await rebuild(s, prev);
  const settled: TournamentState = { ...applyPatch(rebuilt, patch, role), rev: Date.now() };

  await s.setJSON(SNAPSHOT, settled);

  return Response.json({ state: settled, role }, { headers: { 'cache-control': 'no-store' } });
};

export const config = { path: '/api/state' };
