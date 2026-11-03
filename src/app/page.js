import Link from 'next/link';

export default function Home() {
  return (
    <main className="page-section">
      <section className="hero">
        {/* Left Side: Hero Text */}
        <div>
          <span className="badge">Competitive FC Starts Here</span>
          <h1>Your Next<br/><span>Big Match</span><br/>Starts Now.</h1>
          <p>Find your bracket. Earn your place. FC ARENA is where serious players turn a good run into a name people remember.</p>
          <div className="hero-buttons">
            <Link href="/tournaments" className="btn-primary">Find a tournament ↗</Link>
            <Link href="/leaderboard" className="btn-secondary" style={{ color: 'var(--text-light)', borderColor: 'rgba(255,255,255,0.2)' }}>See the rankings →</Link>
          </div>
        </div>

        {/* Right Side: Live Match Card */}
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
                <div style={{ fontSize: 12, color: 'var(--gray-text)', marginTop: 4 }}>#2 Europe</div>
              </div>
              
              <div style={{ fontSize: 32, fontFamily: 'Oswald', color: '#3a4a43' }}>VS</div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: 48, height: 48, background: 'var(--bg-cream)', color: 'var(--bg-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12, marginLeft: 'auto' }}>KR</div>
                <h3 style={{ margin: 0, fontSize: 20 }}>Kairo</h3>
                <div style={{ fontSize: 12, color: 'var(--gray-text)', marginTop: 4 }}>#3 Europe</div>
              </div>
            </div>
            
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Winner advances to</span>
              <span style={{ fontWeight: 'bold' }}>Grand final</span>
            </div>
            
            <div style={{ height: 4, background: '#3a4a43', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '72%', background: 'var(--lime-green)' }}></div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 10, color: 'var(--gray-text)', marginTop: 8 }}>
              Bracket 72% complete
            </div>
          </div>
        </div>
      </section>

      {/* Bottom section from screenshot */}
      <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        <div>
          <div className="badge">Built for match night</div>
          <h2 style={{ fontSize: 56, lineHeight: 1, marginBottom: 24 }}>Compete on<br/>your terms.</h2>
          <p style={{ color: 'var(--gray-text)', lineHeight: 1.6, marginBottom: 32 }}>From first bracket to the finals stage, everything you need to show up ready lives in one place.</p>
          <Link href="/register" className="btn-register">Create your player profile ↗</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Real competition</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-text)' }}>Formats built for fair, focused play.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Know your next match</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-text)' }}>Fixtures, times and results in one view.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Climb with every win</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-text)' }}>A regional ladder that rewards consistency.</p>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Clear rules, clean play</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-text)' }}>Know the format before you enter.</p>
          </div>
        </div>
      </section>
    </main>
  );
}