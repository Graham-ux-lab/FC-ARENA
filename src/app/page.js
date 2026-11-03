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
            <Link href="/tournaments" className="btn-primary">Find a tournament</Link>
            <Link href="/leaderboard" className="btn-secondary">See the rankings</Link>
          </div>
        </div>
        <div>
          <div className="card home-match-card" style={{ background: '#1b2621', color: '#fff', borderColor: '#2a3a33' }}>
            <div className="card-header home-match-card-header">
              <span>Semi-Final · Match 02</span>
              <span style={{ color: 'var(--lime-green)' }}>21:30 CET</span>
            </div>
            <div className="home-match-players">
              <div>
                <div style={{ width: 48, height: 48, background: 'var(--bg-cream)', color: 'var(--bg-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12 }}>NM</div>
                <h3 style={{ margin: 0, fontSize: 20 }}>NOMAD</h3>
              </div>
              <div style={{ fontSize: 32, fontFamily: 'Oswald', color: '#3a4a43' }}>VS</div>
              <div>
                <div style={{ width: 48, height: 48, background: 'var(--bg-cream)', color: 'var(--bg-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12, marginLeft: 'auto' }}>KR</div>
                <h3 style={{ margin: 0, fontSize: 20 }}>Kairo</h3>
              </div>
            </div>
            <div className="home-match-progress">
              <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Winner advances to</span>
                <span style={{ fontWeight: 'bold' }}>Grand final</span>
              </div>
              <div style={{ height: 4, background: '#3a4a43', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '72%', background: 'var(--lime-green)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO FEATURE SECTION */}
      <section className="home-bento" style={{ background: '#e4e0d8', padding: '80px 40px' }}>
        <div className="content-container home-bento-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div className="badge" style={{ color: 'var(--gray-text)' }}>Built for match night</div>
            <h2 style={{ fontSize: '56px', lineHeight: '1.05', marginBottom: '24px' }}>Compete on<br/>your terms.</h2>
            <p style={{ fontSize: '15px', color: 'var(--gray-text)', marginBottom: '32px', maxWidth: '90%' }}>From first bracket to the finals stage, everything you need to show up ready lives in one place.</p>
            <Link href="/register" className="btn-primary" style={{ background: '#1b2621', color: '#fff' }}>Create your player profile</Link>
          </div>
          <div className="home-bento-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { title: 'Real competition', desc: 'Formats built for fair, focused play.' },
              { title: 'Know your next match', desc: 'Fixtures, times and results in one view.' },
              { title: 'Climb with every win', desc: 'A regional ladder that rewards consistency.' },
              { title: 'Clear rules, clean play', desc: 'Know the format before you enter.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '24px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Inter', fontWeight: '600' }}>{f.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-text)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer" style={{ background: '#1b2621', color: '#f3f1eb', padding: '60px 40px 30px' }}>
        <div className="content-container home-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '60px', padding: 0 }}>
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
        <div className="content-container" style={{ borderTop: '1px solid #2a3a33', marginTop: '40px', padding: '20px 0 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#5a625e' }}>
          <div>© 2026 FC ARENA</div>
        </div>
      </footer>
    </main>
  );
}