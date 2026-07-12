import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import decksRouter from './routes/decks.js';
import cardsRouter from './routes/cards.js';
import progressRouter from './routes/progress.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/decks', decksRouter);
app.use('/api', cardsRouter); // handles /api/decks/:deckId/cards and /api/cards/:id
app.use('/api/progress', progressRouter);

app.listen(PORT, () => {
  console.log(`Flashcard API listening on http://localhost:${PORT}`);
});
