import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const [rows] = await pool.query(
      'SELECT u.username, u.email, r.status, r.user_id ' +
      'FROM registrations r JOIN users u ON r.user_id = u.id ' +
      'WHERE r.tournament_id = ?', 
      [resolvedParams.id]
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}