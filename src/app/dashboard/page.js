'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('fifa_token');
    if (!token) { router.push('/login'); return; }

    Promise.all([
      fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } }),
      fetch('/api/player/stats', { headers: { 'Authorization': 'Bearer ' + token } }),
      fetch('/api/player/registrations', { headers: { 'Authorization': 'Bearer ' + token } })
    ]).then(async ([meRes, sRes, rRes]) => {
      if (!meRes.ok) {
        // Token is stale / user missing → clear and go to login
        localStorage.removeItem('fifa_token');
        router.push('/login');
        return;
      }
      const u = await meRes.json();
      const s = sRes.ok ? await sRes.json() : { wins: 0, losses: 0, total: 0, matches: [] };
      const r = rRes.ok ? await rRes.json() : [];
      setUser(u);
      setStats(s);
      setRegs(r);
    }).catch(() => {
      setError('Failed to load dashboard.');
    }).finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('fifa_token');
    router.push('/');
  };

  if (loading) return <main className="page-section"><div className="content-container"><p>Loading...</p></div></main>;
  if (error) return <main className="page-section"><div className="content-container"><p style={{ color: 'red' }}>{error}</p></div></main>;
  if (!user) return <main className="page-section"><div className="content-container"><p>Redirecting...</p></div></main>;

  const winRate = stats && stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
  const platform = (user.platform || 'ps').toUpperCase();
  const eaId = user.ea_id || '—';
  const matches = (stats && stats.matches) || [];

  return (
    <main className="page-section">
      <div className="content-container">
        <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
          <div className="page-header" style={{ margin: 0 }}>
            <div className="badge">Player Dashboard</div>
            <h1>Welcome, {user.username}</h1>
            <p>{user.email} · EA ID: {eaId} · {platform}</p>
          </div>
          <button onClick={logout} className="btn-secondary">Log Out</button>
        </div>

        <div className="dash-grid">
          <div className="stat-card"><span className="stat-value">{stats?.wins || 0}</span><span className="stat-label">Wins</span></div>
          <div className="stat-card"><span className="stat-value">{stats?.losses || 0}</span><span className="stat-label">Losses</span></div>
          <div className="stat-card"><span className="stat-value">{stats?.total || 0}</span><span className="stat-label">Matches</span></div>
          <div className="stat-card"><span className="stat-value">{winRate}%</span><span className="stat-label">Win Rate</span></div>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 24 }}>Your Tournaments</h3>
          {regs.length === 0 && <p style={{ color: 'var(--gray-text)' }}>You haven't registered for any tournaments yet.</p>}
          {regs.length > 0 && (
            <div className="data-table">
              <div className="table-row header" style={{ gridTemplateColumns: '1fr 150px 150px' }}>
                <div>Tournament</div><div>Your Entry</div><div>Tournament Status</div>
              </div>
              {regs.map((r, i) => (
                <div className="table-row" key={i} style={{ gridTemplateColumns: '1fr 150px 150px' }}>
                  <div data-label="Tournament"><strong>{r.name}</strong></div>
                  <div data-label="Your Entry">
                    <span style={{
                      padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                      background: r.status === 'approved' ? 'var(--lime-green)' : r.status === 'rejected' ? '#ffd6d6' : '#fff3cd',
                      color: r.status === 'approved' ? 'var(--bg-dark)' : r.status === 'rejected' ? 'red' : '#856404'
                    }}>
                      {r.status.toUpperCase()}
                    </span>
                  </div>
                  <div data-label="Tournament Status" style={{ color: 'var(--gray-text)', fontSize: 13 }}>{(r.tournament_status || '').toUpperCase()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 24 }}>Your Match History</h3>
          {matches.length === 0 && <p style={{ color: 'var(--gray-text)' }}>No matches yet.</p>}
          {matches.length > 0 && (
            <div className="data-table">
              <div className="table-row header" style={{ gridTemplateColumns: '80px 1fr 120px 1fr' }}>
                <div>Round</div><div>Match</div><div>Score</div><div>Tournament</div>
              </div>
              {matches.map(m => {
                const isWinner = m.winner_id === user.id;
                return (
                  <div className="table-row" key={m.id} style={{ gridTemplateColumns: '80px 1fr 120px 1fr' }}>
                    <div data-label="Round">R{m.round}</div>
                    <div data-label="Match"><strong>{m.player1_name || 'TBD'}</strong> vs <strong>{m.player2_name || 'BYE'}</strong></div>
                    <div data-label="Score" style={{ fontWeight: 700, color: isWinner ? '#2a9d4f' : 'var(--gray-text)' }}>
                      {m.status === 'completed' ? m.player1_score + ' : ' + m.player2_score : '- : -'}
                    </div>
                    <div data-label="Tournament" style={{ color: 'var(--gray-text)' }}>{m.tournament_name}</div>
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