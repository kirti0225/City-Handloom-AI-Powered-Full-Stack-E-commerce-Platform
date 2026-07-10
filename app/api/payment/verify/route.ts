import { NextRequest } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { getUserFromRequest } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function POST(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
if (!tokenUser) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = await req.json()

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpaySignature) {
      return errorResponse('Payment verification failed', 400)
    }

    // Update order
const order = await (Order as any).findOneAndUpdate(
    { _id: orderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        paymentStatus: 'paid',
        status: 'confirmed',
      },
      { new: true }
    )

    if (!order) return errorResponse('Order not found', 404)

    return successResponse(order, 'Payment verified successfully')
  } catch (error) {
    return errorResponse('Payment verification failed', 500)
  }
}
