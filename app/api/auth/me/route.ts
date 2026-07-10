import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('token')?.value
    if (!cookie) return errorResponse('Unauthorized', 401)
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET!) as { id: string }
    await connectDB()
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return errorResponse('User not found', 404)
    return successResponse(user)
  } catch {
    return errorResponse('Unauthorized', 401)
  }
}
