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
    const [tid, uid] = resolvedParams.key.split('_');
    await pool.query(
      'UPDATE registrations SET status = "approved" WHERE tournament_id = ? AND user_id = ?',
      [tid, uid]
    );
    return NextResponse.json({ message: 'Registration approved' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to approve' }, { status: 500 });
  }
}