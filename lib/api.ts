const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',  // ← this MUST be here
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  // Auth
 register: (body: { name: string; email: string; phone: string; password: string }) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  logout: () => request('/api/auth/logout', { method: 'POST' }),
   getProfile: () => request('/api/auth/me'),
  sendOtp: (phone: string) => request('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone: string, otp: string) => request('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),

  // Admin
  
adminGetProducts: () => request('/api/admin/products'),
adminCreateProduct: (body: any) => request('/api/admin/products', { method: 'POST', body: JSON.stringify(body) }),
adminUpdateProduct: (id: string, body: any) => request(`/api/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
adminDeleteProduct: (id: string) => request(`/api/admin/products/${id}`, { method: 'DELETE' }),
adminGetOrders: () => request('/api/admin/orders'),
adminUpdateOrder: (id: string, body: any) => request(`/api/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
uploadImage: async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: formData, credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Upload failed')
  return data
},

getCategories: () => request('/api/categories'),
createCategory: (body: any) => request('/api/categories', { method: 'POST', body: JSON.stringify(body) }),
updateCategory: (body: any) => request('/api/categories', { method: 'PATCH', body: JSON.stringify(body) }),
deleteCategory: (id: string) => request('/api/categories', { method: 'DELETE', body: JSON.stringify({ id }) }),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/api/products${query}`)
  },
  getProduct: (id: string) => request(`/api/products/${id}`),

  // Orders
  getOrders: () => request('/api/orders'),
  createOrder: (body: any) => request('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
getOrder: (id: string) => request(`/api/orders/${id}`),
cancelOrder: (id: string, reason: string) => request(`/api/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'cancelled', cancelReason: reason }) }),

  // Payment
  createPaymentOrder: (orderId: string) => request('/api/payment/create-order', { method: 'POST', body: JSON.stringify({ orderId }) }),
  verifyPayment: (body: any) => request('/api/payment/verify', { method: 'POST', body: JSON.stringify(body) }),

  // AI
  aiSearch: (query: string) => request('/api/ai/search', { method: 'POST', body: JSON.stringify({ query }) }),
  getRecommendations: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/api/ai/recommendations${query}`)
  },

  // Wishlist
  getWishlist: () => request('/api/user/wishlist'),
  toggleWishlist: (productId: string) => request('/api/user/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),

  // Profile
  updateProfile: (body: any) => request('/api/user/profile', { method: 'PUT', body: JSON.stringify(body) }),
 
getAddresses: () => request('/api/user/addresses'),
addAddress: (body: any) => request('/api/user/addresses', { method: 'POST', body: JSON.stringify(body) }),
deleteAddress: (addressId: string) => request('/api/user/addresses', { method: 'DELETE', body: JSON.stringify({ addressId }) }),
}