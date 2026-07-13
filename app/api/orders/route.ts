import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import Product from '@/lib/models/Product'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'
import { sendOrderConfirmationEmail } from '@/lib/email'
import User from '@/lib/models/User'

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

export async function GET(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)

    await connectDB()
const orders = await (Order as any).find({ user: tokenUser.id }).sort({ createdAt: -1 })
    return successResponse(orders)
  } catch (error) {
    return errorResponse('Failed to fetch orders', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)

    await connectDB()
    const body = await req.json()
    const { items, shippingAddress, paymentMethod } = body

    if (!items?.length || !shippingAddress || !paymentMethod) {
      return errorResponse('Missing required fields')
    }

    let subtotal = 0
    const orderItems = []

    for (const item of items) {
const product = await (Product as any).findById(item.productId)
      if (!product) return errorResponse(`Product not found: ${item.productId}`)
      if (product.stock < item.qty) {
        return errorResponse(`Insufficient stock for ${product.name}`)
      }
      subtotal += product.price * item.qty
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        qty: item.qty,
        size: item.size,
        color: item.color,
      })
    }

    const deliveryFee = subtotal >= 999 ? 0 : 99
    const total = subtotal + deliveryFee

    const order = await (Order as any).create({
      user: tokenUser.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      paymentStatus: 'pending',
      status: 'placed',
    })

try {
  const userDoc = await (User as any).findById(tokenUser.id)
  if (userDoc?.email) {
    await sendOrderConfirmationEmail({
      to:      userDoc.email,
      name:    userDoc.name,
      orderId: order._id.toString(),
      items:   orderItems,
      total:   order.total,
      address: shippingAddress,
    })
    console.log('✅ Order email sent to:', userDoc.email)
  }
} catch (emailErr) {
  console.error('❌ Email failed (non-critical):', emailErr)
}

    try {
      const userDoc = await User.findById(tokenUser.id)
      if (userDoc?.email) {
        await sendOrderConfirmationEmail({
          to: userDoc.email,
          name: userDoc.name,
          orderId: order._id.toString(),
          items: orderItems,
          total: order.total,
          address: shippingAddress,
        })
      }
    } catch (emailErr) {
      console.error('Email send failed (non-critical):', emailErr)
    }

    for (const item of items) {
await (Product as any).findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.qty, sold: item.qty }
      })
    }

    return successResponse(order, 'Order placed successfully', 201)
  } catch (error: any) {
    console.error('Create order error:', error)
    return errorResponse('Failed to create order', 500)
  }
}
