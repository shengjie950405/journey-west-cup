/**
 * Types shared between the browser app and the Netlify function.
 *
 * Anything in `shared/` is imported by BOTH bundles, so it must stay free of
 * browser-only and Node-only APIs.
 */

export type Gender = 'M' | 'F';

export interface Player {
  name: string;
  gender: Gender;
  num: number;
  captain: boolean;
}

/** The eight teams. Also the id whitelist the server validates against. */
export const TEAM_IDS = [
  'dasheng',
  'yuanshuai',
  'luohan',
  'shengseng',
  'aolie',
  'rulai',
  'meiyao',
  'nichang',
] as const;

export type TeamId = (typeof TEAM_IDS)[number];

export interface Score {
  h: number;
  a: number;
}

export interface SchedOverride {
  time: string;
  field: string;
}

/**
 * Who is acting. Roles come from PINs checked server-side — the browser never
 * decides its own role.
 */
export type Role = 'player' | 'captain' | 'admin';

export interface AuditEntry {
  /** ISO timestamp */
  at: string;
  role: Role;
  /** Human-readable summary, e.g. "score a11 7–3" */
  what: string;
}

export interface TournamentState {
  scores: Record<string, Score>;
  sched: Record<string, SchedOverride>;
  teamNames: Partial<Record<TeamId, string>>;
  rosters: Partial<Record<TeamId, Player[]>>;
  /** Most recent changes first, capped — a trail for disputed edits. */
  audit: AuditEntry[];
  /** Bumped on every applied patch; used for change detection. */
  rev: number;
  updatedAt: string;
}

/** A single atomic change. The server validates and applies these. */
export type Patch =
  | { kind: 'score'; gameId: string; value: Score; sched: SchedOverride | null }
  | { kind: 'clearScore'; gameId: string }
  | { kind: 'teamName'; teamId: TeamId; value: string }
  | { kind: 'roster'; teamId: TeamId; value: Player[] }
  | { kind: 'reset' };
