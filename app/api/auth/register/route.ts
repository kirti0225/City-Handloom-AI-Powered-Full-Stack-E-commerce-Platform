import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return errorResponse('Name, email and password are required')
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters')
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return errorResponse('Email already registered. Please login.', 409)
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      isVerified: false,
    })

    const token = signToken({ id: user._id.toString(), role: user.role })

    const response = successResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }, 'Account created successfully', 201)

    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)

    return response
  } catch (error: any) {
    console.error('Register error:', error)
    return errorResponse('Server error. Please try again.', 500)
  }
}
