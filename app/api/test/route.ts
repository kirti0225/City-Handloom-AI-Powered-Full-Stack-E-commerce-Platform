import connectDB from '@/lib/mongodb'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function GET() {
  try {
    await connectDB()
    return successResponse({ connected: true }, 'MongoDB connected successfully! ✅')
  } catch (error: any) {
    return errorResponse(`MongoDB connection failed: ${error.message}`, 500)
  }
}
