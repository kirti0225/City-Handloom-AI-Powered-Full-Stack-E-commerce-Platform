'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import {
  Package, Search, ChevronDown,
  Truck, CheckCircle, XCircle, Clock,
  X, Bot, Send, RotateCcw, RefreshCw,
  Download, Star
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }

type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested' | 'returned'

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  placed:           { label: 'Order Placed',     color: 'text-blue-600',   bg: 'bg-blue-50',   icon: <Package size={13} /> },
  confirmed:        { label: 'Confirmed',         color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <CheckCircle size={13} /> },
  packed:           { label: 'Packed',            color: 'text-purple-600', bg: 'bg-purple-50', icon: <Package size={13} /> },
  shipped:          { label: 'Shipped',           color: 'text-amber-600',  bg: 'bg-amber-50',  icon: <Truck size={13} /> },
  delivered:        { label: 'Delivered',         color: 'text-green-600',  bg: 'bg-green-50',  icon: <CheckCircle size={13} /> },
  cancelled:        { label: 'Cancelled',         color: 'text-red-600',    bg: 'bg-red-50',    icon: <XCircle size={13} /> },
  return_requested: { label: 'Return Requested',  color: 'text-orange-600', bg: 'bg-orange-50', icon: <RotateCcw size={13} /> },
  returned:         { label: 'Returned',          color: 'text-gray-600',   bg: 'bg-gray-50',   icon: <RotateCcw size={13} /> },
}

const tabs = ['All', 'Placed', 'Shipped', 'Delivered', 'Cancelled']

interface ChatMessage { role: 'user' | 'bot'; text: string }
const botResponses: Record<string, string> = {
  return:   'To return an order, find your delivered order below and click "Return". You have 10 days from delivery.',
  exchange: 'To exchange, find your delivered order and click "Exchange". Window is 10 days from delivery.',
  track:    'Click "Track" on any shipped order to see real-time delivery status.',
  cancel:   'You can cancel orders that are in "Placed" status. Click "Cancel" on the order.',
  default:  'Our support team is available Mon–Sat 9AM–6PM. Call +91 98765 43210.',
}

function Chatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hi! I'm here to help with your orders 📦 Ask me about returns, exchanges, tracking or cancellations." }
  ])
  const [input, setInput] = useState('')

  const send = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setTimeout(() => {
      const key = Object.keys(botResponses).find(k => msg.toLowerCase().includes(k)) || 'default'
      setMessages(prev => [...prev, { role: 'bot', text: botResponses[key] }])
    }, 700)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={SPRING}
      className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-petal/60"
    >
      <div className="bg-espresso px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold-warm flex items-center justify-center">
            <Bot size={14} className="text-espresso" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ivory font-body">Order Support</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-[10px] text-ivory/60 font-body">Online</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-ivory/60 hover:text-ivory"><X size={15} /></button>
      </div>
      <div className="h-52 overflow-y-auto p-3 space-y-2.5 bg-petal/10">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-1.5`}>
            {msg.role === 'bot' && (
              <div className="w-5 h-5 rounded-full bg-gold-warm flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={10} className="text-espresso" />
              </div>
            )}
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs font-body leading-relaxed ${
              msg.role === 'user' ? 'bg-gold-warm text-espresso' : 'bg-white text-mocha shadow-sm'
            }`}>{msg.text}</div>
          </motion.div>
        ))}
      </div>
      <div className="px-2 py-1.5 flex gap-1 overflow-x-auto border-t border-petal/40 scrollbar-hide">
        {['Return', 'Exchange', 'Track', 'Cancel'].map(q => (
          <button key={q} onClick={() => send(q)}
            className="flex-shrink-0 text-[10px] text-mocha font-body border border-petal px-2 py-1 rounded-full hover:bg-petal/40">
            {q}
          </button>
        ))}
      </div>
      <div className="flex gap-2 p-2.5 border-t border-petal/40">
        <input type="text" placeholder="Ask about your order..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="flex-1 text-xs font-body bg-petal/20 rounded-full px-3 py-1.5 outline-none" />
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => send()}
          className="w-7 h-7 rounded-full bg-gold-warm flex items-center justify-center text-espresso flex-shrink-0">
          <Send size={12} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function OrdersPageClient() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [showChatbot, setShowChatbot] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders()
        setOrders(data.data)
      } catch (err) {
        console.error('Failed to load orders', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [isLoggedIn])

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    setCancellingId(orderId)
    try {
      await api.cancelOrder(orderId, 'Cancelled by customer')
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, status: 'cancelled' } : o
      ))
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order')
    } finally {
      setCancellingId(null)
    }
  }

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'All' || o.status === activeTab.toLowerCase()
    const matchSearch = !searchQuery ||
      o._id.includes(searchQuery) ||
      o.items?.some((item: any) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchTab && matchSearch
  })

  return (
    <main className="bg-ivory min-h-screen">
      <Navbar />
      <div className="pt-28 md:pt-32 px-4 md:px-8 lg:px-16 pb-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`${cormorant.className} text-3xl font-semibold text-mocha`}>My Orders</h1>
            <p className="text-xs text-mocha/50 font-body mt-0.5">{orders.length} orders placed</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-petal rounded-full px-4 py-2 shadow-sm">
            <Search size={14} className="text-mocha/40" />
            <input type="text" placeholder="Search by order ID or product"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm text-mocha font-body w-48 placeholder:text-mocha/35" />
            {searchQuery && <button onClick={() => setSearchQuery('')}><X size={13} className="text-mocha/40" /></button>}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 bg-white rounded-2xl p-2 shadow-sm border border-petal/60">
          {tabs.map(tab => (
            <motion.button key={tab} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 text-xs font-semibold font-body rounded-xl transition-all ${
                activeTab === tab ? 'bg-mocha text-ivory shadow-sm' : 'text-mocha/60 hover:bg-petal/30'
              }`}>
              {tab}
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-white/20 text-ivory' : 'bg-petal text-mocha/60'
              }`}>
                {tab === 'All' ? orders.length : orders.filter(o => o.status === tab.toLowerCase()).length}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-4 pb-16">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-petal/60 p-5 animate-pulse">
                <div className="h-4 bg-petal/30 rounded w-1/4 mb-3" />
                <div className="h-3 bg-petal/20 rounded w-1/2" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-2xl border border-petal/60">
              <Package size={40} className="text-mocha/20 mx-auto mb-3" />
              <p className={`${cormorant.className} text-xl text-mocha/40`}>No orders found</p>
              <Link href="/products">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="mt-4 bg-gold-warm text-espresso font-semibold text-sm font-body px-6 py-2.5 rounded-full hover:bg-gold-deep transition-colors">
                  Start Shopping
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filtered.map((order, i) => {
                const s = statusConfig[order.status as OrderStatus] || statusConfig.placed
                const isExpanded = expandedOrder === order._id

                return (
                  <motion.div key={order._id} layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-petal/60 shadow-sm overflow-hidden">

                    {/* Order header */}
                    <div className="px-5 py-4 border-b border-petal/40 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <p className="text-[10px] text-mocha/50 font-body">ORDER ID</p>
                          <p className="text-sm font-bold text-mocha font-body">#{order._id?.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="w-px h-8 bg-petal/60 hidden md:block" />
                        <div>
                          <p className="text-[10px] text-mocha/50 font-body">DATE</p>
                          <p className="text-xs font-medium text-mocha font-body">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="w-px h-8 bg-petal/60 hidden md:block" />
                        <div>
                          <p className="text-[10px] text-mocha/50 font-body">TOTAL</p>
                          <p className={`${cormorant.className} text-base font-semibold text-mocha`}>
                            ₹{order.total?.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-px h-8 bg-petal/60 hidden md:block" />
                        <div>
                          <p className="text-[10px] text-mocha/50 font-body">PAYMENT</p>
                          <p className="text-xs font-medium text-mocha font-body capitalize">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold font-body px-3 py-1.5 rounded-full ${s.bg} ${s.color}`}>
                          {s.icon} {s.label}
                        </span>
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                          className="text-xs text-mocha/50 font-body border border-petal px-3 py-1.5 rounded-full hover:bg-petal/30 flex items-center gap-1"
                        >
                          Details <ChevronDown size={12} className={isExpanded ? 'rotate-180' : ''} />
                        </button>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="px-5 py-4">
                      {order.items?.map((item: any, j: number) => (
                        <div key={j} className="flex gap-4 py-3 border-b border-petal/30 last:border-0">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-cover bg-center flex-shrink-0 bg-petal/20"
                            style={{ backgroundImage: `url('${item.image}')` }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-mocha font-body line-clamp-2">{item.name}</p>
                            <p className="text-xs text-mocha/50 font-body mt-0.5">
                              {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`} · Qty: {item.qty}
                            </p>
                            <p className={`${cormorant.className} text-base font-semibold text-mocha mt-1`}>
                              ₹{(item.price * item.qty)?.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            {order.status === 'delivered' && (
                              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1 text-[11px] text-gold-deep font-body border border-gold-warm/30 px-2.5 py-1.5 rounded-full hover:bg-gold-warm/10">
                                <Star size={11} /> Rate
                              </motion.button>
                            )}
                            {order.status === 'shipped' && (
                              <Link href={`/track/${order._id}`}>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-1 text-[11px] text-amber-600 font-body border border-amber-300 px-2.5 py-1.5 rounded-full hover:bg-amber-50">
                                  <Truck size={11} /> Track
                                </motion.button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-petal/40"
                        >
                          <div className="px-5 py-4 bg-petal/10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-[10px] text-mocha/50 font-body mb-1">DELIVERY ADDRESS</p>
                                <p className="text-xs font-medium text-mocha font-body">
                                  {order.shippingAddress?.name}<br />
                                  {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
                                  {order.shippingAddress?.state} — {order.shippingAddress?.pin}<br />
                                  {order.shippingAddress?.phone}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-mocha/50 font-body mb-1">PRICE DETAILS</p>
                                <p className="text-xs text-mocha font-body">
                                  Subtotal: ₹{order.subtotal?.toLocaleString()}<br />
                                  Delivery: {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}<br />
                                  <span className="font-semibold">Total: ₹{order.total?.toLocaleString()}</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] text-mocha/50 font-body mb-1">STATUS</p>
                                <p className="text-xs text-mocha font-body capitalize">
                                  Payment: <span className="font-semibold">{order.paymentStatus}</span><br />
                                  Order: <span className="font-semibold">{order.status}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {order.status === 'shipped' && (
                                <Link href={`/track/${order._id}`}>
                                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-1.5 text-xs font-semibold font-body px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600">
                                    <Truck size={13} /> Track Order
                                  </motion.button>
                                </Link>
                              )}
                              {order.status === 'delivered' && (
                                <>
                                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-1.5 text-xs font-semibold font-body px-4 py-2 border border-petal text-mocha rounded-full hover:bg-petal/30">
                                    <RotateCcw size={13} /> Return
                                  </motion.button>
                                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-1.5 text-xs font-semibold font-body px-4 py-2 border border-petal text-mocha rounded-full hover:bg-petal/30">
                                    <RefreshCw size={13} /> Exchange
                                  </motion.button>
                                </>
                              )}
                              {(order.status === 'placed' || order.status === 'confirmed') && (
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                  onClick={() => handleCancel(order._id)}
                                  disabled={cancellingId === order._id}
                                  className="flex items-center gap-1.5 text-xs font-semibold font-body px-4 py-2 border border-red-200 text-red-500 rounded-full hover:bg-red-50 disabled:opacity-50">
                                  <XCircle size={13} />
                                  {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                                </motion.button>
                              )}
                              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-1.5 text-xs font-semibold font-body px-4 py-2 border border-petal text-mocha rounded-full hover:bg-petal/30">
                                <Download size={13} /> Invoice
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setShowChatbot(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-espresso text-ivory shadow-xl flex items-center justify-center hover:bg-gold-warm hover:text-espresso transition-colors">
        {showChatbot ? <X size={22} /> : <Bot size={22} />}
      </motion.button>
    </main>
  )
}