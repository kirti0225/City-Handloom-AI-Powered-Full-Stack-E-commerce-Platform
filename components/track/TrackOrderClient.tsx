'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import {
  Package, CheckCircle, Truck, MapPin,
  Home, Download, Phone, ChevronDown,
  ChevronUp, Star, RotateCcw, RefreshCw,
  Clock, ArrowLeft, Copy, Check
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14, mass: 1.1 }

// ── Types ────────────────────────────────────────────────────
type TrackingStatus = 'ordered' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered'

interface TrackingStep {
  key: TrackingStatus
  label: string
  icon: React.ReactNode
  date: string
  time: string
  desc: string
  location: string
  done: boolean
  active: boolean
}

interface OrderData {
  id: string
  status: TrackingStatus
  estimatedDelivery: string
  orderedDate: string
  items: { name: string; qty: number; price: number; image: string }[]
  address: { name: string; phone: string; line1: string; line2: string; pin: string }
  payment: string
  total: number
  courier: string
  awb: string
  steps: TrackingStep[]
}

// ── Mock order data ──────────────────────────────────────────
const getOrderData = (orderId: string): OrderData | null => {
  const orders: Record<string, OrderData> = {
    '73262': {
      id: '73262',
      status: 'out_for_delivery',
      estimatedDelivery: 'Today by 8:00 PM',
      orderedDate: 'Mon, 10 Nov 2025',
      courier: 'Delhivery',
      awb: 'DL9823746512',
      payment: 'Paid via UPI',
      total: 3453,
      items: [
        { name: 'Jaipuriya Cotton Bedsheet', qty: 1, price: 1255, image: '/images/product-1.jpg' },
        { name: 'Royal Cotton Quilt', qty: 1, price: 1299, image: '/images/product-2.jpg' },
        { name: 'Handloom Curtain Set', qty: 2, price: 899, image: '/images/product-3.jpg' },
      ],
      address: {
        name: 'Kirti Singh',
        phone: '+91 98765 43210',
        line1: '12, Civil Lines',
        line2: 'Kanpur, Uttar Pradesh',
        pin: '208001',
      },
      steps: [
        { key: 'ordered', label: 'Order Placed', icon: <Package size={18} />, date: 'Mon, 10 Nov', time: '11:32 AM', desc: 'Your order has been placed successfully', location: 'City Handloom Store', done: true, active: false },
        { key: 'confirmed', label: 'Order Confirmed', icon: <CheckCircle size={18} />, date: 'Mon, 10 Nov', time: '12:05 PM', desc: 'Seller has confirmed your order', location: 'Kanpur Warehouse', done: true, active: false },
        { key: 'packed', label: 'Packed', icon: <Package size={18} />, date: 'Tue, 11 Nov', time: '09:15 AM', desc: 'Your order has been packed and is ready for pickup', location: 'Kanpur Warehouse', done: true, active: false },
        { key: 'shipped', label: 'Shipped', icon: <Truck size={18} />, date: 'Tue, 11 Nov', time: '03:40 PM', desc: 'Your order has been handed over to Delhivery', location: 'Kanpur Hub', done: true, active: false },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={18} />, date: 'Thu, 13 Nov', time: '08:22 AM', desc: 'Your order is out for delivery with the courier', location: 'Kanpur Local Facility', done: true, active: true },
        { key: 'delivered', label: 'Delivered', icon: <Home size={18} />, date: 'Thu, 13 Nov', time: 'Expected by 8 PM', desc: 'Your order will be delivered at your doorstep', location: 'Your Address', done: false, active: false },
      ],
    },
    '09177': {
      id: '09177',
      status: 'shipped',
      estimatedDelivery: 'Thu, 31 Oct 2025',
      orderedDate: 'Mon, 28 Oct 2025',
      courier: 'BlueDart',
      awb: 'BD4521896734',
      payment: 'Paid via Credit Card',
      total: 2154,
      items: [
        { name: 'Silk Pillow Cover Set', qty: 2, price: 449, image: '/images/product-4.jpg' },
        { name: 'Jaipuriya Bedsheet', qty: 1, price: 1255, image: '/images/product-1.jpg' },
      ],
      address: {
        name: 'Kirti Singh',
        phone: '+91 98765 43210',
        line1: '12, Civil Lines',
        line2: 'Kanpur, Uttar Pradesh',
        pin: '208001',
      },
      steps: [
        { key: 'ordered', label: 'Order Placed', icon: <Package size={18} />, date: 'Mon, 28 Oct', time: '10:00 AM', desc: 'Your order has been placed successfully', location: 'City Handloom Store', done: true, active: false },
        { key: 'confirmed', label: 'Order Confirmed', icon: <CheckCircle size={18} />, date: 'Mon, 28 Oct', time: '10:45 AM', desc: 'Seller has confirmed your order', location: 'Kanpur Warehouse', done: true, active: false },
        { key: 'packed', label: 'Packed', icon: <Package size={18} />, date: 'Tue, 29 Oct', time: '11:00 AM', desc: 'Your order has been packed', location: 'Kanpur Warehouse', done: true, active: false },
        { key: 'shipped', label: 'Shipped', icon: <Truck size={18} />, date: 'Tue, 29 Oct', time: '05:30 PM', desc: 'Handed over to BlueDart', location: 'Kanpur Hub', done: true, active: true },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={18} />, date: 'Thu, 31 Oct', time: 'Expected AM', desc: 'Will be out for delivery soon', location: 'Local Facility', done: false, active: false },
        { key: 'delivered', label: 'Delivered', icon: <Home size={18} />, date: 'Thu, 31 Oct', time: 'Expected PM', desc: 'Expected delivery', location: 'Your Address', done: false, active: false },
      ],
    },
    '77110': {
      id: '77110',
      status: 'delivered',
      estimatedDelivery: 'Delivered on Sat, 20 Sep 2025',
      orderedDate: 'Mon, 15 Sep 2025',
      courier: 'Delhivery',
      awb: 'DL7712309856',
      payment: 'Paid via Net Banking',
      total: 4590,
      items: [
        { name: 'Royal Cotton Quilt King', qty: 1, price: 2399, image: '/images/product-2.jpg' },
        { name: 'Cotton Table Linen', qty: 3, price: 699, image: '/images/product-3.jpg' },
      ],
      address: {
        name: 'Kirti Singh',
        phone: '+91 98765 43210',
        line1: '12, Civil Lines',
        line2: 'Kanpur, Uttar Pradesh',
        pin: '208001',
      },
      steps: [
        { key: 'ordered', label: 'Order Placed', icon: <Package size={18} />, date: 'Mon, 15 Sep', time: '09:05 AM', desc: 'Order placed successfully', location: 'City Handloom Store', done: true, active: false },
        { key: 'confirmed', label: 'Order Confirmed', icon: <CheckCircle size={18} />, date: 'Mon, 15 Sep', time: '09:50 AM', desc: 'Seller confirmed your order', location: 'Kanpur Warehouse', done: true, active: false },
        { key: 'packed', label: 'Packed', icon: <Package size={18} />, date: 'Tue, 16 Sep', time: '10:30 AM', desc: 'Order packed and ready', location: 'Kanpur Warehouse', done: true, active: false },
        { key: 'shipped', label: 'Shipped', icon: <Truck size={18} />, date: 'Tue, 16 Sep', time: '04:00 PM', desc: 'Handed to Delhivery', location: 'Kanpur Hub', done: true, active: false },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={18} />, date: 'Sat, 20 Sep', time: '07:45 AM', desc: 'Out with delivery agent', location: 'Local Facility', done: true, active: false },
        { key: 'delivered', label: 'Delivered', icon: <Home size={18} />, date: 'Sat, 20 Sep', time: '02:30 PM', desc: 'Package delivered successfully', location: 'Your Address', done: true, active: true },
      ],
    },
  }
  return orders[orderId] || null
}

