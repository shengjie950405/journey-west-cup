import type { ReactNode } from 'react';

interface Props {
  /** Chinese calligraphy accent, blank when Chinese is switched off */
  cn: string;
  title: string;
  /** Optional right-aligned note */
  aside?: ReactNode;
  margin?: string;
}

/** Calligraphy glyph + brush title, the section header used across the tabs. */
export function SectionHeading({ cn, title, aside, margin = '0 2px 10px' }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin }}>
      <span style={{ fontFamily: 'var(--font-cn)', fontSize: 21, color: 'var(--seal-red)' }}>
        {cn}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700 }}>
        {title}
      </span>
      {aside && (
        <span style={{ fontSize: 12, color: 'var(--text-faint)', marginLeft: 'auto' }}>
          {aside}
        </span>
      )}
    </div>
  );
}
