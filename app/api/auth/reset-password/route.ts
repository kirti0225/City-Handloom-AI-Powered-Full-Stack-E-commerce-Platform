import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return errorResponse('Token and password required', 400)
    if (password.length < 6) return errorResponse('Password too short', 400)

    await connectDB()
    const user = await (User as any).findOne({
      resetToken:       token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) return errorResponse('Reset link has expired. Please request a new one.', 400)

    // Hash new password
    const hashed = await bcrypt.hash(password, 10)
    user.password       = hashed
    user.resetToken     = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    return successResponse(null, 'Password reset successfully')
  } catch {
    return errorResponse('Reset failed', 500)
  }
}