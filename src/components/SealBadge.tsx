import type { CSSProperties } from 'react';

interface Props {
  glyph?: string;
  size?: number;
  /** Render Latin initials in the brush display face instead of calligraphy */
  latin?: boolean;
  style?: CSSProperties;
}

/**
 * The brand's red artist-seal stamp — the club's mark unit, reproduced from the
 * design system.
 */
export function SealBadge({ glyph = '悟', size = 48, latin = false, style }: Props) {
  return (
    <span
      style={{
        width: size,
        height: size,
        background: 'var(--seal-red)',
        color: '#fff',
        borderRadius: Math.max(6, size * 0.16),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.35)',
        fontFamily: latin ? 'var(--font-display)' : 'var(--font-cn)',
        fontWeight: latin ? 700 : 400,
        fontSize: size * (latin ? 0.36 : 0.5),
        lineHeight: 1,
        flex: 'none',
        ...style,
      }}
    >
      {glyph}
    </span>
  );
}
