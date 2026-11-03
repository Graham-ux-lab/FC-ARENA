'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingRegs, setPendingRegs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [newTournament, setNewTournament] = useState({ name: '', max_players: 8 });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedTid, setSelectedTid] = useState(null);
  const [tMatches, setTMatches] = useState([]);
  const [tRegs, setTRegs] = useState([]);
  const [scoreInput, setScoreInput] = useState({ id: null, p1: 0, p2: 0, isEdit: false });
  const [auditMatch, setAuditMatch] = useState(null);
  const [auditData, setAuditData] = useState([]);
  const [seedModal, setSeedModal] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('fifa_token') : null;

  const loadData = async () => {
    if (!token) { router.push('/login'); return; }
    try {
      const meRes = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
      if (!meRes.ok) { router.push('/login'); return; }
      const me = await meRes.json();
      if (me.role !== 'admin') { router.push('/'); return; }

      const [pu, pr, au, t] = await Promise.all([
        fetch('/api/admin/pending', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
        fetch('/api/admin/registrations', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
        fetch('/api/admin/users', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
        fetch('/api/tournaments/public').then(r => r.json())
      ]);
      setPendingUsers(pu);
      setPendingRegs(pr);
      setAllUsers(au);
      setTournaments(t);
    } catch (e) {
      setMsg('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const loadTournamentDetails = async (tid) => {
    setSelectedTid(tid);
    const [mRes, rRes] = await Promise.all([
      fetch('/api/tournaments/' + tid + '/matches', { headers: { 'Authorization': 'Bearer ' + token } }),
      fetch('/api/admin/tournament/' + tid + '/registrations', { headers: { 'Authorization': 'Bearer ' + token } })
    ]);
    if (mRes.ok) setTMatches(await mRes.json());
    if (rRes.ok) setTRegs(await rRes.json());
  };

  useEffect(() => { loadData(); }, []);

  const approveUser = async (id) => {
    await fetch('/api/admin/approve/' + id, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
    loadData();
  };
  const rejectUser = async (id) => {
    if (!confirm('Reject this user?')) return;
    await fetch('/api/admin/reject/' + id, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
    loadData();
  };
  const setUserStatus = async (id, status) => {
    if (status === 'banned' && !confirm('Ban this user? They will not be able to log in.')) return;
    await fetch('/api/admin/user/' + id + '/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ status })
    });
    loadData();
  };

  const approveReg = async (tid, uid) => {
    await fetch('/api/admin/approve-registration/' + tid + '_' + uid, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
    loadData();
    if (selectedTid === tid) loadTournamentDetails(tid);
  };
  const rejectReg = async (tid, uid) => {
    if (!confirm('Reject this registration?')) return;
    await fetch('/api/admin/reject-registration/' + tid + '_' + uid, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
    loadData();
  };

  const createTournament = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/tournament', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(newTournament)
    });
    if (res.ok) {
      setMsg('Tournament created!');
      setNewTournament({ name: '', max_players: 8 });
      loadData();
    }
  };

  const deleteTournament = async (id, name) => {
    if (!confirm('Delete "' + name + '"? All matches will be lost.')) return;
    await fetch('/api/admin/tournament/' + id + '/delete', {
      method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }
    });
    setSelectedTid(null);
    loadData();
  };

  const handleTournamentAction = async (tid, action) => {
    if (action === 'generate') { setSeedModal(tid); return; }
    const res = await fetch('/api/admin/tournament/' + tid + '/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ action })
    });
    const data = await res.json();
    if (res.ok) { setMsg(data.message); loadTournamentDetails(tid); loadData(); }
    else setMsg(data.error);
  };

  const generateBracket = async (mode) => {
    const tid = seedModal;
    setSeedModal(null);
    const res = await fetch('/api/admin/tournament/' + tid + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ mode })
    });
    const data = await res.json();
    if (res.ok) { setMsg(data.message); loadTournamentDetails(tid); loadData(); }
    else setMsg(data.error);
  };

  const submitScore = async (matchId, isEdit) => {
    if (scoreInput.p1 === scoreInput.p2) { setMsg('Draws are not allowed.'); return; }
    const endpoint = isEdit 
      ? '/api/admin/match/' + matchId + '/edit'
      : '/api/admin/match/' + matchId + '/result';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ p1_score: parseInt(scoreInput.p1), p2_score: parseInt(scoreInput.p2) })
    });
    if (res.ok) {
      setMsg(isEdit ? 'Score updated (audit logged)' : 'Score recorded');
      setScoreInput({ id: null, p1: 0, p2: 0, isEdit: false });
      loadTournamentDetails(selectedTid);
    } else {
      const data = await res.json();
      setMsg(data.error);
    }
  };

  const openAudit = async (matchId) => {
    setAuditMatch(matchId);
    setAuditData([]);
    const res = await fetch('/api/admin/match/' + matchId + '/audit', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) setAuditData(await res.json());
  };

  if (loading) return <main className="page-section"><div className="content-container"><p>Loading...</p></div></main>;

  const filteredUsers = allUsers.filter(u => {
    const q = search.toLowerCase();
    const matchesSearch = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.ea_id || '').toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="page-section">
      <div className="content-container">
        <div className="page-header">
          <div className="badge">Admin Control Panel</div>
          <h1>Admin Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
          {['overview', 'users', 'tournaments'].map(t => (
            <button key={t} onClick={() => setTab(t)} 
              className={tab === t ? 'btn-primary' : 'btn-secondary'} 
              style={{ padding: '8px 20px', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>

        {msg && <div style={{ padding: 16, marginBottom: 24, background: 'var(--lime-green)', borderRadius: 4, fontWeight: 600 }}>{msg}</div>}

        {tab === 'overview' && (
          <>
            <div className="dash-grid">
              <div className="stat-card"><span className="stat-value">{pendingUsers.length}</span><span className="stat-label">Pending Users</span></div>
              <div className="stat-card"><span className="stat-value">{pendingRegs.length}</span><span className="stat-label">Pending Regs</span></div>
              <div className="stat-card"><span className="stat-value">{tournaments.length}</span><span className="stat-label">Tournaments</span></div>
              <div className="stat-card"><span className="stat-value">{tournaments.filter(t => t.status === 'ongoing').length}</span><span className="stat-label">Live Now</span></div>
            </div>

            <div className="admin-grid">
              <div className="card">
                <h3 style={{ marginBottom: 24 }}>Pending Users</h3>
                {pendingUsers.map(u => (
                  <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, border: '1px solid var(--border-light)', background: '#f9f8f5', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <strong>{u.username}</strong><br/>
                      <span style={{ fontSize: 12, color: 'var(--gray-text)' }}>{u.email}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => approveUser(u.id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>Approve</button>
                      <button onClick={() => rejectUser(u.id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, color: 'red', borderColor: 'red' }}>Reject</button>
                    </div>
                  </div>
                ))}
                {pendingUsers.length === 0 && <p style={{ color: 'var(--gray-text)' }}>No pending users.</p>}
              </div>

              <div className="card">
                <h3 style={{ marginBottom: 24 }}>Pending Registrations</h3>
                {pendingRegs.map(r => (
                  <div key={r.tournament_id + r.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, border: '1px solid var(--border-light)', background: '#f9f8f5', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ flex: 1 }}>
                      <strong>{r.username}</strong><br/>
                      <span style={{ fontSize: 12, color: 'var(--gray-text)' }}>for {r.tournament_name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => approveReg(r.tournament_id, r.user_id)} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>Approve</button>
                      <button onClick={() => rejectReg(r.tournament_id, r.user_id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, color: 'red', borderColor: 'red' }}>Reject</button>
                    </div>
                  </div>
                ))}
                {pendingRegs.length === 0 && <p style={{ color: 'var(--gray-text)' }}>No pending registrations.</p>}
              </div>
            </div>
          </>
        )}

        {tab === 'users' && (
          <div className="card">
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search username, email, EA ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: 240, padding: 10, border: '1px solid var(--border-light)', fontSize: 14 }}
              />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: 10, border: '1px solid var(--border-light)', fontSize: 14 }}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            <div className="data-table">
              <div className="table-row header" style={{ gridTemplateColumns: '1fr 1fr 100px 100px 160px' }}>
                <div>Player</div><div>Email</div><div>Platform</div><div>Status</div><div>Actions</div>
              </div>
              {filteredUsers.map(u => (
                <div className="table-row" key={u.id} style={{ gridTemplateColumns: '1fr 1fr 100px 100px 160px', alignItems: 'center' }}>
                  <div>
                    <strong>{u.username}</strong><br/>
                    <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>{u.ea_id}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>{u.email}</div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{u.platform.toUpperCase()}</div>
                  <div>
                    <span style={{
                      padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                      background: u.status === 'approved' ? 'var(--lime-green)' : u.status === 'banned' ? '#ffd6d6' : u.status === 'rejected' ? '#ffd6d6' : '#fff3cd',
                      color: u.status === 'approved' ? 'var(--bg-dark)' : u.status === 'banned' ? 'red' : '#856404'
                    }}>
                      {u.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {u.status !== 'approved' && u.role !== 'admin' && (
                      <button onClick={() => setUserStatus(u.id, 'approved')} className="btn-primary" style={{ padding: '4px 10px', fontSize: 11 }}>Approve</button>
                    )}
                    {u.status !== 'banned' && u.role !== 'admin' && (
                      <button onClick={() => setUserStatus(u.id, 'banned')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, color: 'red', borderColor: 'red' }}>Ban</button>
                    )}
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="table-row" style={{ gridTemplateColumns: '1fr', padding: 40, textAlign: 'center', color: 'var(--gray-text)' }}>
                  No users match the search.
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'tournaments' && (
          <>
            <div className="card" style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 24 }}>Create New Tournament</h3>
              <form onSubmit={createTournament} style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 2, marginBottom: 0, minWidth: 200 }}>
                  <label>Tournament Name</label>
                  <input type="text" placeholder="e.g. Weekend Rivals #01" value={newTournament.name} onChange={e => setNewTournament({...newTournament, name: e.target.value})} required />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: 100 }}>
                  <label>Max Players</label>
                  <input type="number" min="2" value={newTournament.max_players} onChange={e => setNewTournament({...newTournament, max_players: parseInt(e.target.value)})} required />
                </div>
                <button type="submit" className="btn-primary" style={{ height: 42 }}>Create</button>
              </form>
            </div>

            <div className="data-table" style={{ marginBottom: 32 }}>
              <div className="table-row header" style={{ gridTemplateColumns: '2fr 1fr 1fr 160px' }}>
                <div>Name</div><div>Status</div><div>Max</div><div>Actions</div>
              </div>
              {tournaments.map(t => (
                <div className="table-row" key={t.id} style={{ gridTemplateColumns: '2fr 1fr 1fr 160px', alignItems: 'center' }}>
                  <div><strong>{t.name}</strong></div>
                  <div><span style={{ fontWeight: 600, color: t.status === 'ongoing' ? 'red' : 'inherit' }}>{t.status.toUpperCase()}</span></div>
                  <div>{t.max_players}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => loadTournamentDetails(t.id)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 11 }}>Manage</button>
                    <button onClick={() => deleteTournament(t.id, t.name)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 11, color: 'red', borderColor: 'red' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedTid && (
              <div className="card" style={{ border: '2px solid var(--bg-dark)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                  <h3>Managing: {tournaments.find(t => t.id === selectedTid)?.name}</h3>
                  <div className="manage-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => handleTournamentAction(selectedTid, 'generate')} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Generate Bracket</button>
                    <button onClick={() => handleTournamentAction(selectedTid, 'advance')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>Advance Round</button>
                    <button onClick={() => handleTournamentAction(selectedTid, 'complete')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13, borderColor: 'red', color: 'red' }}>Mark Complete</button>
                  </div>
                </div>

                <h4 style={{ marginBottom: 16 }}>Registered Players ({tRegs.length})</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                  {tRegs.map((r, i) => (
                    <div key={i} style={{ padding: '6px 12px', background: r.status === 'approved' ? 'var(--lime-green)' : r.status === 'rejected' ? '#ffd6d6' : '#fff3cd', borderRadius: 4, fontSize: 13 }}>
                      {r.username} ({r.status})
                    </div>
                  ))}
                  {tRegs.length === 0 && <p style={{ color: 'var(--gray-text)', fontSize: 14 }}>No players registered.</p>}
                </div>

                <h4 style={{ marginBottom: 16 }}>Matches</h4>
                <div className="data-table">
                  <div className="table-row header" style={{ gridTemplateColumns: '60px 1fr 100px 240px' }}>
                    <div>Round</div><div>Match</div><div>Score</div><div>Action</div>
                  </div>
                  {tMatches.map(m => {
                    const isEditing = scoreInput.id === m.id;
                    return (
                      <div className="table-row" key={m.id} style={{ gridTemplateColumns: '60px 1fr 100px 240px', alignItems: 'center' }}>
                        <div>R{m.round}</div>
                        <div style={{ fontSize: 13 }}>{m.player1_id ? 'P1' : 'TBD'} vs {m.player2_id ? 'P2' : 'TBD'}</div>
                        <div style={{ fontWeight: 600 }}>{m.status === 'completed' ? m.player1_score + ' : ' + m.player2_score : '- : -'}</div>
                        <div>
                          {m.player1_id && m.player2_id && (
                            isEditing ? (
                              <div className="score-inputs" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                <input type="number" style={{ width: 42, padding: 4 }} value={scoreInput.p1} onChange={e => setScoreInput({...scoreInput, p1: e.target.value})} />
                                <input type="number" style={{ width: 42, padding: 4 }} value={scoreInput.p2} onChange={e => setScoreInput({...scoreInput, p2: e.target.value})} />
                                <button onClick={() => submitScore(m.id, scoreInput.isEdit)} className="btn-primary" style={{ padding: '4px 8px', fontSize: 11 }}>Save</button>
                                <button onClick={() => setScoreInput({ id: null, p1: 0, p2: 0, isEdit: false })} style={{ padding: '4px 8px', fontSize: 11, background: 'none', border: '1px solid var(--border-light)', cursor: 'pointer' }}>X</button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {m.status !== 'completed' && (
                                  <button onClick={() => setScoreInput({ id: m.id, p1: 0, p2: 0, isEdit: false })} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }}>Enter Score</button>
                                )}
                                {m.status === 'completed' && (
                                  <>
                                    <button onClick={() => setScoreInput({ id: m.id, p1: m.player1_score, p2: m.player2_score, isEdit: true })} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }}>Edit</button>
                                    <button onClick={() => openAudit(m.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 11 }}>Audit</button>
                                  </>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {tMatches.length === 0 && <div className="table-row" style={{ gridTemplateColumns: '1fr', padding: 20, textAlign: 'center', color: 'var(--gray-text)' }}>No matches yet.</div>}
                </div>
              </div>
            )}
          </>
        )}

        {seedModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <div className="card" style={{ width: '100%', maxWidth: 400, background: 'var(--bg-cream)' }}>
              <h3 style={{ marginBottom: 8 }}>Generate Bracket</h3>
              <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 24 }}>How should players be paired?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={() => generateBracket('random')} className="btn-primary" style={{ padding: 16, justifyContent: 'flex-start' }}>
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block' }}>Random Shuffle</strong>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>Fast and fair ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â everyone has an equal chance</span>
                  </div>
                </button>
                <button onClick={() => generateBracket('seeded')} className="btn-secondary" style={{ padding: 16, justifyContent: 'flex-start', color: 'var(--text-dark)', borderColor: 'var(--border-light)' }}>
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ display: 'block' }}>Seeded (Ranked)</strong>
                    <span style={{ fontSize: 12, color: 'var(--gray-text)' }}>Top players face bottom players</span>
                  </div>
                </button>
                <button onClick={() => setSeedModal(null)} className="btn-secondary" style={{ padding: 10, color: 'var(--gray-text)', borderColor: 'var(--border-light)' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {auditMatch && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setAuditMatch(null)}>
            <div className="card" style={{ width: '100%', maxWidth: 700, background: 'var(--bg-cream)', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3>Audit Log</h3>
                <button onClick={() => setAuditMatch(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>ÃƒÆ’Ã¢â‚¬â€</button>
              </div>
              {auditData.length === 0 && <p style={{ color: 'var(--gray-text)' }}>No edits recorded for this match.</p>}
              {auditData.map((e, i) => (
                <div key={i} style={{ padding: 12, border: '1px solid var(--border-light)', background: '#fff', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 4 }}>
                    {new Date(e.edited_at).toLocaleString()} Ãƒâ€šÃ‚Â· by <strong>{e.editor}</strong>
                  </div>
                  <div style={{ fontSize: 14 }}>
                    Score: <strong>{e.old_p1_score} : {e.old_p2_score}</strong> ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ <strong style={{ color: '#2a9d4f' }}>{e.new_p1_score} : {e.new_p2_score}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}