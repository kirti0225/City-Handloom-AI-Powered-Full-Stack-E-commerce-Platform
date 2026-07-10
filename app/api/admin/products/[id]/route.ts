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

const product = await (Product as any).findByIdAndUpdate(id, body, { new: true })
    if (!product) return errorResponse('Product not found', 404)

    return successResponse(product, 'Product updated')
  } catch (error) {
    return errorResponse('Failed to update product', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { id } = await context.params
    await (Product as any).findByIdAndDelete(id)
    return successResponse(null, 'Product deleted')
  } catch (error) {
    return errorResponse('Failed to delete product', 500)
  }
}