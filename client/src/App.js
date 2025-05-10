import React, { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState('[10,20,30]');
  const [secret, setSecret] = useState('abc');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    setError('');
    setResult(null);
    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Data: data, Secret: secret })
      });
      if (!response.ok) throw new Error(await response.text());
      setResult(await response.json());
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: 'auto' }}>
      <h1>Stats Analyzer</h1>
      <input
        value={data}
        onChange={e => setData(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        value={secret}
        onChange={e => setSecret(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <button onClick={analyze} style={{ width: '100%' }}>
        Analyze
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <pre style={{ background: '#f0f0f0', padding: 10 }}>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default App;