import { CONFIG } from '../config';
import { SectionHeading } from '../components/SectionHeading';

const VENUE_NOTES = [
  {
    color: 'var(--seal-red)',
    head: 'Venue',
    body: "L'Amoreaux Sports Complex, 100 Silver Spring Blvd, Scarborough.",
  },
  { color: 'var(--gold)', head: 'Parking', body: 'free on-site parking at the complex.' },
  {
    color: 'var(--gold)',
    head: 'Washrooms',
    body: 'public washrooms available at the complex.',
  },
];

export function FieldsTab() {
  const showCn = CONFIG.showChinese;

  return (
    <div
      style={{
        padding: '14px 14px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <SectionHeading cn={showCn ? '場地' : ''} title="Field Layout" margin="0 2px" />

      <div
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-soft)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-card)',
          padding: '14px 15px',
        }}
      >
        <div style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 12 }}>
          One full soccer field, split into four ultimate fields side by side.{' '}
          <b>F1 is the far left</b> as you face the field from the parking lot;{' '}
          <b>F4 is the far right</b>. Each field plays across the width of the pitch.
        </div>

        <div
          style={{
            background: 'var(--way-green)',
            borderRadius: 10,
            padding: 12,
            display: 'flex',
            gap: 8,
          }}
        >
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                border: '1.5px solid rgba(238,241,248,.75)',
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: 34,
                  background: 'rgba(238,241,248,.18)',
                  borderBottom: '1.5px dashed rgba(238,241,248,.75)',
                }}
              />
              <div
                style={{
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 700,
                    color: 'var(--text-on-dark)',
                  }}
                >
                  F{n}
                </span>
              </div>
              <div
                style={{
                  height: 34,
                  background: 'rgba(238,241,248,.18)',
                  borderTop: '1.5px dashed rgba(238,241,248,.75)',
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 7,
            padding: '0 2px',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '.07em',
              color: 'var(--text-faint)',
            }}
          >
            ◀ LEFT (F1)
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
            shaded bands = end zones
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '.07em',
              color: 'var(--text-faint)',
            }}
          >
            (F4) RIGHT ▶
          </span>
        </div>
      </div>

      <div
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-soft)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-card)',
          padding: '14px 15px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 700,
            marginBottom: 9,
          }}
        >
          Getting There
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {VENUE_NOTES.map((n) => (
            <div key={n.head} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: n.color,
                  flex: 'none',
                  marginTop: 5,
                }}
              />
              <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                <b>{n.head}</b> — {n.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
