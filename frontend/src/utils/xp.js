// Mirrors backend/routes/progress.js — total XP required to REACH a given level.
export function xpForLevel(level) {
  return level * (level - 1) * 50 + level * 50;
}

// Returns { current, needed, percent } describing progress within the current level.
export function levelProgress(xp, level) {
  const floor = xpForLevel(level);
  const ceiling = xpForLevel(level + 1);
  const span = ceiling - floor;
  const current = xp - floor;
  const percent = Math.max(0, Math.min(100, Math.round((current / span) * 100)));
  return { current, needed: span, percent };
}
