import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function POST(req) {
  const { email, password } = await req.json();
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];

  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  if (user.status !== 'approved') return NextResponse.json({ error: 'Awaiting approval' }, { status: 403 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
  return NextResponse.json({ token, role: user.role });
}