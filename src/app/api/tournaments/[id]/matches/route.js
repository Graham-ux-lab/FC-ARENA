import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(req, { params }) {
  const resolvedParams = await params;
  
  const sql = 
    'SELECT m.id, m.round, m.status, m.player1_score, m.player2_score, ' +
    'p1.username AS player1_name, p2.username AS player2_name ' +
    'FROM matches m ' +
    'LEFT JOIN users p1 ON m.player1_id = p1.id ' +
    'LEFT JOIN users p2 ON m.player2_id = p2.id ' +
    'WHERE m.tournament_id = ? ' +
    'ORDER BY m.round ASC, m.id ASC';

  const [rows] = await pool.query(sql, [resolvedParams.id]);
  return NextResponse.json(rows);
}