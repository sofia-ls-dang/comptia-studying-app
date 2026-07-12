const BASE_URL = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Decks
  getDecks: () => fetch(`${BASE_URL}/decks`).then(handleResponse),
  getDeck: (id) => fetch(`${BASE_URL}/decks/${id}`).then(handleResponse),
  createDeck: (deck) =>
    fetch(`${BASE_URL}/decks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deck)
    }).then(handleResponse),
  deleteDeck: (id) =>
    fetch(`${BASE_URL}/decks/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Cards
  getCards: (deckId) =>
    fetch(`${BASE_URL}/decks/${deckId}/cards`).then(handleResponse),
  createCard: (deckId, card) =>
    fetch(`${BASE_URL}/decks/${deckId}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    }).then(handleResponse),
  updateCard: (id, card) =>
    fetch(`${BASE_URL}/cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    }).then(handleResponse),
  deleteCard: (id) =>
    fetch(`${BASE_URL}/cards/${id}`, { method: 'DELETE' }).then(handleResponse),
  reviewCard: (id, result, sessionId) =>
    fetch(`${BASE_URL}/cards/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, session_id: sessionId })
    }).then(handleResponse),

  // Progress / XP
  getProgress: () => fetch(`${BASE_URL}/progress`).then(handleResponse)
};
