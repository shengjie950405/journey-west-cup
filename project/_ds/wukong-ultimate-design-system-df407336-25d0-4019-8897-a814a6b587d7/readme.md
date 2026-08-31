# Wukong Ultimate — Design System

Brand system for **Toronto Wukong Ultimate Club**, an ultimate frisbee club themed on *Journey to the West* (西游记). Built from uploaded jersey/tee artworks: eight character colorway prints (ink-wash paintings with calligraphy + red seal stamps) and jersey mockups. No codebase, Figma, or font files were provided — visuals were derived from the artwork itself.

## Sources
- `uploads/*.JPG|PNG` — character art on jersey-ground colors (霓裳 celadon, 如来 brown, 圣僧 blush, 元帅 navy, 魅妖 maroon, 大圣 cream, 罗汉 green), a light-blue jersey mockup (dragon 敖烈, front/back with chibi character grid and "Toronto Wukong / Ultimate Club" lettering), and three transparent-cutout PNGs (Wukong, Buddha, Enchantress).
- Three files referenced in the brief (`9f649b85…PNG`, `981da923…PNG`, `b1248045…PNG`) were not present in `uploads/` — presumed removed by the user.

## The brand in one paragraph
Each teammate/roster line is a *Journey to the West* character with its own ink-wash painting, two-character calligraphy title (e.g. 大聖 "Great Sage"), a red artist's seal, and a signature jersey ground color. The system therefore revolves around **paper grounds + ink art + one red seal accent + brush lettering**. It is sporty but artful: soft muted grounds, expressive brushwork, tiny pops of seal red and gold.

## CONTENT FUNDAMENTALS
- Naming: English club name "Toronto Wukong Ultimate Club"; characters carry Chinese titles (大聖, 元帥, 如來, 聖僧, 霓裳, 魅妖, 敖烈, 羅漢) with pinyin/English nicknames (Dasheng / Great Sage, Marshal, Buddha, Holy Monk, Nichang, Enchantress, Dragon, Luohan / Sha Wujing).
- Tone: playful-heroic, community-spirited sports copy. Short lines, title case for headings ("Ultimate Club"), no corporate jargon, no emoji (the chibi illustrations play that role).
- Chinese calligraphy is used decoratively (vertical, 2 characters) beside art — never as functional UI copy. Always pair with Latin text for meaning.
- Voice: "we/us" as a club; direct "you" for players ("Bring your legs. We bring the dragon.").

## VISUAL FOUNDATIONS
- **Color**: 8 character colorways as grounds (see `tokens/colors.css`): 4 light (celadon, cream, blush, sky) and 4 dark (navy, maroon, brown, green). Neutral ink scale for text; one accent: seal red `--seal-red` (+ deep variant), secondary metal gold. Page surfaces are warm paper (`--paper`), never pure white.
- **Type**: brush handwriting for display (Kalam ≈ jersey lettering), Ma Shan Zheng for Chinese calligraphy accents, Alegreya Sans for body. Display headings may letter-space slightly (`--track-wide`).
- **Imagery**: ink-wash (shuimo) paintings, loose splatter edges, monochrome-plus-one-hue per colorway; art sits on flat grounds, never in boxes. Cutout PNGs float over surfaces.
- **Seal stamp motif**: small red rounded-square stamp (white glyph/initials inside) used as the brand mark unit, list bullets, and badges. `SealBadge` component reproduces it.
- **Backgrounds**: flat token grounds; occasional huge, low-contrast calligraphy glyph as watermark. No gradients, no photos-as-backgrounds.
- **Borders/corners**: hairline `--border-soft` on paper; radius small-to-medium (4–14px); pills for tags. Cards = `--surface-card` + `--shadow-card` + 1px soft border.
- **Shadows**: soft, warm, low (see `tokens/effects.css`); no inner shadows.
- **Motion**: restrained; 120–220ms fades/translates with `--ease-brush`. No bounces.
- **Hover**: darken accent (`--accent-hover`), underline links; Press: translateY(1px), slightly darker.
- **Dark surfaces**: navy/maroon/brown colorways host light ink art + `--text-on-dark` text.

## ICONOGRAPHY
- No icon font or SVG icon set exists in the sources. The brand's "icons" are: (1) red seal stamps, (2) chibi character heads (raster, on the jersey back — not extracted as individual files), (3) calligraphy glyphs.
- For functional UI icons, use **Lucide** from CDN (thin 1.5–2px strokes match the linework). This is a **flagged substitution** — confirm or supply club icons.
- No emoji. Unicode is used only for Chinese characters as decoration.
- **No logo file was provided.** Wherever a mark is needed, use `SealBadge` (initials in a seal) or plain brush type. We did not redraw the club's seal artwork.

## Intentional additions
- `SealBadge` — reusable red-seal brand unit (the only invented component; it reproduces the stamp motif present in every artwork).

## Index
- `styles.css` → imports `tokens/` (fonts, colors, typography, spacing, effects)
- `assets/art/` — 3 transparent cutouts (wukong, buddha, enchantress) + 7 colorway prints; `assets/photos/` — jersey/tee mockups
- `guidelines/` — specimen cards (Design System tab)
- `components/forms/` — Button, Input, Select, Checkbox, Radio, Switch
- `components/display/` — Card, Badge, Tag, SealBadge
- `components/navigation/` — Tabs
- `components/feedback/` — Dialog, Toast
- `ui_kits/website/` — tournament site (hero, colorways, schedule, register)
- `SKILL.md` — agent skill entry point
