import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { email, name, avatar } = await req.json()
    await connectDB()

    // Find or create user
    let user = await (User as any).findOne({ email: email.toLowerCase() })
    if (!user) {
      user = await (User as any).create({
        name,
        email:    email.toLowerCase(),
        password: 'google-' + Math.random().toString(36).slice(2),
        role:     'customer',
        avatar,
      })
    }

    // Create your own JWT token (same as regular login)
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Explicitly cast or type the response as NextResponse to access .cookies safely
    const response = successResponse(
      {
        user: {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          role:  user.role,
        }
      },
      'Google login successful'
    ) as NextResponse

    // Set the same cookie as regular login
    response.cookies.set('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   7 * 24 * 60 * 60,
      path:     '/',
    })

    return response
  } catch (err: any) {
    return errorResponse('Google login failed: ' + err.message, 500)
  }
}