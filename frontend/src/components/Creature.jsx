function stageForLevel(level) {
  if (level >= 10) return 4;
  if (level >= 6) return 3;
  if (level >= 3) return 2;
  return 1;
}

const STAGE_NAMES = {
  1: 'behbeh',
  2: 'Voltling',
  3: 'Ampyre',
  4: 'Voltessa'
};

const STAGE_COLORS = {
  1: { body: '#c9a8f5', accent: '#a175e8' },
  2: { body: '#9bd6f0', accent: '#5eb3dd' },
  3: { body: '#8fe3b8', accent: '#4fbf85' },
  4: { body: '#f7c56b', accent: '#e89a2e' }
};

// A small original pixel-blob creature (not based on any existing IP) that
// grows visual features as it evolves: stage 1 is a round blob, stage 2 adds
// ears + a tail, stage 3 adds wings, stage 4 adds a little crown/horn and
// a glow. Purely geometric SVG so it stays lightweight and easy to re-theme.
export default function Creature({ level, size = 96 }) {
  const stage = stageForLevel(level);
  const { body, accent } = STAGE_COLORS[stage];

  return (
    <div className="creature-wrap" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={STAGE_NAMES[stage]}>
        {stage >= 3 && (
          <>
            <ellipse cx="18" cy="52" rx="14" ry="9" fill={accent} transform="rotate(-20 18 52)" />
            <ellipse cx="82" cy="52" rx="14" ry="9" fill={accent} transform="rotate(20 82 52)" />
          </>
        )}

        {stage >= 2 && (
          <>
            <circle cx="30" cy="28" r="9" fill={body} />
            <circle cx="70" cy="28" r="9" fill={body} />
            <path d="M50 78 Q62 90 50 96 Q46 88 50 78 Z" fill={body} />
          </>
        )}

        <circle cx="50" cy="55" r="32" fill={body} />

        {stage >= 4 && (
          <path d="M40 26 L50 10 L60 26 Z" fill={accent} />
        )}

        <circle cx="40" cy="52" r="5" fill="#2e2540" />
        <circle cx="60" cy="52" r="5" fill="#2e2540" />
        <path d="M42 65 Q50 71 58 65" stroke="#2e2540" strokeWidth="3" fill="none" strokeLinecap="round" />

        <circle cx="34" cy="58" r="4" fill="#ff9fc4" opacity="0.6" />
        <circle cx="66" cy="58" r="4" fill="#ff9fc4" opacity="0.6" />

        {stage >= 4 && (
          <circle cx="50" cy="55" r="36" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5" />
        )}
      </svg>
    </div>
  );
}

export { stageForLevel, STAGE_NAMES };
