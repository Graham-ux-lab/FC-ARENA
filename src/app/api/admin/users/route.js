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
      'SELECT id, username, email, ea_id, platform, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}