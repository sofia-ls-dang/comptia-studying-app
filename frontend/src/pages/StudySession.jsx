import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/api.js';
import { useProgress } from '../context/ProgressContext.jsx';

export default function StudySession() {
  const { deckId } = useParams();
  const { applyReviewProgress } = useProgress();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pass: 0, fail: 0 });

  useEffect(() => {
    api
      .getCards(deckId)
      .then(setCards)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [deckId]);

  const currentCard = cards[index];
  const finished = index >= cards.length;

  async function handleReview(result) {
    if (!currentCard) return;
    try {
      const { progress } = await api.reviewCard(currentCard.id, result);
      applyReviewProgress(progress);
      setStats((s) => ({ ...s, [result]: s[result] + 1 }));
      setFlipped(false);
      setIndex((i) => Math.min(i + 1, cards.length));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return null;
  if (error) return <p className="error">Error: {error}</p>;
  if (cards.length === 0) {
    return (
      <div>
        <p>This deck has no cards yet.</p>
        <Link to={`/decks/${deckId}`}>Add some cards</Link>
      </div>
    );
  }

  return (
    <div className="study-page">
      <Link to={`/decks/${deckId}`}>← Back to deck</Link>

      {!finished && (
        <div className="session-progress-track">
          <div
            className="session-progress-fill"
            style={{ width: `${(index / cards.length) * 100}%` }}
          />
        </div>
      )}

      {finished ? (
        <div className="session-summary">
          <h2>Session complete</h2>
          <p className="session-summary-stats">
            <span className="stat-pass">{stats.pass} knew it</span>
            <span className="stat-fail">{stats.fail} to review again</span>
          </p>
          <button
            className="primary-button"
            onClick={() => {
              setIndex(0);
              setStats({ pass: 0, fail: 0 });
            }}
          >
            Restart deck
          </button>
        </div>
      ) : (
        <>
          <p className="card-counter">
            Card {index + 1} of {cards.length}
          </p>

          <div className="flip-card-scene" onClick={() => setFlipped((f) => !f)}>
            <div className={`flip-card-inner ${flipped ? 'is-flipped' : ''}`}>
              <div className="flip-card-face flip-card-front">
                <p className="flip-card-label">Question</p>
                <p className="flip-card-text">{currentCard.front_text}</p>
              </div>
              <div className="flip-card-face flip-card-back">
                <p className="flip-card-label">Answer</p>
                <p className="flip-card-text">{currentCard.back_text}</p>
              </div>
            </div>
          </div>

          <div className="review-buttons">
            <button className="fail" onClick={() => handleReview('fail')}>
              Didn't know it
            </button>
            <button className="pass" onClick={() => handleReview('pass')}>
              Knew it
            </button>
          </div>
        </>
      )}
    </div>
  );
}
