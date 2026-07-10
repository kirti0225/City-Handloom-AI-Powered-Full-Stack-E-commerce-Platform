import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'

function getUserFromRequest(req: NextRequest) {
  try {
    const cookie = req.cookies.get('token')?.value
    if (!cookie) return null
    return jwt.verify(cookie, process.env.JWT_SECRET!) as { id: string }
  } catch { return null }
}

export async function GET(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)
    await connectDB()
    const user = await User.findById(tokenUser.id).select('addresses')
    return successResponse(user?.addresses || [])
  } catch { return errorResponse('Failed to fetch addresses', 500) }
}

export async function POST(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)
    await connectDB()
    const address = await req.json()
    const user = await User.findById(tokenUser.id)
    if (!user) return errorResponse('User not found', 404)
    if (address.isDefault) {
      user.addresses.forEach((a: any) => a.isDefault = false)
    }
    user.addresses.push(address)
    await user.save()
    return successResponse(user.addresses, 'Address added')
  } catch { return errorResponse('Failed to add address', 500) }
}

export async function DELETE(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)
    await connectDB()
    const { addressId } = await req.json()
    const user = await User.findById(tokenUser.id)
    if (!user) return errorResponse('User not found', 404)
    user.addresses = user.addresses.filter((a: any) => a._id.toString() !== addressId)
    await user.save()
    return successResponse(user.addresses, 'Address removed')
  } catch { return errorResponse('Failed to remove address', 500) }
}
