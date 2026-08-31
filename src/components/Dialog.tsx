import type { ReactNode } from 'react';

interface Props {
  open?: boolean;
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
}

/** Centred modal on a scrim, per the design system's Dialog. */
export function Dialog({ open = false, title, children, onClose, actions }: Props) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(46,49,56,.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-float)',
          width: 'min(440px, calc(100vw - 48px))',
          maxHeight: 'calc(100dvh - 48px)',
          overflowY: 'auto',
          padding: 24,
          fontFamily: 'var(--font-body)',
          color: 'var(--text-body)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 24,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              color: 'var(--text-faint)',
              padding: 2,
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            fontSize: 15,
            lineHeight: 'var(--leading-body)',
            color: 'var(--text-muted)',
          }}
        >
          {children}
        </div>
        {actions && (
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              marginTop: 20,
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
