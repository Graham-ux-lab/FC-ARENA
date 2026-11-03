'use client';
import { useEffect, useState } from 'react';

export default function Results() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch('/api/tournaments/results').then(r => r.json()).then(setData); }, []);

  return (
    <main className="page-section">
      <div className="content-container">
        <div className="page-header">
          <div className="badge">The Final Whistle</div>
          <h1>Results & Reports</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {data.map(m => (
            <div className="card" key={m.id}>
              <div className="card-header">
                <span>Round {m.round}</span><span>Final</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: 'var(--bg-cream)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {(m.player1_name || 'TBD').substring(0, 2).toUpperCase()}
                  </div>
                  <strong style={{ fontSize: 18 }}>{m.player1_name || 'TBD'}</strong>
                </div>
                <div style={{ fontSize: 32, fontFamily: 'Oswald' }}>{m.player1_score} : {m.player2_score}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <strong style={{ fontSize: 18 }}>{m.player2_name || 'BYE'}</strong>
                  <div style={{ width: 40, height: 40, background: 'var(--bg-cream)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {(m.player2_name || 'BYE').substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}