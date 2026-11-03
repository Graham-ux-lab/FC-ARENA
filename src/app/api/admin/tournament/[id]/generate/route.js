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

    const p = await params;
    const { mode } = await req.json();

    const [players] = await pool.query(
      'SELECT r.user_id, u.username, ' +
      '(SELECT COUNT(*) FROM matches m WHERE m.winner_id = r.user_id) AS wins ' +
      'FROM registrations r JOIN users u ON r.user_id = u.id ' +
      'WHERE r.tournament_id = ? AND r.status = "approved"',
      [p.id]
    );

    if (players.length < 2) return NextResponse.json({ error: 'Need at least 2 approved players' }, { status: 400 });

    let ids;
    if (mode === 'seeded') {
      players.sort((a, b) => b.wins - a.wins);
      ids = players.map(p => p.user_id);
      const seeded = [];
      const half = Math.ceil(ids.length / 2);
      for (let i = 0; i < half; i++) {
        seeded.push(ids[i]);
        if (ids[ids.length - 1 - i]) seeded.push(ids[ids.length - 1 - i]);
      }
      ids = seeded;
    } else {
      ids = players.map(p => p.user_id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
    }

    await pool.query('DELETE FROM matches WHERE tournament_id = ?', [p.id]);

    for (let i = 0; i < ids.length; i += 2) {
      await pool.query(
        'INSERT INTO matches (tournament_id, round, player1_id, player2_id) VALUES (?,?,?,?)',
        [p.id, 1, ids[i], ids[i + 1] || null]
      );
    }
    await pool.query('UPDATE tournaments SET status = "ongoing" WHERE id = ?', [p.id]);

    return NextResponse.json({ message: 'Bracket generated (' + mode + ')' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed: ' + e.message }, { status: 500 });
  }
}