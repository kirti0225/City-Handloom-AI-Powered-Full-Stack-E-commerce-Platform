import { NextRequest } from 'next/server'
import Razorpay from 'razorpay'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { getUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
  try {
     const tokenUser = getUserFromRequest(req)
if (!tokenUser) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { orderId } = await req.json()
const order = await Order.findOne({
  _id: orderId,
  user: tokenUser?.id
} as any)
    if (!order) return errorResponse('Order not found', 404)

    const razorpayOrder = await razorpay.orders.create({
      amount: order.total * 100, // paise
      currency: 'INR',
      receipt: order._id.toString(),
    })

    order.razorpayOrderId = razorpayOrder.id
    await order.save()

    return successResponse({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    return errorResponse('Failed to create payment order', 500)
  }
}
