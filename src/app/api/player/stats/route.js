import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const [wins] = await pool.query(
      'SELECT COUNT(*) as c FROM matches WHERE winner_id = ?',
      [decoded.id]
    );
    const [losses] = await pool.query(
      'SELECT COUNT(*) as c FROM matches WHERE status = "completed" AND winner_id != ? AND (player1_id = ? OR player2_id = ?)',
      [decoded.id, decoded.id, decoded.id]
    );
    const [matches] = await pool.query(
      'SELECT m.id, m.round, m.status, m.player1_score, m.player2_score, t.name AS tournament_name, p1.username AS player1_name, p2.username AS player2_name, m.winner_id ' +
      'FROM matches m JOIN tournaments t ON m.tournament_id = t.id ' +
      'LEFT JOIN users p1 ON m.player1_id = p1.id ' +
      'LEFT JOIN users p2 ON m.player2_id = p2.id ' +
      'WHERE m.player1_id = ? OR m.player2_id = ? ' +
      'ORDER BY m.round DESC',
      [decoded.id, decoded.id]
    );

    return NextResponse.json({
      wins: wins[0].c,
      losses: losses[0].c,
      total: wins[0].c + losses[0].c,
      matches
    });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}