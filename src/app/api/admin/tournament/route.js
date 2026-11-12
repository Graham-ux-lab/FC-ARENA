import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function POST(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

    const { name, max_players, entry_fee } = await req.json();
    await pool.query(
      'INSERT INTO tournaments (name, max_players, entry_fee) VALUES (?, ?, ?)',
      [name, max_players, entry_fee || 0]
    );
    return NextResponse.json({ message: 'Tournament created' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}