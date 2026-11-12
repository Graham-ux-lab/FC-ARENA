import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) return NextResponse.json({ error: 'No account with that email' }, { status: 400 });
    if (user.status === 'rejected') return NextResponse.json({ error: 'This account was rejected' }, { status: 403 });
    if (user.status === 'banned') return NextResponse.json({ error: 'This account is banned' }, { status: 403 });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return NextResponse.json({ error: 'Wrong password' }, { status: 400 });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
    return NextResponse.json({ token });
  } catch (e) {
    console.error('LOGIN ERROR:', e);
    return NextResponse.json({ error: 'Server error: ' + (e.message || 'unknown') }, { status: 500 });
  }
}