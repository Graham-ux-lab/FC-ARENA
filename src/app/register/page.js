'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const checkStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: '', color: '' },
      { label: 'Very Weak', color: '#e53935' },
      { label: 'Weak', color: '#fb8c00' },
      { label: 'Fair', color: '#fdd835' },
      { label: 'Strong', color: '#7cb342' },
      { label: 'Very Strong', color: '#2a9d4f' },
    ];
    setStrength({ score, ...map[score] });
  };

  const validateEmail = (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    if (!validateEmail(email)) return setMsg({ text: 'Please enter a valid email address.', type: 'error' });
    if (password !== confirm) return setMsg({ text: 'Passwords do not match.', type: 'error' });
    if (strength.score < 3) return setMsg({ text: 'Password is too weak. Use 8+ chars with upper/lowercase and a number.', type: 'error' });

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: e.target.name.value,
          email,
          password,
          ea_id: e.target.ea_id.value,
          platform: 'ps'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: data.message + ' Redirecting to login...', type: 'success' });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMsg({ text: data.error, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Registration failed. Try again.', type: 'error' });
    }
  };

  return (
    <main className="split-layout">
      <div className="split-left">
        <div className="badge" style={{ color: '#8a938e' }}>FC ARENA Account</div>
        <h1>Claim<br/>Your<br/><span style={{ color: 'var(--lime-green)' }}>Spot.</span></h1>
        <p>Create your profile, enter tournaments, and show the community what you're made of.</p>
      </div>
      <div className="split-right">
        <div className="badge">Registration</div>
        <h1>Create Profile</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ borderColor: email && !validateEmail(email) ? '#e53935' : undefined }} />
            {email && !validateEmail(email) && <div style={{ fontSize: 12, color: '#e53935', marginTop: 4 }}>Invalid email format</div>}
          </div>
          <div className="form-group password-wrapper">
            <label>Password</label>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); checkStrength(e.target.value); }} required />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'HIDE' : 'SHOW'}</span>
          </div>
          {password && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ height: 4, background: '#e0ddd5', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (strength.score / 5) * 100 + '%', background: strength.color, transition: 'all 0.3s' }}></div>
              </div>
              <div style={{ fontSize: 11, marginTop: 4, color: strength.color, fontWeight: 700 }}>{strength.label}</div>
            </div>
          )}
          <div className="form-group password-wrapper">
            <label>Confirm Password</label>
            <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required
              style={{ borderColor: confirm && confirm !== password ? '#e53935' : undefined }} />
            <span className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? 'HIDE' : 'SHOW'}</span>
            {confirm && confirm !== password && <div style={{ fontSize: 12, color: '#e53935', marginTop: 4 }}>Passwords do not match</div>}
          </div>
          <div className="form-group">
            <label>EA ID</label>
            <input type="text" name="ea_id" required />
          </div>
          <div className="form-group">
            <label>Platform</label>
            <input type="text" value="PlayStation" disabled readOnly style={{ background: '#e0ddd5', cursor: 'not-allowed' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>Register</button>
        </form>
        {msg.text && <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: msg.type === 'success' ? '#2a9d4f' : '#e53935' }}>{msg.text}</div>}
        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--gray-text)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </main>
  );
}