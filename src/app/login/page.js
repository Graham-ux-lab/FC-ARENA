'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate and get the token
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e.target.email.value, password: e.target.password.value })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // 2. Save the token
      localStorage.setItem('fifa_token', data.token);

      // 3. Fetch user data to check their role
      const meRes = await fetch('/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + data.token }
      });
      
      if (meRes.ok) {
        const user = await meRes.json();
        // 4. Redirect based on role
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Fallback if /me fails
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred during login.');
      setLoading(false);
    }
  };

  return (
    <main className="split-layout">
      <div className="split-left">
        <div className="badge" style={{ color: 'var(--gray-text)' }}>FC ARENA Account</div>
        <h1 style={{ fontSize: 64, lineHeight: 1.1, marginBottom: 24 }}>The Next<br/>Match Is<br/><span style={{ color: 'var(--lime-green)' }}>Yours.</span></h1>
        <p style={{ color: '#a0a5a2', lineHeight: 1.6, maxWidth: '80%' }}>Sign in to follow your fixtures, keep your entries in one place, and track your climb.</p>
      </div>
      <div className="split-right">
        <div className="badge">Welcome Back</div>
        <h1 style={{ fontSize: 48, marginBottom: 40 }}>Sign In</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group password-wrapper">
            <label>Password</label>
            <input type={showPassword ? 'text' : 'password'} name="password" required />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </span>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {error && <div style={{ marginTop: 16, fontSize: 14, color: 'red' }}>{error}</div>}
        <p style={{ marginTop: 24, fontSize: 14, color: 'var(--gray-text)' }}>
          No account? <Link href="/register" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </main>
  );
}