import React, { useState } from 'react';

interface MenuProps {
  userId: number;
  username: string;
  onStartGame: (gameId: number, number: number) => void;
  onShowStatistics: () => void;
  lastScore: number | null;
}

const Menu: React.FC<MenuProps> = ({ userId, username, onStartGame, onShowStatistics, lastScore }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clearMsg, setClearMsg] = useState('');

  const handleStartGame = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/game/start?user_id=${userId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start game');
      const data = await response.json();
      onStartGame(data.game_id, data.number);
    } catch (err) {
      setError('Could not start game.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearStatistics = async () => {
    setLoading(true);
    setError('');
    setClearMsg('');
    try {
      const response = await fetch(`http://localhost:8000/statistics/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to clear statistics');
      const data = await response.json();
      setClearMsg(data.message);
    } catch (err) {
      setError('Could not clear statistics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box" style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2 className="subtitle">Welcome, <strong>{username}</strong>!</h2>
      {lastScore !== null && (
        <div className="notification is-info">Last game score: {lastScore}</div>
      )}
      {error && <p className="help is-danger">{error}</p>}
      {clearMsg && <p className="help is-success">{clearMsg}</p>}
      <div className="buttons is-centered mt-3">
        <button className={`button is-primary${loading ? ' is-loading' : ''}`} onClick={handleStartGame} disabled={loading}>
          Start New Game
        </button>
        <button className="button is-link" onClick={onShowStatistics} disabled={loading}>
          View Statistics
        </button>
        <button className="button is-danger" onClick={handleClearStatistics} disabled={loading}>
          Clear Statistics
        </button>
      </div>
    </div>
  );
};

export default Menu;
