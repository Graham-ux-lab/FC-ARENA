'use client';
import { useEffect, useState } from 'react';

export default function Fixtures() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => { 
    fetch('/api/tournaments/fixtures')
      .then(r => r.json())
      .then(res => {
        setData(res);
        setLoading(false);
      }); 
  }, []);

  const filteredData = data.filter(m => {
    if (filter === 'upcoming') return m.status === 'scheduled';
    if (filter === 'completed') return m.status === 'completed';
    return true;
  });

  return (
    <main className="page-section">
      <div className="content-container">
        <div className="page-header">
          <div className="badge">The Next Whistle</div>
          <h1>Fixture Schedule</h1>
          <p>Every kick-off in one place. Check your slot, or review past results.</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '10px 20px' }}>All Fixtures</button>
          <button onClick={() => setFilter('upcoming')} className={filter === 'upcoming' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '10px 20px' }}>Upcoming</button>
          <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'btn-primary' : 'btn-secondary'} style={{ padding: '10px 20px' }}>Completed</button>
        </div>

        <div className="data-table">
          <div className="table-row header" style={{ gridTemplateColumns: '80px 1fr 120px 1fr' }}>
            <div>Round</div><div>Match</div><div>Score</div><div>Tournament</div>
          </div>
          
          {loading ? (
            // SKELETON ROWS
            Array(4).fill(0).map((_, i) => (
              <div className="table-row" key={i} style={{ gridTemplateColumns: '80px 1fr 120px 1fr' }}>
                <div className="skeleton" style={{ height: 16, width: 40 }}></div>
                <div className="skeleton" style={{ height: 16, width: '80%' }}></div>
                <div className="skeleton" style={{ height: 20, width: 60 }}></div>
                <div className="skeleton" style={{ height: 16, width: '60%' }}></div>
              </div>
            ))
          ) : (
            // REAL DATA
            filteredData.map(m => {
              const isCompleted = m.status === 'completed';
              return (
                <div className="table-row" key={m.id} style={{ gridTemplateColumns: '80px 1fr 120px 1fr' }}>
                  <div style={{ color: 'var(--gray-text)', fontWeight: 600 }}>R{m.round}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <strong style={{ width: '40%', textAlign: 'right' }}>{m.player1_name || 'TBD'}</strong>
                    <span style={{ fontSize: 12, color: 'var(--gray-text)', textTransform: 'uppercase', width: 20, textAlign: 'center' }}>vs</span>
                    <strong style={{ width: '40%' }}>{m.player2_name || 'BYE'}</strong>
                  </div>
                  
                  <div style={{ fontWeight: 'bold', fontSize: 18, color: isCompleted ? 'var(--text-dark)' : 'var(--gray-text)' }}>
                    {isCompleted ? (m.player1_score + ' : ' + m.player2_score) : '- : -'}
                  </div>
                  
                  <div style={{ fontSize: 13, color: 'var(--gray-text)' }}>
                    {m.tournament_name}
                    {!isCompleted && <span style={{ marginLeft: 8, fontSize: 10, border: '1px solid var(--border-light)', padding: '2px 6px', borderRadius: 4, fontWeight: 'bold' }}>SCHEDULED</span>}
                  </div>
                </div>
              );
            })
          )}
          
          {!loading && filteredData.length === 0 && (
            <div className="table-row" style={{ gridTemplateColumns: '1fr', padding: 40, textAlign: 'center', color: 'var(--gray-text)' }}>
              No {filter === 'all' ? '' : filter} matches found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}