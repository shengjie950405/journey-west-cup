import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4173/';
const errors = [];
const results = [];
function check(name, cond, extra = '') {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);
  if (!cond) process.exitCode = 1;
}

// Set CHROMIUM_PATH when using a Chromium that Playwright didn't install itself.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));

// Start from a clean tournament — the suite must not depend on earlier runs.
// This goes through the real endpoint, so it also proves reset works.
const wiped = await fetch(new URL('api/state', BASE), {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ pin: process.env.ADMIN_PIN || '8888', patch: { kind: 'reset' } }),
});
check('server reset before run', wiped.ok);

await page.goto(BASE, { waitUntil: 'networkidle' });


/** Expands a team card, tolerating whatever state it was left in. */
async function ensureTeamOpen(name) {
  for (let i = 0; i < 2; i++) {
    const editing = await page.getByRole('button', { name: '+ Add player' }).count();
    const reading = await page.getByText('Roster not posted yet').count();
    if (editing || reading) return;
    await page.getByText(name).first().click();
    await page.waitForTimeout(150);
  }
}

// --- Header + default tab
check('header title', await page.getByText('Journey West Cup').isVisible());
check('seal badge 悟', await page.getByText('悟', { exact: true }).isVisible());
check('role pill starts as PLAYER', await page.getByRole('button', { name: /PLAYER/ }).isVisible());
check('sync badge present', (await page.locator('body').innerText()).match(/Synced|Saving|Offline/) !== null);
check('seed banner (pools not done)', await page.getByText(/Playoffs seed automatically/).isVisible());

// --- Pool schedule: 12 pool games in 3 slots, evening times
const bodyText = await page.locator('body').innerText();
for (const time of ['6:20', '7:00', '7:40']) {
  check(`pool slot ${time} present`, bodyText.includes(time));
}
for (const label of ['8:30 — QUARTERFINALS', '9:10 — SEMIFINALS', '10:00 — PLACEMENT']) {
  check(`bracket heading ${label}`, bodyText.toUpperCase().includes(label.toUpperCase()));
}
check('consolation semis listed', /Consolation semis/i.test(bodyText));
// Tags render through text-transform: uppercase.
check('placement tags', ['3RD PLACE', '5TH PLACE', '7TH PLACE'].every((t) => bodyText.includes(t)));
check('TBD placeholders before seeding', bodyText.includes('Pool A #1') && bodyText.includes('Winner QF1'));

// --- Tabs
for (const [label, marker] of [
  ['Teams', 'The Eight Banners'],
  ['Fields', 'Field Layout'],
  ['Rules', 'Tournament Setup'],
  ['Story', 'The Eight Legends'],
  ['Games', 'Pool Round'],
]) {
  await page.getByRole('button', { name: new RegExp(`^[^A-Za-z]*${label}$`) }).click();
  await page.waitForTimeout(60);
  check(`tab ${label} renders`, (await page.locator('body').innerText()).includes(marker));
}

// --- Team order on Teams tab
await page.getByRole('button', { name: /Teams$/ }).click();
await page.waitForTimeout(60);
const teamsText = await page.locator('body').innerText();
const order = ['Dasheng', 'Yuanshuai', 'Luohan', 'Shengseng', 'Aolie', 'Rulai', 'Meiyao', 'Nichang'];
const idxs = order.map((n) => teamsText.indexOf(n));
check('character order top-down', idxs.every((v, i) => v > -1 && (i === 0 || v > idxs[i - 1])), idxs.join(','));
check('default English names', ['Monkey Kings', 'Sky Marshals', 'White Bone Spirit', 'Moon Fairy', 'Holy Monk'].every((n) => teamsText.includes(n)));

// roster expands — no seeded players, and no editing affordances for players
await ensureTeamOpen('Monkey Kings');
check('roster empty by default', (await page.locator('body').innerText()).includes('Roster not posted yet'));
check('rename hidden for players', !(await page.getByRole('button', { name: 'Save name' }).count()));
check('add player hidden for players', !(await page.getByRole('button', { name: '+ Add player' }).count()));

// --- Admin sign-in: wrong PIN then right PIN
await page.getByRole('button', { name: /PLAYER/ }).click();
await page.waitForTimeout(80);
await page.getByLabel('Admin PIN').fill('1234');
await page.getByRole('button', { name: 'Unlock' }).click();
await page.waitForTimeout(200);
check('wrong PIN rejected', (await page.locator('body').innerText()).includes('Wrong PIN'));

