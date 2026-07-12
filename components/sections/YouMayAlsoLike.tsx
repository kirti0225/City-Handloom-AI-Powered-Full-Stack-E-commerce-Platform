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
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    bg: '#F2D4CC',
    textColor: '#1A0F0A',
  },
  {
    title: 'Customer Favourite Handloom Essentials',
    sub: 'Natural and organic is the future of skincare and life as we know it.',
    cta: 'Shop Now',
    href: '/products',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    bg: '#FAF6F3',
    textColor: '#1A0F0A',
  },
]

export default function YouMayAlsoLike() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="px-4 md:px-8 lg:px-16">
        {/* Forces single column vertical stack on mobile, grid layout side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-5">
          {panels.map((panel, i) => (
            <motion.div
              key={panel.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.1 }}
              className="relative overflow-hidden group rounded-xl flex flex-col md:block"
              style={{ backgroundColor: panel.bg, minHeight: 'auto' }}
            >
              {/* Text Layout Block — Fluid height on mobile, absolute top-left overlay on desktop */}
              <div className="relative md:absolute md:top-0 md:left-0 z-20 p-6 sm:p-8 w-full md:max-w-[55%] flex flex-col items-start">
                <h3
                  className={`${cormorant.className} text-xl sm:text-2xl font-bold leading-snug mb-2 sm:mb-3`}
                  style={{ color: panel.textColor }}
                >
                  {panel.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-body" style={{ color: panel.textColor, opacity: 0.65 }}>
                  {panel.sub}
                </p>
                <Link href={panel.href}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-white text-xs sm:text-sm font-semibold font-body px-5 py-2.5 sm:px-6 sm:py-3 transition-colors"
                    style={{ backgroundColor: '#1A0F0A', borderRadius: '4px' }}
                  >
                    {panel.cta}
                  </motion.button>
                </Link>
              </div>

              {/* Product Image Block — Stacked under text on mobile, set to 55% absolute width on desktop */}
              <div
                className="relative md:absolute md:right-0 md:bottom-0 md:top-0 w-full h-[220px] sm:h-[260px] md:w-[55%] md:h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 z-10"
                style={{ backgroundImage: `url('${panel.image}')` }}
              />

              {/* Layout Blend Gradients — Hidden on mobile, renders clean background blending transparency on desktop */}
              <div
                className="hidden md:block absolute inset-0 pointer-events-none z-15"
                style={{
                  background: `linear-gradient(to right, ${panel.bg} 40%, ${panel.bg}99 55%, transparent 75%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}