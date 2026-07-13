import { NextRequest } from 'next/server'
import { getPincodeDetails } from '@/lib/shiprocket'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'

export async function GET(req: NextRequest) {
  try {
    const pin = req.nextUrl.searchParams.get('pin')
    if (!pin || pin.length !== 6) return errorResponse('Invalid pincode', 400)
    const data = await getPincodeDetails(pin)
    if (!data.postcode_details) return errorResponse('Pincode not found', 404)
    return successResponse({
      city:    data.postcode_details.city,
      state:   data.postcode_details.state,
      country: data.postcode_details.country,
      valid:   true,
    })
  } catch {
    return errorResponse('Failed to fetch pincode', 500)
  }
}