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

    const p = await params;
    const { p1_score, p2_score } = await req.json();
    if (p1_score === p2_score) return NextResponse.json({ error: 'Draws not allowed' }, { status: 400 });

    const [m] = await pool.query('SELECT * FROM matches WHERE id = ?', [p.id]);
    if (!m[0]) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    const old = m[0];
    const newWinner = p1_score > p2_score ? old.player1_id : old.player2_id;

    await pool.query(
      'UPDATE matches SET player1_score = ?, player2_score = ?, winner_id = ?, status = "completed" WHERE id = ?',
      [p1_score, p2_score, newWinner, p.id]
    );

    await pool.query(
      'INSERT INTO match_edits (match_id, edited_by, old_p1_score, old_p2_score, new_p1_score, new_p2_score, old_winner_id, new_winner_id) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [p.id, decoded.id, old.player1_score, old.player2_score, p1_score, p2_score, old.winner_id, newWinner]
    );

    return NextResponse.json({ message: 'Match updated and logged' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}