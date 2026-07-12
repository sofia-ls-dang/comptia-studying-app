import { Router } from 'express';
import pool from '../db/pool.js';
import { computeLevel } from './progress.js';

const router = Router();

// GET /api/decks/:deckId/cards - all cards in a deck
router.get('/decks/:deckId/cards', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cards WHERE deck_id = $1 ORDER BY id ASC',
      [req.params.deckId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// POST /api/decks/:deckId/cards - add a card to a deck
router.post('/decks/:deckId/cards', async (req, res) => {
  const { front_text, back_text, difficulty } = req.body;
  if (!front_text || !back_text) {
    return res.status(400).json({ error: 'front_text and back_text are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO cards (deck_id, front_text, back_text, difficulty)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.deckId, front_text, back_text, difficulty || 'medium']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// PUT /api/cards/:id - edit a card
router.put('/cards/:id', async (req, res) => {
  const { front_text, back_text, difficulty } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cards
       SET front_text = COALESCE($1, front_text),
           back_text = COALESCE($2, back_text),
           difficulty = COALESCE($3, difficulty)
       WHERE id = $4
       RETURNING *`,
      [front_text, back_text, difficulty, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// DELETE /api/cards/:id
router.delete('/cards/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM cards WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// POST /api/cards/:id/review - record a pass/fail result and award XP
router.post('/cards/:id/review', async (req, res) => {
  const { result: reviewResult, session_id } = req.body;
  if (!['pass', 'fail'].includes(reviewResult)) {
    return res.status(400).json({ error: "result must be 'pass' or 'fail'" });
  }
  const xpEarned = reviewResult === 'pass' ? 10 : 3;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const inserted = await client.query(
      `INSERT INTO card_reviews (card_id, session_id, result)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.params.id, session_id || null, reviewResult]
    );

    const progressBefore = await client.query(
      'SELECT xp, level FROM progress WHERE id = 1'
    );
    const prevXp = progressBefore.rows[0]?.xp ?? 0;
    const prevLevel = progressBefore.rows[0]?.level ?? 1;
    const newXp = prevXp + xpEarned;
    const newLevel = computeLevel(newXp);

    await client.query(
      `INSERT INTO progress (id, xp, level, updated_at) VALUES (1, $1, $2, NOW())
       ON CONFLICT (id) DO UPDATE SET xp = $1, level = $2, updated_at = NOW()`,
      [newXp, newLevel]
    );

    await client.query('COMMIT');

    res.status(201).json({
      review: inserted.rows[0],
      progress: {
        xp: newXp,
        level: newLevel,
        xpEarned,
        leveledUp: newLevel > prevLevel
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to record review' });
  } finally {
    client.release();
  }
});

export default router;
