'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { Package, Search, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'] })
const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }

export default function TrackPageClient() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleTrack = () => {
    if (!orderId.trim()) {
      setError('Please enter your order ID')
      return
    }
    setError('')
    router.push(`/track/${orderId.trim()}`)
  }

  return (
    <main className="bg-ivory min-h-screen">
      <Navbar />
      <div className="pt-28 md:pt-32 px-4 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={SPRING}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-petal flex items-center justify-center mx-auto mb-5">
              <Package size={28} className="text-gold-deep" />
            </div>
            <h1 className={`${cormorant.className} text-3xl font-semibold text-mocha mb-2`}>
              Track Your Order
            </h1>
            <p className="text-sm text-mocha/55 font-body mb-8">
              Enter your order ID to get real-time updates on your delivery
            </p>

            <div className="space-y-3 mb-6 text-left">
              <div>
                <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 73262"
                  value={orderId}
                  onChange={e => { setOrderId(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleTrack()}
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-body outline-none transition-colors ${
                    error ? 'border-red-400 bg-red-50' : 'border-mocha/15 focus:border-gold-warm'
                  }`}
                />
                {error && <p className="text-xs text-red-500 font-body mt-1">{error}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">
                  Email Address <span className="text-mocha/40 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-mocha/15 rounded-xl px-4 py-3 text-sm font-body outline-none focus:border-gold-warm transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleTrack}
              className="w-full py-3.5 bg-gold-warm text-espresso font-semibold text-sm font-body rounded-full hover:bg-gold-deep transition-colors flex items-center justify-center gap-2"
            >
              <Search size={16} />
              Track Order
            </motion.button>

            <div className="mt-6 pt-5 border-t border-petal/60">
              <p className="text-xs text-mocha/50 font-body mb-3">Try these sample order IDs:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {['73262', '09177', '77110'].map(id => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setOrderId(id); router.push(`/track/${id}`) }}
                    className="flex items-center gap-1 text-xs text-gold-deep font-body border border-gold-warm/30 px-3 py-1.5 rounded-full hover:bg-gold-warm/10 transition-colors"
                  >
                    #{id} <ArrowRight size={11} />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}