import Link from 'next/link';

export default function Home() {
  return (
    <main className="page-section">
      <section className="hero">
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
          </div>
        </div>
      </section>
    </main>
  );
}