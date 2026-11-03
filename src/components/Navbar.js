'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

function decodeRole(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('fifa_token');
    setIsLoggedIn(!!token);
    setIsAdmin(decodeRole(token) === 'admin');

    // Load theme
    const savedTheme = localStorage.getItem('fifa_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [pathname]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('fifa_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('fifa_theme', 'light');
    }
  };

  const logout = () => {
    localStorage.removeItem('fifa_token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav>
      <Link href="/" className="brand-logo">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15 5H18L21 8V12C21 15.5 18 18 12 22C6 18 3 15.5 3 12V8L6 5H9L12 2Z" fill="currentColor"/>
          <circle cx="12" cy="12" r="4" fill="#ccf380"/>
        </svg>
        FC ARENA
      </Link>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/tournaments">Tournaments</Link>
        <Link href="/fixtures">Fixtures</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        <Link href="/results">Results</Link>
      </div>
<div className="nav-actions">
        <button onClick={toggleTheme} className="btn-theme" title="Toggle theme">
          {darkMode ? 'LIGHT' : 'DARK'}
        </button>
        {isLoggedIn ? (
          <>
            {isAdmin && <Link href="/admin" className="btn-signin">Admin</Link>}
            <Link href="/dashboard" className="btn-signin">Dashboard</Link>
            <button onClick={logout} className="btn-register">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-signin">Sign in</Link>
            <Link href="/register" className="btn-register">Register ↗</Link>
          </>
        )}
      </div>
    </nav>
  );
}