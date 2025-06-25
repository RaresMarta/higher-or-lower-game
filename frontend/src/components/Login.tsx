import React, { useState } from 'react';

interface LoginProps {
  onLogin: (id: number, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) throw new Error('Failed to login or register');
      const data = await response.json();
      onLogin(data.id, data.username);
    } catch (err) {
      setError('Login failed. Try a different username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="box" onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </div>
      </div>
      {error && <p className="help is-danger">{error}</p>}
      <div className="field">
        <div className="control">
          <button className={`button is-primary${loading ? ' is-loading' : ''}`} type="submit">
            {loading ? 'Logging in...' : 'Login / Register'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
