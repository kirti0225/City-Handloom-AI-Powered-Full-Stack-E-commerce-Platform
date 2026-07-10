'use client'
import { useState, useRef } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'
import Image from 'next/image'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
})

const collections = [
  { id: 1, name: 'Jaipuriya Bedsheet', image: '/images/product-1.webp' },
  { id: 2, name: 'Jaipuriya Bedsheet', image: '/images/product-2.webp' },
  { id: 3, name: 'Jaipuriya Bedsheet', image: '/images/product-3.avif' },
  { id: 4, name: 'Jaipuriya Bedsheet', image: '/images/product-4.webp' },
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
}

export default function TopCollections() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      style={{ backgroundColor: '#FDF0EC' }}
      className="py-14 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex items-center justify-between mb-10">
          <h2 className={`${cormorant.className} text-2xl md:text-3xl font-semibold text-mocha`}>
            Top Collections
          </h2>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: '#F7ECE8' }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-mocha transition-colors border border-petal"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: '#F7ECE8' }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-mocha transition-colors border border-petal"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* Cards grid */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {collections.map((item, i) => (
            <motion.div
              key={item.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer"
              style={{ willChange: 'transform' }}
            >
              {/* Card container */}
              <motion.div
                animate={{
                  y: hoveredId === item.id ? -8 : 0,
                  boxShadow: hoveredId === item.id
                    ? '0 20px 40px rgba(61, 43, 31, 0.15)'
                    : '0 2px 8px rgba(61, 43, 31, 0.06)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-white rounded-2xl overflow-hidden"
              >
                {/* Image — tall, takes most of card */}
                <div className="relative overflow-hidden"
                  style={{ height: '280px' }}>
                  <motion.div
                    animate={{
                      scale: hoveredId === item.id ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  {/* Shimmer overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0, x: '-100%' }}
                    animate={{
                      opacity: hoveredId === item.id ? 1 : 0,
                      x: hoveredId === item.id ? '100%' : '-100%',
                    }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                    }}
                  />
                </div>

                {/* Name below image */}
                <div className="px-4 py-4">
                  <motion.h3
                    animate={{
                      color: hoveredId === item.id ? '#B8860B' : '#3D2B1F',
                    }}
                    transition={{ duration: 0.2 }}
                    className={`${cormorant.className} text-lg font-medium text-center`}
                  >
                    {item.name}
                  </motion.h3>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}