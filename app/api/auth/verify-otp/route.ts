import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { phone, otp } = await req.json()

    if (!phone || !otp) return errorResponse('Phone and OTP are required')

    const user = await User.findOne({ phone }).select('+otp +otpExpiry')
    if (!user) return errorResponse('No account found with this phone number', 404)

    if (user.otp !== otp) return errorResponse('Invalid OTP', 401)

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return errorResponse('OTP has expired. Please request a new one.', 401)
    }

    // Clear OTP and mark verified
    user.otp = undefined
    user.otpExpiry = undefined
    user.isVerified = true
    await user.save()

    const token = signToken({ id: user._id.toString(), role: user.role })

    const response = successResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    }, 'OTP verified successfully')

    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`)

    return response
  } catch (error) {
    return errorResponse('Server error', 500)
  }
}
