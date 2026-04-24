import React from 'react';
import { MatrixCard } from './MatrixCard';
import { MatrixPosition } from '../lib/numerology';
import '../styles/tokens.css';
interface StarGridProps { matrix: MatrixPosition[]; onPositionClick?: (pos: number) => void; activePosition?: number; }
export const StarGrid: React.FC<StarGridProps> = ({ matrix, onPositionClick, activePosition }) => {
  const personality = matrix.filter(p => p.sphere === 'personality');
  const spirituality = matrix.filter(p => p.sphere === 'spirituality');
  const money = matrix.filter(p => p.sphere === 'money');
  const relationships = matrix.filter(p => p.sphere === 'relationships');
  const health = matrix.filter(p => p.sphere === 'health');
  return (
    <div className="space-y-8 p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-headline text-glow" style={{ color: 'var(--color-primary)' }}>Ваша Звезда</h2>
        <p className="font-body opacity-70">Матрица 27 позиций • 5 сфер</p>
      </div>
      {[['personality', '✨', 'Личности'], ['spirituality', '🔮', 'Духовности'], ['money', '💫', 'Денег'], ['relationships', '💜', 'Отношений'], ['health', '🌿', 'Здоровья']].map(([key, emoji, name]) => (
        <div key={key} className="section">
          <div className="flex items-center gap-3 mb-4"><span className="text-2xl">{emoji}</span><h3 className="text-xl font-headline">Сфера {name}</h3></div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {matrix.filter(p => p.sphere === key).map(p => (
              <MatrixCard key={p.position} {...p} isActive={activePosition === p.position} onClick={() => onPositionClick?.(p.position)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
