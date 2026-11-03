'use client';
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch('/api/tournaments/leaderboard').then(r => r.json()).then(setData); }, []);

  return (
    <main className="page-section">
      <div className="content-container">
        <div className="page-header">
          <div className="badge">The Table Never Lies</div>
          <h1>League Standings</h1>
          <p>3 points for a win, 1 point for a loss, and +15 points for winning a tournament.</p>
        </div>
        
        <div className="data-table leaderboard-table-wrap">
          <div className="table-row header leaderboard-header" style={{ gridTemplateColumns: '60px 1fr 60px 60px 60px 60px 100px', minWidth: 600 }}>
            <div style={{ textAlign: 'center' }}>Pos</div>
            <div>Player</div>
            <div style={{ textAlign: 'center' }}>P</div>
            <div style={{ textAlign: 'center' }}>W</div>
            <div style={{ textAlign: 'center' }}>L</div>
            <div style={{ textAlign: 'center' }}>Win%</div>
            <div style={{ textAlign: 'right' }}>Pts</div>
          </div>
          
          {data.map((p, i) => (
            <div className="table-row leaderboard-row" key={p.id} style={{ gridTemplateColumns: '60px 1fr 60px 60px 60px 60px 100px', padding: '16px 24px', minWidth: 600, alignItems: 'center' }}>
              
              <div style={{ 
                textAlign: 'center', 
                fontWeight: 'bold', 
                fontSize: 18,
                color: i === 0 ? '#fbc02d' : i < 3 ? 'var(--lime-green)' : 'var(--gray-text)'
              }}>
                {i + 1}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, background: 'var(--bg-cream)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 12, flexShrink: 0 }}>
                  {p.username.substring(0, 2).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <strong style={{ fontSize: 16, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.username}</strong>
                  <span style={{ fontSize: 11, color: 'var(--gray-text)', textTransform: 'uppercase' }}>{p.platform} · {p.ea_id}</span>
                </div>
                {p.trophies > 0 && (
                  <span style={{ fontSize: 11, marginLeft: 'auto', padding: '2px 6px', background: 'var(--bg-cream)', border: '1px solid var(--border-light)', borderRadius: 4, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {p.trophies} Trophies
                  </span>
                )}
              </div>

              <div style={{ textAlign: 'center', fontWeight: 600 }}>{p.played}</div>
              <div style={{ textAlign: 'center', fontWeight: 600, color: '#2a9d4f' }}>{p.wins}</div>
              <div style={{ textAlign: 'center', fontWeight: 600, color: '#e53935' }}>{p.losses}</div>
              <div style={{ textAlign: 'center', color: 'var(--gray-text)' }}>{p.win_pct}%</div>
              
              <div style={{ textAlign: 'right', fontWeight: 800, fontSize: 18 }}>
                {p.points}
              </div>
            </div>
          ))}
          
          {data.length === 0 && (
            <div className="table-row" style={{ gridTemplateColumns: '1fr', padding: 40, textAlign: 'center', color: 'var(--gray-text)' }}>
              No matches played yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}