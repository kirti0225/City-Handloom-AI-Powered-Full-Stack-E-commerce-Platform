'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import {
  Phone, Mail, MapPin, MessageCircle,
  Send, Check, ChevronDown, ChevronUp,
  X, Package, RefreshCw, RotateCcw,
  AlertCircle, Bot, Clock
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14, mass: 1.1 }

interface OrderItem {
  id: number
  name: string
  image: string
  price: number
  qty: number
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled'
  deliveredDate: string | null
  returnEligibleUntil: string | null
  canReturn: boolean
  canExchange: boolean
  orderId: string
}

const mockOrders: OrderItem[] = [
  { id: 1, name: 'Jaipuriya Cotton Bedsheet', image: '/images/product-1.jpg', price: 1255, qty: 1, status: 'delivered', deliveredDate: '20 Jun 2026', returnEligibleUntil: '30 Jun 2026', canReturn: true, canExchange: true, orderId: '73262' },
  { id: 2, name: 'Royal Cotton Quilt King Size', image: '/images/product-2.jpg', price: 1299, qty: 1, status: 'delivered', deliveredDate: '10 May 2026', returnEligibleUntil: '20 May 2026', canReturn: false, canExchange: false, orderId: '77110' },
  { id: 3, name: 'Silk Pillow Cover Set', image: '/images/product-3.jpg', price: 449, qty: 2, status: 'shipped', deliveredDate: null, returnEligibleUntil: null, canReturn: false, canExchange: false, orderId: '09177' },
]

interface ChatMessage { role: 'user' | 'bot'; text: string }

const botResponses: Record<string, string> = {
  'return': 'You can return any delivered product within 10 days of delivery. Go to Contact Us → My Orders → Click Return.',
  'exchange': 'Exchange requests must be raised within 10 days of delivery. Select your order and click "Exchange".',
  'track': 'Track your order at /track or enter your Order ID on the Track Order page.',
  'refund': 'Refunds are processed within 5-7 business days after we receive the returned product.',
  'cancel': 'Orders can be cancelled before they are shipped. Go to My Account → Orders → Cancel Order.',
  'default': 'Thank you for reaching out! Our team will get back to you within 24 hours. For urgent queries call +91 98765 43210.',
}

function AiChatbot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hi! I'm your City Handloom assistant 👋 How can I help you today? Ask about returns, exchanges, tracking or refunds." }
  ])
  const [input, setInput] = useState('')

  const sendMessage = (text?: string) => {
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
      initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={SPRING}
      className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-petal/60"
      style={{ boxShadow: '0 20px 60px rgba(61,43,31,0.25)' }}
    >
      <div className="bg-espresso px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold-warm flex items-center justify-center">
            <Bot size={16} className="text-espresso" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ivory font-body">CH Assistant</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <p className="text-[10px] text-ivory/60 font-body">Online now</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-ivory/60 hover:text-ivory transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="h-60 overflow-y-auto p-4 space-y-3 bg-petal/10">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
          >
            {msg.role === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-gold-warm flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={12} className="text-espresso" />
              </div>
            )}
            <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs font-body leading-relaxed ${
              msg.role === 'user' ? 'bg-gold-warm text-espresso rounded-br-sm' : 'bg-white text-mocha shadow-sm rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t border-petal/40 scrollbar-hide">
        {['Return', 'Exchange', 'Track', 'Refund', 'Cancel'].map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            className="flex-shrink-0 text-[10px] text-mocha font-body border border-petal px-2.5 py-1 rounded-full hover:bg-petal/40 transition-colors">
            {q}
          </button>
        ))}
      </div>

      <div className="flex gap-2 p-3 border-t border-petal/40">
        <input type="text" placeholder="Type a message..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 text-xs font-body bg-petal/20 rounded-full px-3 py-2 outline-none" />
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage()}
          className="w-8 h-8 rounded-full bg-gold-warm flex items-center justify-center text-espresso flex-shrink-0">
          <Send size={13} />
        </motion.button>
      </div>
    </motion.div>
  )
}

