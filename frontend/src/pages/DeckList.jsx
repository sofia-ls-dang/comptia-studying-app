import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api.js';

const DOMAIN_ICONS = {
  'Mobile Devices': '📱',
  'Networking': '🌐',
  'Hardware': '🔧',
  'Virtualization & Cloud Computing': '☁️',
  'Hardware & Network Troubleshooting': '🩺',
  'Operating Systems': '🖥️',
  'Security': '🔒',
  'Software Troubleshooting': '🐛',
  'Operational Procedures': '📋'
};

function DeckGrid({ decks }) {
  return (
    <div className="deck-grid">
      {decks.map((deck) => (
        <Link to={`/decks/${deck.id}`} key={deck.id} className="deck-card">
          <span className="deck-card-icon">{DOMAIN_ICONS[deck.domain] || '📚'}</span>
          <h3>{deck.name}</h3>
          {deck.description && <p>{deck.description}</p>}
        </Link>
      ))}
    </div>
  );
}

export default function DeckList() {
  const [decks, setDecks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDecks()
      .then(setDecks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (error) return <p className="error">Error: {error}</p>;

  const core1Decks = decks.filter((d) => d.exam_core === 'core1');
  const core2Decks = decks.filter((d) => d.exam_core === 'core2');
  const otherDecks = decks.filter((d) => d.exam_core !== 'core1' && d.exam_core !== 'core2');

  return (
    <div>
      <h1>CompTIA A+ Study Decks</h1>

      {core1Decks.length > 0 && (
        <section className="deck-section">
          <h2>Core 1 (220-1201)</h2>
          <DeckGrid decks={core1Decks} />
        </section>
      )}

      {core2Decks.length > 0 && (
        <section className="deck-section">
          <h2>Core 2 (220-1202)</h2>
          <DeckGrid decks={core2Decks} />
        </section>
      )}

      {otherDecks.length > 0 && (
        <section className="deck-section">
          <h2>Other decks</h2>
          <DeckGrid decks={otherDecks} />
        </section>
      )}
    </div>
  );
}
