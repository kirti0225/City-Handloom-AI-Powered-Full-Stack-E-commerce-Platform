'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Mail } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
})

const quickBuy = ['Buy Bedsheets', 'Buy Blackout Curtains', 'Buy Blankets', 'Buy Cushion Covers', 'Buy Carpets', 'Buy Table Linen']

const importantLinks = ['Track Order', 'About Us', 'Curtains Customization', 'Shipping Policy', 'Exchange & Refund Policy', 'Privacy Policy', 'Terms & Conditions', 'Sitemap', 'Blogs']

const collectionPages = ['Buy Cotton Curtains', 'Buy Table Cloths', 'Buy Bedding Combos', 'Buy Soft Mats', 'Buy Home Decor', 'Buy Tote Bags', 'Buy Mix n Match Curtains']

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-espresso text-ivory px-4 md:px-8 pt-14 pb-6 mt-0">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Column 1 — Newsletter */}
          <div className="md:col-span-1">
            <h3 className={`${cormorant.className} text-lg font-semibold mb-4`}>
              Stay Updated
            </h3>
            <div className="flex items-center border-b border-ivory/30 pb-2 mb-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-sm text-ivory placeholder:text-ivory/40 outline-none flex-1 font-body"
              />
              <motion.button whileHover={{ x: 3 }} className="text-gold-warm">
                <ArrowRight size={18} />
              </motion.button>
            </div>
            <p className="text-xs text-ivory/50 font-body leading-relaxed">
              Be the first to get latest offers, decor tips, celebrity tie-ups and blogs
            </p>
          </div>

          {/* Column 2 — Quick Buy */}
          <div>
            <h3 className={`${cormorant.className} text-base font-semibold mb-4`}>
              Quick Buy
            </h3>
            <ul className="space-y-2.5">
              {quickBuy.map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-ivory/60 hover:text-gold-warm transition-colors font-body">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Important Links */}
          <div>
            <h3 className={`${cormorant.className} text-base font-semibold mb-4`}>
              Important Links
            </h3>
            <ul className="space-y-2.5">
              {importantLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-ivory/60 hover:text-gold-warm transition-colors font-body">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Collection Pages */}
          <div>
            <h3 className={`${cormorant.className} text-base font-semibold mb-4`}>
              Collection Pages
            </h3>
            <ul className="space-y-2.5">
              {collectionPages.map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs text-ivory/60 hover:text-gold-warm transition-colors font-body">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 — Address */}
          <div>
            <h3 className={`${cormorant.className} text-base font-semibold mb-4`}>
              Address
            </h3>
            <p className="text-xs text-ivory/60 font-body leading-relaxed mb-4">
              City Handloom Store<br />
              [Your full address here]<br />
              Kanpur, Uttar Pradesh
            </p>

            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={14} className="text-gold-warm" />
              <span className="text-xs text-ivory/60 font-body">WhatsApp Support</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Mail size={14} className="text-gold-warm" />
              <span className="text-xs text-ivory/60 font-body">Email Support</span>
            </div>

            <div className="flex gap-3">
  <a href="#" className="w-8 h-8 rounded-full border border-ivory/30 flex items-center justify-center hover:border-gold-warm hover:text-gold-warm transition-colors">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  </a>
  <a href="#" className="w-8 h-8 rounded-full border border-ivory/30 flex items-center justify-center hover:border-gold-warm hover:text-gold-warm transition-colors">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  </a>
  <a href="#" className="w-8 h-8 rounded-full border border-ivory/30 flex items-center justify-center hover:border-gold-warm hover:text-gold-warm transition-colors">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  </a>
</div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-ivory/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <span className={`${cormorant.className} text-sm text-gold-warm tracking-wider`}>
            CITY HANDLOOM
          </span>
          <p className="text-xs text-ivory/40 font-body">
            © 2026 City Handloom. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}