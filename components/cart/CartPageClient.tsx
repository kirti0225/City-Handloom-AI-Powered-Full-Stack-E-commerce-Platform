'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { Trash2, Minus, Plus, Tag, Sparkles } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14, mass: 0.9 }

const fromLeft = {
  hidden: { opacity: 0, x: -120, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, x: 0, scale: 1,
    transition: { ...SPRING, delay: i * 0.18 },
  }),
}

const fromRight = {
  hidden: { opacity: 0, x: 120, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { ...SPRING, delay: 0.15 } },
}

export default function CartPageClient() {
  const { items, updateQty, removeItem, total } = useCartStore()
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotal = total()
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const delivery = subtotal > 999 || subtotal === 0 ? 0 : 99
  const grandTotal = subtotal - discount + delivery

  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-28 md:pt-32 px-4 md:px-8 lg:px-16">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${cormorant.className} text-3xl md:text-4xl font-semibold text-mocha mb-8`}
        >
          Your Cart
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className={`${cormorant.className} text-2xl text-mocha/50 mb-4`}>
              Your cart is empty
            </p>
            <Link
              href="/products"
              className="inline-block bg-gold-warm text-espresso font-semibold text-sm font-body px-8 py-3 rounded-full hover:bg-gold-deep transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start pb-16">

            {/* Left — cart items */}
            <div className="bg-white rounded-2xl border border-petal/60 overflow-hidden shadow-sm">
              {items.map((item, i) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  custom={i}
                  variants={fromLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-40px' }}
                  whileHover={{ x: 6, backgroundColor: '#FDF0EC' }}
                  className={`flex gap-4 p-5 transition-colors ${
                    i < items.length - 1 ? 'border-b border-petal/60' : ''
                  }`}
                >
                  <div
                    className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl bg-cover bg-center bg-petal/20"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`${cormorant.className} text-base md:text-lg font-semibold text-mocha leading-snug`}>
                        {item.name}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(item.id)}
                        className="text-mocha/30 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-xs text-mocha/50 font-body">Size: {item.size}</p>
                      <p className="text-xs text-mocha/50 font-body">Color: {item.color}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className={`${cormorant.className} text-lg font-semibold text-mocha`}>
                        ₹{(item.price * item.qty).toLocaleString()}
                      </span>

                      <div className="flex items-center gap-2 border border-mocha/15 rounded-full px-2 py-1">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-6 h-6 flex items-center justify-center text-mocha/60 hover:text-mocha transition-colors"
                        >
                          <Minus size={13} />
                        </motion.button>
                        <span className="text-sm font-semibold text-mocha font-body w-5 text-center">
                          {item.qty}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-6 h-6 flex items-center justify-center text-mocha/60 hover:text-mocha transition-colors"
                        >
                          <Plus size={13} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right — order summary */}
            <motion.div
              variants={fromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: '-40px' }}
              className="bg-white rounded-2xl border border-petal/60 shadow-sm p-6 sticky top-32"
            >
              <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-5`}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-mocha/60">Subtotal</span>
                  <span className="text-mocha font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between text-sm font-body"
                  >
                    <span className="text-green-600">Discount (10%)</span>
                    <span className="text-green-600 font-medium">-₹{discount.toLocaleString()}</span>
                  </motion.div>
                )}
                <div className="flex justify-between text-sm font-body">
                  <span className="text-mocha/60">Delivery Fee</span>
                  <span className={delivery === 0 ? 'text-green-600 font-medium' : 'text-mocha font-medium'}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
                {delivery === 0 && subtotal > 0 && (
                  <p className="text-[11px] text-green-600 font-body">
                    🎉 You got free delivery!
                  </p>
                )}
                <div className="border-t border-petal/60 pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-mocha font-body">Total</span>
                  <span className={`${cormorant.className} text-xl font-semibold text-mocha`}>
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-5">
                <div className="flex-1 flex items-center gap-2 border border-mocha/15 rounded-lg px-3 py-2.5 focus-within:border-gold-warm transition-colors">
                  <Tag size={14} className="text-mocha/40 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Add promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-transparent outline-none text-sm text-mocha placeholder:text-mocha/35 font-body w-full"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { if (promoCode.trim()) setPromoApplied(true) }}
                  className="px-4 py-2.5 bg-mocha text-ivory text-sm font-semibold font-body rounded-lg hover:bg-espresso transition-colors"
                >
                  Apply
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full py-3.5 bg-gold-warm text-espresso font-semibold text-sm font-body rounded-full hover:bg-gold-deep transition-colors mb-3"
              >
                Go to Checkout
              </motion.button>

              <Link
                href="/products"
                className="block text-center text-xs text-mocha/50 font-body hover:text-mocha transition-colors"
              >
                Continue Shopping
              </Link>

              <div className="mt-5 pt-4 border-t border-petal/60">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={13} className="text-gold-deep" />
                  <span className="text-xs font-semibold text-mocha/60 font-body">AI Suggestion</span>
                </div>
                <p className="text-xs text-mocha/55 font-body leading-relaxed">
                  Items in your cart pair well with our handloom collection. Explore more on the Products page.
                </p>
              </div>
            </motion.div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}