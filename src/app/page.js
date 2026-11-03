import Link from 'next/link';

export default function Home() {
  return (
    <main className="page-section">
      <section className="hero" style={{ flex: 1 }}>
        <div>
          <span className="badge">Competitive FC Starts Here</span>
          <h1>Your Next<br/><span>Big Match</span><br/>Starts Now.</h1>
          <p>Find your bracket. Earn your place. FC ARENA is where serious players turn a good run into a name people remember.</p>
          <div className="hero-buttons">
            <Link href="/tournaments" className="btn-primary">Find a tournament →</Link>
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
                <div style={{ width: 48, height: 48, background: 'var(--bg-cream)', color: '#1b2621', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12 }}>NM</div>
                <h3 style={{ margin: 0, fontSize: 20, color: '#fff' }}>NOMAD</h3>
                <div style={{ fontSize: 12, color: '#8a938e', marginTop: 4 }}>#2 Europe</div>
              </div>
              <div style={{ fontSize: 32, fontFamily: 'Oswald', color: '#3a4a43' }}>VS</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ width: 48, height: 48, background: 'var(--bg-cream)', color: '#1b2621', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 12, marginLeft: 'auto' }}>KR</div>
                <h3 style={{ margin: 0, fontSize: 20, color: '#fff' }}>Kairo</h3>
                <div style={{ fontSize: 12, color: '#8a938e', marginTop: 4 }}>#3 Europe</div>
              </div>
            </div>
            <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#a0a5a2' }}>
              <span>Winner advances to</span>
              <span style={{ fontWeight: 'bold', color: '#fff' }}>Grand final</span>
            </div>
            <div style={{ height: 4, background: '#3a4a43', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '72%', background: 'var(--lime-green)' }}></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}