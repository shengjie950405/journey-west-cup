import { GAME_IDS } from './schedule';
import {
  TEAM_IDS,
  type AuditEntry,
  type Patch,
  type Player,
  type Role,
  type Score,
  type SchedOverride,
  type TeamId,
  type TournamentState,
} from './types';

export const MAX_AUDIT = 200;
const MAX_NAME = 40;
const MAX_ROSTER = 30;
const MAX_SCORE = 99;

export function emptyState(): TournamentState {
  return {
    scores: {},
    sched: {},
    teamNames: {},
    rosters: {},
    audit: [],
    rev: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

/**
 * Role permissions. Scores, schedule and reset are the organiser's; captains
 * may only touch team names and rosters.
 *
 * This runs on the server — the UI hides what a role cannot do, but this is
 * what actually enforces it.
 */
export function canApply(role: Role, kind: Patch['kind']): boolean {
  if (role === 'admin') return true;
  if (role === 'captain') return kind === 'teamName' || kind === 'roster';
  return false;
}

const clampInt = (v: unknown, lo: number, hi: number): number => {
  const n = Math.trunc(Number(v));
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
};

const cleanText = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

function cleanPlayer(p: unknown): Player {
  const o = (p || {}) as Partial<Player>;
  return {
    name: cleanText(o.name, MAX_NAME),
    gender: o.gender === 'F' ? 'F' : 'M',
    num: clampInt(o.num, 0, MAX_SCORE),
    captain: !!o.captain,
  };
}

const isTeamId = (v: unknown): v is TeamId => TEAM_IDS.includes(v as TeamId);
const isGameId = (v: unknown): v is string => GAME_IDS.includes(v as string);

/**
 * Validates and normalises an untrusted patch from the network.
 * Returns null when the patch is malformed or names something that
 * does not exist.
 */
export function parsePatch(raw: unknown): Patch | null {
  const p = (raw || {}) as Record<string, unknown>;

  switch (p.kind) {
    case 'score': {
      if (!isGameId(p.gameId)) return null;
      const v = (p.value || {}) as Partial<Score>;
      const sched = p.sched
        ? {
            time: cleanText((p.sched as SchedOverride).time, 10),
            field: cleanText((p.sched as SchedOverride).field, 20),
          }
        : null;
      if (sched && (!sched.time || !sched.field)) return null;
      return {
        kind: 'score',
        gameId: p.gameId,
        value: { h: clampInt(v.h, 0, MAX_SCORE), a: clampInt(v.a, 0, MAX_SCORE) },
        sched,
      };
    }
    case 'clearScore':
      return isGameId(p.gameId) ? { kind: 'clearScore', gameId: p.gameId } : null;
    case 'teamName': {
      if (!isTeamId(p.teamId)) return null;
      const value = cleanText(p.value, MAX_NAME);
      return value ? { kind: 'teamName', teamId: p.teamId, value } : null;
    }
    case 'roster': {
      if (!isTeamId(p.teamId)) return null;
      if (!Array.isArray(p.value)) return null;
      return {
        kind: 'roster',
        teamId: p.teamId,
        value: p.value.slice(0, MAX_ROSTER).map(cleanPlayer),
      };
    }
    case 'reset':
      return { kind: 'reset' };
    default:
      return null;
  }
}

function describe(patch: Patch): string {
  switch (patch.kind) {
    case 'score':
      return `score ${patch.gameId} ${patch.value.h}–${patch.value.a}`;
    case 'clearScore':
      return `cleared score ${patch.gameId}`;
    case 'teamName':
      return `renamed ${patch.teamId} to "${patch.value}"`;
    case 'roster':
      return `roster ${patch.teamId} (${patch.value.length} players)`;
    case 'reset':
      return 'reset everything';
  }
}

/**
 * Applies a validated patch, returning a new state. Pure — the caller persists
 * the result. Every change appends an audit entry and bumps `rev`.
 */
export function applyPatch(
  state: TournamentState,
  patch: Patch,
  role: Role,
  now = new Date(),
): TournamentState {
  const at = now.toISOString();
  const entry: AuditEntry = { at, role, what: describe(patch) };

  let next: TournamentState;

  switch (patch.kind) {
    case 'score': {
      const sched = { ...state.sched };
      if (patch.sched) sched[patch.gameId] = patch.sched;
      else delete sched[patch.gameId];
      next = {
        ...state,
        scores: { ...state.scores, [patch.gameId]: patch.value },
        sched,
      };
      break;
    }
    case 'clearScore': {
      const scores = { ...state.scores };
      delete scores[patch.gameId];
      next = { ...state, scores };
      break;
    }
    case 'teamName':
      next = {
        ...state,
        teamNames: { ...state.teamNames, [patch.teamId]: patch.value },
      };
      break;
    case 'roster':
      next = {
        ...state,
        rosters: { ...state.rosters, [patch.teamId]: patch.value },
      };
      break;
    case 'reset':
      next = { ...emptyState(), audit: state.audit };
      break;
  }

  return {
    ...next,
    audit: [entry, ...next.audit].slice(0, MAX_AUDIT),
    rev: state.rev + 1,
    updatedAt: at,
  };
}
