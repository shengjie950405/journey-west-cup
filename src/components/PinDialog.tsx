import { useEffect, useState } from 'react';
import { Dialog } from './Dialog';

interface Props {
  open: boolean;
  title: string;
  /** Body copy explaining what the PIN authorises */
  prompt: React.ReactNode;
  confirmLabel: string;
  onClose: () => void;
  /**
   * Checked server-side. Resolves null on success, or the message to show —
   * so the dialog can say *why* it failed rather than always blaming the PIN.
   */
  onConfirm: (pin: string) => Promise<string | null>;
}

/**
 * PIN gate — used both to enter admin mode and to confirm a tournament reset.
 * A wrong PIN clears the field and shows the error without closing.
 */
export function PinDialog({
  open,
  title,
  prompt,
  confirmLabel,
  onClose,
  onConfirm,
}: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setValue('');
      setError(null);
      setBusy(false);
    }
  }, [open]);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const message = await onConfirm(value);
      if (!message) return;
      setError(message);
      setValue('');
    } catch {
      setError('Something went wrong. Try again.');
      setValue('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} title={title} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>{prompt}</div>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void submit();
          }}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Admin PIN"
          placeholder="••••"
          style={{
            padding: '10px 12px',
            border: '1px solid var(--border-soft)',
            borderRadius: 8,
            fontSize: 20,
            letterSpacing: '.35em',
            fontFamily: 'var(--font-body)',
            background: 'var(--paper)',
            color: 'var(--text-body)',
            outlineColor: 'var(--seal-red)',
            width: 130,
          }}
        />
        {error && (
          <div
            style={{
              color: 'var(--danger)',
              fontSize: 13,
              fontWeight: 700,
              lineHeight: 1.45,
            }}
          >
            {error}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--ink-1)',
              border: '1px solid var(--border-ink)',
              borderRadius: 8,
              padding: '8px 18px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => void submit()}
            disabled={busy}
            style={{
              opacity: busy ? 0.6 : 1,
              background: 'var(--seal-red)',
              color: '#fff',
              border: '1px solid transparent',
              borderRadius: 8,
              padding: '8px 18px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