// ── Status config ────────────────────────────────────────────
const statusConfig: Record<TrackingStatus, { label: string; color: string; bg: string; progress: number }> = {
  ordered: { label: 'Order Placed', color: 'text-blue-500', bg: 'bg-blue-50', progress: 10 },
  confirmed: { label: 'Confirmed', color: 'text-indigo-500', bg: 'bg-indigo-50', progress: 25 },
  packed: { label: 'Packed', color: 'text-purple-500', bg: 'bg-purple-50', progress: 45 },
  shipped: { label: 'Shipped', color: 'text-amber-500', bg: 'bg-amber-50', progress: 65 },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-orange-500', bg: 'bg-orange-50', progress: 85 },
  delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50', progress: 100 },
}

// ── Main component ───────────────────────────────────────────
export default function TrackOrderClient({ orderId }: { orderId: string }) {
  const order = getOrderData(orderId)
  const [showAllItems, setShowAllItems] = useState(false)
  const [copiedAwb, setCopiedAwb] = useState(false)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const copyAwb = () => {
    if (order) {
      navigator.clipboard.writeText(order.awb)
      setCopiedAwb(true)
      setTimeout(() => setCopiedAwb(false), 2000)
    }
  }

  if (!order) {
    return (
      <main className="bg-ivory min-h-screen">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <Package size={32} className="text-red-300" />
          </div>
          <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha mb-2`}>
            Order not found
          </h2>
          <p className="text-sm text-mocha/55 font-body mb-6">
            We couldn't find order #{orderId}. Please check your order ID and try again.
          </p>
          <Link href="/track">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-gold-warm text-espresso font-semibold text-sm font-body px-6 py-3 rounded-full hover:bg-gold-deep transition-colors"
            >
              <ArrowLeft size={16} /> Try Again
            </motion.button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const status = statusConfig[order.status]
  const completedSteps = order.steps.filter(s => s.done).length
  const visibleItems = showAllItems ? order.items : order.items.slice(0, 2)

  return (
    <main className="bg-ivory min-h-screen">
      <Navbar />

      <div className="pt-28 md:pt-32 px-4 md:px-8 lg:px-16 pb-0">

        {/* Breadcrumb + back */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 mb-6"
        >
          <Link href="/track" className="flex items-center gap-1.5 text-xs text-mocha/50 font-body hover:text-mocha transition-colors">
            <ArrowLeft size={14} /> Track Order
          </Link>
          <span className="text-mocha/30">/</span>
          <span className="text-xs text-mocha font-body font-semibold">Order #{order.id}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 pb-16">

          {/* Left — tracking timeline + details */}
          <div className="space-y-5">

            {/* Status hero card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={SPRING}
              className="bg-white rounded-2xl border border-petal/60 shadow-sm overflow-hidden"
            >
              {/* Top colored strip */}
              <div className={`h-1.5 w-full ${
                order.status === 'delivered' ? 'bg-green-500' :
                order.status === 'out_for_delivery' ? 'bg-orange-500' :
                order.status === 'shipped' ? 'bg-amber-500' : 'bg-gold-warm'
              }`} />

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs text-mocha/50 font-body mb-1">Order #{order.id}</p>
                    <h1 className={`${cormorant.className} text-2xl md:text-3xl font-semibold text-mocha`}>
                      {status.label}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={13} className="text-mocha/40" />
                      <p className="text-sm text-mocha/60 font-body">
                        {order.status === 'delivered' ? order.estimatedDelivery : `Expected: ${order.estimatedDelivery}`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold font-body px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="w-full h-2 bg-mocha/8 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${status.progress}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      className={`h-full rounded-full ${
                        order.status === 'delivered' ? 'bg-green-500' :
                        order.status === 'out_for_delivery' ? 'bg-orange-500' :
                        'bg-gold-warm'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-mocha/40 font-body mt-1">
                    <span>Order Placed</span>
                    <span>Delivered</span>
                  </div>
                </div>

                {/* Step mini icons */}
                <div className="flex items-center justify-between mt-4">
                  {order.steps.map((step, i) => (
                    <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        step.done ? (step.active ? 'bg-gold-warm text-white ring-2 ring-gold-warm/30 ring-offset-1' : 'bg-green-500 text-white') : 'bg-mocha/10 text-mocha/30'
                      }`}>
                        {step.done && !step.active ? <Check size={12} /> : step.icon}
                      </div>
                      <p className="text-[9px] text-mocha/50 font-body text-center leading-tight hidden md:block max-w-[50px]">
                        {step.label}
                      </p>
                      {i < order.steps.length - 1 && (
                        <div className={`absolute hidden md:block h-0.5 w-full top-3.5 ${step.done ? 'bg-green-400' : 'bg-mocha/10'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tracking timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="bg-white rounded-2xl border border-petal/60 shadow-sm p-6"
            >
              <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-6`}>
                Tracking Timeline
              </h2>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-mocha/8" />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(completedSteps / order.steps.length) * 100}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                  className="absolute left-5 top-2 w-0.5 bg-green-400 origin-top"
                />

                <div className="space-y-0">
                  {order.steps.map((step, i) => (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...SPRING, delay: 0.1 + i * 0.08 }}
                      className="relative flex gap-5 pb-7 last:pb-0 cursor-pointer"
                      onClick={() => setActiveStep(activeStep === i ? null : i)}
                    >
                      {/* Step dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <motion.div
                          animate={step.active ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            step.done && step.active
                              ? 'bg-gold-warm border-gold-warm text-white shadow-md shadow-gold-warm/30'
                              : step.done
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-mocha/15 text-mocha/30'
                          }`}
                        >
                          {step.done && !step.active ? <CheckCircle size={18} /> : step.icon}
                        </motion.div>
                        {step.active && (
                          <motion.div
                            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-gold-warm/30"
                          />
                        )}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-semibold font-body ${
                              step.active ? 'text-gold-deep' : step.done ? 'text-mocha' : 'text-mocha/35'
                            }`}>
                              {step.label}
                              {step.active && (
                                <span className="ml-2 text-[10px] font-bold text-gold-warm bg-gold-warm/10 px-2 py-0.5 rounded-full">
                                  CURRENT
                                </span>
                              )}
                            </p>
                            <p className={`text-xs font-body mt-0.5 ${step.done ? 'text-mocha/60' : 'text-mocha/30'}`}>
                              {step.desc}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`text-[11px] font-body ${step.done ? 'text-mocha/60' : 'text-mocha/30'}`}>
                              {step.date}
                            </p>
                            <p className={`text-[11px] font-body ${step.done ? 'text-mocha/50' : 'text-mocha/25'}`}>
                              {step.time}
                            </p>
                          </div>
                        </div>

                        {/* Expandable location detail */}
                        {activeStep === i && step.done && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 flex items-center gap-1.5 bg-petal/30 rounded-xl px-3 py-2"
                          >
                            <MapPin size={13} className="text-gold-deep flex-shrink-0" />
                            <p className="text-xs text-mocha/70 font-body">{step.location}</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Courier info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.2 }}
              className="bg-white rounded-2xl border border-petal/60 shadow-sm p-6"
            >
              <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-4`}>
                Courier Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-petal/20 rounded-xl p-4">
                  <p className="text-xs text-mocha/50 font-body mb-1">Courier Partner</p>
                  <p className="text-sm font-semibold text-mocha font-body">{order.courier}</p>
                </div>
                <div className="bg-petal/20 rounded-xl p-4">
                  <p className="text-xs text-mocha/50 font-body mb-1">AWB Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-mocha font-body truncate">{order.awb}</p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={copyAwb}
                      className={`flex-shrink-0 transition-colors ${copiedAwb ? 'text-green-500' : 'text-mocha/40 hover:text-mocha'}`}
                    >
                      {copiedAwb ? <Check size={14} /> : <Copy size={14} />}
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-petal rounded-full text-xs text-mocha font-body hover:bg-petal/30 transition-colors"
                >
                  <Phone size={13} /> Contact Support
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-petal rounded-full text-xs text-mocha font-body hover:bg-petal/30 transition-colors"
                >
                  <Download size={13} /> Download Invoice
                </motion.button>
              </div>
            </motion.div>

            {/* Delivered actions */}
            {order.status === 'delivered' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.25 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={20} className="text-green-600" />
                  <h3 className={`${cormorant.className} text-lg font-semibold text-green-700`}>
                    Order Delivered Successfully!
                  </h3>
                </div>
                <p className="text-sm text-green-700/70 font-body mb-4">
                  Your order was delivered on {order.steps[5].date} at {order.steps[5].time}. Hope you love your purchase!
                </p>
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-xs font-semibold font-body px-4 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                  >
                    <Star size={13} /> Rate this order
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-xs font-semibold font-body px-4 py-2.5 border border-green-400 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                  >
                    <RefreshCw size={13} /> Exchange
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-xs font-semibold font-body px-4 py-2.5 border border-green-400 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                  >
                    <RotateCcw size={13} /> Return
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — order summary panel */}
          <div className="space-y-5">

            {/* Order items */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: 0.15 }}
              className="bg-white rounded-2xl border border-petal/60 shadow-sm p-5 sticky top-32"
            >
              <h2 className={`${cormorant.className} text-lg font-semibold text-mocha mb-4`}>
                Order Details
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {visibleItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING, delay: 0.2 + i * 0.08 }}
                    className="flex gap-3"
                  >
                    <div
                      className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 bg-petal/20"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-mocha font-body line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-mocha/50 font-body mt-0.5">
                        Qty: {item.qty}
                      </p>
                      <p className={`${cormorant.className} text-sm font-semibold text-mocha`}>
                        ₹{(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {order.items.length > 2 && (
                <button
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="flex items-center gap-1 text-xs text-gold-deep font-body hover:underline mb-4"
                >
                  {showAllItems ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> +{order.items.length - 2} more items</>}
                </button>
              )}

              {/* Price breakdown */}
              <div className="border-t border-petal/60 pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-xs font-body">
                  <span className="text-mocha/55">Subtotal</span>
                  <span className="text-mocha">₹{order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-body">
                  <span className="text-mocha/55">Delivery</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-body border-t border-petal/60 pt-2">
                  <span className="font-semibold text-mocha">Total Paid</span>
                  <span className={`${cormorant.className} text-base font-semibold text-mocha`}>
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-mocha/40 font-body">{order.payment}</p>
              </div>

              {/* Delivery address */}
              <div className="bg-petal/20 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin size={13} className="text-gold-deep" />
                  <p className="text-xs font-semibold text-mocha font-body">Delivery Address</p>
                </div>
                <p className="text-xs font-semibold text-mocha font-body">{order.address.name}</p>
                <p className="text-xs text-mocha/60 font-body">{order.address.line1}</p>
                <p className="text-xs text-mocha/60 font-body">{order.address.line2} — {order.address.pin}</p>
                <p className="text-xs text-mocha/60 font-body mt-0.5">{order.address.phone}</p>
              </div>

              {/* Order meta */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-body">
                  <span className="text-mocha/50">Ordered on</span>
                  <span className="text-mocha font-medium">{order.orderedDate}</span>
                </div>
                <div className="flex justify-between text-xs font-body">
                  <span className="text-mocha/50">Order ID</span>
                  <span className="text-mocha font-medium">#{order.id}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-petal/60 space-y-2">
                <Link href="/account">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 bg-gold-warm text-espresso font-semibold text-xs font-body rounded-full hover:bg-gold-deep transition-colors"
                  >
                    View All Orders
                  </motion.button>
                </Link>
                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 border border-petal text-mocha font-semibold text-xs font-body rounded-full hover:bg-petal/30 transition-colors"
                  >
                    Continue Shopping
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}