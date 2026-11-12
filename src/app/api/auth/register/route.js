import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function POST(req) {
  try {
    const { username, email, password, ea_id, platform } = await req.json();

    if (!username || !email || !password || !ea_id || !platform) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, ea_id, platform, status) VALUES (?,?,?,?,?,?)',
      [username, email, hash, ea_id, platform, 'approved']
    );

    // Fetch the newly inserted user to get their ID
    const [rows] = await pool.query('SELECT id, role FROM users WHERE email = ?', [email]);
    const newUser = rows[0];

    // Auto-login: sign a JWT immediately
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'secret');

    return NextResponse.json({ 
      message: 'Account created. Welcome!', 
      token 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}