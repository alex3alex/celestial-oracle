import React from 'react';
import { NumerologyResult } from '../lib/numerology.js';
import '../styles/tokens.css';

export interface MatrixCardProps {
  result: NumerologyResult;
  webApp: any;
}

export const MatrixCard: React.FC<MatrixCardProps> = ({ result, webApp }) => {
  const { matrix, spheres, fatalMistake, chakras, soulCode } = result;

  return (
    <div className="matrix-card">
      <div className="section">
        <h2>Ваша Матрица Судьбы</h2>
        <div className="matrix-grid">
          {matrix.map((pos, index) => (
            <div
              key={index}
              className={`matrix-cell ${pos.sphere ? `sphere-${pos.sphere}` : ''}`}
              style={{
                background: pos.sphere ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-low)'
              }}
            >
              <span className="position">{pos.position}</span>
              <span className="arcana">{pos.arcana}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Сферы Жизни</h3>
        <div className="spheres">
          <div className="sphere">
            <h4>Личность</h4>
            <p>{spheres.personality.join(', ')}</p>
          </div>
          <div className="sphere">
            <h4>Духовность</h4>
            <p>{spheres.spirituality.join(', ')}</p>
          </div>
          <div className="sphere">
            <h4>Деньги</h4>
            <p>{spheres.money.join(', ')}</p>
          </div>
          <div className="sphere">
            <h4>Отношения</h4>
            <p>{spheres.relationships.join(', ')}</p>
          </div>
          <div className="sphere">
            <h4>Здоровье</h4>
            <p>{spheres.health.join(', ')}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Код Души</h3>
        <p className="soul-code">{soulCode.join(' → ')}</p>
      </div>

      <div className="section">
        <h3>Роковая Ошибка</h3>
        <p className="fatal-mistake">Аркан {fatalMistake}</p>
      </div>
    </div>
  );
};

export default MatrixCard;
