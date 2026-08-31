import { GAME_BY_ID } from '../data/games';
import type { Player, TeamId } from '../data/teams';

const KEY = 'wukong-jwc-v1';

export interface Score {
  h: number;
  a: number;
}

export interface SchedOverride {
  time: string;
  field: string;
}

export interface Saved {
  scores: Record<string, Score>;
  sched: Record<string, SchedOverride>;
  teamNames: Record<string, string>;
  /** Rosters are entered by admins in the app; there are no defaults. */
  rosters: Partial<Record<TeamId, Player[]>>;
}

const EMPTY: Saved = { scores: {}, sched: {}, teamNames: {}, rosters: {} };

/**
 * Schedule overrides saved under older versions of the schedule are remapped to
 * the current evening times, so an admin's earlier edits don't strand a game at
 * a slot that no longer exists.
 */
const TIME_MIGRATIONS: Record<string, string> = {
  '9:00': '6:20',
  '9:45': '7:00',
  '10:30': '7:40',
  '11:30': '8:30',
  '12:45': '9:10',
  '13:45': '10:00',
  '14:30': '10:00',
  '6:30': '6:20',
  '7:15': '7:00',
  '8:00': '7:40',
  '8:50': '8:30',
  '9:40': '9:10',
  '10:25': '10:00',
};

export function load(): Saved {
  let raw: Partial<Saved>;
  try {
    raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch {
    raw = {};
  }

  const scores = raw.scores || {};
  const teamNames = raw.teamNames || {};
  const sched: Record<string, SchedOverride> = {};

  for (const [id, override] of Object.entries(raw.sched || {})) {
    const game = GAME_BY_ID[id];
    if (!game || !override) continue;

    const time = TIME_MIGRATIONS[override.time] || override.time;
    const field = override.field;

    // Drop overrides that no longer differ from the default schedule.
    if ((!time || time === game.time) && (!field || field === game.field)) continue;

    sched[id] = { time: time || game.time, field: field || game.field };
  }

  const rosters: Partial<Record<TeamId, Player[]>> = {};
  for (const [id, list] of Object.entries(raw.rosters || {})) {
    if (!Array.isArray(list)) continue;
    // Coerce each entry — this is hand-entered data read back from storage.
    rosters[id as TeamId] = list.map((p) => ({
      name: typeof p?.name === 'string' ? p.name : '',
      gender: p?.gender === 'F' ? 'F' : 'M',
      num: Number.isFinite(p?.num) ? Number(p.num) : 0,
      captain: !!p?.captain,
    }));
  }

  return { ...EMPTY, scores, sched, teamNames, rosters };
}

export function save(state: Saved): void {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        scores: state.scores,
        sched: state.sched,
        teamNames: state.teamNames,
        rosters: state.rosters,
      }),
    );
  } catch {
    // Storage can be unavailable (private mode, quota) — the app still works
    // for the current session, results just aren't remembered.
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* see above */
  }
}
