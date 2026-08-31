import { useState } from 'react';
import { CONFIG, EVENT } from './config';
import { PinDialog } from './components/PinDialog';
import { ScoreDialog } from './components/ScoreDialog';
import { SealBadge } from './components/SealBadge';
import type { Game } from './data/games';
import type { TeamId } from './data/teams';
import { gameFieldOf, gameTimeOf, refLabel } from './lib/tournament';
import { useTournament } from './lib/useTournament';
import { FieldsTab } from './tabs/FieldsTab';
import { GamesTab } from './tabs/GamesTab';
import { RulesTab } from './tabs/RulesTab';
import { StoryTab } from './tabs/StoryTab';
import { TeamsTab } from './tabs/TeamsTab';

type Tab = 'games' | 'teams' | 'field' | 'rules' | 'story';

const TABS: { id: Tab; label: string; cn: string }[] = [
  { id: 'games', label: 'Games', cn: '賽' },
  { id: 'teams', label: 'Teams', cn: '隊' },
  { id: 'field', label: 'Fields', cn: '場' },
  { id: 'rules', label: 'Rules', cn: '規' },
  { id: 'story', label: 'Story', cn: '書' },
];

export function App() {
  const t = useTournament();
  const showCn = CONFIG.showChinese;

  const [tab, setTab] = useState<Tab>('games');
  const [admin, setAdmin] = useState(CONFIG.defaultAdmin);
  const [pinOpen, setPinOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [editGame, setEditGame] = useState<Game | null>(null);
  const [openTeam, setOpenTeam] = useState<TeamId | null>(null);
  const [openStory, setOpenStory] = useState<TeamId | null>(null);

  /** Name for a slot, falling back to its placeholder label while undecided. */
  const sideName = (ref: string) => {
    const id = t.resolve(ref);
    return id ? t.teamName(id) : refLabel(ref);
  };

  return (
    <div
      style={{
        maxWidth: 430,
        margin: '0 auto',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--paper)',
        boxShadow: '0 0 40px rgba(46,49,56,.18)',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          background: 'var(--way-navy)',
          color: 'var(--text-on-dark)',
          padding: '14px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          flex: 'none',
        }}
      >
        <SealBadge glyph="悟" size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 19,
              lineHeight: 1.15,
              fontWeight: 700,
            }}
          >
            {EVENT.title}{' '}
            <span
              style={{
                fontFamily: 'var(--font-cn)',
                fontWeight: 400,
                color: 'var(--gold)',
              }}
            >
              {showCn ? EVENT.cnTitle : ''}
            </span>
          </div>
          <div
            style={{
              fontSize: 11.5,
              color: 'rgba(238,241,248,.65)',
              letterSpacing: '.03em',
            }}
          >
            {EVENT.subtitle}
          </div>
        </div>
        <button
          onClick={() => (admin ? setAdmin(false) : setPinOpen(true))}
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            border: `1px solid ${admin ? 'var(--seal-red)' : 'rgba(238,241,248,.3)'}`,
            background: admin ? 'var(--seal-red)' : 'rgba(238,241,248,.1)',
            color: admin ? '#fff' : 'rgba(238,241,248,.8)',
            borderRadius: 999,
            padding: '5px 11px',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer',
            letterSpacing: '.04em',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: admin ? '#fff' : 'var(--gold)',
            }}
          />
          {admin ? 'ADMIN' : 'PLAYER'}
        </button>
      </header>

      <main
        className="jwc-scroll"
        style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}
      >
        {tab === 'games' && <GamesTab t={t} admin={admin} onEditGame={setEditGame} />}
        {tab === 'teams' && (
          <TeamsTab t={t} admin={admin} openTeam={openTeam} setOpenTeam={setOpenTeam} />
        )}
        {tab === 'field' && <FieldsTab />}
        {tab === 'rules' && <RulesTab />}
        {tab === 'story' && (
          <StoryTab
            t={t}
            openStory={openStory}
            setOpenStory={setOpenStory}
            onSecretReset={() => setResetOpen(true)}
          />
        )}
      </main>

      <nav
        style={{
          flex: 'none',
          display: 'flex',
          background: 'var(--card)',
          borderTop: '1px solid var(--border-soft)',
          padding: '6px 6px calc(8px + env(safe-area-inset-bottom))',
        }}
      >
        {TABS.map((tb) => {
          const on = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              aria-current={on ? 'page' : undefined}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                padding: '5px 0',
                color: on ? 'var(--seal-red)' : 'var(--ink-3)',
              }}
            >
              <span
                style={{ fontFamily: 'var(--font-cn)', fontSize: 19, lineHeight: 1.1 }}
              >
                {showCn ? tb.cn : '●'}
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: on ? 800 : 600,
                  letterSpacing: '.05em',
                }}
              >
                {tb.label}
              </span>
            </button>
          );
        })}
      </nav>

      <PinDialog
        open={pinOpen}
        title="Admin sign-in"
        prompt="Enter the admin PIN to unlock schedule and score editing."
        errorText="Wrong PIN — try again."
        confirmLabel="Unlock"
        onClose={() => setPinOpen(false)}
        onConfirm={(pin) => {
          if (pin !== CONFIG.adminPin) return false;
          setAdmin(true);
          setPinOpen(false);
          return true;
        }}
      />

      <PinDialog
        open={resetOpen}
        title="Reset tournament"
        prompt={
          <>
            This clears <b>all scores, schedule changes and team names</b> back to the
            defaults. Re-enter the admin PIN to confirm.
          </>
        }
        errorText="Wrong PIN — nothing was reset."
        confirmLabel="Reset everything"
        onClose={() => setResetOpen(false)}
        onConfirm={(pin) => {
          if (pin !== CONFIG.adminPin) return false;
          t.resetAll();
          setEditGame(null);
          setOpenTeam(null);
          setResetOpen(false);
          return true;
        }}
      />

      {/* Keyed by game id so the form re-seeds when a different game is opened. */}
      {editGame && (
        <ScoreDialog
          key={editGame.id}
          game={editGame}
          homeName={sideName(editGame.h)}
          awayName={sideName(editGame.a)}
          initialScore={t.scores[editGame.id] ?? { h: 0, a: 0 }}
          initialTime={gameTimeOf(editGame, t.sched)}
          initialField={gameFieldOf(editGame, t.sched)}
          onClose={() => setEditGame(null)}
          onSave={(score, override) => {
            t.setScore(editGame.id, score, override);
            setEditGame(null);
          }}
          onClear={() => {
            t.clearScore(editGame.id);
            setEditGame(null);
          }}
        />
      )}
    </div>
  );
}
