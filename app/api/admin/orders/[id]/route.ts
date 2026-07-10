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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await context.params
    const body = await req.json()
    const { status, trackingNumber, courier } = body

    const updateData: any = {
      status,
      ...(trackingNumber && { trackingNumber }),
      ...(courier && { courier }),
      ...(status === 'delivered' && { deliveredAt: new Date() }),
    }

    const order = await (Order as any).findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    if (!order) return errorResponse('Order not found', 404)
    return successResponse(order, 'Order status updated')
  } catch (error) {
    return errorResponse('Failed to update order', 500)
  }
}