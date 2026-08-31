import { useEffect, useState } from 'react';
import { CONFIG } from '../config';
import { SectionHeading } from '../components/SectionHeading';
import { ORDERED_TEAMS, type TeamId } from '../data/teams';
import { recordOf } from '../lib/tournament';
import type { Tournament } from '../lib/useTournament';

interface Props {
  t: Tournament;
  admin: boolean;
  openTeam: TeamId | null;
  setOpenTeam: (id: TeamId | null) => void;
}

export function TeamsTab({ t, admin, openTeam, setOpenTeam }: Props) {
  const showCn = CONFIG.showChinese;

  return (
    <div
      style={{
        padding: '14px 14px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <SectionHeading
        cn={showCn ? '八隊' : ''}
        title="The Eight Banners"
        aside="tap a team for its roster"
        margin="0 2px 2px"
      />

      {ORDERED_TEAMS.map((tm) => {
        const open = openTeam === tm.id;
        return (
          <div
            key={tm.id}
            style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--border-soft)',
              borderRadius: 14,
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            <div
              onClick={() => setOpenTeam(open ? null : tm.id)}
              role="button"
              tabIndex={0}
              aria-expanded={open}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenTeam(open ? null : tm.id);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 13px',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  flex: 'none',
                  overflow: 'hidden',
                  display: 'block',
                  border: `2px solid ${tm.color}`,
                  background: 'var(--paper-warm)',
                }}
              >
                <span
                  role="img"
                  aria-label={tm.name}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('${tm.art}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 18%',
                  }}
                />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    {t.teamName(tm.id)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-cn)',
                      fontSize: 17,
                      color: 'var(--seal-red)',
                    }}
                  >
                    {showCn ? tm.cn : ''}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {tm.name} — {tm.title} · Pool {tm.pool} · {recordOf(tm.id, t.tables)}
                </div>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-faint)', flex: 'none' }}>
                {open ? '▲' : '▼'}
              </span>
            </div>

            {open && (
              <div
                style={{
                  borderTop: '1px solid var(--border-soft)',
                  padding: '10px 13px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 7,
                  background: 'var(--paper)',
                }}
              >
                {admin && (
                  <RenameRow
                    initial={t.teamName(tm.id)}
                    onSave={(name) => t.renameTeam(tm.id, name)}
                  />
                )}
                {tm.roster.map((p) => (
                  <div
                    key={`${p.num}-${p.name}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: tm.color,
                        color: 'var(--ink-1)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11.5,
                        fontWeight: 800,
                        flex: 'none',
                        border: '1px solid rgba(46,49,56,.15)',
                      }}
                    >
                      {p.num}
                    </span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>
                      {p.name}
                      {p.captain && (
                        <span style={{ color: 'var(--gold-deep)', fontWeight: 800 }}>
                          {' '}
                          · C
                        </span>
                      )}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: '.06em',
                        color: p.gender === 'F' ? 'var(--seal-red-deep)' : '#2c3f6b',
                        background: p.gender === 'F' ? '#f3e2df' : '#dde4f2',
                        borderRadius: 999,
                        padding: '2px 8px',
                        flex: 'none',
                      }}
                    >
                      {p.gender}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ height: 5, background: tm.color }} />
          </div>
        );
      })}
    </div>
  );
}

/** Admin-only inline rename for a team's cheerable English name. */
function RenameRow({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (name: string) => void;
}) {
  const [value, setValue] = useState(initial);

  // Re-seed when a different team's card opens, or the name changes elsewhere.
  useEffect(() => setValue(initial), [initial]);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Team name"
        aria-label="Team name"
        style={{
          flex: 1,
          minWidth: 0,
          padding: '7px 10px',
          border: '1px solid var(--border-soft)',
          borderRadius: 8,
          fontSize: 13.5,
          fontFamily: 'var(--font-body)',
          background: 'var(--card)',
          color: 'var(--text-body)',
          outlineColor: 'var(--seal-red)',
        }}
      />
      <button
        onClick={() => onSave(value)}
        style={{
          background: 'var(--seal-red)',
          color: '#fff',
          border: '1px solid transparent',
          borderRadius: 8,
          padding: '7px 13px',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 12.5,
          cursor: 'pointer',
          flex: 'none',
        }}
      >
        Save name
      </button>
    </div>
  );
}
