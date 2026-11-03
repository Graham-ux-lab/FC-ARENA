import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    const [rows] = await pool.query(
      'SELECT r.tournament_id, r.status, t.name, t.status AS tournament_status ' +
      'FROM registrations r JOIN tournaments t ON r.tournament_id = t.id ' +
      'WHERE r.user_id = ?',
      [decoded.id]
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}