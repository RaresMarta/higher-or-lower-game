import React, { useState } from 'react';

interface GameProps {
  gameId: number;
  currentNumber: number;
  setCurrentNumber: (n: number) => void;
  onGameEnd: (score: number) => void;
}

const Game: React.FC<GameProps> = ({ gameId, currentNumber, setCurrentNumber, onGameEnd }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const makeGuess = async (guess: 'higher' | 'lower') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/game/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: gameId, guess }),
      });
      if (!response.ok) throw new Error('Failed to make guess');
      const data = await response.json();
      if (data.correct) {
        setCurrentNumber(data.new_number);
      } else {
        onGameEnd(data.score);
      }
    } catch (err) {
      setError('Error making guess.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2 className="subtitle has-text-centered">Current Number: <strong>{currentNumber}</strong></h2>
      {error && <p className="help is-danger">{error}</p>}
      <div className="buttons is-centered mt-4">
        <button className="button is-success is-large" onClick={() => makeGuess('higher')} disabled={loading}>
          Higher
        </button>
        <button className="button is-warning is-large" onClick={() => makeGuess('lower')} disabled={loading}>
          Lower
        </button>
      </div>
    </div>
  );
};

export default Game;
