import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '8')

    const query: any = { isActive: true }
    if (category) query.category = category
    if (productId) query._id = { $ne: productId }

    const products = await Product.find(query)
      .sort({ sold: -1, rating: -1 })
      .limit(limit)

    return successResponse(products)
  } catch (error) {
    return errorResponse('Failed to fetch recommendations', 500)
  }
}
