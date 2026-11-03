import Link from 'next/link';

export default function Home() {
  return (
    <main className="page-section">
      {/* HERO SECTION */}
      <section className="hero" style={{ flex: 1, minHeight: '80vh' }}>
        <div>
          <span className="badge">Competitive FC Starts Here</span>
          <h1>Your Next<br/><span>Big Match</span><br/>Starts Now.</h1>
          <p>Find your bracket. Earn your place. FC ARENA is where serious players turn a good run into a name people remember.</p>
          <div className="hero-buttons">
            <Link href="/tournaments" className="btn-primary">Find a tournament ↗</Link>
            <Link href="/leaderboard" className="btn-secondary">See the rankings →</Link>
          </div>
        </div>
        <div>
          <div className="card" style={{ background: '#1b2621', color: '#fff', borderColor: '#2a3a33' }}>
            <div className="card-header">
              <span>Semi-Final · Match 02</span>
              <span style={{ color: 'var(--lime-green)' }}>21:30 CET</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0' }}>
              <div>
                <div style={{ width: 48, height: 48, background: 'var(--bg-cream)', color: 'var(--bg-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12 }}>NM</div>
                <h3 style={{ margin: 0, fontSize: 20 }}>NOMAD</h3>
              </div>
              <div style={{ fontSize: 32, fontFamily: 'Oswald', color: '#3a4a43' }}>VS</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: 48, height: 48, background: 'var(--bg-cream)', color: 'var(--bg-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12, marginLeft: 'auto' }}>KR</div>
                <h3 style={{ margin: 0, fontSize: 20 }}>Kairo</h3>
              </div>
            </div>
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Winner advances to</span>
              <span style={{ fontWeight: 'bold' }}>Grand final</span>
            </div>
            <div style={{ height: 4, background: '#3a4a43', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '72%', background: 'var(--lime-green)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO FEATURE SECTION */}
      <section style={{ background: '#e4e0d8', padding: '80px 40px' }}>
        <div className="content-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div className="badge" style={{ color: 'var(--gray-text)' }}>Built for match night</div>
            <h2 style={{ fontSize: '56px', lineHeight: '1.05', marginBottom: '24px' }}>Compete on<br/>your terms.</h2>
            <p style={{ fontSize: '15px', color: 'var(--gray-text)', marginBottom: '32px', maxWidth: '90%' }}>From first bracket to the finals stage, everything you need to show up ready lives in one place.</p>
            <Link href="/register" className="btn-primary" style={{ background: '#1b2621', color: '#fff' }}>Create your player profile ↗</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { icon: '🏆', title: 'Real competition', desc: 'Formats built for fair, focused play.' },
              { icon: '📅', title: 'Know your next match', desc: 'Fixtures, times and results in one view.' },
              { icon: '⚡', title: 'Climb with every win', desc: 'A regional ladder that rewards consistency.' },
              { icon: '🛡️', title: 'Clear rules, clean play', desc: 'Know the format before you enter.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '24px' }}>
                <div style={{ fontSize: '20px', marginBottom: '16px' }}>{f.icon}</div>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Inter', fontWeight: '600' }}>{f.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-text)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRENT STANDINGS SECTION */}
      <section style={{ padding: '80px 40px', background: 'var(--bg-cream)' }}>
        <div className="content-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px', alignItems: 'start' }}>
          <div>
            <div className="badge" style={{ color: 'var(--gray-text)' }}>Current standings</div>
            <h2 style={{ fontSize: '56px', lineHeight: '1.05', marginBottom: '24px' }}>Earn your<br/>position.</h2>
            <p style={{ fontSize: '15px', color: 'var(--gray-text)', marginBottom: '32px' }}>Every result moves the table. Here's who is setting the pace.</p>
            <Link href="/leaderboard" style={{ fontWeight: '600', fontSize: '14px', borderBottom: '1px solid var(--text-dark)', paddingBottom: '2px' }}>Full leaderboard →</Link>
          </div>
          <div>
            <div style={{ background: '#fff', border: '1px solid var(--border-light)' }}>
              {[
                { rank: '01', init: 'VX', name: 'Vexx', loc: 'London, UK', pts: '2,840' },
                { rank: '02', init: 'NM', name: 'NOMAD', loc: 'Berlin, DE', pts: '2,715' },
                { rank: '03', init: 'KR', name: 'Kairo', loc: 'Paris, FR', pts: '2,580' },
                { rank: '04', init: 'TT', name: 'TouchlineTom', loc: 'Manchester, UK', pts: '2,430' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none' }}>
                  <div style={{ width: '40px', color: 'var(--gray-text)', fontWeight: '700', fontSize: '13px' }}>{p.rank}</div>
                  <div style={{ width: '40px', height: '40px', background: '#f4f2ec', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', marginRight: '16px' }}>{p.init}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{p.name}</div>
                  </div>
                  <div style={{ color: 'var(--gray-text)', fontSize: '13px', marginRight: '24px' }}>{p.loc}</div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{p.pts} <span style={{ fontSize: '10px', color: 'var(--gray-text)' }}>PTS</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OPEN BRACKETS SECTION */}
      <section style={{ padding: '80px 40px', background: '#e4e0d8' }}>
        <div className="content-container">
          <div className="badge" style={{ color: 'var(--gray-text)' }}>Pick your next challenge</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '48px', margin: 0 }}>Open brackets</h2>
            <Link href="/tournaments" style={{ fontWeight: '600', fontSize: '14px', borderBottom: '1px solid var(--text-dark)', paddingBottom: '2px' }}>All tournaments →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { title: 'Continental Cup: Spring Split', prize: '€1,200', entry: '€8', date: '24 May', players: '86/128 players', status: 'OPEN' },
              { title: 'Weekend Rivals Series #08', prize: '€600', entry: '€5', date: '25 May', players: '42/96 players', status: 'OPEN' },
              { title: 'Academy Cup: New Blood', prize: '€250', entry: 'Free', date: '1 Jun', players: '28/64 players', status: 'OPEN' },
            ].map((t, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--gray-text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === 2 ? 'var(--gray-text)' : '#a1d06f' }}></span> {t.status}
                </div>
                <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>{t.title}</h3>
                <div style={{ fontSize: '13px', color: 'var(--gray-text)', marginBottom: '24px' }}>EA SPORTS FC 25 · 1v1 · Swiss</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginBottom: '20px' }}>
                  <div><div style={{ fontSize: '11px', color: 'var(--gray-text)', textTransform: 'uppercase', marginBottom: '4px' }}>Prize pool</div><div style={{ fontWeight: '700', fontSize: '15px' }}>{t.prize}</div></div>
                  <div><div style={{ fontSize: '11px', color: 'var(--gray-text)', textTransform: 'uppercase', marginBottom: '4px' }}>Entry</div><div style={{ fontWeight: '700', fontSize: '15px' }}>{t.entry}</div></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--gray-text)', marginBottom: '24px' }}>
                  <span>📅 {t.date}</span>
                  <span>📍 Europe</span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--gray-text)' }}>👥 {t.players}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Details ›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1b2621', color: '#f3f1eb', padding: '60px 40px 30px' }}>
        <div className="content-container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px', padding: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M12 2L15 5H18L21 8V12C21 15.5 18 18 12 22C6 18 3 15.5 3 12V8L6 5H9L12 2Z" fill="#f3f1eb"/><circle cx="12" cy="12" r="4" fill="#ccf380"/></svg>
              <span style={{ fontFamily: 'Oswald', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>FC ARENA</span>
            </div>
            <p style={{ color: '#a0a5a2', fontSize: '14px', maxWidth: '320px', lineHeight: '1.6' }}>
              The competitive home for EA SPORTS FC players. Find your next match and make it count.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#a0a5a2' }}>
              <Link href="/tournaments" style={{ color: 'inherit' }}>Tournaments</Link>
              <Link href="/fixtures" style={{ color: 'inherit' }}>Fixtures</Link>
              <Link href="/leaderboard" style={{ color: 'inherit' }}>Leaderboard</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#a0a5a2' }}>
              <Link href="/results" style={{ color: 'inherit' }}>Results</Link>
              <Link href="/register" style={{ color: 'inherit' }}>Register</Link>
              <Link href="/login" style={{ color: 'inherit' }}>Sign in</Link>
            </div>
          </div>
        </div>
        <div className="content-container" style={{ borderTop: '1px solid #2a3a33', marginTop: '40px', paddingTop: '20px', padding: '40px 0 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#5a625e' }}>
          <div>Sample-data experience · Tournament information is illustrative and not live.</div>
          <div>© 2026 FC ARENA</div>
        </div>
      </footer>
    </main>
  );
}