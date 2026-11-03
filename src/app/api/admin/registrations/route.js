import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

    const [rows] = await pool.query(
      'SELECT r.tournament_id, r.user_id, r.status, ' +
      'u.username, u.email, ' +
      't.name AS tournament_name ' +
      'FROM registrations r ' +
      'JOIN users u ON r.user_id = u.id ' +
      'JOIN tournaments t ON r.tournament_id = t.id ' +
      'WHERE r.status = "pending"'
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}