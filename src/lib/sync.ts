import { applyPatch, emptyState } from '../../shared/state';
import type { Patch, Role, TournamentState } from '../../shared/types';

const CACHE_KEY = 'wukong-jwc-cache-v2';
const QUEUE_KEY = 'wukong-jwc-queue-v2';
const PIN_KEY = 'wukong-jwc-pin-v2';

export type SyncStatus = 'synced' | 'pending' | 'offline';

interface Cached {
  state: TournamentState;
  queue: Patch[];
}

/**
 * The server is authoritative, but the app must keep working on a field with
 * bad signal. So: the last server state is cached, unsent patches queue up in
 * localStorage, and the rendered state is the cache with the queue applied on
 * top. The queue drains on a timer and whenever the tab regains focus.
 */
export function loadCache(): Cached {
  let state = emptyState();
  let queue: Patch[] = [];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) state = { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    /* corrupt or unavailable cache — start from empty */
  }
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) queue = parsed as Patch[];
    }
  } catch {
    /* as above */
  }
  return { state, queue };
}

export function saveCache(state: TournamentState): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — sync still works, just no offline cache */
  }
}

export function saveQueue(queue: Patch[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    /* as above */
  }
}

/** The PIN is remembered per device so a scorer isn't re-entering it all night. */
export function loadPin(): string {
  try {
    return localStorage.getItem(PIN_KEY) || '';
  } catch {
    return '';
  }
}

export function savePin(pin: string): void {
  try {
    if (pin) localStorage.setItem(PIN_KEY, pin);
    else localStorage.removeItem(PIN_KEY);
  } catch {
    /* as above */
  }
}

/** Renders the optimistic view: server state with unsent patches layered on. */
export function project(state: TournamentState, queue: Patch[], role: Role): TournamentState {
  return queue.reduce((acc, p) => applyPatch(acc, p, role), state);
}

export async function fetchState(signal?: AbortSignal): Promise<TournamentState> {
  const res = await fetch('/api/state', { signal, headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`state ${res.status}`);
  const body = (await res.json()) as { state: TournamentState };
  return body.state;
}

export class ForbiddenError extends Error {
  constructor(readonly role: Role) {
    super('forbidden');
  }
}

/** Sends one patch. Throws ForbiddenError when the PIN lacks the permission. */
export async function pushPatch(patch: Patch, pin: string): Promise<TournamentState> {
  const res = await fetch('/api/state', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pin, patch }),
  });

  if (res.status === 403) {
    const body = (await res.json().catch(() => ({}))) as { role?: Role };
    throw new ForbiddenError(body.role ?? 'player');
  }
  if (!res.ok) throw new Error(`push ${res.status}`);

  const body = (await res.json()) as { state: TournamentState };
  return body.state;
}

export async function checkPin(pin: string): Promise<Role> {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  if (!res.ok) return 'player';
  const body = (await res.json()) as { role: Role };
  return body.role;
}
