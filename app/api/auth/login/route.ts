import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    if (!email || !password) {
      return errorResponse('Email and password are required')
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !user.password) {
      return errorResponse('Invalid email or password', 401)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return errorResponse('Invalid email or password', 401)
    }

    const token = signToken({ id: user._id.toString(), role: user.role })

    const response = successResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    }, 'Login successful')

    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse('Server error. Please try again.', 500)
  }
}
