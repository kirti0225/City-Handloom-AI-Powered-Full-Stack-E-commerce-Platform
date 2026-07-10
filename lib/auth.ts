import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

import jwt, { SignOptions } from 'jsonwebtoken'

export function signToken(payload: { id: string; role: string }) {
  const options: SignOptions = {
    expiresIn: '7d',
  }

  return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string }
  } catch {
    return null
  }
}

export function getUserFromRequest(req: NextRequest) {
  try {
    const cookie = req.cookies.get('token')?.value
    if (!cookie) return null
    return jwt.verify(cookie, JWT_SECRET) as { id: string; role: string }
  } catch {
    return null
  }
}

export async function requireAuth(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return { error: Response.json({ success: false, message: 'Unauthorized' }, { status: 401 }), user: null }
  }
  return { error: null, user }
}

export async function requireAdmin(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return { error: Response.json({ success: false, message: 'Unauthorized' }, { status: 401 }), user: null }
  }
  if (user.role !== 'admin') {
    return { error: Response.json({ success: false, message: 'Forbidden' }, { status: 403 }), user: null }
  }
  return { error: null, user }
}