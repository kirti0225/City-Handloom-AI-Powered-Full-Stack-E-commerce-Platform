import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { phone } = await req.json()

    if (!phone) return errorResponse('Phone number is required')

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await User.findOneAndUpdate(
      { phone },
      { otp, otpExpiry },
      { upsert: true, new: true }
    )

    // Send OTP via Fast2SMS
    if (process.env.FAST2SMS_API_KEY) {
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: phone,
        }),
      })
    }

    // In development, return OTP in response for testing
    const isDev = process.env.NODE_ENV === 'development'
    return successResponse(
      isDev ? { otp } : null,
      'OTP sent successfully'
    )
  } catch (error) {
    return errorResponse('Failed to send OTP', 500)
  }
}
