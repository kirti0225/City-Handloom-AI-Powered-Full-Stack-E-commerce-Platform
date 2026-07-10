import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

export async function sendOrderConfirmationEmail({
  to, name, orderId, items, total, address,
}: {
  to: string
  name: string
  orderId: string
  items: any[]
  total: number
  address: any
}) {
  const itemsList = items.map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #f5d5c8">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #f5d5c8;text-align:center">${item.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #f5d5c8;text-align:right">₹${(item.price * item.qty).toLocaleString()}</td>
    </tr>`
  ).join('')

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff">
      <div style="background:#3D2B1F;padding:30px;text-align:center">
        <h1 style="color:#D4AF37;font-size:28px;margin:0">City Handloom</h1>
        <p style="color:#FDF0EC;margin:8px 0 0;font-size:14px">Your order is confirmed!</p>
      </div>
      <div style="padding:30px">
        <p style="font-size:16px;color:#3D2B1F">Dear ${name},</p>
        <p style="color:#666;font-size:14px;line-height:1.6">
          Thank you for your order. We've received your order and will start processing it right away.
        </p>
        <div style="background:#FDF0EC;padding:15px;border-radius:8px;margin:20px 0">
          <p style="margin:0;font-size:14px;color:#3D2B1F">
            <strong>Order ID:</strong> #${orderId?.slice(-8).toUpperCase()}<br>
            <strong>Delivery to:</strong> ${address?.name}, ${address?.city}, ${address?.pin}
          </p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <thead>
            <tr style="background:#f5d5c8">
              <th style="padding:10px;text-align:left;font-size:12px">Product</th>
              <th style="padding:10px;text-align:center;font-size:12px">Qty</th>
              <th style="padding:10px;text-align:right;font-size:12px">Price</th>
            </tr>
          </thead>
          <tbody>${itemsList}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:10px;font-weight:bold;font-size:14px">Total</td>
              <td style="padding:10px;text-align:right;font-weight:bold;font-size:14px;color:#3D2B1F">₹${total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <p style="color:#666;font-size:13px">
          You can track your order at <a href="https://cityhandloom.com/track" style="color:#D4AF37">cityhandloom.com/track</a>
        </p>
      </div>
      <div style="background:#FDF0EC;padding:20px;text-align:center">
        <p style="color:#666;font-size:12px;margin:0">
          Questions? Email us at hello@cityhandloom.com or call +91 98765 43210
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"City Handloom" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Order Confirmed! #${orderId?.slice(-8).toUpperCase()} — City Handloom`,
    html,
  })
}

export async function sendPasswordResetEmail({
  to, name, resetLink,
}: {
  to: string
  name: string
  resetLink: string
}) {
  const html = `
    <div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;background:#fff">
      <div style="background:#3D2B1F;padding:24px;text-align:center">
        <h1 style="color:#D4AF37;font-size:24px;margin:0">City Handloom</h1>
      </div>
      <div style="padding:30px">
        <p style="font-size:16px;color:#3D2B1F">Hi ${name || 'there'},</p>
        <p style="color:#666;font-size:14px">
          We received a request to reset your password. Click the button below to reset it.
          This link expires in 1 hour.
        </p>
        <div style="text-align:center;margin:28px 0">
          <a href="${resetLink}"
            style="background:#D4AF37;color:#3D2B1F;padding:12px 28px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px">
            Reset Password
          </a>
        </div>
        <p style="color:#999;font-size:12px">
          If you didn't request this, ignore this email. Your password won't change.
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"City Handloom" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Reset your City Handloom password',
    html,
  })
}

export async function sendShippingUpdateEmail({
  to, name, orderId, status, trackingNumber,
}: {
  to: string
  name: string
  orderId: string
  status: string
  trackingNumber?: string
}) {
  const statusMessages: Record<string, string> = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    packed: 'Your order has been packed and is ready for pickup.',
    shipped: `Your order is on its way! ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
    delivered: 'Your order has been delivered. We hope you love it!',
  }

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff">
      <div style="background:#3D2B1F;padding:30px;text-align:center">
        <h1 style="color:#D4AF37;font-size:28px;margin:0">City Handloom</h1>
        <p style="color:#FDF0EC;margin:8px 0 0;font-size:14px">Order Update</p>
      </div>
      <div style="padding:30px">
        <p style="font-size:16px;color:#3D2B1F">Hi ${name},</p>
        <p style="color:#666;font-size:14px;line-height:1.6">
          Your order <strong>#${orderId?.slice(-8).toUpperCase()}</strong> status has been updated.
        </p>
        <div style="background:#FDF0EC;padding:20px;border-radius:8px;margin:20px 0;text-align:center">
          <p style="font-size:20px;font-weight:bold;color:#3D2B1F;margin:0 0 8px;text-transform:capitalize">${status}</p>
          <p style="color:#666;font-size:14px;margin:0">${statusMessages[status] || 'Your order status has been updated.'}</p>
        </div>
        <a href="https://cityhandloom.com/track" style="display:block;background:#D4AF37;color:#3D2B1F;text-align:center;padding:12px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px">
          Track Your Order
        </a>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"City Handloom" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Order ${status.charAt(0).toUpperCase() + status.slice(1)} — #${orderId?.slice(-8).toUpperCase()}`,
    html,
  })
}