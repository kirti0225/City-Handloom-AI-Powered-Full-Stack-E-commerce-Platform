import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'

function getUserFromRequest(req: NextRequest) {
  try {
    const cookie = req.cookies.get('token')?.value
    if (!cookie) return null
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET!) as { id: string; role: string }
    return decoded
  } catch {
    return null
  }
}

export async function PUT(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)

    await connectDB()
    const body = await req.json()

    const user = await User.findByIdAndUpdate(
      tokenUser.id,
      { name: body.name, phone: body.phone },
      { new: true }
    ).select('-password -otp -otpExpiry')

    if (!user) return errorResponse('User not found', 404)
    return successResponse(user, 'Profile updated')
  } catch (error) {
    return errorResponse('Failed to update profile', 500)
  }
}
