export interface Rule {
  head: string;
  body: string;
}

/** The organiser's house rules for this tournament. */
export const HOUSE_RULES: Rule[] = [
  {
    head: '5v5 speedpoint',
    body: 'five players per team on the field; after every point play restarts immediately — no pull, no huddle.',
  },
  {
    head: 'Gender ratio 3:2',
    body: 'mixed lines of five with at least 2 players of each gender on the field at all times.',
  },
  {
    head: 'Stall count 8',
    body: 'the marker counts to eight, not ten. "Stalling… one" through eight.',
  },
  {
    head: 'Tap-in substitutions',
    body: 'subs happen on the fly, but the incoming player must tap the outgoing player in at the sideline.',
  },
  {
    head: 'One timeout per team',
    body: 'each team gets one 1-minute timeout per game — none in the last 5 minutes.',
  },
  {
    head: 'No halftime break',
    body: 'games run straight through; teams switch ends without a break at the half.',
  },
  {
    head: 'Footblocks allowed',
    body: 'footblocks are legal on the mark. Keep them clean.',
  },
];

/** Standard speedpoint basics, for players new to the format. */
export const SPEEDPOINT_RULES: Rule[] = [
  {
    head: 'Continuous play',
    body: 'a pull starts the game; after each goal the team that was scored on picks the disc up in its own end zone and plays immediately.',
  },
  {
    head: 'Scoring',
    body: 'one point per goal, caught in the attacking end zone. Games run to the 30-minute cap; finish the live point, and if tied play one more.',
  },
  {
    head: 'Turnovers',
    body: 'drops, blocks, interceptions, out-of-bounds and stall-outs are turnovers — play on where the disc lands.',
  },
  {
    head: 'The thrower',
    body: 'establish a pivot; you may not run with the disc. The marker must be within 3 metres to count the stall.',
  },
  {
    head: 'Fouls & contests',
    body: 'non-contact sport; the fouled player calls it. Contested calls send the disc back to the thrower.',
  },
  {
    head: 'Boundaries',
    body: 'sidelines are out; first point of contact decides. The disc can fly out and curve back in.',
  },
];
