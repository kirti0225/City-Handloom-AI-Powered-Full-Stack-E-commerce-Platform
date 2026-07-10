import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email } = await req.json()
    if (!email) return errorResponse('Email is required', 400)

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (user) {
      // Generate a simple reset token
      const resetToken = crypto.randomBytes(32).toString('hex')

      // Save token to user (add these fields to User model if not present)
      user.resetToken       = resetToken
      user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      await user.save()

      const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

      try {
        await sendPasswordResetEmail({
          to:   user.email,
          name: user.name,
          resetLink,
        })
      } catch (emailErr) {
        console.error('Reset email failed:', emailErr)
      }
    }

    // Always return success (don't reveal if email exists)
    return successResponse(null, 'If this email is registered, a reset link has been sent')
  } catch (error: any) {
    return errorResponse('Failed to process request', 500)
  }
}
