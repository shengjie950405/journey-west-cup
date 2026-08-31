import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Patch, Player, Role, Score, SchedOverride, TeamId, TournamentState } from '../../shared/types';
import { team } from '../data/teams';
import {
  ForbiddenError,
  checkPin,
  fetchState,
  loadCache,
  loadPin,
  project,
  pushPatch,
  saveCache,
  savePin,
  saveQueue,
  type SyncStatus,
} from './sync';
import { makeResolver, poolDone, standings, type Pool, type StandingRow } from './tournament';

/** Polling cadence while the tab is visible. Hidden tabs do not poll. */
const POLL_MS = 20_000;
const RETRY_MS = 4_000;

/**
 * Shared tournament state. Reads come from the server (cached locally so the
 * app works offline); writes go through a queue that drains in the background,
 * so an edit made with no signal is not lost.
 */
export function useTournament() {
  const initial = useMemo(loadCache, []);
  const [server, setServer] = useState<TournamentState>(initial.state);
  const [queue, setQueue] = useState<Patch[]>(initial.queue);
  const [pin, setPin] = useState<string>(loadPin);
  const [role, setRole] = useState<Role>('player');
  const [status, setStatus] = useState<SyncStatus>('synced');

  const draining = useRef(false);
  const queueRef = useRef(queue);
  queueRef.current = queue;
  const pinRef = useRef(pin);
  pinRef.current = pin;
  const statusRef = useRef(status);
  statusRef.current = status;

  /** Optimistic view: server state plus whatever has not been acknowledged. */
  const state = useMemo(() => project(server, queue, role), [server, queue, role]);

  const commit = useCallback((next: TournamentState) => {
    setServer(next);
    saveCache(next);
  }, []);

  const enqueue = useCallback((patch: Patch) => {
    setQueue((q) => {
      const next = [...q, patch];
      saveQueue(next);
      return next;
    });
  }, []);

  /** Sends queued patches oldest-first, stopping at the first failure. */
  const drain = useCallback(async () => {
    if (draining.current) return;
    draining.current = true;
    try {
      while (queueRef.current.length) {
        const patch = queueRef.current[0];
        try {
          const next = await pushPatch(patch, pinRef.current);
          commit(next);
          setQueue((q) => {
            const rest = q.slice(1);
            saveQueue(rest);
            return rest;
          });
          setStatus((s) => (s === 'offline' ? 'pending' : s));
        } catch (err) {
          if (err instanceof ForbiddenError) {
            // The PIN no longer grants this; drop the patch rather than retry
            // forever, and fall back to whatever role the server reports.
            setRole(err.role);
            setQueue((q) => {
              const rest = q.slice(1);
              saveQueue(rest);
              return rest;
            });
            continue;
          }
          setStatus('offline');
          return;
        }
      }
      setStatus('synced');
    } finally {
      draining.current = false;
    }
  }, [commit]);

  // A remembered PIN has to be re-checked to get its role back — otherwise a
  // scorer who reloads the page silently drops to read-only.
  useEffect(() => {
    const saved = loadPin();
    if (!saved) return;
    let alive = true;
    void checkPin(saved)
      .then((outcome) => {
        if (alive) setRole(outcome.ok ? outcome.role : 'player');
      })
      .catch(() => {
        /* offline: stay a player until the next successful check */
      });
    return () => {
      alive = false;
    };
  }, []);

  // Poll while visible, and refresh immediately when the tab comes back.
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const tick = async () => {
      if (!alive || document.hidden) return;
      if (queueRef.current.length) {
        void drain();
        return;
      }
      try {
        const next = await fetchState(controller.signal);
        if (!alive) return;
        commit(next);
        setStatus('synced');
      } catch {
        if (alive) setStatus('offline');
      }
    };

    void tick();
    const id = setInterval(tick, POLL_MS);
    const onVisible = () => {
      if (!document.hidden) void tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onVisible);

    return () => {
      alive = false;
      controller.abort();
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onVisible);
    };
  }, [commit, drain]);

  // Send as soon as something is queued; the delay is a backoff after a failure,
  // not a wait before the first attempt.
  useEffect(() => {
    if (!queue.length) return;
    const backoff = statusRef.current === 'offline';
    setStatus((s) => (s === 'offline' ? s : 'pending'));
    const id = setTimeout(() => void drain(), backoff ? RETRY_MS : 0);
    return () => clearTimeout(id);
  }, [queue, drain]);

  const signIn = useCallback(async (candidate: string, nextRole: Role) => {
    setPin(candidate);
    savePin(candidate);
    setRole(nextRole);
  }, []);

  const signOut = useCallback(() => {
    setPin('');
    savePin('');
    setRole('player');
  }, []);

  const setScore = useCallback(
    (gameId: string, value: Score, sched: SchedOverride | null) =>
      enqueue({ kind: 'score', gameId, value, sched }),
    [enqueue],
  );
  const clearScore = useCallback(
    (gameId: string) => enqueue({ kind: 'clearScore', gameId }),
    [enqueue],
  );
  const renameTeam = useCallback(
    (teamId: TeamId, value: string) =>
      enqueue({ kind: 'teamName', teamId, value: value.trim() || team(teamId).en }),
    [enqueue],
  );
  const setRoster = useCallback(
    (teamId: TeamId, value: Player[]) => enqueue({ kind: 'roster', teamId, value }),
    [enqueue],
  );
  const resetAll = useCallback(() => enqueue({ kind: 'reset' }), [enqueue]);

  const roster = useCallback(
    (id: TeamId): Player[] => state.rosters[id] || [],
    [state.rosters],
  );
  const teamName = useCallback(
    (id: TeamId) => state.teamNames[id] || team(id).en,
    [state.teamNames],
  );

  const tables = useMemo<Record<Pool, StandingRow[]>>(
    () => ({ A: standings('A', state.scores), B: standings('B', state.scores) }),
    [state.scores],
  );
  const doneA = useMemo(() => poolDone('A', state.scores), [state.scores]);
  const doneB = useMemo(() => poolDone('B', state.scores), [state.scores]);
  const resolve = useMemo(() => makeResolver(state.scores), [state.scores]);

  return {
    scores: state.scores,
    sched: state.sched,
    audit: state.audit,
    teamName,
    roster,
    tables,
    doneA,
    doneB,
    poolsDone: doneA && doneB,
    resolve,
    role,
    isAdmin: role === 'admin',
    canEditTeams: role === 'admin' || role === 'captain',
    status,
    pendingCount: queue.length,
    signIn,
    signOut,
    setScore,
    clearScore,
    renameTeam,
    setRoster,
    resetAll,
  };
}

export type Tournament = ReturnType<typeof useTournament>;
