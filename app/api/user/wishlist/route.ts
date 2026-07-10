import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'

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
    const user = await User.findById(tokenUser.id).populate('wishlist')
    if (!user) return errorResponse('User not found', 404)

    return successResponse(user.wishlist || [])
  } catch (error) {
    return errorResponse('Failed to fetch wishlist', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser) return errorResponse('Unauthorized', 401)

    await connectDB()
    const { productId } = await req.json()

console.log('tokenUser =', tokenUser)

const user = await User.findById(tokenUser.id)

console.log('user =', user)

if (!user) return errorResponse('User not found', 404)

    const index = user.wishlist.findIndex(
      (id: any) => id.toString() === productId
    )
    const isWishlisted = index > -1

    if (isWishlisted) {
      user.wishlist.splice(index, 1)
    } else {
      user.wishlist.push(productId)
    }
    await user.save()

    return successResponse({
      wishlisted: !isWishlisted,
      wishlist: user.wishlist,
    }, isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  } catch (error: any) {
    console.error('Wishlist error:', error)
    return errorResponse('Failed to update wishlist', 500)
  }
}
