import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
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

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)

    await connectDB()
    const body = await req.json()

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const existing = await Product.findOne({ slug } as any)
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const product = await Product.create({ ...body, slug: finalSlug })
    return successResponse(product, 'Product created', 201)
  } catch (error: any) {
    return errorResponse(`Failed to create product: ${error.message}`, 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)

    await connectDB()
const products = await (Product as any).find({}).sort({ createdAt: -1 })
    return successResponse(products)
  } catch (error) {
    return errorResponse('Failed to fetch products', 500)
  }
}
