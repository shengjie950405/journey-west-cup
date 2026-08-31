# Journey West Cup 西遊盃

Mobile tournament app for the Journey to the West Cup — a one-evening 5v5 speedpoint
ultimate frisbee tournament at L'Amoreaux Sports Complex, September 5 2026.

Eight teams, each one a character from *Journey to the West* (西遊記): schedule and live
scores, standings, a self-seeding playoff bracket, rosters, field layout, the house rules
and the story behind every team.

## Running it

```bash
npm install
npm run dev        # dev server
npm run build      # production build into dist/
npm run preview    # serve the production build on :4173
```

`dist/` is a plain static site — drop it on any static host. `vite.config.ts` sets
`base: './'` so it also works from a subpath.

### Checks

```bash
npm run typecheck
npm run smoke                 # end-to-end smoke test against a running preview
```

`npm run smoke` drives a real browser through the whole app: every tab, the admin PIN
gate, entering all 12 pool scores, bracket seeding, persistence across reload, and the
hidden reset. Start `npm run preview` first. If Playwright's own Chromium isn't
installed, point it at one with `CHROMIUM_PATH=/path/to/chrome npm run smoke`.

## How it works

### Tabs

| Tab | What's on it |
| --- | --- |
| **Games** 賽 | Pool round (6:20 / 7:00 / 7:40), live standings for both pools, and the full playoff bracket |
| **Teams** 隊 | The eight banners with art, record and roster; admins rename teams and edit rosters here |
| **Fields** 場 | The soccer pitch split into F1–F4 left to right, plus parking and washroom info |
| **Rules** 規 | Tournament setup, the house rules, speedpoint basics, Spirit of the Game |
| **Story** 書 | *Journey to the West* intro and all eight legends, each expanding to full lore and their bonds to the other seven |

### Schedule

8 teams in two pools of four, four fields running at once, 30-minute cap per game.

- **6:20 / 7:00 / 7:40** — pool round robin, 12 games
- **8:30** — quarterfinals, seeded automatically once every pool game has a final score
- **9:10** — semifinals (F1/F2) and consolation semis for the quarterfinal runners-up (F3/F4)
- **10:00** — championship final (F1), 3rd place (F2), 5th place (F3), 7th place (F4)

Every team plays through to the last round. The bracket fills itself in: pool seeds
resolve once a pool is complete, and each later slot chains off the winner or runner-up
of an earlier game, showing a placeholder like "Winner QF1" until it's decided.

Standings sort by wins, then point differential, then points for, then name — the same
order the bracket seeds from.

### Admin

Tap the **PLAYER** pill in the header and enter the PIN (`8888`) to switch to **ADMIN**.
Admins can:

- tap any game whose teams are known to set the score, and override its time or field
- rename a team from its card on the Teams tab
- **edit that team's roster** — expand a team and add players inline: jersey number,
  name, gender (M/F) and a captain toggle, with a row of ✕ buttons to remove. Each row
  saves as you type, and the summary line under the roster shows the count and gender
  split, which is what the 3:2 ratio rule is checked against. Any number of captains is
  allowed, for teams with co-captains.
- reset everything — hidden behind the faint `· 終 ·` mark at the bottom of the Story
  tab, and it asks for the PIN again before wiping anything

Rosters ship **empty** — there is no seeded player data. Until an admin fills one in,
players see "Roster not posted yet" on that team's card.

Everything else is read-only.

Change the PIN, or start a device in admin mode, in `src/config.ts`.

### Data

Scores, schedule overrides, custom team names and rosters persist to `localStorage`
under `wukong-jwc-v1`. **This is per-device**: scores and rosters an admin enters on
their phone are not visible on anyone else's. Schedule overrides saved under an earlier version of the
schedule are migrated forward on load (`src/lib/storage.ts`).

## Layout

```
src/
  config.ts            admin PIN, event details, Chinese-accent toggle
  data/                teams (art, lore, bonds, rosters), games, rules
  lib/
    storage.ts         localStorage load/save + schedule migration
    tournament.ts      standings, seeding, slot resolution
    useTournament.ts   persisted state + derived tables
  components/          SealBadge, Dialog, PinDialog, ScoreDialog, GameCard, SectionHeading
  tabs/                GamesTab, TeamsTab, FieldsTab, RulesTab, StoryTab
  styles/              design-system tokens (colors, fonts, typography, spacing, effects)
public/assets/art/     character artwork
project/               original Claude Design handoff bundle (design source of truth)
```

Styling follows the Wukong Ultimate design system: warm paper grounds, ink-wash art, one
seal-red accent plus gold, brush display type (Kalam), calligraphy accents (Ma Shan Zheng)
and Alegreya Sans for body copy. The fonts load from Google Fonts; without a connection
they fall back to generic cursive/sans-serif and the layout is unaffected.

## Notes

- **Rosters start empty** and are filled in from the app by an admin (see above). If you
  would rather ship them in the build, add a `roster` field back to `src/data/teams.ts`
  and seed `rosters` in `src/lib/storage.ts`.
- **Team names are defaults.** Monkey Kings, Sky Marshals, River Guards, Holy Monk, White
  Dragons, Golden Palms, White Bone Spirit, Moon Fairy. Teams can rename themselves in
  admin mode, or change the `en` field in `src/data/teams.ts`.
- The design this was built from lives in `project/` — `Journey West Cup App.dc.html`
  plus the design-system bundle. `chats/` has the conversation it came out of.
