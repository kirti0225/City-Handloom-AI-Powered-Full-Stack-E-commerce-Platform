import { NextRequest } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import jwt from 'jsonwebtoken'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

function getUserFromRequest(req: NextRequest) {
  try {
    const cookie = req.cookies.get('token')?.value
    if (!cookie) return null
    return jwt.verify(cookie, process.env.JWT_SECRET!) as { id: string; role: string }
  } catch { return null }
}

export async function POST(req: NextRequest) {
  try {
    const tokenUser = getUserFromRequest(req)
    if (!tokenUser || tokenUser.role !== 'admin') {
      return errorResponse('Unauthorized', 401)
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return errorResponse('No file provided')

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'city-handloom/products', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return successResponse({ url: result.secure_url, publicId: result.public_id })
  } catch (error: any) {
    return errorResponse(`Upload failed: ${error.message}`, 500)
  }
}
