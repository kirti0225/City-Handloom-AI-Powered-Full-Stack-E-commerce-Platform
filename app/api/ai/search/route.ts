import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { query } = await req.json()

    if (!query) return errorResponse('Search query is required')

    // Parse query with OpenAI if API key exists
    let filters: any = { isActive: true }
    let aiChips: { label: string; value: string }[] = []

    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.OPENAI_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `Parse this product search query and extract filters as JSON only, no explanation:
Query: "${query}"
Return JSON with these optional fields: category (bedsheets/quilts/pillows/curtains/towels), material (Cotton/Silk/Linen), maxPrice (number), minPrice (number), size (Single/Double/Queen/King).
Example: {"category":"bedsheets","material":"Cotton","maxPrice":2000}`,
          }],
        }),
      })

      const aiData = await response.json()
      const content = aiData.content?.[0]?.text || '{}'

      try {
        const parsed = JSON.parse(content)
        if (parsed.category) {
          filters.category = parsed.category
          aiChips.push({ label: 'Category', value: parsed.category })
        }
        if (parsed.material) {
          filters.material = new RegExp(parsed.material, 'i')
          aiChips.push({ label: 'Material', value: parsed.material })
        }
        if (parsed.maxPrice) {
          filters.price = { ...filters.price, $lte: parsed.maxPrice }
          aiChips.push({ label: 'Price', value: `Under ₹${parsed.maxPrice.toLocaleString()}` })
        }
        if (parsed.minPrice) {
          filters.price = { ...filters.price, $gte: parsed.minPrice }
        }
        if (parsed.size) {
          aiChips.push({ label: 'Size', value: parsed.size })
        }
      } catch { }
    }

    // Also do text search
    const q = query.toLowerCase()
    const categories = ['bedsheets', 'quilts', 'pillows', 'curtains', 'towels']
    const matchedCat = categories.find(c => q.includes(c.slice(0, -1)) || q.includes(c))
    if (matchedCat && !filters.category) filters.category = matchedCat

    const products = await Product.find(filters).limit(20)

    return successResponse({ products, aiChips })
  } catch (error) {
    return errorResponse('Search failed', 500)
  }
}
