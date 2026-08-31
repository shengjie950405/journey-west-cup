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

await page.goto(BASE, { waitUntil: 'networkidle' });

// --- Header + default tab
check('header title', await page.getByText('Journey West Cup').isVisible());
check('seal badge 悟', await page.getByText('悟', { exact: true }).isVisible());
check('role pill starts as PLAYER', await page.getByRole('button', { name: /PLAYER/ }).isVisible());
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

// roster expands
await page.getByText('Monkey Kings').first().click();
await page.waitForTimeout(80);
check('roster expands', (await page.locator('body').innerText()).includes('Kai Zhang'));
check('rename hidden for players', !(await page.getByRole('button', { name: 'Save name' }).count()));

// --- Admin sign-in: wrong PIN then right PIN
await page.getByRole('button', { name: /PLAYER/ }).click();
await page.waitForTimeout(80);
await page.getByLabel('Admin PIN').fill('1234');
await page.getByRole('button', { name: 'Unlock' }).click();
await page.waitForTimeout(80);
check('wrong PIN rejected', (await page.locator('body').innerText()).includes('Wrong PIN'));
await page.getByLabel('Admin PIN').fill('8888');
await page.getByRole('button', { name: 'Unlock' }).click();
await page.waitForTimeout(120);
check('admin unlocked', await page.getByRole('button', { name: /ADMIN/ }).isVisible());
check('rename visible for admin', (await page.getByRole('button', { name: 'Save name' }).count()) > 0);

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
  await page.waitForTimeout(80);
  const inputs = page.locator('input[inputmode="numeric"][type="text"]');
  await inputs.nth(0).fill(String(h));
  await inputs.nth(1).fill(String(a));
  await page.getByRole('button', { name: 'Save final' }).click();
  await page.waitForTimeout(100);
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

// --- Hidden reset behind · 終 · on the Story tab
await page.getByRole('button', { name: /PLAYER/ }).click();
await page.getByLabel('Admin PIN').fill('8888');
await page.getByRole('button', { name: 'Unlock' }).click();
await page.waitForTimeout(100);
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

// --- Story expansion
await page.getByRole('button', { name: /Story$/ }).click();
await page.waitForTimeout(80);
await page.getByText('Tap for the full legend').first().click();
await page.waitForTimeout(100);
const story = await page.locator('body').innerText();
check('legend expands with lore', story.includes('Mountain of Flowers and Fruit'));
check('bonds section', story.includes('BONDS') && story.includes('因緣'));

console.log(results.join('\n'));
console.log('\nconsole/network errors: ' + (errors.length ? '\n  ' + errors.join('\n  ') : 'none'));
if (errors.length) process.exitCode = 1;
await browser.close();
