import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  // User cancelled
  if (error) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!code) {
    // Step 1 — Redirect to Google
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id',     process.env.GOOGLE_CLIENT_ID!)
    googleAuthUrl.searchParams.set('redirect_uri',  `${process.env.NEXTAUTH_URL}/api/auth/google`)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope',         'openid email profile')
    googleAuthUrl.searchParams.set('access_type',   'offline')
    return NextResponse.redirect(googleAuthUrl.toString())
  }

  try {
    // Step 2 — Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri:  `${process.env.NEXTAUTH_URL}/api/auth/google`,
        grant_type:    'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      return NextResponse.redirect(new URL('/login?error=google_failed', req.url))
    }

    // Step 3 — Get user info from Google
    const userRes  = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const googleUser = await userRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', req.url))
    }

    // Step 4 — Find or create user in MongoDB
    await connectDB()
    let user = await (User as any).findOne({ email: googleUser.email.toLowerCase() })

    if (!user) {
      user = await (User as any).create({
        name:     googleUser.name || googleUser.email.split('@')[0],
        email:    googleUser.email.toLowerCase(),
        password: 'google-' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        role:     'customer',
        avatar:   googleUser.picture || '',
      })
    }

    // Step 5 — Create your JWT token (same as regular login)
    const jwtToken = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Step 6 — Redirect to success page with cookie set
    const response = NextResponse.redirect(
      new URL('/google-auth-success', req.url)
    )

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    })

    return response
  } catch (err: any) {
    console.error('Google OAuth error:', err)
    return NextResponse.redirect(new URL('/login?error=server_error', req.url))
  }
}