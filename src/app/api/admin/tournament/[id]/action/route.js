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
    const tid = resolvedParams.id;
    const { action } = await req.json();

    if (action === 'complete') {
      await pool.query('UPDATE tournaments SET status = "completed" WHERE id = ?', [tid]);
      return NextResponse.json({ message: 'Tournament marked as completed' });
    }

    if (action === 'generate') {
      // Get approved players
      const [players] = await pool.query(
        'SELECT user_id FROM registrations WHERE tournament_id = ? AND status = "approved"', [tid]
      );
      if (players.length < 2) return NextResponse.json({ error: 'Need at least 2 approved players' }, { status: 400 });

      const ids = players.map(p => p.user_id);
      // Shuffle
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      
      // Insert matches
      for (let i = 0; i < ids.length; i += 2) {
        await pool.query(
          'INSERT INTO matches (tournament_id, round, player1_id, player2_id) VALUES (?,?,?,?)',
          [tid, 1, ids[i], ids[i + 1] || null]
        );
      }
      await pool.query('UPDATE tournaments SET status = "ongoing" WHERE id = ?', [tid]);
      return NextResponse.json({ message: 'Bracket generated' });
    }

    if (action === 'advance') {
      const [all] = await pool.query('SELECT * FROM matches WHERE tournament_id = ? ORDER BY round', [tid]);
      if (all.length === 0) return NextResponse.json({ error: 'No matches' }, { status: 400 });
      
      const currentRound = Math.max(...all.map(m => m.round));
      const current = all.filter(m => m.round === currentRound);

      // Auto-resolve byes
      for (const m of current) {
        if (m.status !== 'completed' && (!m.player1_id || !m.player2_id)) {
          const lone = m.player1_id || m.player2_id;
          await pool.query('UPDATE matches SET winner_id = ?, status = "completed" WHERE id = ?', [lone, m.id]);
          m.winner_id = lone; m.status = 'completed';
        }
      }

      if (current.some(m => m.status !== 'completed')) {
        return NextResponse.json({ error: 'Not all matches in current round are completed' }, { status: 400 });
      }

      const winners = current.map(m => m.winner_id).filter(Boolean);
      if (winners.length === 1) {
        await pool.query('UPDATE tournaments SET status = "completed" WHERE id = ?', [tid]);
        return NextResponse.json({ message: 'Tournament completed', champion_id: winners[0] });
      }

      // Shuffle winners
      for (let i = winners.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [winners[i], winners[j]] = [winners[j], winners[i]];
      }

      const nextRound = currentRound + 1;
      for (let i = 0; i < winners.length; i += 2) {
        await pool.query(
          'INSERT INTO matches (tournament_id, round, player1_id, player2_id) VALUES (?,?,?,?)',
          [tid, nextRound, winners[i], winners[i + 1] || null]
        );
      }
      return NextResponse.json({ message: 'Advanced to round ' + nextRound });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}