/**
 * Client-side settings only.
 *
 * The admin and captain PINs are NOT here — they live in Netlify environment
 * variables (`ADMIN_PIN`, `CAPTAIN_PIN`) and are checked server-side, so they
 * are never shipped to the browser.
 */
export const CONFIG = {
  /** Show the Chinese calligraphy accents alongside the English copy. */
  showChinese: true,
};

export const EVENT = {
  title: 'Journey West Cup',
  cnTitle: '西遊盃',
  subtitle: "Sept 5, 2026 · 6–11 PM · L'Amoreaux Sports Complex",
};
