import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function POST(req, { params }) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

    const resolvedParams = await params;
    const { p1_score, p2_score } = await req.json();
    
    if (p1_score === p2_score) return NextResponse.json({ error: 'Draws not allowed in knockout' }, { status: 400 });

    const [m] = await pool.query('SELECT * FROM matches WHERE id = ?', [resolvedParams.id]);
    if (!m[0]) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    
    const win = p1_score > p2_score ? m[0].player1_id : m[0].player2_id;
    await pool.query(
      'UPDATE matches SET player1_score = ?, player2_score = ?, winner_id = ?, status = "completed" WHERE id = ?',
      [p1_score, p2_score, win, resolvedParams.id]
    );
    return NextResponse.json({ message: 'Result recorded' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}