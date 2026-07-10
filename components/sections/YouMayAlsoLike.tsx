'use client'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Link from 'next/link'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }

const panels = [
  {
    title: 'You May Also Like',
    sub: 'Natural and organic is the future of skincare and life as we know it.',
    cta: 'Shop Now',
    href: '/products',
    // Left panel: solid pink/peach bg, product image on the right half
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    bg: '#F2D4CC',
    textColor: '#1A0F0A',
  },
  {
    title: 'Customer Favourite Handloom Essentials',
    sub: 'Natural and organic is the future of skincare and life as we know it.',
    cta: 'Shop Now',
    href: '/products',
    // Right panel: very light cream bg, product image on the right
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    bg: '#FAF6F3',
    textColor: '#1A0F0A',
  },
]

export default function YouMayAlsoLike() {
  return (
    <section className="py-12 bg-white">
      <div className="px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.1 }}
              className="relative overflow-hidden group"
              style={{ backgroundColor: panel.bg, borderRadius: '4px', minHeight: '380px' }}
            >
              {/* Text — top left, always visible */}
              <div className="absolute top-0 left-0 z-10 p-8 max-w-[55%]">
                <h3
                  className="text-xl md:text-2xl font-bold leading-snug mb-3"
                  style={{ color: panel.textColor, fontFamily: 'inherit' }}
                >
                  {panel.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: panel.textColor, opacity: 0.65 }}>
                  {panel.sub}
                </p>
                <Link href={panel.href}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-white text-sm font-semibold font-body px-6 py-3 transition-colors"
                    style={{ backgroundColor: '#1A0F0A', borderRadius: '2px' }}
                  >
                    {panel.cta}
                  </motion.button>
                </Link>
              </div>

              {/* Product image — right side, cut off at right edge */}
              <div
                className="absolute right-0 bottom-0 top-0 w-[55%] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${panel.image}')` }}
              />

              {/* Blend gradient — text panel into image */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to right, ${panel.bg} 35%, ${panel.bg}88 50%, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}