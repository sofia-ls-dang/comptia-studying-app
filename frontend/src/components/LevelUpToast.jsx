import { useEffect } from 'react';
import Creature, { STAGE_NAMES, stageForLevel } from './Creature.jsx';

export default function LevelUpToast({ level, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3200);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const stage = stageForLevel(level);

  return (
    <div className="level-up-toast" onClick={onDismiss}>
      <Creature level={level} size={64} />
      <div>
        <p className="level-up-title">Level up!</p>
        <p className="level-up-detail">
          {STAGE_NAMES[stage]} reached level {level}
        </p>
      </div>
    </div>
  );
}
