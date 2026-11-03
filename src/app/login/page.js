'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e.target.email.value, password: e.target.password.value })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('fifa_token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  return (
    <main className="split-layout">
      <div className="split-left">
        <div className="badge" style={{ color: '#8a938e' }}>FC ARENA Account</div>
        <h1>The Next<br/>Match Is<br/><span style={{ color: 'var(--lime-green)' }}>Yours.</span></h1>
        <p>Sign in to follow your fixtures, keep your entries in one place, and track your climb.</p>
      </div>
      <div className="split-right">
        <div className="badge">Welcome Back</div>
        <h1>Sign In</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required autoComplete="email" />
          </div>
          <div className="form-group password-wrapper">
            <label>Password</label>
            <input type={showPassword ? 'text' : 'password'} name="password" required autoComplete="current-password" />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </span>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>Sign In</button>
        </form>
        {error && <div style={{ marginTop: 16, fontSize: 14, color: '#e53935', fontWeight: 600 }}>{error}</div>}
        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--gray-text)' }}>
          No account? <Link href="/register" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </main>
  );
}