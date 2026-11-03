import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET(req, { params }) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

    const p = await params;
    const [rows] = await pool.query(
      'SELECT e.*, u.username AS editor FROM match_edits e ' +
      'LEFT JOIN users u ON e.edited_by = u.id ' +
      'WHERE e.match_id = ? ORDER BY e.edited_at DESC',
      [p.id]
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}