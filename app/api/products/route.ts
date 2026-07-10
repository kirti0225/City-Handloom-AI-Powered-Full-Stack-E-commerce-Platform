import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const featured = searchParams.get('featured')

    const query: any = { isActive: true }
// In GET handler, add these query params:
const bestSellers   = searchParams.get('bestSellers')
const trending      = searchParams.get('trending')
const newArrivals   = searchParams.get('newArrivals')

if (bestSellers === 'true') query.showInBestSellers = true
if (trending === 'true')    query.showInTrending    = true
if (newArrivals === 'true') query.showInNewArrivals = true
    if (category) query.category = category
    if (featured === 'true') query.isFeatured = true
    if (search) {
      query.$text = { $search: search }
    }
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseInt(minPrice)
      if (maxPrice) query.price.$lte = parseInt(maxPrice)
    }

    const sortOptions: any = {}
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limit),
      Product.countDocuments(query),
    ])

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return errorResponse('Failed to fetch products', 500)
  }
}
