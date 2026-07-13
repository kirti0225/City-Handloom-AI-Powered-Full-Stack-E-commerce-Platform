import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    })

    await transporter.verify()

    await transporter.sendMail({
      from: `"City Handloom" <${process.env.GMAIL_USER}>`,
      to:   process.env.GMAIL_USER,
      subject: 'Test Email from City Handloom',
      html: '<h2>Email is working!</h2><p>Your email setup is correct.</p>',
    })

    return successResponse(null, 'Test email sent! Check your inbox in 1-2 minutes.')
  } catch (err: any) {
    return errorResponse('Email failed: ' + err.message, 500)
  }
}