import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

// XP needed to reach a given level. Level N requires N * 100 total XP
// (level 1->2 needs 100xp, 2->3 needs 200 more, etc. — gentle ramp).
export function xpForLevel(level) {
  return (level * (level - 1) * 50) + level * 50;
}

export function computeLevel(xp) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) {
    level += 1;
  }
  return level;
}

// GET /api/progress
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT xp, level FROM progress WHERE id = 1');
    const row = result.rows[0] || { xp: 0, level: 1 };
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
