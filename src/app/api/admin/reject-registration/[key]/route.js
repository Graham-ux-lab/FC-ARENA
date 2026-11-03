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
    
    // Instead of deleting, we set status to 'rejected' so we keep a record
    // (Alternatively, change to DELETE FROM registrations)
    const [result] = await pool.query(
      'UPDATE registrations SET status = ? WHERE tournament_id = ? AND user_id = ?',
      ['rejected', tid, uid]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Registration rejected' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to reject' }, { status: 500 });
  }
}