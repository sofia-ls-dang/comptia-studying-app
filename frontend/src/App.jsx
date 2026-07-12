import { Routes, Route } from 'react-router-dom';
import DeckList from './pages/DeckList.jsx';
import DeckDetail from './pages/DeckDetail.jsx';
import StudySession from './pages/StudySession.jsx';
import Header from './components/Header.jsx';
import LevelUpToast from './components/LevelUpToast.jsx';
import { useProgress } from './context/ProgressContext.jsx';

export default function App() {
  const { levelUpEvent, clearLevelUpEvent } = useProgress();

  return (
    <>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<DeckList />} />
          <Route path="/decks/:deckId" element={<DeckDetail />} />
          <Route path="/study/:deckId" element={<StudySession />} />
        </Routes>
      </div>
      {levelUpEvent && (
        <LevelUpToast level={levelUpEvent.level} onDismiss={clearLevelUpEvent} />
      )}
    </>
  );
}
