import { Link } from 'react-router-dom';
import Creature, { STAGE_NAMES, stageForLevel } from './Creature.jsx';
import { levelProgress } from '../utils/xp.js';
import { useProgress } from '../context/ProgressContext.jsx';

export default function Header() {
  const { progress, loading } = useProgress();
  const { xp, level } = progress;
  const { percent } = levelProgress(xp, level);
  const stage = stageForLevel(level);

  return (
    <header className="app-header">
      <Link to="/" className="app-header-title">
        Network+ Flashcards
      </Link>
      {!loading && (
        <div className="creature-widget">
          <Creature level={level} size={48} />
          <div className="creature-info">
            <p className="creature-name">
              {STAGE_NAMES[stage]} <span className="creature-level">Lv. {level}</span>
            </p>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