function OrderCard({ order }: { order: OrderItem }) {
  const [expanded, setExpanded] = useState(false)
  const statusConfig = {
    delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-50' },
    shipped: { label: 'Shipped', color: 'text-amber-500', bg: 'bg-amber-50' },
    processing: { label: 'Processing', color: 'text-blue-500', bg: 'bg-blue-50' },
    cancelled: { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-50' },
  }
  const s = statusConfig[order.status]

  return (
    <motion.div layout className="border border-petal/60 rounded-2xl overflow-hidden bg-white">
      <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-petal/10 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 bg-petal/20"
          style={{ backgroundImage: `url('${order.image}')` }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-mocha font-body line-clamp-1">{order.name}</p>
          <p className="text-xs text-mocha/50 font-body">Qty: {order.qty} · ₹{(order.price * order.qty).toLocaleString()}</p>
          <span className={`text-[10px] font-semibold font-body px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
        </div>
        <div className="text-mocha/40">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-2.5 border-t border-petal/40">
              {order.deliveredDate && (
                <div className="flex items-center gap-2 pt-3">
                  <Clock size={13} className="text-mocha/40" />
                  <p className="text-xs text-mocha/60 font-body">Delivered on {order.deliveredDate}</p>
                </div>
              )}
              {order.status === 'delivered' && (
                <>
                  {order.canReturn ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-petal text-mocha text-xs font-semibold font-body rounded-xl hover:bg-petal/70 transition-colors">
                      <RotateCcw size={13} /> Request Return
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2.5">
                      <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-500 font-body">Return period expired (was until {order.returnEligibleUntil})</p>
                    </div>
                  )}
                  {order.canExchange ? (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-petal text-mocha text-xs font-semibold font-body rounded-xl hover:bg-petal/30 transition-colors">
                      <RefreshCw size={13} /> Request Exchange
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2.5">
                      <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
                      <p className="text-xs text-red-500 font-body">Exchange period expired (was until {order.returnEligibleUntil})</p>
                    </div>
                  )}
                </>
              )}
              {order.status === 'shipped' && (
                <Link href={`/track/${order.orderId}`}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-50 text-amber-700 text-xs font-semibold font-body rounded-xl hover:bg-amber-100 transition-colors mt-3">
                    <Package size={13} /> Track Order
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ContactPageClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  const inputClass = "w-full border border-mocha/15 rounded-lg px-4 py-2.5 text-sm font-body outline-none focus:border-gold-warm transition-colors bg-white"

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero — same layout as About Us */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '280px' }}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/banner-1.jpg')` }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(253,240,236,0.98) 0%, rgba(253,240,236,0.90) 45%, rgba(253,240,236,0.2) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 flex items-center"
          style={{ minHeight: '280px', paddingTop: '120px', paddingBottom: '40px' }}>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className={`${cormorant.className} text-5xl md:text-7xl font-semibold text-mocha mb-3`}>
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="text-xs text-mocha/50 font-body">
              HOME <span className="mx-2">›</span> CONTACT US
            </motion.p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-16 py-14">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Section 1 — Get In Touch (left) + Contact Form (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Get In Touch */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={SPRING}
            >
              <h2 className={`${cormorant.className} text-3xl md:text-4xl font-semibold text-mocha mb-2`}>
                Get In Touch
              </h2>
              <p className="text-sm text-mocha/60 font-body mb-7 leading-relaxed max-w-sm">
                Have a question about your order, a product, or just want to say hello? We'd love to hear from you.
              </p>

              {/* 4-grid contact info */}
              <div className="grid grid-cols-2 gap-4 mb-7">
                {[
                  { icon: <Phone size={20} />, label: 'Phone', value: '(+91) 98765 43210' },
                  { icon: <Mail size={20} />, label: 'Email', value: 'hello@cityhandloom.com' },
                  { icon: <MapPin size={20} />, label: 'Address', value: '12, Civil Lines, Kanpur' },
                  { icon: <MessageCircle size={20} />, label: 'WhatsApp', value: '+91 98765 43210' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    custom={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING, delay: i * 0.08 }}
                    whileHover={{ y: -3 }}
                    className="flex items-start gap-3 bg-petal/20 rounded-xl p-3.5 cursor-pointer hover:bg-petal/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-espresso flex items-center justify-center text-ivory flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-mocha font-body">{item.label}</p>
                      <p className="text-xs text-mocha/60 font-body leading-snug">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social media */}
              <div>
                <p className="text-xs font-semibold text-mocha/50 font-body uppercase tracking-wider mb-3">
                  Social Media
                </p>
                <div className="flex gap-3">
                  {[
                    { label: 'Facebook', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                    { label: 'Twitter', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                    { label: 'YouTube', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                  ].map(s => (
                    <motion.button key={s.label} whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-full bg-espresso text-ivory flex items-center justify-center hover:bg-gold-warm hover:text-espresso transition-colors">
                      {s.icon}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING, delay: 0.15 }}
              className="bg-petal/20 rounded-2xl p-6"
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={SPRING} className="text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Check size={24} className="text-green-600" />
                    </div>
                    <h3 className={`${cormorant.className} text-xl font-semibold text-mocha mb-2`}>Message Sent!</h3>
                    <p className="text-sm text-mocha/60 font-body">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Email</label>
                        <input type="email" placeholder="Email" value={form.email} onChange={e => update('email', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Name</label>
                        <input type="text" placeholder="Name" value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Phone</label>
                      <input type="tel" placeholder="Phone" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} />
                    </div>
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-mocha/70 font-body block mb-1.5">Message</label>
                      <textarea placeholder="Message" rows={5} value={form.message} onChange={e => update('message', e.target.value)} className={`${inputClass} resize-none`} />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                      onClick={handleSubmit}
                      className="w-full py-3 bg-espresso text-ivory font-semibold text-sm font-body rounded-lg hover:bg-mocha transition-colors flex items-center justify-center gap-2">
                      <Send size={14} /> SUBMIT BUTTON
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Section 2 — My Orders */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
          >
            <div className="flex items-center gap-2 mb-5">
              <Package size={18} className="text-gold-deep" />
              <h2 className={`${cormorant.className} text-2xl font-semibold text-mocha`}>
                My Orders
              </h2>
              <span className="text-xs text-mocha/40 font-body ml-1">
                — Raise return, exchange or track requests
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            <p className="text-xs text-mocha/40 font-body mt-4 text-center">
              ⓘ Return & exchange window: 10 days from delivery date. Expired items cannot be returned.
            </p>
          </motion.div>

        </div>
      </div>

      {/* Bottom spacing */}
      <div className="pb-16" />

      <Footer />

      {/* AI Chatbot */}
      <AnimatePresence>
        {showChatbot && <AiChatbot onClose={() => setShowChatbot(false)} />}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChatbot(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-espresso text-ivory shadow-xl flex items-center justify-center hover:bg-gold-warm hover:text-espresso transition-colors"
        style={{ boxShadow: '0 8px 30px rgba(61,43,31,0.35)' }}
      >
        {showChatbot ? <X size={22} /> : <Bot size={22} />}
      </motion.button>
    </main>
  )
}