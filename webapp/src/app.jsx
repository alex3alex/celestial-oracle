import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculateMatrix } from './lib/numerology.ts';
import { MatrixCard } from './components/MatrixCard.tsx';
import './styles/tokens.css';

function App() {
  const [webApp, setWebApp] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setWebApp(tg);

      // Get birth date from Telegram user data or prompt
      const birthDate = tg.initDataUnsafe?.user?.birth_date;
      if (birthDate) {
        const matrix = calculateMatrix(new Date(birthDate));
        setResult(matrix);
      }
      setLoading(false);
    }
  }, []);

  const handleDateSubmit = (date) => {
    const matrix = calculateMatrix(date);
    setResult(matrix);
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="app">
      <header className="header">
        <h1>✨ Celestial Oracle</h1>
      </header>
      <main>
        {result ? (
          <MatrixCard result={result} webApp={webApp} />
        ) : (
          <DateInput onSubmit={handleDateSubmit} webApp={webApp} />
        )}
      </main>
    </div>
  );
}

function DateInput({ onSubmit, webApp }) {
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    const [day, month, year] = date.split('.');
    onSubmit(new Date(year, month - 1, day));
  };

  return (
    <div className="date-input">
      <h2>Введите дату рождения</h2>
      <input
        type="text"
        placeholder="ДД.ММ.ГГГГ"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        maxLength={10}
      />
      <button onClick={handleSubmit} className="btn-primary">
        Рассчитать
      </button>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
