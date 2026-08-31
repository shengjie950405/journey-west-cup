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

`npm run smoke` drives a real browser through the whole app: every tab, all three roles,
a captain being refused score access, roster editing, entering all 12 pool scores,
bracket seeding, persistence across reload, and the hidden reset. It resets the server
first, so it does not depend on earlier runs. Start `npm run preview` first — dev and
preview serve an in-memory stand-in for the API that reuses the real `shared/state`
logic, so permission rules are exercised as written. If Playwright's own Chromium isn't
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

### Roles and sign-in

Tap the pill in the header and enter a PIN. There are three roles:

| Role | Can do |
| --- | --- |
| **PLAYER** (default) | View everything. No PIN needed. |
| **CAPTAIN** | Edit team names and rosters. |
| **ADMIN** | Everything, plus scores, times, fields and reset. |

The captain PIN is shared by all eight captains, so any captain can edit any team's
name and roster — the audit trail, not the PIN, is what makes that safe. Scores are
admin-only.

**PINs are set as Netlify environment variables** (`ADMIN_PIN`, `CAPTAIN_PIN`) and are
checked server-side, so they are never shipped to the browser. Every write is
re-authorised on the server: hiding a button in the UI is not what enforces permissions.

A signed-in device remembers its PIN, and re-checks it on reload so a scorer does not
silently drop to read-only after a refresh. Tap the pill again to sign out.

Admins can:

- tap any game whose teams are known to set the score, and override its time or field
- rename a team from its card on the Teams tab
- **edit that team's roster** (captains too) — expand a team and add players inline: jersey number,
  name, gender (M/F) and a captain toggle, with a row of ✕ buttons to remove. Each row
  saves as you type, and the summary line under the roster shows the count and gender
  split, which is what the 3:2 ratio rule is checked against. Any number of captains is
  allowed, for teams with co-captains.
- reset everything — hidden behind the faint `· 終 ·` mark at the bottom of the Story
  tab, and it asks for the PIN again before wiping anything

Rosters ship **empty** — there is no seeded player data. Until an admin fills one in,
players see "Roster not posted yet" on that team's card.

Everything else is read-only.

### Data — shared across devices

State lives on the server (Netlify Blobs) and is shared by everyone: a score entered on
the organiser's phone shows up on every other device within about 20 seconds.

**Local-first.** The app renders from a local cache and queues edits in `localStorage`,
so it keeps working on a field with no signal. The header badge shows the state:

| Badge | Meaning |
| --- | --- |
| **Synced** | Everything is on the server. |
| **Saving…** | Edits are in flight; the number is how many are queued. |
| **Offline** | No connection. Edits are held locally and sent automatically when signal returns. |

Reads poll every 20 seconds while the tab is visible, and stop when it is hidden.

**Concurrency.** Netlify Blobs is last-write-wins with no compare-and-swap, so each
entity (one score, one roster, one team name) is stored under its own key. Two people
editing different things can never clobber each other. Two people editing the *same*
roster is genuinely last-write-wins — the later save replaces the earlier one.

**Audit trail.** Every change records who (by role), when, and what, capped at the most
recent 200 entries, exposed on the state endpoint. If a score is wrong, you can see when
it changed. Under a write race a single audit line can be dropped; a score never is.

## API

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/state` | `GET` | Current tournament state. Public. |
| `/api/state` | `POST` | Apply one patch: `{pin, patch}`. Validated and authorised server-side. |
| `/api/auth` | `POST` | Exchange `{pin}` for a role, so the UI can label the pill. |

## Layout

```
src/
  config.ts            event details and the Chinese-accent toggle (no secrets)
  data/                teams (art, lore, bonds), rules; games re-exports the shared schedule
  lib/
    sync.ts            fetch/push, offline cache and the pending-edit queue
    tournament.ts      standings, seeding, slot resolution
    useTournament.ts   shared state, roles, sync status
  components/          SealBadge, Dialog, PinDialog, ScoreDialog, GameCard, SectionHeading
  tabs/                GamesTab, TeamsTab, FieldsTab, RulesTab, StoryTab
  styles/              design-system tokens (colors, fonts, typography, spacing, effects)
shared/                types, schedule and state logic used by BOTH the app and the server
  state.ts             patch validation, role permissions, apply — the security boundary
netlify/functions/     state.ts (read/write) and auth.ts (PIN → role)
scripts/mock-api.ts    in-memory API for local dev and the smoke suite (never shipped)
public/assets/art/     character artwork
project/               original Claude Design handoff bundle (design source of truth)
```

Styling follows the Wukong Ultimate design system: warm paper grounds, ink-wash art, one
seal-red accent plus gold, brush display type (Kalam), calligraphy accents (Ma Shan Zheng)
and Alegreya Sans for body copy. The fonts load from Google Fonts; without a connection
they fall back to generic cursive/sans-serif and the layout is unaffected.

## Deploying

Connect the repo in Netlify (*Add new project → Import an existing project*).
`netlify.toml` already sets the build command, publish directory and Node version, so
there is nothing to configure — **except the two PINs**, which must be set before anyone
can edit anything:

*Site configuration → Environment variables →* add

| Key | Value |
| --- | --- |
| `ADMIN_PIN` | the organiser's PIN |
| `CAPTAIN_PIN` | the PIN shared with the eight captains |

Without them every PIN is rejected and the app stays read-only for everyone — which is
the safe failure, but it does mean scores cannot be entered until they are set. Changing
a PIN takes effect on the next deploy.

Production uses a global Blobs store; previews and branch deploys get their own
deploy-scoped store, so testing never touches live tournament data.

## Notes

- **Rosters start empty** and are filled in from the app by a captain or admin. They are
  stored on the server, so each team only has to enter theirs once.
- **Team names are defaults.** Monkey Kings, Sky Marshals, River Guards, Holy Monk, White
  Dragons, Golden Palms, White Bone Spirit, Moon Fairy. Captains can rename their own
  team in the app, or change the `en` field in `src/data/teams.ts`.
- **PINs are a speed bump, not security.** They are short, shared, and not rate-limited.
  Anyone who has a PIN can edit what that role allows, and a determined person could
  guess one. That is an accepted trade for a club tournament — the audit trail is what
  lets you spot and undo a bad edit. Do not reuse these PINs anywhere that matters.
- The design this was built from lives in `project/` — `Journey West Cup App.dc.html`
  plus the design-system bundle. `chats/` has the conversation it came out of.
