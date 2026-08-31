import { CONFIG } from '../config';
import { HOUSE_RULES, SPEEDPOINT_RULES, type Rule } from '../data/rules';

const PILLS = ['5v5 Speedpoint', 'Mixed 3:2', 'Stall 8', '30 min cap'];

export function RulesTab() {
  const showCn = CONFIG.showChinese;

  return (
    <div
      style={{
        padding: '14px 14px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        style={{
          background: 'var(--way-navy)',
          color: 'var(--text-on-dark)',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{ fontFamily: 'var(--font-cn)', fontSize: 22, color: 'var(--gold)' }}
          >
            {showCn ? '規則' : ''}
          </span>
          <span
            style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}
          >
            Tournament Setup
          </span>
        </div>
        <div
          style={{ fontSize: 13.5, lineHeight: 1.55, color: 'rgba(238,241,248,.85)' }}
        >
          One evening, 6:00–11:00 PM · 8 teams · two pools of four · round robin, then
          quarters, semis and the final. Every game is a 30-minute running-clock cap on
          four fields.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {PILLS.map((p) => (
            <span
              key={p}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                background: 'rgba(238,241,248,.12)',
                borderRadius: 999,
                padding: '3px 10px',
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <RuleCard
        title="House Rules"
        cn={showCn ? '家規' : ''}
        rules={HOUSE_RULES}
        bullet="var(--seal-red)"
      />
      <RuleCard title="Speedpoint Basics" rules={SPEEDPOINT_RULES} bullet="var(--gold)" />

      <div
        style={{
          background: 'var(--accent-quiet)',
          border: '1px solid #e8cfc9',
          borderRadius: 14,
          padding: '13px 15px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--seal-red-deep)',
            marginBottom: 4,
          }}
        >
          Spirit of the Game{' '}
          <span style={{ fontFamily: 'var(--font-cn)', fontSize: 15 }}>
            {showCn ? '精神' : ''}
          </span>
        </div>
        <div
          style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--seal-red-deep)' }}
        >
          Ultimate is self-officiated. Players make their own calls, resolve disputes with
          respect, and if no agreement is reached the disc goes back. Win like the Great
          Sage — with style, not spite.
        </div>
      </div>
    </div>
  );
}

function RuleCard({
  title,
  cn,
  rules,
  bullet,
}: {
  title: string;
  cn?: string;
  rules: Rule[];
  bullet: string;
}) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-card)',
        padding: '14px 15px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontWeight: 700,
          marginBottom: 9,
        }}
      >
        {title}
        {cn && (
          <span
            style={{
              fontFamily: 'var(--font-cn)',
              color: 'var(--seal-red)',
              fontSize: 16,
            }}
          >
            {' '}
            {cn}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {rules.map((r) => (
          <div key={r.head} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: bullet,
                flex: 'none',
                marginTop: 5,
              }}
            />
            <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              <b>{r.head}</b> — {r.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
