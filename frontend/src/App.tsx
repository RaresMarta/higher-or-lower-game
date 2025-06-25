import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import Login from './components/Login';
import Menu from './components/Menu';
import Game from './components/Game';
import Statistics from './components/Statistics';

export type Page = 'login' | 'menu' | 'game' | 'statistics';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('login');
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>('');
  const [gameId, setGameId] = useState<number | null>(null);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);

  // Handlers for navigation and state
  const handleLogin = (id: number, username: string) => {
    console.log(`User logged in: ${username} (id: ${id})`);
    setUserId(id);
    setUsername(username);
    setPage('menu');
  };
  
  const handleStartGame = (gameId: number, number: number) => {
    console.log(`Game started: gameId=${gameId}, first number=${number}`);
    setGameId(gameId);
    setCurrentNumber(number);
    setLastScore(null);
    setPage('game');
  };
  
  const handleGameEnd = (score: number) => {
    console.log(`Game ended. Score: ${score}`);
    setLastScore(score);
    setGameId(null);
    setCurrentNumber(null);
    setPage('menu');
  };

  return (
    <div className="container mt-5">
      <h1 className="title has-text-centered">Higher or Lower Game</h1>
      {page === 'login' && <Login onLogin={handleLogin} />}
      {page === 'menu' && userId && (
        <Menu
          userId={userId}
          username={username}
          onStartGame={handleStartGame}
          onShowStatistics={() => setPage('statistics')}
          lastScore={lastScore}
        />
      )}
      {page === 'game' && userId && gameId && currentNumber !== null && (
        <Game
          gameId={gameId}
          currentNumber={currentNumber}
          onGameEnd={handleGameEnd}
          setCurrentNumber={setCurrentNumber}
        />
      )}
      {page === 'statistics' && userId && (
        <Statistics userId={userId} onBack={() => setPage('menu')} />
      )}
    </div>
  );
};

export default App;
