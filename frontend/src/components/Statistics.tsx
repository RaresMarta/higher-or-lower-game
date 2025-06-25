import React, { useEffect, useState } from 'react';

interface StatisticsProps {
  userId: number;
  onBack: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ userId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ total_games: number; longest_streak: number } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:8000/statistics/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch statistics');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Could not load statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userId]);

  return (
    <div className="box" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2 className="subtitle">Your Statistics</h2>
      {loading && <progress className="progress is-small is-info" max="100">Loading</progress>}
      {error && <p className="help is-danger">{error}</p>}
      {stats && !loading && (
        <div>
          <p><strong>Total games played:</strong> {stats.total_games}</p>
          <p><strong>Longest streak:</strong> {stats.longest_streak}</p>
        </div>
      )}
      <button className="button is-link mt-4" onClick={onBack}>Back</button>
    </div>
  );
};

export default Statistics;