// captain PIN grants team edits but not scores
await page.getByLabel('Admin PIN').fill('2222');
await page.getByRole('button', { name: 'Unlock' }).click();
await page.waitForTimeout(300);
check('captain role shown', await page.getByRole('button', { name: /CAPTAIN/ }).isVisible());
await page.getByRole('button', { name: /Games$/ }).click();
await page.waitForTimeout(120);
check('captain cannot edit scores', !(await page.locator('main div[role="button"]').count()));
await page.getByRole('button', { name: /Teams$/ }).click();
await page.waitForTimeout(120);
await ensureTeamOpen('Monkey Kings');
check('captain can edit rosters', (await page.getByRole('button', { name: '+ Add player' }).count()) > 0);

// sign out, then in as admin
await page.getByRole('button', { name: /CAPTAIN/ }).click();
await page.waitForTimeout(150);
check('sign out returns to player', await page.getByRole('button', { name: /PLAYER/ }).isVisible());
await page.getByRole('button', { name: /PLAYER/ }).click();
await page.getByLabel('Admin PIN').fill('8888');
await page.getByRole('button', { name: 'Unlock' }).click();
await page.waitForTimeout(300);
check('admin unlocked', await page.getByRole('button', { name: /ADMIN/ }).isVisible());
await page.getByRole('button', { name: /Teams$/ }).click();
await page.waitForTimeout(120);
await ensureTeamOpen('Monkey Kings');
check('rename visible for admin', (await page.getByRole('button', { name: 'Save name' }).count()) > 0);

// --- Admin roster editing: add two players, edit them, remove one
check('add player visible for admin', (await page.getByRole('button', { name: '+ Add player' }).count()) > 0);
await page.getByRole('button', { name: '+ Add player' }).click();
await page.waitForTimeout(80);
await page.getByLabel('Player name').first().fill('Ada Wong');
await page.getByLabel('Jersey number').first().fill('42');
await page.getByRole('button', { name: 'Female' }).first().click();
await page.getByRole('button', { name: 'Captain' }).first().click();
await page.waitForTimeout(100);
check('player fields accept input',
  (await page.getByLabel('Player name').first().inputValue()) === 'Ada Wong' &&
  (await page.getByLabel('Jersey number').first().inputValue()) === '42');
check('gender toggle set to F', (await page.getByRole('button', { name: 'Female' }).first().getAttribute('aria-pressed')) === 'true');
check('captain toggle set', (await page.getByRole('button', { name: 'Captain' }).first().getAttribute('aria-pressed')) === 'true');

await page.getByRole('button', { name: '+ Add player' }).click();
await page.waitForTimeout(80);
await page.getByLabel('Player name').nth(1).fill('Bo Lin');
await page.waitForTimeout(100);
check('roster summary counts', (await page.locator('body').innerText()).includes('2 players · 1M / 1F'));

// jersey number rejects non-digits and caps at 99
await page.getByLabel('Jersey number').nth(1).fill('abc7x');
await page.waitForTimeout(80);
check('number strips non-digits', (await page.getByLabel('Jersey number').nth(1).inputValue()) === '7');
await page.getByLabel('Jersey number').nth(1).fill('250');
await page.waitForTimeout(80);
check('number caps at 99', (await page.getByLabel('Jersey number').nth(1).inputValue()) === '99');

await page.getByRole('button', { name: 'Remove Bo Lin' }).click();
await page.waitForTimeout(100);
check('player removed', (await page.locator('body').innerText()).includes('1 player · 0M / 1F'));
await page.waitForTimeout(900); // let the debounced roster commit reach the server
check('roster reached server', (await (await page.request.get(BASE + 'api/state')).json()).state.rosters?.dasheng?.[0]?.name === 'Ada Wong');

// --- Rename a team, verify it propagates to the schedule
await page.getByLabel('Team name').first().fill('Staff Twirlers');
await page.getByRole('button', { name: 'Save name' }).click();
await page.waitForTimeout(100);
await page.getByRole('button', { name: /Games$/ }).click();
await page.waitForTimeout(80);
check('rename propagates to schedule', (await page.locator('body').innerText()).includes('Staff Twirlers'));

// --- Enter all 12 pool scores, verify seeding kicks in
async function scoreGame(index, h, a) {
  // Pool games are the first 12 tappable cards, in schedule order.
  await page.locator('main div[role="button"]').nth(index).click();
  await page.waitForTimeout(150);
  const inputs = page.locator('input[inputmode="numeric"][type="text"]');
  await inputs.nth(0).fill(String(h));
  await inputs.nth(1).fill(String(a));
  await page.getByRole('button', { name: 'Save final' }).click();
  await page.waitForTimeout(220);
}

