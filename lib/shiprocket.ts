const SHIPROCKET_EMAIL    = process.env.SHIPROCKET_EMAIL!
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD!

let token: string | null = null
let tokenExpiry: number  = 0

async function getToken(): Promise<string> {
  if (token && Date.now() < tokenExpiry) return token
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }),
  })
  const data = await res.json()
  token       = data.token
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000 // 9 days
  return token!
}

export async function createShiprocketOrder(order: any) {
  const t   = await getToken()
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
    body: JSON.stringify({
      order_id:          order._id.toString(),
      order_date:        new Date().toISOString().split('T')[0],
      pickup_location:   'Primary',
      channel_id:        '',
      comment:           'City Handloom Order',
      billing_customer_name:  order.shippingAddress.name,
      billing_last_name:      '',
      billing_address:        order.shippingAddress.address,
      billing_city:           order.shippingAddress.city,
      billing_pincode:        order.shippingAddress.pin,
      billing_state:          order.shippingAddress.state,
      billing_country:        'India',
      billing_email:          order.userEmail || 'customer@cityhandloom.com',
      billing_phone:          order.shippingAddress.phone,
      shipping_is_billing:    true,
      order_items: order.items.map((item: any) => ({
        name:         item.name,
        sku:          item.id || item._id,
        units:        item.qty,
        selling_price: item.price,
        discount:     0,
        tax:          0,
        hsn:          0,
      })),
      payment_method:  order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
      sub_total:       order.subtotal,
      length:          10,
      breadth:         10,
      height:          5,
      weight:          0.5,
    }),
  })
  return res.json()
}

export async function trackShiprocketOrder(orderId: string) {
  const t   = await getToken()
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`,
    { headers: { Authorization: `Bearer ${t}` } }
  )
  return res.json()
}

export async function getPincodeDetails(pincode: string) {
  const t   = await getToken()
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/open/postcode/details?postcode=${pincode}`,
    { headers: { Authorization: `Bearer ${t}` } }
  )
  return res.json()
}