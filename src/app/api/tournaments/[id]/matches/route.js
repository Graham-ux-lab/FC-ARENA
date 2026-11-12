import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const p = await params;
    const [rows] = await pool.query(
      'SELECT m.*, ' +
      'p1.username AS player1_name, p2.username AS player2_name ' +
      'FROM matches m ' +
      'LEFT JOIN users p1 ON m.player1_id = p1.id ' +
      'LEFT JOIN users p2 ON m.player2_id = p2.id ' +
      'WHERE m.tournament_id = ? ORDER BY m.round, m.id',
      [p.id]
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}