const scores = [[7,3],[6,5],[8,2],[5,4],[7,4],[6,3],[9,2],[4,6],[7,5],[5,3],[8,4],[6,2]];
for (let i = 0; i < 12; i++) await scoreGame(i, ...scores[i]);

const afterText = await page.locator('body').innerText();
check('pool play complete banner', afterText.includes('Pool play complete'));
check('standings marked final', afterText.includes('POOL A · FINAL') && afterText.includes('POOL B · FINAL'));
check('quarters seeded (no Pool A #1 left)', !afterText.includes('Pool A #1'));
check('12 finals recorded', (afterText.match(/FINAL/g) || []).length >= 12);

// --- Persistence across reload
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(150);
const reloaded = await page.locator('body').innerText();
check('scores persist across reload', reloaded.includes('Pool play complete'));
check('team name persists across reload', reloaded.includes('Staff Twirlers'));

check('role restored after reload', await page.getByRole('button', { name: /ADMIN/ }).isVisible());
await page.getByRole('button', { name: /Teams$/ }).click();
await page.waitForTimeout(120);
await ensureTeamOpen('Staff Twirlers');
// Admin sees the roster in inputs, whose values are not part of innerText.
check('roster persists across reload',
  (await page.getByLabel('Player name').first().inputValue()) === 'Ada Wong');

// sign out to exercise the read-only player view
await page.getByRole('button', { name: /ADMIN/ }).click();
await page.waitForTimeout(200);
const rosterView = await page.locator('body').innerText();
check('captain mark shown to players', rosterView.includes('Ada Wong · C'));
check('roster read-only for players', !(await page.getByLabel('Player name').count()));

// back in as admin for the reset checks
await page.getByRole('button', { name: /PLAYER/ }).click();
await page.getByLabel('Admin PIN').fill('8888');
await page.getByRole('button', { name: 'Unlock' }).click();
await page.waitForTimeout(300);

// --- Hidden reset behind · 終 · on the Story tab
await page.getByRole('button', { name: /Story$/ }).click();
await page.waitForTimeout(80);
await page.getByText('· 終 ·').scrollIntoViewIfNeeded();
await page.getByText('· 終 ·').click();
await page.waitForTimeout(100);
check('reset dialog opens from 終', (await page.locator('body').innerText()).includes('Reset tournament'));
await page.getByLabel('Admin PIN').fill('0000');
await page.getByRole('button', { name: 'Reset everything' }).click();
await page.waitForTimeout(100);
check('wrong PIN resets nothing', (await page.locator('body').innerText()).includes('nothing was reset'));
await page.getByLabel('Admin PIN').fill('8888');
await page.getByRole('button', { name: 'Reset everything' }).click();
await page.waitForTimeout(150);
await page.getByRole('button', { name: /Games$/ }).click();
await page.waitForTimeout(100);
const afterReset = await page.locator('body').innerText();
check('reset clears scores', afterReset.includes('Playoffs seed automatically'));
check('reset clears team names', !afterReset.includes('Staff Twirlers') && afterReset.includes('Monkey Kings'));
await page.getByRole('button', { name: /Teams$/ }).click();
await page.waitForTimeout(80);
await ensureTeamOpen('Monkey Kings');
// still in admin mode here, so an empty roster shows the editor's add button
const afterResetRoster = await page.locator('body').innerText();
check('reset clears rosters', !afterResetRoster.includes('Ada Wong') && afterResetRoster.includes('+ Add player'));

// --- Story expansion
await page.getByRole('button', { name: /Story$/ }).click();
await page.waitForTimeout(80);
await page.getByText('Tap for the full legend').first().click();
await page.waitForTimeout(100);
const story = await page.locator('body').innerText();
check('legend expands with lore', story.includes('Mountain of Flowers and Fruit'));
check('bonds section', story.includes('BONDS') && story.includes('因緣'));

console.log(results.join('\n'));
// Google Fonts and the favicon are fetched from outside; a sandbox that blocks
// them is an environment fact, not a defect in the app.
const EXTERNAL = /fonts\.googleapis\.com|fonts\.gstatic\.com|favicon|ERR_CONNECTION_RESET|404 \(Not Found\)/;
const real = errors.filter((e) => !EXTERNAL.test(e));
console.log('\nconsole/network errors: ' + (real.length ? '\n  ' + real.join('\n  ') : 'none'));
if (errors.length && !real.length) console.log('(ignored ' + errors.length + ' external font/favicon fetch failures)');
if (real.length) process.exitCode = 1;
await browser.close();
