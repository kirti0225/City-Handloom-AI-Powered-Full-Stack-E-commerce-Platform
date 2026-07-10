'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'] })

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&auto=format',
    tag: '🎉 Grand Launch Offer',
    title: 'Up to 50% OFF',
    titleItalic: 'on Premium Bedding',
    cta: 'Shop Bedding',
    href: '/products/bedsheets',
    textSide: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&auto=format',
    tag: '✨ New Arrivals',
    title: 'Handloom Curtains',
    titleItalic: 'for Every Home',
    cta: 'Explore Curtains',
    href: '/products/curtains',
    textSide: 'right',
  },
]

export default function GifBanner() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % banners.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-12 bg-white">
      <div className="px-4 md:px-8 lg:px-16">
        <div className="relative h-[280px] md:h-[360px] rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${banners[active].image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-espresso/75 via-espresso/30 to-transparent" />

              <div className={`absolute inset-0 flex items-center ${banners[active].textSide === 'right' ? 'justify-end' : 'justify-start'} px-10 md:px-16`}>
                <div className="max-w-xs">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-gold-warm font-body tracking-widest uppercase mb-2"
                  >
                    {banners[active].tag}
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`${cormorant.className} text-3xl md:text-5xl font-semibold text-white leading-tight`}
                  >
                    {banners[active].title}<br />
                    <span className="italic text-gold-warm">{banners[active].titleItalic}</span>
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="mt-5"
                  >
                    <Link href={banners[active].href}>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-gold-warm text-espresso font-semibold text-sm font-body px-7 py-3 rounded-full hover:bg-gold-deep transition-colors"
                      >
                        {banners[active].cta}
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-gold-warm' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}