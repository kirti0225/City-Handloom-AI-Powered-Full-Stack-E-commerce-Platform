import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Banner from '@/lib/models/Banner'
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

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const section = searchParams.get('section')
    const query = section ? { section, isActive: true } : { isActive: true }
const banners = await (Banner as any).find(query).sort({ order: 1 })
    return successResponse(banners)
  } catch {
    return errorResponse('Failed to fetch banners', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)
    await connectDB()
    const body = await req.json()
    const banner = await Banner.create(body)
    return successResponse(banner, 'Banner created', 201)
  } catch {
    return errorResponse('Failed to create banner', 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)
    await connectDB()
    const { id, ...updates } = await req.json()
const banner = await (Banner as any).findByIdAndUpdate(id, updates, { new: true })
    return successResponse(banner, 'Banner updated')
  } catch {
    return errorResponse('Failed to update banner', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req)
    if (!admin) return errorResponse('Unauthorized', 401)
    await connectDB()
    const { id } = await req.json()
    // Change line 61 to this:
await (Banner as any).findByIdAndDelete(id)
    return successResponse(null, 'Banner deleted')
  } catch {
    return errorResponse('Failed to delete banner', 500)
  }
}
