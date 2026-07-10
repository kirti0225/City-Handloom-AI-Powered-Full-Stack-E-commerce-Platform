import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/lib/models/Category'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

const defaultCategories = [
  { name: 'Bedsheets',     slug: 'bedsheets', description: 'Pure cotton handloom bedsheets', order: 1 },
  { name: 'Quilts',        slug: 'quilts',    description: 'Soft quilts and blankets',       order: 2 },
  { name: 'Pillows',       slug: 'pillows',   description: 'Pillow covers and pillows',      order: 3 },
  { name: 'Curtains',      slug: 'curtains',  description: 'Handwoven curtains and drapes',  order: 4 },
  { name: 'Towels',        slug: 'towels',    description: 'Premium GSM towels',             order: 5 },
]

export async function GET() {
  try {
    await connectDB()
    for (const cat of defaultCategories) {
     
await (Category as any).findOneAndUpdate(
  { slug: cat.slug },
  cat,
  { upsert: true, new: true }
)
    }
    return successResponse(null, 'Categories seeded')
  } catch {
    return errorResponse('Failed to seed categories', 500)
  }
}
