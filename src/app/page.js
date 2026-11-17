import Link from 'next/link';

export default function Home() {
  return (
    <main className="page-section">
      {/* HERO SECTION - Now uses CSS variables so it adapts to Dark Mode */}
      <section className="hero" style={{ flex: 1, minHeight: '80vh', background: 'var(--bg-dark)', color: 'var(--text-light)' }}>
        <div>
          <span className="badge" style={{ color: 'var(--gray-text)' }}>Competitive FC Starts Here</span>
          <h1 style={{ color: 'var(--text-light)' }}>Your Next<br/><span style={{ color: 'var(--lime-green)' }}>Big Match</span><br/>Starts Now.</h1>
          <p style={{ color: 'var(--gray-text)' }}>Find your bracket. Earn your place. XP LOUNGE is where serious players turn a good run into a name people remember.</p>
          <div className="hero-buttons">
            <Link href="/tournaments" className="btn-primary">Find a tournament</Link>
            <Link href="/leaderboard" className="btn-secondary" style={{ color: 'var(--text-light)', borderColor: 'var(--text-light)' }}>See the rankings</Link>
          </div>
        </div>
        <div>
          {/* Inner match card */}
          <div className="card" style={{ background: 'var(--bg-cream)', color: 'var(--text-dark)', borderColor: 'var(--border-light)' }}>
            <div className="card-header">
              <span>Semi-Final · Match 02</span>
              <span style={{ color: 'var(--bg-dark)' }}>21:30 CET</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0' }}>
              <div>
                <div style={{ width: 48, height: 48, background: 'var(--bg-dark)', color: 'var(--bg-cream)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12 }}>NM</div>
                <h3 style={{ margin: 0, fontSize: 20, color: 'var(--text-dark)' }}>NOMAD</h3>
              </div>
              <div style={{ fontSize: 32, fontFamily: 'Oswald', color: 'var(--gray-text)' }}>VS</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: 48, height: 48, background: 'var(--bg-dark)', color: 'var(--bg-cream)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12, marginLeft: 'auto' }}>KR</div>
                <h3 style={{ margin: 0, fontSize: 20, color: 'var(--text-dark)' }}>Kairo</h3>
              </div>
            </div>
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Winner advances to</span>
              <span style={{ fontWeight: 'bold' }}>Grand final</span>
            </div>
            <div style={{ height: 4, background: 'var(--border-light)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '72%', background: 'var(--lime-green)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO FEATURE SECTION - Hardcoded colors to remain consistent */}
      <section style={{ background: '#e4e0d8', padding: '80px 40px' }}>
        <div className="content-container bento-grid">
          <div>
            <div className="badge" style={{ color: '#6b706c' }}>Built for match night</div>
            <h2 style={{ fontSize: '56px', lineHeight: '1.05', marginBottom: '24px', color: '#1b2621' }}>Compete on<br/>your terms.</h2>
            <p style={{ fontSize: '15px', color: '#6b706c', marginBottom: '32px', maxWidth: '90%' }}>From first bracket to the finals stage, everything you need to show up ready lives in one place.</p>
            <Link href="/register" className="btn-primary" style={{ background: '#1b2621', color: '#fff' }}>Create your player profile</Link>
          </div>
          <div className="bento-cards">
            {[
              { title: 'Real competition', desc: 'Formats built for fair, focused play.' },
              { title: 'Know your next match', desc: 'Fixtures, times and results in one view.' },
              { title: 'Climb with every win', desc: 'A regional ladder that rewards consistency.' },
              { title: 'Clear rules, clean play', desc: 'Know the format before you enter.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2dfd4', padding: '24px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '8px', fontFamily: 'Inter', fontWeight: '600', color: '#1b2621' }}>{f.title}</h4>
                <p style={{ fontSize: '13px', color: '#6b706c' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER - Hardcoded colors to remain consistent */}
      <footer style={{ background: '#1b2621', color: '#f3f1eb', padding: '60px 40px 30px' }}>
        <div className="content-container footer-grid" style={{ padding: 0 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M12 2L15 5H18L21 8V12C21 15.5 18 18 12 22C6 18 3 15.5 3 12V8L6 5H9L12 2Z" fill="#f3f1eb"/><circle cx="12" cy="12" r="4" fill="#ccf380"/></svg>
              <span style={{ fontFamily: 'Oswald', fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em' }}>XP LOUNGE</span>
            </div>
            <p style={{ color: '#a0a5a2', fontSize: '14px', maxWidth: '320px', lineHeight: '1.6' }}>
              The competitive home for EA SPORTS FC players. Find your next match and make it count.
            </p>
          </div>
          <div className="footer-links" style={{ display: 'flex', gap: '40px' }}>
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
        <div className="content-container footer-bottom" style={{ borderTop: '1px solid #2a3a33', marginTop: '40px', padding: '20px 0 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#5a625e' }}>
          <div>© 2026 XP LOUNGE</div>
        </div>
      </footer>
    </main>
  );
}