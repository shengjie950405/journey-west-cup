import { useCallback, useMemo, useState } from 'react';
import type { TeamId } from '../data/teams';
import { team } from '../data/teams';
import {
  makeResolver,
  poolDone,
  standings,
  type Pool,
  type StandingRow,
} from './tournament';
import { clear, load, save, type SchedOverride, type Score } from './storage';

/**
 * Owns everything that persists between visits — scores, schedule overrides and
 * custom team names — and derives the standings and bracket seeding from them.
 */
export function useTournament() {
  const [data, setData] = useState(load);

  const setScore = useCallback(
    (id: string, score: Score, override: SchedOverride | null) => {
      setData((prev) => {
        const sched = { ...prev.sched };
        if (override) sched[id] = override;
        else delete sched[id];
        const next = { ...prev, scores: { ...prev.scores, [id]: score }, sched };
        save(next);
        return next;
      });
    },
    [],
  );

  const clearScore = useCallback((id: string) => {
    setData((prev) => {
      const scores = { ...prev.scores };
      delete scores[id];
      const next = { ...prev, scores };
      save(next);
      return next;
    });
  }, []);

  const renameTeam = useCallback(
    (id: TeamId, name: string) => {
      setData((prev) => {
        const next = {
          ...prev,
          teamNames: { ...prev.teamNames, [id]: name.trim() || team(id).en },
        };
        save(next);
        return next;
      });
    },
    [],
  );

  const resetAll = useCallback(() => {
    setData({ scores: {}, sched: {}, teamNames: {} });
    clear();
  }, []);

  /** The team's cheerable name — a custom one if set, else the default. */
  const teamName = useCallback(
    (id: TeamId) => data.teamNames[id] || team(id).en,
    [data.teamNames],
  );

  const tables = useMemo<Record<Pool, StandingRow[]>>(
    () => ({ A: standings('A', data.scores), B: standings('B', data.scores) }),
    [data.scores],
  );

  const doneA = useMemo(() => poolDone('A', data.scores), [data.scores]);
  const doneB = useMemo(() => poolDone('B', data.scores), [data.scores]);
  const resolve = useMemo(() => makeResolver(data.scores), [data.scores]);

  return {
    scores: data.scores,
    sched: data.sched,
    teamNames: data.teamNames,
    teamName,
    tables,
    doneA,
    doneB,
    poolsDone: doneA && doneB,
    resolve,
    setScore,
    clearScore,
    renameTeam,
    resetAll,
  };
}

export type Tournament = ReturnType<typeof useTournament>;
