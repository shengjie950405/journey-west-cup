import { useState } from 'react';
import { Dialog } from './Dialog';
import { FIELDS, type Game } from '../data/games';
import type { SchedOverride, Score } from '../../shared/types';

interface Props {
  game: Game;
  homeName: string;
  awayName: string;
  initialScore: Score;
  /** Current time/field for the game, including any saved override */
  initialTime: string;
  initialField: string;
  onClose: () => void;
  onSave: (score: Score, override: SchedOverride | null) => void;
  onClear: () => void;
}

/**
 * Admin score entry: steppers plus a directly typeable field, with optional
 * time and field overrides for the game. Mounted per game (keyed by id), so the
 * initial props seed the form once.
 */
export function ScoreDialog({
  game,
  homeName,
  awayName,
  initialScore,
  initialTime,
  initialField,
  onClose,
  onSave,
  onClear,
}: Props) {
  const [h, setH] = useState(initialScore.h);
  const [a, setA] = useState(initialScore.a);
  const [time, setTime] = useState(initialTime);
  const [field, setField] = useState(initialField);

  const save = () => {
    // Only record an override when the admin actually changed time or field.
    const changed = time !== game.time || field !== game.field;
    onSave({ h, a }, changed ? { time, field } : null);
  };

  return (
    <Dialog open title={`${homeName} vs ${awayName}`} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ScoreRow label={homeName} value={h} onChange={setH} />
        <ScoreRow label={awayName} value={a} onChange={setA} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderTop: '1px solid var(--border-soft)',
            paddingTop: 12,
          }}
        >
          <span
            style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}
          >
            Time
          </span>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-label="Game time"
            style={{
              width: 64,
              padding: '7px 8px',
              border: '1px solid var(--border-soft)',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              background: 'var(--paper)',
              color: 'var(--text-body)',
            }}
          />
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginLeft: 6,
            }}
          >
            Field
          </span>
          {FIELDS.map((f) => {
            const on = field === f;
            return (
              <button
                key={f}
                onClick={() => setField(f)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: `1px solid ${on ? 'var(--seal-red)' : 'var(--border-soft)'}`,
                  background: on ? 'var(--seal-red)' : 'var(--paper)',
                  color: on ? '#fff' : 'var(--ink-2)',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {f.replace('Field ', 'F')}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <button
            onClick={onClear}
            style={{
              background: 'transparent',
              color: 'var(--danger)',
              border: '1px solid transparent',
              borderRadius: 8,
              padding: '8px 10px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
            }}
          >
            Clear result
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: 'var(--ink-1)',
                border: '1px solid var(--border-ink)',
                borderRadius: 8,
                padding: '8px 16px',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              style={{
                background: 'var(--seal-red)',
                color: '#fff',
                border: '1px solid transparent',
                borderRadius: 8,
                padding: '8px 16px',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Save final
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

/** One team's score: − stepper, typeable number, + stepper. */
function ScoreRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span
        style={{
          flex: 1,
          fontWeight: 700,
          color: 'var(--text-body)',
          fontSize: 15,
          minWidth: 0,
        }}
      >
        {label}
      </span>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        aria-label={`Decrease ${label} score`}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          border: '1px solid var(--border-soft)',
          background: 'var(--paper)',
          fontSize: 18,
          cursor: 'pointer',
          color: 'var(--ink-1)',
          flex: 'none',
        }}
      >
        −
      </button>
      <input
        value={String(value)}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '');
          const n = parseInt(digits, 10);
          onChange(isNaN(n) ? 0 : Math.min(99, n));
        }}
        type="text"
        inputMode="numeric"
        aria-label={`${label} score`}
        style={{
          width: 44,
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--ink-1)',
          border: '1px solid var(--border-soft)',
          borderRadius: 10,
          background: 'var(--paper)',
          padding: '3px 0',
          outlineColor: 'var(--seal-red)',
          flex: 'none',
        }}
      />
      <button
        onClick={() => onChange(value + 1)}
        aria-label={`Increase ${label} score`}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          border: '1px solid transparent',
          background: 'var(--seal-red)',
          color: '#fff',
          fontSize: 18,
          cursor: 'pointer',
          flex: 'none',
        }}
      >
        +
      </button>
    </div>
  );
}
