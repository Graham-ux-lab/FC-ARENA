import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  // Get all approved users
  const [users] = await pool.query('SELECT id, username, ea_id, platform FROM users WHERE status = "approved"');

  const leaderboard = [];

  for (const u of users) {
    // 1. Matches played
    const [matches] = await pool.query(
      'SELECT id, winner_id FROM matches WHERE (player1_id = ? OR player2_id = ?) AND status = "completed"',
      [u.id, u.id]
    );

    const played = matches.length;
    let wins = 0;
    
    for (const m of matches) {
      if (m.winner_id === u.id) wins++;
    }
    const losses = played - wins;

    // 2. Tournaments won (check if user is the winner of the final match in a completed tournament)
    const [trophies] = await pool.query(
      'SELECT COUNT(*) as c FROM matches m ' +
      'JOIN tournaments t ON m.tournament_id = t.id ' +
      'WHERE m.winner_id = ? AND t.status = "completed" ' +
      'AND m.round = (SELECT MAX(round) FROM matches m2 WHERE m2.tournament_id = m.tournament_id)',
      [u.id]
    );
    const trophyCount = trophies[0].c;

    // 3. Points Math
    // Wins: 3 pts. Losses: 1 pt. Trophy: +15 pts.
    const points = (wins * 3) + (losses * 1) + (trophyCount * 15);
    const win_pct = played > 0 ? Math.round((wins / played) * 100) : 0;

    leaderboard.push({
      id: u.id,
      username: u.username,
      ea_id: u.ea_id,
      platform: u.platform,
      played,
      wins,
      losses,
      win_pct,
      trophies: trophyCount,
      points
    });
  }

  // Sort by Points descending, then by Wins descending
  leaderboard.sort((a, b) => b.points - a.points || b.wins - a.wins);

  // Filter out users who have never played a match to keep the table clean
  const activePlayers = leaderboard.filter(p => p.played > 0);

  return NextResponse.json(activePlayers);
}