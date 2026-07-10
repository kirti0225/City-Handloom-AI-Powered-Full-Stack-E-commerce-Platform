import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import Review from '@/lib/models/Review'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await context.params
    if (!id || id === 'undefined') return errorResponse('Product not found', 404)

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id)

    const product = isObjectId
     ? await Product.findOne({ _id: id, isActive: true } as any)
: await Product.findOne({ slug: id, isActive: true } as any)

    if (!product) return errorResponse('Product not found', 404)

const reviews = await Review.find({ product: product._id } as any)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10)

    return successResponse({ product, reviews })
  } catch (error: any) {
    console.error('Get product error:', error)
    return errorResponse('Failed to fetch product', 500)
  }
}