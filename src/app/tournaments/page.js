'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Tournaments() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Modal state
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const load = async () => {
    const token = localStorage.getItem('fifa_token');
    setIsLoggedIn(!!token);

    const tRes = await fetch('/api/tournaments/public');
    setTournaments(await tRes.json());

    if (token) {
      const rRes = await fetch('/api/player/registrations', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (rRes.ok) setMyRegs(await rRes.json());
    }
  };

  useEffect(() => { load(); }, []);

  const handleRegisterClick = (tournament) => {
    const token = localStorage.getItem('fifa_token');
    if (!token) { router.push('/login'); return; }
    setSelectedTournament(tournament);
    setFormData({ username: '', email: '' });
    setMsg({ text: '', type: '' });
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fifa_token');
    
    const res = await fetch('/api/tournaments/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ 
        tournament_id: selectedTournament.id,
        username: formData.username,
        email: formData.email
      })
    });
    
    const data = await res.json();
    if (res.ok) {
      setMsg({ text: data.message, type: 'success' });
      await load();
      setTimeout(() => setSelectedTournament(null), 2000); // Close modal on success
    } else {
      setMsg({ text: data.error, type: 'error' });
    }
  };

  const getRegStatus = (tid) => {
    const r = myRegs.find(r => r.tournament_id === tid);
    return r ? r.status : null;
  };

  return (
    <main className="page-section">
      <div className="content-container">
        <div className="page-header">
          <div className="badge">The Competition Starts Here</div>
          <h1>Tournament Directory</h1>
          <p>Choose your format, pick your region, and register for a bracket worth showing up for.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} id="tournamentGrid">
          {tournaments.map(t => {
            const status = getRegStatus(t.id);
            return (
              <div className="card" key={t.id}>
                <div className="card-header">
                  <span style={{ color: t.status === 'ongoing' ? 'red' : 'var(--lime-green)' }}>
                    {t.status.toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontSize: 24 }}>{t.name}</h3>
                <div className="card-meta">EA SPORTS FC 25 · 1v1 · Single Elim</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: 16, marginBottom: 16, fontSize: 14 }}>
                  <span>Max: {t.max_players} players</span>
                  <span>Region: Europe</span>
                </div>

                {t.status === 'open' && (
                  status === null ? (
                    <button onClick={() => handleRegisterClick(t)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      {isLoggedIn ? 'Register' : 'Sign in to Register'}
                    </button>
                  ) : status === 'pending' ? (
                    <div style={{ padding: 12, background: '#fff3cd', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#856404' }}>
                      Awaiting approval
                    </div>
                  ) : (
                    <div style={{ padding: 12, background: 'var(--lime-green)', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--bg-dark)' }}>
                      You are registered
                    </div>
                  )
                )}

                {t.status !== 'open' && (
                  <div style={{ padding: 12, textAlign: 'center', fontSize: 13, color: 'var(--gray-text)' }}>
                    Registration closed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedTournament && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 400, background: 'var(--bg-cream)' }}>
            <h3 style={{ marginBottom: 8 }}>Register for {selectedTournament.name}</h3>
            <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 24 }}>Confirm your details to submit your entry for admin approval.</p>
            
            <form onSubmit={submitRegistration}>
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              
              {msg.text && (
                <div style={{ fontSize: 13, marginBottom: 16, color: msg.type === 'success' ? '#2a9d4f' : '#e53935', fontWeight: 600 }}>
                  {msg.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setSelectedTournament(null)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}