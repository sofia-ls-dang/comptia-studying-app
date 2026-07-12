import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api/api.js';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({ xp: 0, level: 1 });
  const [loading, setLoading] = useState(true);
  const [levelUpEvent, setLevelUpEvent] = useState(null); // { level } | null

  useEffect(() => {
    api
      .getProgress()
      .then(setProgress)
      .catch(() => {
        /* non-fatal — creature widget just shows defaults */
      })
      .finally(() => setLoading(false));
  }, []);

  // Called after a card review comes back from the API with an updated progress payload.
  const applyReviewProgress = useCallback((newProgress) => {
    setProgress({ xp: newProgress.xp, level: newProgress.level });
    if (newProgress.leveledUp) {
      setLevelUpEvent({ level: newProgress.level });
    }
  }, []);

  const clearLevelUpEvent = useCallback(() => setLevelUpEvent(null), []);

  return (
    <ProgressContext.Provider
      value={{ progress, loading, applyReviewProgress, levelUpEvent, clearLevelUpEvent }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
