import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/api.js';
import ConfirmModal from '../components/ConfirmModal.jsx';

const emptyForm = { front_text: '', back_text: '', difficulty: 'medium' };

export default function DeckDetail() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    Promise.all([api.getDeck(deckId), api.getCards(deckId)])
      .then(([deckData, cardsData]) => {
        setDeck(deckData);
        setCards(cardsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [deckId]);

  async function handleAddCard(e) {
    e.preventDefault();
    if (!form.front_text.trim() || !form.back_text.trim()) return;
    setSubmitting(true);
    try {
      const newCard = await api.createCard(deckId, form);
      setCards((prev) => [...prev, newCard]);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(card) {
    setEditingId(card.id);
    setEditForm({
      front_text: card.front_text,
      back_text: card.back_text,
      difficulty: card.difficulty
    });
  }

  async function handleSaveEdit(cardId) {
    try {
      const updated = await api.updateCard(cardId, editForm);
      setCards((prev) => prev.map((c) => (c.id === cardId ? updated : c)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(cardId) {
    try {
      await api.deleteCard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingDeleteId(null);
    }
  }

  if (loading) return null;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div>
      <Link to="/">← Back to decks</Link>
      <h1>{deck?.name}</h1>
      {deck?.description && <p>{deck.description}</p>}

      {cards.length > 0 && (
        <p>
          <Link to={`/study/${deckId}`}>Study this deck ({cards.length} cards) →</Link>
        </p>
      )}

      <h2>Add a card</h2>
      <form onSubmit={handleAddCard} className="card-form">
        <label>
          Question (front)
          <textarea
            value={form.front_text}
            onChange={(e) => setForm({ ...form, front_text: e.target.value })}
            rows={2}
            required
          />
        </label>
        <label>
          Answer (back)
          <textarea
            value={form.back_text}
            onChange={(e) => setForm({ ...form, back_text: e.target.value })}
            rows={2}
            required
          />
        </label>
        <label>
          Difficulty
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add card'}
        </button>
      </form>

      <h2>Cards in this deck ({cards.length})</h2>
      {cards.length === 0 && <p>No cards yet — add your first one above.</p>}
      <ul className="card-manage-list">
        {cards.map((card) => (
          <li key={card.id} className="card-manage-item">
            {editingId === card.id ? (
              <div className="card-form">
                <label>
                  Question
                  <textarea
                    value={editForm.front_text}
                    onChange={(e) =>
                      setEditForm({ ...editForm, front_text: e.target.value })
                    }
                    rows={2}
                  />
                </label>
                <label>
                  Answer
                  <textarea
                    value={editForm.back_text}
                    onChange={(e) =>
                      setEditForm({ ...editForm, back_text: e.target.value })
                    }
                    rows={2}
                  />
                </label>
                <label>
                  Difficulty
                  <select
                    value={editForm.difficulty}
                    onChange={(e) =>
                      setEditForm({ ...editForm, difficulty: e.target.value })
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>
                <div className="card-manage-actions">
                  <button onClick={() => handleSaveEdit(card.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>Q:</strong> {card.front_text}
                </p>
                <p>
                  <strong>A:</strong> {card.back_text}
                </p>
                <p className="card-difficulty">{card.difficulty}</p>
                <div className="card-manage-actions">
                  <button onClick={() => startEdit(card)}>Edit</button>
                  <button onClick={() => setPendingDeleteId(card.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {pendingDeleteId !== null && (
        <ConfirmModal
          message="Delete this card? This can't be undone."
          confirmLabel="Delete"
          onConfirm={() => handleDelete(pendingDeleteId)}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
}
