import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function DELETE(req, { params }) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });

    const p = await params;
    await pool.query('DELETE FROM tournaments WHERE id = ?', [p.id]);
    return NextResponse.json({ message: 'Tournament deleted' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}