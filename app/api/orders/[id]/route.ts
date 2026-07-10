import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'

function getUserFromRequest(req: NextRequest) {
  try {
    const cookie = req.cookies.get('token')?.value
    if (!cookie) return null
    return jwt.verify(cookie, process.env.JWT_SECRET!) as { id: string; role: string }
  } catch { return null }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await context.params
const order = await Order.findOne({ _id: id, user: tokenUser.id } as any)
    if (!order) return errorResponse('Order not found', 404)

    return successResponse(order)
  } catch (error) {
    return errorResponse('Failed to fetch order', 500)
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await context.params
    const { status, cancelReason } = await req.json()

const order = await Order.findOne({ _id: id, user: tokenUser.id } as any)
    if (!order) return errorResponse('Order not found', 404)

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return errorResponse('Cannot update this order', 400)
    }

    order.status = status
    if (cancelReason) order.cancelReason = cancelReason
    await order.save()

    return successResponse(order, 'Order updated')
  } catch (error) {
    return errorResponse('Failed to update order', 500)
  }
}