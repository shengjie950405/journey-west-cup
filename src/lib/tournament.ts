import { GAMES, GAME_BY_ID, REF_LABEL, type Game, type SlotRef } from '../data/games';
import { TEAMS, team, type Team, type TeamId } from '../data/teams';
import type { Score, SchedOverride } from '../../shared/types';

export type Pool = 'A' | 'B';

export interface StandingRow {
  id: TeamId;
  team: Team;
  w: number;
  l: number;
  pf: number;
  pa: number;
}

/**
 * Pool table, sorted by wins, then point differential, then points for, then
 * name — the same ordering the bracket seeds from.
 */
export function standings(pool: Pool, scores: Record<string, Score>): StandingRow[] {
  const rows: StandingRow[] = TEAMS.filter((t) => t.pool === pool).map((t) => ({
    id: t.id,
    team: t,
    w: 0,
    l: 0,
    pf: 0,
    pa: 0,
  }));
  const by = new Map(rows.map((r) => [r.id, r]));

  for (const g of GAMES) {
    if (g.phase !== 'pool' || g.pool !== pool) continue;
    const s = scores[g.id];
    if (!s) continue;
    const H = by.get(g.h as TeamId);
    const A = by.get(g.a as TeamId);
    if (!H || !A) continue;

    H.pf += s.h;
    H.pa += s.a;
    A.pf += s.a;
    A.pa += s.h;
    if (s.h > s.a) {
      H.w++;
      A.l++;
    } else if (s.a > s.h) {
      A.w++;
      H.l++;
    }
  }

  rows.sort(
    (x, y) =>
      y.w - x.w ||
      (y.pf - y.pa) - (x.pf - x.pa) ||
      y.pf - x.pf ||
      x.team.name.localeCompare(y.team.name),
  );
  return rows;
}

export function poolDone(pool: Pool, scores: Record<string, Score>): boolean {
  return GAMES.filter((g) => g.phase === 'pool' && g.pool === pool).every(
    (g) => scores[g.id],
  );
}

/**
 * Resolves a slot reference to a concrete team id, or null while it is still
 * undecided. Seeds only fill in once their whole pool is final; winner and
 * runner-up references chain recursively through earlier games and stay
 * undecided on a tie.
 */
export function makeResolver(scores: Record<string, Score>) {
  const seeds: Record<string, TeamId> = {};
  if (poolDone('A', scores)) {
    standings('A', scores).forEach((r, i) => {
      seeds[`A${i + 1}`] = r.id;
    });
  }
  if (poolDone('B', scores)) {
    standings('B', scores).forEach((r, i) => {
      seeds[`B${i + 1}`] = r.id;
    });
  }

  const resolve = (ref: SlotRef | undefined): TeamId | null => {
    if (!ref) return null;
    if (!ref.includes(':')) return ref as TeamId;

    const [kind, value] = ref.split(':');
    if (kind === 'seed') return seeds[value] ?? null;

    const g = GAME_BY_ID[value];
    const s = scores[value];
    if (!g || !s || s.h === s.a) return null;

    const hi = resolve(g.h);
    const ai = resolve(g.a);
    if (!hi || !ai) return null;

    if (kind === 'w') return s.h > s.a ? hi : ai;
    return s.h > s.a ? ai : hi;
  };

  return resolve;
}

export interface Side {
  name: string;
  cn: string;
  color: string;
  /** True once an actual team occupies the slot */
  real: boolean;
}

export function refLabel(ref: SlotRef): string {
  return REF_LABEL[ref] || 'TBD';
}

/** Groups consecutive games that share a heading, preserving schedule order. */
export function groupSlots<T>(
  phase: Game['phase'],
  gameTime: (g: Game) => string,
  make: (g: Game) => T,
): { key: string; tag: string; time: string; games: T[] }[] {
  const out: { key: string; tag: string; time: string; games: T[] }[] = [];
  for (const g of GAMES.filter((x) => x.phase === phase)) {
    let slot = out[out.length - 1];
    if (!slot || slot.key !== g.slot) {
      slot = { key: g.slot, tag: g.slot, time: gameTime(g), games: [] };
      out.push(slot);
    }
    slot.games.push(make(g));
  }
  return out;
}

export function gameTimeOf(g: Game, sched: Record<string, SchedOverride>): string {
  return sched[g.id]?.time || g.time;
}

export function gameFieldOf(g: Game, sched: Record<string, SchedOverride>): string {
  return sched[g.id]?.field || g.field;
}

export function recordOf(id: TeamId, tables: Record<Pool, StandingRow[]>): string {
  const row = tables[team(id).pool].find((r) => r.id === id);
  return row ? `${row.w}–${row.l}` : '0–0';
}
