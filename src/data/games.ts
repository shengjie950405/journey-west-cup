import type { TeamId } from './teams';

/**
 * A slot reference: either a literal team id, a pool seed (`seed:A1`) or the
 * winner / runner-up of an earlier game (`w:qf1` / `l:sf2`).
 */
export type SlotRef = string;

export interface Game {
  id: string;
  phase: 'pool' | 'br';
  pool?: 'A' | 'B';
  /** Heading the game is grouped under */
  slot: string;
  time: string;
  field: string;
  h: SlotRef;
  a: SlotRef;
  /** Optional badge, e.g. "3rd place" */
  tag?: string;
}

export const FIELDS = ['Field 1', 'Field 2', 'Field 3', 'Field 4'] as const;

const t = (id: TeamId): SlotRef => id;

export const GAMES: Game[] = [
  { id: 'a11', phase: 'pool', pool: 'A', slot: 'Pool round 1', time: '6:20', field: 'Field 1', h: t('dasheng'), a: t('aolie') },
  { id: 'a12', phase: 'pool', pool: 'A', slot: 'Pool round 1', time: '6:20', field: 'Field 2', h: t('rulai'), a: t('nichang') },
  { id: 'b11', phase: 'pool', pool: 'B', slot: 'Pool round 1', time: '6:20', field: 'Field 3', h: t('yuanshuai'), a: t('luohan') },
  { id: 'b12', phase: 'pool', pool: 'B', slot: 'Pool round 1', time: '6:20', field: 'Field 4', h: t('shengseng'), a: t('meiyao') },
  { id: 'a21', phase: 'pool', pool: 'A', slot: 'Pool round 2', time: '7:00', field: 'Field 1', h: t('dasheng'), a: t('nichang') },
  { id: 'a22', phase: 'pool', pool: 'A', slot: 'Pool round 2', time: '7:00', field: 'Field 2', h: t('rulai'), a: t('aolie') },
  { id: 'b21', phase: 'pool', pool: 'B', slot: 'Pool round 2', time: '7:00', field: 'Field 3', h: t('yuanshuai'), a: t('meiyao') },
  { id: 'b22', phase: 'pool', pool: 'B', slot: 'Pool round 2', time: '7:00', field: 'Field 4', h: t('shengseng'), a: t('luohan') },
  { id: 'a31', phase: 'pool', pool: 'A', slot: 'Pool round 3', time: '7:40', field: 'Field 1', h: t('dasheng'), a: t('rulai') },
  { id: 'a32', phase: 'pool', pool: 'A', slot: 'Pool round 3', time: '7:40', field: 'Field 2', h: t('nichang'), a: t('aolie') },
  { id: 'b31', phase: 'pool', pool: 'B', slot: 'Pool round 3', time: '7:40', field: 'Field 3', h: t('yuanshuai'), a: t('shengseng') },
  { id: 'b32', phase: 'pool', pool: 'B', slot: 'Pool round 3', time: '7:40', field: 'Field 4', h: t('meiyao'), a: t('luohan') },
  { id: 'qf1', phase: 'br', slot: 'Quarterfinals', time: '8:30', field: 'Field 1', h: 'seed:A1', a: 'seed:B4' },
  { id: 'qf2', phase: 'br', slot: 'Quarterfinals', time: '8:30', field: 'Field 2', h: 'seed:B2', a: 'seed:A3' },
  { id: 'qf3', phase: 'br', slot: 'Quarterfinals', time: '8:30', field: 'Field 3', h: 'seed:B1', a: 'seed:A4' },
  { id: 'qf4', phase: 'br', slot: 'Quarterfinals', time: '8:30', field: 'Field 4', h: 'seed:A2', a: 'seed:B3' },
  { id: 'sf1', phase: 'br', slot: 'Semifinals', time: '9:10', field: 'Field 1', h: 'w:qf1', a: 'w:qf2' },
  { id: 'sf2', phase: 'br', slot: 'Semifinals', time: '9:10', field: 'Field 2', h: 'w:qf3', a: 'w:qf4' },
  { id: 'cs1', phase: 'br', slot: 'Consolation semis — QF runners-up play on', time: '9:10', field: 'Field 3', h: 'l:qf1', a: 'l:qf2' },
  { id: 'cs2', phase: 'br', slot: 'Consolation semis — QF runners-up play on', time: '9:10', field: 'Field 4', h: 'l:qf3', a: 'l:qf4' },
  { id: 'br3', phase: 'br', slot: 'Placement games — every team plays', time: '10:00', field: 'Field 2', h: 'l:sf1', a: 'l:sf2', tag: '3rd place' },
  { id: 'p5', phase: 'br', slot: 'Placement games — every team plays', time: '10:00', field: 'Field 3', h: 'w:cs1', a: 'w:cs2', tag: '5th place' },
  { id: 'p7', phase: 'br', slot: 'Placement games — every team plays', time: '10:00', field: 'Field 4', h: 'l:cs1', a: 'l:cs2', tag: '7th place' },
  { id: 'fin', phase: 'br', slot: 'Championship final', time: '10:00', field: 'Field 1', h: 'w:sf1', a: 'w:sf2' },
];

export const GAME_BY_ID: Record<string, Game> = Object.fromEntries(
  GAMES.map((g) => [g.id, g]),
);

/** Human-readable placeholders shown until a slot resolves to a real team. */
export const REF_LABEL: Record<string, string> = {
  'seed:A1': 'Pool A #1',
  'seed:A2': 'Pool A #2',
  'seed:A3': 'Pool A #3',
  'seed:A4': 'Pool A #4',
  'seed:B1': 'Pool B #1',
  'seed:B2': 'Pool B #2',
  'seed:B3': 'Pool B #3',
  'seed:B4': 'Pool B #4',
  'w:qf1': 'Winner QF1',
  'w:qf2': 'Winner QF2',
  'w:qf3': 'Winner QF3',
  'w:qf4': 'Winner QF4',
  'w:sf1': 'Winner SF1',
  'w:sf2': 'Winner SF2',
  'l:sf1': 'SF1 Runner-up',
  'l:sf2': 'SF2 Runner-up',
  'l:qf1': 'QF1 Runner-up',
  'l:qf2': 'QF2 Runner-up',
  'l:qf3': 'QF3 Runner-up',
  'l:qf4': 'QF4 Runner-up',
  'w:cs1': 'Winner Cons. 1',
  'w:cs2': 'Winner Cons. 2',
  'l:cs1': 'Cons. 1 Runner-up',
  'l:cs2': 'Cons. 2 Runner-up',
};
