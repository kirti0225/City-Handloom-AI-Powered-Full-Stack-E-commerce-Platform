import { successResponse } from '@/lib/utils/apiResponse'

export async function POST() {
  const response = successResponse(null, 'Logged out successfully')
  response.headers.set('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict')
  return response
}
