import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import { SectionHeading } from '../components/SectionHeading';
import { ORDERED_TEAMS, type Gender, type Player, type TeamId } from '../data/teams';
import { recordOf } from '../lib/tournament';
import type { Tournament } from '../lib/useTournament';

interface Props {
  t: Tournament;
  /** Captains and admins may edit team names and rosters. */
  canEdit: boolean;
  openTeam: TeamId | null;
  setOpenTeam: (id: TeamId | null) => void;
}

export function TeamsTab({ t, canEdit, openTeam, setOpenTeam }: Props) {
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
                {canEdit && (
                  <RenameRow
                    initial={t.teamName(tm.id)}
                    onSave={(name) => t.renameTeam(tm.id, name)}
                  />
                )}
                <RosterSection
                  color={tm.color}
                  admin={canEdit}
                  roster={t.roster(tm.id)}
                  onChange={(players) => t.setRoster(tm.id, players)}
                />
              </div>
            )}

            <div style={{ height: 5, background: tm.color }} />
          </div>
        );
      })}
    </div>
  );
}

/** How long to wait after the last keystroke before pushing a roster edit. */
const COMMIT_DELAY_MS = 600;

const GENDER_FG: Record<Gender, string> = { F: 'var(--seal-red-deep)', M: '#2c3f6b' };
const GENDER_BG: Record<Gender, string> = { F: '#f3e2df', M: '#dde4f2' };

/**
 * A team's roster. Players see a read-only list; admins get inline editing —
 * number, name, gender and captain — plus add and remove.
 */
function RosterSection({
  color,
  admin,
  roster,
  onChange,
}: {
  color: string;
  admin: boolean;
  roster: Player[];
  onChange: (players: Player[]) => void;
}) {
  // Edits are held locally and pushed once the typing stops — otherwise every
  // keystroke would be its own round trip to the server.
  const [rows, setRows] = useState<Player[]>(roster);
  const dirty = useRef(false);
  const serialized = JSON.stringify(roster);

  // Held in a ref so a parent re-render (a poll tick) cannot restart the timer.
  const commit = useRef(onChange);
  commit.current = onChange;

  // Accept incoming server changes, but never overwrite an in-progress edit.
  useEffect(() => {
    if (!dirty.current) setRows(roster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);

  useEffect(() => {
    if (!dirty.current) return;
    const id = setTimeout(() => {
      dirty.current = false;
      commit.current(rows);
    }, COMMIT_DELAY_MS);
    return () => clearTimeout(id);
  }, [rows]);

  const edit = (next: Player[]) => {
    dirty.current = true;
    setRows(next);
  };

  const patch = (i: number, next: Partial<Player>) =>
    edit(rows.map((p, j) => (j === i ? { ...p, ...next } : p)));
  const remove = (i: number) => edit(rows.filter((_, j) => j !== i));
  const add = () => edit([...rows, { name: '', gender: 'M', num: 0, captain: false }]);

  const women = rows.filter((p) => p.gender === 'F').length;
  const men = rows.length - women;

  if (!admin) {
    if (!rows.length) {
      return (
        <div style={{ fontSize: 13, color: 'var(--text-faint)', padding: '2px 0' }}>
          Roster not posted yet.
        </div>
      );
    }
    return (
      <>
        {rows.map((p, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: color,
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
              {p.num || '–'}
            </span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, minWidth: 0 }}>
              {p.name || <span style={{ color: 'var(--text-faint)' }}>Unnamed</span>}
              {p.captain && (
                <span style={{ color: 'var(--gold-deep)', fontWeight: 800 }}> · C</span>
              )}
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '.06em',
                color: GENDER_FG[p.gender],
                background: GENDER_BG[p.gender],
                borderRadius: 999,
                padding: '2px 8px',
                flex: 'none',
              }}
            >
              {p.gender}
            </span>
          </div>
        ))}
        <RosterSummary count={rows.length} men={men} women={women} />
      </>
    );
  }

  return (
    <>
      {rows.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            value={p.num || ''}
            onChange={(e) => {
              const n = parseInt(e.target.value.replace(/\D/g, ''), 10);
              patch(i, { num: isNaN(n) ? 0 : Math.min(99, n) });
            }}
            inputMode="numeric"
            placeholder="#"
            aria-label="Jersey number"
            style={{
              width: 38,
              flex: 'none',
              textAlign: 'center',
              padding: '6px 2px',
              border: '1px solid var(--border-soft)',
              borderRadius: 7,
              background: color,
              color: 'var(--ink-1)',
              fontSize: 12.5,
              fontWeight: 800,
              fontFamily: 'var(--font-body)',
              outlineColor: 'var(--seal-red)',
              minWidth: 0,
            }}
          />
          <input
            value={p.name}
            onChange={(e) => patch(i, { name: e.target.value })}
            placeholder="Player name"
            aria-label="Player name"
            style={{
              flex: 1,
              minWidth: 0,
              padding: '6px 9px',
              border: '1px solid var(--border-soft)',
              borderRadius: 7,
              background: 'var(--card)',
              color: 'var(--text-body)',
              fontSize: 13.5,
              fontFamily: 'var(--font-body)',
              outlineColor: 'var(--seal-red)',
            }}
          />
          <div style={{ display: 'flex', flex: 'none' }}>
            {(['M', 'F'] as Gender[]).map((g, gi) => {
              const on = p.gender === g;
              return (
                <button
                  key={g}
                  onClick={() => patch(i, { gender: g })}
                  aria-pressed={on}
                  aria-label={g === 'M' ? 'Male' : 'Female'}
                  style={{
                    width: 26,
                    padding: '6px 0',
                    border: `1px solid ${on ? 'transparent' : 'var(--border-soft)'}`,
                    borderRadius: gi === 0 ? '7px 0 0 7px' : '0 7px 7px 0',
                    marginLeft: gi === 1 ? -1 : 0,
                    background: on ? GENDER_BG[g] : 'var(--card)',
                    color: on ? GENDER_FG[g] : 'var(--text-faint)',
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => patch(i, { captain: !p.captain })}
            aria-pressed={p.captain}
            aria-label="Captain"
            title="Captain"
            style={{
              width: 26,
              flex: 'none',
              padding: '6px 0',
              border: `1px solid ${p.captain ? 'transparent' : 'var(--border-soft)'}`,
              borderRadius: 7,
              background: p.captain ? 'var(--gold)' : 'var(--card)',
              color: p.captain ? '#fff' : 'var(--text-faint)',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            C
          </button>
          <button
            onClick={() => remove(i)}
            aria-label={`Remove ${p.name || 'player'}`}
            style={{
              width: 24,
              flex: 'none',
              padding: '6px 0',
              border: 'none',
              background: 'none',
              color: 'var(--text-faint)',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={add}
        style={{
          alignSelf: 'flex-start',
          marginTop: 3,
          background: 'transparent',
          color: 'var(--seal-red)',
          border: '1px dashed var(--seal-red)',
          borderRadius: 8,
          padding: '6px 12px',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 12.5,
          cursor: 'pointer',
        }}
      >
        + Add player
      </button>

      {rows.length > 0 && (
        <RosterSummary count={rows.length} men={men} women={women} />
      )}
    </>
  );
}

/** Line count and gender split — the numbers behind the 3:2 ratio rule. */
function RosterSummary({
  count,
  men,
  women,
}: {
  count: number;
  men: number;
  women: number;
}) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '.05em',
        color: 'var(--text-faint)',
        marginTop: 2,
      }}
    >
      {count} player{count === 1 ? '' : 's'} · {men}M / {women}F
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
