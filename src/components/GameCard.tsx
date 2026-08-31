export interface GameSideVM {
  name: string;
  cn: string;
  color: string;
  fg: string;
  score: string;
  scoreFg: string;
}

export interface GameVM {
  id: string;
  time: string;
  /** Abbreviated field label, e.g. "F1" */
  field: string;
  tag: string;
  status: string;
  home: GameSideVM;
  away: GameSideVM;
  onTap?: () => void;
}

function SideRow({ side }: { side: GameSideVM }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span
        style={{
          width: 13,
          height: 13,
          borderRadius: 4,
          background: side.color,
          border: '1px solid rgba(46,49,56,.18)',
          flex: 'none',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-cn)',
          fontSize: 14,
          color: 'var(--text-muted)',
          width: 26,
          flex: 'none',
        }}
      >
        {side.cn}
      </span>
      <span
        style={{
          flex: 1,
          fontWeight: 700,
          fontSize: 14.5,
          color: side.fg,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {side.name}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 19,
          fontWeight: 700,
          color: side.scoreFg,
        }}
      >
        {side.score}
      </span>
    </div>
  );
}

/** One scheduled game. Tappable in admin mode once both slots hold real teams. */
export function GameCard({ game }: { game: GameVM }) {
  const editable = !!game.onTap;

  return (
    <div
      onClick={game.onTap}
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
      onKeyDown={
        editable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                game.onTap?.();
              }
            }
          : undefined
      }
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 12,
        boxShadow: 'var(--shadow-card)',
        padding: '9px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: editable ? 'pointer' : 'default',
      }}
    >
      <div style={{ width: 46, flex: 'none', textAlign: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 13 }}>{game.time}</div>
        <div
          style={{ fontSize: 10.5, color: 'var(--text-faint)', letterSpacing: '.05em' }}
        >
          {game.field}
        </div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '.05em',
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
          }}
        >
          {game.tag}
        </div>
      </div>
      <div
        style={{
          width: 1,
          alignSelf: 'stretch',
          background: 'var(--border-soft)',
          flex: 'none',
        }}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        <SideRow side={game.home} />
        <SideRow side={game.away} />
      </div>
      <div style={{ width: 34, flex: 'none', textAlign: 'right' }}>
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: '.08em',
            color: 'var(--seal-red)',
          }}
        >
          {game.status}
        </span>
      </div>
    </div>
  );
}
