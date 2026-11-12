'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fifa_token');
    if (!token) { router.push('/login'); return; }

    Promise.all([
      fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/player/stats', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/player/registrations', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json())
    ]).then(([u, s, r]) => {
      setUser(u);
      setStats(s);
      setRegs(r);
    }).finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('fifa_token');
    router.push('/');
  };

  if (loading) return (
    <main className="page-section">
      <div className="content-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <div>
            <div className="skeleton" style={{ height: 16, width: 100, marginBottom: 12 }}></div>
            <div className="skeleton" style={{ height: 48, width: 300, marginBottom: 12 }}></div>
            <div className="skeleton" style={{ height: 16, width: 200 }}></div>
          </div>
          <div className="skeleton" style={{ height: 44, width: 100 }}></div>
        </div>

        <div className="dash-grid">
          {Array(4).fill(0).map((_, i) => (
            <div className="stat-card" key={i}>
              <div className="skeleton" style={{ height: 42, width: 60, marginBottom: 8 }}></div>
              <div className="skeleton" style={{ height: 16, width: 80 }}></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="skeleton" style={{ height: 28, width: 200, marginBottom: 24 }}></div>
          <div className="data-table">
            {Array(3).fill(0).map((_, i) => (
              <div className="table-row" key={i} style={{ gridTemplateColumns: '80px 1fr 120px 1fr' }}>
                <div className="skeleton" style={{ height: 16, width: 40 }}></div>
                <div className="skeleton" style={{ height: 16, width: '80%' }}></div>
                <div className="skeleton" style={{ height: 16, width: 60 }}></div>
                <div className="skeleton" style={{ height: 16, width: '60%' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );

  if (!user) return <main className="page-section"><div className="content-container"><p>Not logged in.</p></div></main>;

  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  return (
    <main className="page-section">
      <div className="content-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <div className="page-header" style={{ margin: 0 }}>
            <div className="badge">Player Dashboard</div>
            <h1>Welcome, {user.username}</h1>
            <p>{user.email} · EA ID: {user.ea_id} · {user.platform.toUpperCase()}</p>
          </div>
          <button onClick={logout} className="btn-secondary">Log Out</button>
        </div>

        <div className="dash-grid">
          <div className="stat-card"><span className="stat-value">{stats.wins}</span><span className="stat-label">Wins</span></div>
          <div className="stat-card"><span className="stat-value">{stats.losses}</span><span className="stat-label">Losses</span></div>
          <div className="stat-card"><span className="stat-value">{stats.total}</span><span className="stat-label">Matches</span></div>
          <div className="stat-card"><span className="stat-value">{winRate}%</span><span className="stat-label">Win Rate</span></div>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 24 }}>Your Tournaments</h3>
          {regs.length === 0 && <p style={{ color: 'var(--gray-text)' }}>You haven't registered for any tournaments yet.</p>}
          
          {regs.length > 0 && (
            <div className="data-table">
              <div className="table-row header" style={{ gridTemplateColumns: '1fr 150px 150px' }}>
                <div>Tournament</div><div>Status</div><div>Tournament Status</div>
              </div>
              {regs.map((r, i) => (
                <div className="table-row" key={i} style={{ gridTemplateColumns: '1fr 150px 150px' }}>
                  <div><strong>{r.name}</strong></div>
                  <div>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                      background: r.status === 'approved' ? 'var(--lime-green)' : '#fff3cd',
                      color: r.status === 'approved' ? 'var(--bg-dark)' : '#856404'
                    }}>
                      {r.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ color: 'var(--gray-text)', fontSize: 13 }}>{r.tournament_status.toUpperCase()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 24 }}>Your Match History</h3>
          {stats.matches.length === 0 && <p style={{ color: 'var(--gray-text)' }}>No matches yet.</p>}
          {stats.matches.length > 0 && (
            <div className="data-table">
              <div className="table-row header" style={{ gridTemplateColumns: '80px 1fr 120px 1fr' }}>
                <div>Round</div><div>Match</div><div>Score</div><div>Tournament</div>
              </div>
              {stats.matches.map(m => {
                const isWinner = m.winner_id === user.id;
                return (
                  <div className="table-row" key={m.id} style={{ gridTemplateColumns: '80px 1fr 120px 1fr' }}>
                    <div>R{m.round}</div>
                    <div><strong>{m.player1_name}</strong> vs <strong>{m.player2_name}</strong></div>
                    <div style={{ fontWeight: 700, color: isWinner ? '#2a9d4f' : 'var(--gray-text)' }}>
                      {m.status === 'completed' ? m.player1_score + ' : ' + m.player2_score : '- : -'}
                    </div>
                    <div style={{ color: 'var(--gray-text)' }}>{m.tournament_name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}