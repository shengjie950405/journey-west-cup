import type { SyncStatus } from '../lib/sync';

const LOOK: Record<SyncStatus, { dot: string; label: string }> = {
  synced: { dot: 'var(--ok)', label: 'Synced' },
  pending: { dot: 'var(--gold)', label: 'Saving…' },
  offline: { dot: 'var(--danger)', label: 'Offline' },
};

/**
 * Sync state, so nobody has to wonder whether a score actually left the phone.
 * "Offline" means edits are queued locally and will send when signal returns.
 */
export function SyncBadge({ status, pending }: { status: SyncStatus; pending: number }) {
  const look = LOOK[status];
  const label = pending > 0 && status !== 'synced' ? `${look.label} ${pending}` : look.label;

  return (
    <span
      title={
        status === 'offline'
          ? `No connection — ${pending} change${pending === 1 ? '' : 's'} waiting to send`
          : 'Shared with everyone on this tournament'
      }
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '.04em',
        color: 'rgba(238,241,248,.7)',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: look.dot,
          flex: 'none',
        }}
      />
      {label}
    </span>
  );
}
