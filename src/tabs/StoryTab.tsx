import { CONFIG } from '../config';
import { SectionHeading } from '../components/SectionHeading';
import { ORDERED_TEAMS, team, type TeamId } from '../data/teams';
import type { Tournament } from '../lib/useTournament';

interface Props {
  t: Tournament;
  openStory: TeamId | null;
  setOpenStory: (id: TeamId | null) => void;
  /** Hidden admin entry point behind the closing "· 終 ·" mark. */
  onSecretReset: () => void;
}

export function StoryTab({ t, openStory, setOpenStory, onSecretReset }: Props) {
  const showCn = CONFIG.showChinese;

  return (
    <div
      style={{
        padding: '14px 14px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div
        style={{
          background: 'var(--way-navy)',
          color: 'var(--text-on-dark)',
          borderRadius: 14,
          padding: '18px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: 6,
            top: 2,
            fontFamily: 'var(--font-cn)',
            fontSize: 110,
            lineHeight: 1,
            color: 'rgba(238,241,248,.07)',
            pointerEvents: 'none',
          }}
        >
          遊
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div
            style={{
              fontFamily: 'var(--font-cn)',
              fontSize: 30,
              lineHeight: 1.25,
              color: 'var(--gold)',
              writingMode: 'vertical-rl',
              flex: 'none',
            }}
          >
            西遊記
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 21,
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: 6,
              }}
            >
              Journey to the West
            </div>
            <div
              style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(238,241,248,.85)' }}
            >
              A Tang-dynasty monk is sent west to fetch the sacred scriptures. Guarding him
              on the road: a rebellious monkey king freed from beneath a mountain, a
              gluttonous pig marshal fallen from heaven, a river spirit seeking redemption,
              and a dragon prince turned white horse.
            </div>
            <div
              style={{
                fontSize: 13.5,
                lineHeight: 1.6,
                color: 'rgba(238,241,248,.85)',
                marginTop: 7,
              }}
            >
              Eighty-one trials stand between them and the West — demons, temptations,
              floods and fire. Today, the pilgrimage runs through L'Amoreaux. Every team is
              one of its legends.
            </div>
          </div>
        </div>
        <img
          src="assets/art/chibi-group.png"
          alt="The pilgrims"
          style={{ display: 'block', width: '100%', marginTop: 14, borderRadius: 8 }}
        />
      </div>

      <SectionHeading
        cn={showCn ? '群英' : ''}
        title="The Eight Legends"
        margin="6px 2px 0"
      />

      {ORDERED_TEAMS.map((c) => {
        const open = openStory === c.id;
        const fg = c.dark ? 'var(--text-on-dark)' : 'var(--ink-1)';
        const cnFg = c.dark ? 'var(--gold)' : 'var(--seal-red)';
        const subFg = c.dark ? 'rgba(238,241,248,.6)' : 'var(--ink-2)';
        const bodyFg = c.dark ? 'rgba(238,241,248,.85)' : 'var(--ink-1)';
        const line = c.dark ? 'rgba(238,241,248,.25)' : 'rgba(46,49,56,.15)';

        return (
          <div
            key={c.id}
            onClick={() => setOpenStory(open ? null : c.id)}
            role="button"
            tabIndex={0}
            aria-expanded={open}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpenStory(open ? null : c.id);
              }
            }}
            style={{
              background: c.ground,
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid rgba(46,49,56,.08)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', gap: 13, padding: 13 }}>
              <span
                style={{
                  width: 92,
                  height: 122,
                  borderRadius: 8,
                  flex: 'none',
                  overflow: 'hidden',
                  display: 'block',
                  background: 'rgba(255,255,255,.25)',
                }}
              >
                <span
                  role="img"
                  aria-label={c.name}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('${c.story}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: '50% 12%',
                  }}
                />
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span
                    style={{ fontFamily: 'var(--font-cn)', fontSize: 23, color: cnFg }}
                  >
                    {showCn ? c.cn : ''}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17,
                      fontWeight: 700,
                      color: fg,
                    }}
                  >
                    {c.name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.09em',
                    textTransform: 'uppercase',
                    color: subFg,
                    margin: '2px 0 5px',
                  }}
                >
                  {c.title} · {t.teamName(c.id)}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: bodyFg }}>{c.bio}</div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: '.07em',
                    color: subFg,
                    marginTop: 6,
                  }}
                >
                  {open ? '▲ Fold the scroll' : '▼ Tap for the full legend'}
                </div>
              </div>
            </div>

            {open && (
              <div
                style={{
                  padding: '0 13px 15px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                }}
              >
                <div style={{ height: 1, background: line }} />
                <div style={{ fontSize: 13, lineHeight: 1.62, color: bodyFg }}>
                  {c.lore1}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.62, color: bodyFg }}>
                  {c.lore2}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '.09em',
                    textTransform: 'uppercase',
                    color: subFg,
                    marginTop: 3,
                  }}
                >
                  Bonds{' '}
                  <span
                    style={{
                      fontFamily: 'var(--font-cn)',
                      fontSize: 13,
                      textTransform: 'none',
                      letterSpacing: 0,
                    }}
                  >
                    {showCn ? '因緣' : ''}
                  </span>
                </div>
                {c.rel.map(([otherId, text]) => {
                  const other = team(otherId);
                  return (
                    <div
                      key={otherId}
                      style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: 'var(--seal-red)',
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-cn)',
                          fontSize: 14,
                          flex: 'none',
                          boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.35)',
                        }}
                      >
                        {other.cn.charAt(0)}
                      </span>
                      <div
                        style={{
                          minWidth: 0,
                          fontSize: 12.5,
                          lineHeight: 1.55,
                          color: bodyFg,
                          paddingTop: 2,
                        }}
                      >
                        <b>{other.name}</b> — {text}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Reads as a decorative closing mark; doubles as the reset entry point. */}
      <div style={{ textAlign: 'center', padding: '10px 0 2px' }}>
        <span
          onClick={onSecretReset}
          style={{
            fontFamily: 'var(--font-cn)',
            fontSize: 15,
            color: 'var(--text-faint)',
            opacity: 0.55,
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          · 終 ·
        </span>
      </div>
    </div>
  );
}
