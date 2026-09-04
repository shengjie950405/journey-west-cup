import { useState } from 'react';
import { CONFIG } from '../config';
import { SectionHeading } from './SectionHeading';
import { PERK_SPONSORS, SEASON_SPONSOR } from '../data/sponsors';

/**
 * A sponsor's artwork. These are posters and cards rather than small marks, so
 * they render at full width at their natural aspect — the detail on them (perks,
 * QR codes, contact details) is the point.
 *
 * The frame reserves height from the aspect ratio so the page does not jump as
 * images arrive, and a missing file falls back to the sponsor's name.
 */
function Artwork({
  src,
  name,
  aspect,
  onDark = false,
  eager = false,
}: {
  src: string;
  name: string;
  aspect: number;
  onDark?: boolean;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  const frame = {
    width: '100%',
    aspectRatio: String(aspect),
    borderRadius: 10,
    overflow: 'hidden',
    background: onDark ? 'rgba(238,241,248,.07)' : 'var(--paper-warm)',
    border: `1px solid ${onDark ? 'rgba(238,241,248,.16)' : 'var(--border-soft)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (failed) {
    return (
      <div style={{ ...frame, aspectRatio: '3' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 16,
            textAlign: 'center',
            padding: 10,
            color: onDark ? 'var(--gold)' : 'var(--ink-2)',
          }}
        >
          {name}
        </span>
      </div>
    );
  }

  return (
    <div style={frame}>
      <img
        src={src}
        alt={name}
        // Sponsor art runs to a few MB in total; only the hero loads up front.
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  );
}

/** Season sponsor plus the day's perks. Sits at the foot of the Fields tab. */
export function Sponsors() {
  const showCn = CONFIG.showChinese;
  const s = SEASON_SPONSOR;

  return (
    <>
      <SectionHeading cn={showCn ? '贊助' : ''} title="Our Sponsors" margin="6px 2px 0" />

      <div
        style={{
          background: 'var(--way-navy)',
          color: 'var(--text-on-dark)',
          borderRadius: 14,
          padding: '16px 15px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: 8,
            top: -6,
            fontFamily: 'var(--font-cn)',
            fontSize: 88,
            lineHeight: 1,
            color: 'rgba(238,241,248,.06)',
            pointerEvents: 'none',
          }}
        >
          謝
        </div>

        <div
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          Season Sponsor{' '}
          {showCn && (
            <span style={{ fontFamily: 'var(--font-cn)', letterSpacing: 0, fontSize: 12.5 }}>
              年度贊助
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.15,
            marginTop: 6,
          }}
        >
          {s.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(238,241,248,.62)',
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          {s.role}
        </div>

        <div style={{ marginTop: 12 }}>
          <Artwork src={s.logo} name={s.name} aspect={s.aspect} onDark eager />
        </div>

        <div
          style={{
            fontSize: 13.5,
            lineHeight: 1.6,
            color: 'rgba(238,241,248,.85)',
            marginTop: 13,
          }}
        >
          {s.blurb}
        </div>
        {showCn && (
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.6,
              color: 'rgba(238,241,248,.62)',
              marginTop: 5,
            }}
          >
            {s.blurbCn}
          </div>
        )}

        <div
          style={{
            marginTop: 12,
            paddingTop: 11,
            borderTop: '1px solid rgba(238,241,248,.16)',
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--gold)' }}>{s.ask}</div>
          {showCn && (
            <div style={{ fontSize: 12, color: 'rgba(238,241,248,.6)', marginTop: 2 }}>
              {s.askCn}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
            {s.contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: 5,
                  background: 'rgba(238,241,248,.12)',
                  border: '1px solid rgba(238,241,248,.2)',
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: 'var(--text-on-dark)',
                  textDecoration: 'none',
                }}
              >
                <span style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: '.06em' }}>
                  {c.label}
                </span>
                {c.value}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          margin: '4px 2px 0',
        }}
      >
        On the day{' '}
        {showCn && (
          <span style={{ fontFamily: 'var(--font-cn)', letterSpacing: 0, fontSize: 13 }}>
            當日福利
          </span>
        )}
      </div>

      {PERK_SPONSORS.map((sp) => (
        <div
          key={sp.id}
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-soft)',
            borderRadius: 14,
            boxShadow: 'var(--shadow-card)',
            padding: '12px 13px 13px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>
                {sp.name}
              </span>
              {showCn && sp.cn && (
                <span
                  style={{
                    fontFamily: 'var(--font-cn)',
                    fontSize: 16,
                    color: 'var(--seal-red)',
                  }}
                >
                  {sp.cn}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 4 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 2,
                  background: 'var(--gold)',
                  flex: 'none',
                  marginTop: 5,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, lineHeight: 1.45, color: 'var(--ink-1)' }}>
                  {sp.perk}
                </div>
                {showCn && sp.perkCn && (
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 1 }}>
                    {sp.perkCn}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Artwork src={sp.logo} name={sp.name} aspect={sp.aspect} />
        </div>
      ))}

      <div
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--text-faint)',
          padding: '4px 0 2px',
          lineHeight: 1.5,
        }}
      >
        Thank you to our sponsors for backing this tournament.
        {showCn && (
          <>
            <br />
            <span style={{ fontFamily: 'var(--font-cn)', fontSize: 14 }}>感謝各位贊助商</span>
          </>
        )}
      </div>
    </>
  );
}
