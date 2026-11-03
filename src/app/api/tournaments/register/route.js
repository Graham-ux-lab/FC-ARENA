import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function POST(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const { tournament_id, username, email } = await req.json();

    if (!tournament_id || !username || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Verify the user matches the token
    const [user] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [decoded.id]);
    if (user.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    if (user[0].username !== username || user[0].email !== email) {
      return NextResponse.json({ error: 'Username or email does not match your logged-in account' }, { status: 403 });
    }

    // Check tournament status
    const [t] = await pool.query('SELECT status, max_players FROM tournaments WHERE id = ?', [tournament_id]);
    if (t.length === 0) return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    if (t[0].status !== 'open') return NextResponse.json({ error: 'Tournament is not open for registration' }, { status: 400 });

    // Check capacity
    const [count] = await pool.query('SELECT COUNT(*) as c FROM registrations WHERE tournament_id = ?', [tournament_id]);
    if (count[0].c >= t[0].max_players) {
      return NextResponse.json({ error: 'Tournament is full' }, { status: 400 });
    }

    // Insert registration
    await pool.query(
      'INSERT INTO registrations (tournament_id, user_id, status) VALUES (?, ?, ?)',
      [tournament_id, decoded.id, 'pending']
    );

    return NextResponse.json({ message: 'Registration submitted. Awaiting admin approval.' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'You are already registered for this tournament' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}