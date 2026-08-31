import { CONFIG } from '../config';
import { GameCard, type GameVM } from '../components/GameCard';
import { SectionHeading } from '../components/SectionHeading';
import type { Game } from '../data/games';
import { team, type TeamId } from '../data/teams';
import {
  gameFieldOf,
  gameTimeOf,
  groupSlots,
  refLabel,
  type Side,
} from '../lib/tournament';
import type { Tournament } from '../lib/useTournament';

interface Props {
  t: Tournament;
  admin: boolean;
  onEditGame: (g: Game) => void;
}

export function GamesTab({ t, admin, onEditGame }: Props) {
  const showCn = CONFIG.showChinese;

  const side = (ref: string): Side => {
    const id = t.resolve(ref);
    if (id) {
      const tm = team(id);
      return { name: t.teamName(id), cn: showCn ? tm.cn : '', color: tm.color, real: true };
    }
    return { name: refLabel(ref), cn: '', color: 'var(--ink-wash)', real: false };
  };

  const toVM = (g: Game): GameVM => {
    const s = t.scores[g.id];
    const H = side(g.h);
    const A = side(g.a);
    const editable = admin && H.real && A.real;

    return {
      id: g.id,
      time: gameTimeOf(g, t.sched),
      field: gameFieldOf(g, t.sched).replace('Field ', 'F'),
      tag: g.tag || '',
      status: s ? 'FINAL' : '',
      home: {
        name: H.name,
        cn: H.cn,
        color: H.color,
        fg: H.real ? 'var(--ink-1)' : 'var(--ink-3)',
        score: s ? String(s.h) : '–',
        scoreFg: s && s.h >= s.a ? 'var(--seal-red)' : 'var(--ink-3)',
      },
      away: {
        name: A.name,
        cn: A.cn,
        color: A.color,
        fg: A.real ? 'var(--ink-1)' : 'var(--ink-3)',
        score: s ? String(s.a) : '–',
        scoreFg: s && s.a >= s.h ? 'var(--seal-red)' : 'var(--ink-3)',
      },
      onTap: editable ? () => onEditGame(g) : undefined,
    };
  };

  const timeOf = (g: Game) => gameTimeOf(g, t.sched);
  const poolSlots = groupSlots('pool', timeOf, toVM);
  const brSlots = groupSlots('br', timeOf, toVM);

  const standTables = (['A', 'B'] as const).map((pool) => ({
    label: `Pool ${pool}${(pool === 'A' ? t.doneA : t.doneB) ? ' · final' : ''}`,
    rows: t.tables[pool].map((r, i) => {
      const diff = r.pf - r.pa;
      return {
        id: r.id as TeamId,
        rank: String(i + 1),
        color: r.team.color,
        name: t.teamName(r.id),
        rec: `${r.w}–${r.l}`,
        diff: `${diff > 0 ? '+' : ''}${diff}`,
      };
    }),
  }));

  return (
    <div
      style={{
        padding: '14px 14px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div
        style={{
          background: 'var(--accent-quiet)',
          border: '1px solid #e8cfc9',
          borderRadius: 10,
          padding: '10px 13px',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--seal-red-deep)' }}>
          {t.poolsDone
            ? 'Pool play complete — the bracket is seeded.'
            : 'Playoffs seed automatically once every pool game has a final score.'}
        </div>
        {admin && (
          <div
            style={{
              fontSize: 12.5,
              color: 'var(--seal-red-deep)',
              opacity: 0.8,
              marginTop: 2,
            }}
          >
            Admin: tap any game to enter or edit its result, time or field.
          </div>
        )}
      </div>

      <div>
        <SectionHeading
          cn={showCn ? '預賽' : ''}
          title="Pool Round"
          aside="30 min cap · 4 fields"
        />
        <SlotList slots={poolSlots} />
      </div>

      <div>
        <SectionHeading cn={showCn ? '排名' : ''} title="Standings" />
        <div style={{ display: 'flex', gap: 10 }}>
          {standTables.map((tbl) => (
            <div
              key={tbl.label}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'var(--surface-card)',
                border: '1px solid var(--border-soft)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-card)',
                padding: '10px 11px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '.1em',
                  color: 'var(--text-faint)',
                  textTransform: 'uppercase',
                  marginBottom: 7,
                }}
              >
                {tbl.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tbl.rows.map((s) => (
                  <div
                    key={s.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span
                      style={{
                        width: 14,
                        fontSize: 11,
                        fontWeight: 800,
                        color: 'var(--text-faint)',
                        flex: 'none',
                      }}
                    >
                      {s.rank}
                    </span>
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 3,
                        background: s.color,
                        border: '1px solid rgba(46,49,56,.18)',
                        flex: 'none',
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12.5,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        flex: 'none',
                      }}
                    >
                      {s.rec}
                    </span>
                    <span
                      style={{
                        width: 28,
                        textAlign: 'right',
                        fontSize: 11,
                        color: 'var(--text-faint)',
                        flex: 'none',
                      }}
                    >
                      {s.diff}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading cn={showCn ? '決賽' : ''} title="Playoffs" />
        <SlotList slots={brSlots} />
      </div>
    </div>
  );
}

function SlotList({
  slots,
}: {
  slots: { key: string; tag: string; time: string; games: GameVM[] }[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {slots.map((slot) => (
        <div key={slot.key}>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '.08em',
              color: 'var(--text-faint)',
              margin: '0 2px 6px',
              textTransform: 'uppercase',
            }}
          >
            {slot.time} — {slot.tag}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {slot.games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
