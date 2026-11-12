'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Tournaments() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [contact, setContact] = useState('');
  const [stage, setStage] = useState('contact'); 
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [processing, setProcessing] = useState(false);

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
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRegisterClick = (tournament) => {
    const token = localStorage.getItem('fifa_token');
    if (!token) { router.push('/login'); return; }
    setSelectedTournament(tournament);
    setContact('');
    setStage('contact');
    setMsg({ text: '', type: '' });
  };

  const proceedToPay = (e) => {
    e.preventDefault();
    if (!contact.trim()) { setMsg({ text: 'Please enter a contact', type: 'error' }); return; }
    setStage('pay');
    setMsg({ text: '', type: '' });
  };

  const submitPayment = async () => {
    setProcessing(true);
    setMsg({ text: '', type: '' });
    const token = localStorage.getItem('fifa_token');
    
    const res = await fetch('/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ tournament_id: selectedTournament.id, contact })
    });
    
    const data = await res.json();
    setProcessing(false);
    
    if (res.ok) {
      setMsg({ text: data.message, type: 'success' });
      setStage('success');
      await load();
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

        <div className="tournament-grid" id="tournamentGrid">
          {loading ? (
            // SKELETON LOADING
            Array(3).fill(0).map((_, i) => (
              <div className="card" key={i}>
                <div className="skeleton" style={{ height: 16, width: 60, marginBottom: 20 }}></div>
                <div className="skeleton sk-title"></div>
                <div className="skeleton sk-text" style={{ width: 70 }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: 16, marginTop: 16 }}>
                  <div className="skeleton sk-text" style={{ width: 100 }}></div>
                  <div className="skeleton sk-text" style={{ width: 80 }}></div>
                </div>
                <div className="skeleton sk-box" style={{ height: 60, marginTop: 16 }}></div>
                <div className="skeleton sk-button"></div>
              </div>
            ))
          ) : (
            // REAL DATA
            tournaments.map(t => {
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
                    <span>Region: Kenya</span>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: 'var(--gray-text)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Entry Fee</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: t.entry_fee > 0 ? 'var(--text-dark)' : 'var(--lime-green)' }}>
                      {t.entry_fee > 0 ? 'KES ' + t.entry_fee : 'Free'}
                    </div>
                  </div>

                  {t.status === 'open' ? (
                    status === null ? (
                      <button onClick={() => handleRegisterClick(t)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        {isLoggedIn ? (t.entry_fee > 0 ? 'Register & Pay' : 'Register') : 'Sign in to Register'}
                      </button>
                    ) : status === 'approved' ? (
                      <div style={{ padding: 12, background: 'var(--lime-green)', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--bg-dark)' }}>Registered</div>
                    ) : (
                      <div style={{ padding: 12, background: '#fff3cd', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#856404' }}>Awaiting payment</div>
                    )
                  ) : (
                    <div style={{ padding: 12, textAlign: 'center', fontSize: 13, color: 'var(--gray-text)' }}>Registration closed</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* MODAL REMAINS THE SAME */}
      {selectedTournament && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{selectedTournament.name}</h3>
              <button onClick={() => setSelectedTournament(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            {stage === 'contact' && (
              <form onSubmit={proceedToPay}>
                <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 20 }}>Enter your contact to proceed to payment.</p>
                <div className="form-group">
                  <label>Contact (Phone / Email)</label>
                  <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="e.g. 254712345678" required />
                </div>
                {msg.text && <div style={{ fontSize: 13, marginBottom: 16, color: '#e53935', fontWeight: 600 }}>{msg.text}</div>}
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Continue</button>
              </form>
            )}
            {stage === 'pay' && (
              <>
                <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 20 }}>{selectedTournament.entry_fee > 0 ? 'Review your entry fee and complete payment to be registered.' : 'This tournament is free. Click below to confirm your registration.'}</p>
                <div style={{ background: '#f9f8f5', border: '1px solid var(--border-light)', padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}><span>Entry fee</span><strong>KES {selectedTournament.entry_fee}</strong></div>
                  {contact && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--gray-text)' }}><span>Contact</span><span>{contact}</span></div>}
                </div>
                {msg.text && <div style={{ fontSize: 13, marginBottom: 16, color: msg.type === 'success' ? '#2a9d4f' : '#e53935', fontWeight: 600 }}>{msg.text}</div>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setStage('contact')} className="btn-secondary" style={{ flex: 1 }} disabled={processing}>Back</button>
                  <button onClick={submitPayment} className="btn-primary" style={{ flex: 2 }} disabled={processing}>{processing ? 'Processing...' : `Pay KES ${selectedTournament.entry_fee}`}</button>
                </div>
              </>
            )}
            {stage === 'success' && (
              <>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16, color: '#2a9d4f' }}>✓</div>
                  <h4 style={{ fontSize: 20, marginBottom: 12, fontFamily: 'Inter', textTransform: 'none' }}>You are registered!</h4>
                  <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 24 }}>{msg.text}</p>
                </div>
                <button onClick={() => setSelectedTournament(null)} className="btn-primary" style={{ width: '100%' }}>Done</button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}