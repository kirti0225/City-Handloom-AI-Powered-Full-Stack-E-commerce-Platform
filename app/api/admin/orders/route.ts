import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'

function getAdminFromRequest(req: NextRequest) {
  try {
    const cookie = req.cookies.get('token')?.value
    if (!cookie) return null
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET!) as { id: string; role: string }
    return decoded.role === 'admin' ? decoded : null
  } catch { return null }
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)

    await connectDB()
    const orders = await (Order as any).find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(100)

    return successResponse(orders)
  } catch (error) {
    return errorResponse('Failed to fetch orders', 500)
  }
}
