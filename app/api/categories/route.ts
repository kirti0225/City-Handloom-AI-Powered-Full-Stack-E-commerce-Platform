import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/lib/models/Category'
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

export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 })
    return successResponse(categories)
  } catch {
    return errorResponse('Failed to fetch categories', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)
    await connectDB()
    const { name, description, image, order } = await req.json()
    if (!name) return errorResponse('Name is required', 400)
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const existing = await Category.findOne({ slug })
    if (existing) return errorResponse('Category already exists', 400)
    const category = await Category.create({ name, slug, description, image, order: order || 0 })
    return successResponse(category, 'Category created', 201)
  } catch {
    return errorResponse('Failed to create category', 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)
    await connectDB()
    const { id, ...updates } = await req.json()
    const category = await Category.findByIdAndUpdate(id, updates, { new: true })
    if (!category) return errorResponse('Category not found', 404)
    return successResponse(category, 'Category updated')
  } catch {
    return errorResponse('Failed to update category', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)
    await connectDB()
    const { id } = await req.json()
    await Category.findByIdAndDelete(id)
    return successResponse(null, 'Category deleted')
  } catch {
    return errorResponse('Failed to delete category', 500)
  }
}
