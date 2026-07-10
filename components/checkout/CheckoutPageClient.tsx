'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { Check, CreditCard, Smartphone, Banknote } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14, mass: 1.2 }

const fromLeft = {
  hidden: { opacity: 0, x: -100, scale: 0.97 },
  visible: { opacity: 1, x: 0, scale: 1, transition: SPRING },
}

const fromRight = {
  hidden: { opacity: 0, x: 100, scale: 0.97 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { ...SPRING, delay: 0.15 } },
}

type PaymentMethod = 'card' | 'upi' | 'cod' | 'netbanking'
type DeliveryMethod = 'standard' | 'express'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPageClient() {
  const { items, total, clearCart } = useCartStore()
  const { user, isLoggedIn } = useAuthStore()
  const router = useRouter()

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi')
  const [agreed, setAgreed] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '', phone: '',
    country: 'India', city: '', address: '', postal: '',
  })

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [isLoggedIn, items, router])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const subtotal = total()
  const deliveryFee = deliveryMethod === 'express' ? 199 : (subtotal >= 999 ? 0 : 99)
  const discount = 0
  const grandTotal = subtotal + deliveryFee - discount

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const inputClass = "w-full border border-mocha/15 rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-gold-warm transition-colors bg-white"

  const handlePlaceOrder = async () => {
    setOrderError('')

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city || !form.postal) {
      setOrderError('Please fill in all shipping details')
      return
    }
    if (!agreed) {
      setOrderError('Please accept the Terms & Conditions')
      return
    }

    setIsPlacingOrder(true)

    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        qty: item.qty,
        size: item.size,
        color: item.color,
      }))

      const shippingAddress = {
        name: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.country,
        pin: form.postal,
      }

      // Create order in DB
      const orderData = await api.createOrder({
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
      })

      const order = orderData.data

      if (paymentMethod === 'cod') {
        clearCart()
        router.push(`/orders?success=true&orderId=${order._id}`)
        return
      }

      // Razorpay flow
      if (!razorpayLoaded) {
        setOrderError('Payment gateway is still loading. Please try again in a moment.')
        setIsPlacingOrder(false)
        return
      }

      const paymentData = await api.createPaymentOrder(order._id)

      const options = {
        key: paymentData.data.key,
        amount: paymentData.data.amount,
        currency: paymentData.data.currency,
        name: 'City Handloom',
        description: `Order #${order._id}`,
        order_id: paymentData.data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            await api.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order._id,
            })
            clearCart()
            router.push(`/orders?success=true&orderId=${order._id}`)
          } catch (err) {
            setOrderError('Payment verification failed. Please contact support.')
            setIsPlacingOrder(false)
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#D4AF37' },
        modal: {
          ondismiss: function () {
            setIsPlacingOrder(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order. Please try again.')
      setIsPlacingOrder(false)
    }
  }

  if (items.length === 0) return null

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-28 md:pt-32 px-4 md:px-8 lg:px-16 pb-0">

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ...SPRING }}
          className={`${cormorant.className} text-3xl md:text-4xl font-semibold text-mocha mb-8`}
        >
          Checkout
        </motion.h1>

        {orderError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600 font-body">{orderError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 pb-16">

          <motion.div variants={fromLeft} initial="hidden" animate="visible" className="space-y-8">

            <div className="bg-white border border-petal/60 rounded-2xl p-6 shadow-sm">
              <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-5`}>
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">First name</label>
                  <input type="text" placeholder="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Last name</label>
                  <input type="text" placeholder="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Email address</label>
                  <input type="email" placeholder="Email address" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Phone number</label>
                  <input type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-petal/60 rounded-2xl p-6 shadow-sm">
              <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-5`}>
                Delivery Method
              </h2>
              <div className="space-y-3">
                {[
                  { id: 'standard', label: 'Standard delivery (5-6 days)', sub: subtotal >= 999 ? 'FREE' : '₹99', price: subtotal >= 999 ? 0 : 99 },
                  { id: 'express', label: 'Express delivery (1-2 days)', sub: '₹199', price: 199 },
                ].map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setDeliveryMethod(option.id as DeliveryMethod)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl text-left transition-colors ${
                      deliveryMethod === option.id ? 'border-gold-warm bg-gold-warm/5' : 'border-mocha/10 hover:border-mocha/20'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      deliveryMethod === option.id ? 'border-gold-warm' : 'border-mocha/20'
                    }`}>
                      {deliveryMethod === option.id && <div className="w-2.5 h-2.5 rounded-full bg-gold-warm" />}
                    </div>
                    <span className="flex-1 text-sm text-mocha font-body">{option.label}</span>
                    <span className={`text-sm font-semibold font-body ${option.price === 0 ? 'text-green-600' : 'text-mocha'}`}>
                      {option.sub}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-petal/60 rounded-2xl p-6 shadow-sm">
              <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-5`}>
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Country</label>
                  <input type="text" placeholder="Country" value={form.country} onChange={(e) => update('country', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">City</label>
                  <input type="text" placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Address</label>
                  <input type="text" placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Postal code</label>
                  <input type="text" placeholder="Postal code" value={form.postal} onChange={(e) => update('postal', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-petal/60 rounded-2xl p-6 shadow-sm">
              <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-5`}>
                Payment Method
              </h2>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { id: 'upi', label: 'UPI / Card', icon: <Smartphone size={16} /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={16} /> },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 border-2 rounded-xl text-xs font-body transition-colors ${
                      paymentMethod === method.id
                        ? 'border-gold-warm bg-gold-warm/5 text-mocha font-semibold'
                        : 'border-mocha/10 text-mocha/60 hover:border-mocha/20'
                    }`}
                  >
                    {method.icon}
                    <span className="leading-tight text-center">{method.label}</span>
                  </motion.button>
                ))}
              </div>

              {paymentMethod === 'upi' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-petal/30 rounded-xl p-4"
                >
                  <p className="text-sm text-mocha font-body">
                    💳 You'll be redirected to Razorpay's secure checkout to pay via UPI, Card, or Net Banking.
                  </p>
                </motion.div>
              )}

              {paymentMethod === 'cod' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-petal/30 rounded-xl p-4"
                >
                  <p className="text-sm text-mocha font-body">
                    💰 Pay with cash when your order is delivered.
                  </p>
                </motion.div>
              )}
            </div>

          </motion.div>

          <motion.div variants={fromRight} initial="hidden" animate="visible" className="space-y-4">
            <div className="bg-white border border-petal/60 rounded-2xl p-6 shadow-sm sticky top-32">
              <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-5`}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-5">
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING, delay: 0.2 + i * 0.1 }}
                    className="flex gap-3"
                  >
                    <div
                      className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 bg-petal/20"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-mocha font-body leading-snug mb-0.5 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-mocha/50 font-body">Size: {item.size} | Colour: {item.color}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-mocha font-body">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-mocha/40 font-body">x{item.qty}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-petal/60 pt-4 space-y-2.5 mb-5">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-mocha/60">Subtotal</span>
                  <span className="text-mocha">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-mocha/60">Delivery cost</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : 'text-mocha'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="border-t border-petal/60 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-mocha font-body">Total to pay</span>
                  <span className={`${cormorant.className} text-xl font-semibold text-mocha`}>
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer mb-4">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    agreed ? 'bg-gold-warm border-gold-warm' : 'border-mocha/20'
                  }`}
                >
                  {agreed && <Check size={11} className="text-white" />}
                </div>
                <span className="text-xs text-mocha/60 font-body leading-relaxed">
                  By proceeding I accept the{' '}
                  <Link href="/terms" className="text-gold-deep underline">Terms & Conditions</Link>
                </span>
              </label>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-4 bg-gold-warm text-espresso font-bold text-sm font-body rounded-full hover:bg-gold-deep transition-colors shadow-md disabled:opacity-60"
              >
                {isPlacingOrder ? 'Processing...' : `${paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'} — ₹${grandTotal.toLocaleString()}`}
              </motion.button>

              <p className="text-center text-xs text-mocha/40 font-body mt-3">
                🔒 Secured by Razorpay
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  )
}