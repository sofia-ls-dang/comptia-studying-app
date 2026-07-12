import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

// GET /api/decks - list all decks
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM decks ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// GET /api/decks/:id - single deck
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM decks WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch deck' });
  }
});

// POST /api/decks - create a new deck
router.post('/', async (req, res) => {
  const { name, domain, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO decks (name, domain, description) VALUES ($1, $2, $3) RETURNING *',
      [name, domain || null, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create deck' });
  }
});

// DELETE /api/decks/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM decks WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete deck' });
  }
});

export default router;
