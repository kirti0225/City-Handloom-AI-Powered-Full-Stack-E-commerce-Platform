import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    if (!token) return errorResponse('No token provided', 400)

    await connectDB()
    const user = await (User as any).findOne({
      resetToken:       token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) return errorResponse('Token expired or invalid', 400)
    return successResponse(null, 'Token valid')
  } catch {
    return errorResponse('Verification failed', 500)
  }
}