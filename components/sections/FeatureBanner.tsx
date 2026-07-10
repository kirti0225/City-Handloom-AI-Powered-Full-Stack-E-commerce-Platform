'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
})

interface Product {
  id: number
  name: string
  desc: string
  price: number
  oldPrice?: number
  discount?: string
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Jaipuriya Bedsheet',
    desc: 'Pure cotton handloom bedsheet, soft and breathable',
    price: 560,
    oldPrice: 799,
    discount: '30% OFF',
    image: '/images/feature-1.jpg',
  },
  {
    id: 2,
    name: 'Royal Cotton Quilt',
    desc: 'Handcrafted quilt with traditional embroidery',
    price: 1299,
    oldPrice: 1799,
    discount: '28% OFF',
    image: '/images/feature-2.jpg',
  },
  {
    id: 3,
    name: 'Handloom Curtain Set',
    desc: 'Elegant curtains woven with natural fibers',
    price: 899,
    image: '/images/feature-3.jpg',
  },
  {
    id: 4,
    name: 'Silk Pillow Cover',
    desc: 'Premium silk-blend pillow cover, set of 2',
    price: 449,
    oldPrice: 599,
    discount: '25% OFF',
    image: '/images/feature-4.jpg',
  },
  {
    id: 5,
    name: 'Cotton Table Linen',
    desc: 'Hand-dyed table cloth with traditional motifs',
    price: 699,
    image: '/images/feature-5.jpg',
  },
]

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 26 }

// Arc positions for the 4 satellite thumbnails (around the main image)
// x/y as % offsets from center of the orbit area
const arcPositions = [
  { x: -10, y: -42 },  // top-left
  { x: 38, y: -28 },   // top-right
  { x: 40, y: 30 },    // bottom-right
  { x: -8, y: 44 },    // bottom-left
]

function useAutoSlide(callback: () => void, enabled: boolean) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    if (!enabled) return
    const interval = setInterval(() => callbackRef.current(), 3000)
    return () => clearInterval(interval)
  }, [enabled])
}

export default function FeatureBanner() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const total = products.length

  const goNext = () => setActive((prev) => (prev + 1) % total)
  const goTo = (index: number) => setActive(index)

  useAutoSlide(goNext, true)

  const current = products[active]

  // The 4 products NOT currently active, in order, get placed on the arc
  const satellites = products
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter((p) => p.originalIndex !== active)
    .slice(0, 4)

  return (
<section ref={ref} className="w-full bg-white py-16 md:py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-gold-deep font-body tracking-[0.2em] uppercase mb-2">
            Curated For You
          </p>
          <h2 className={`${cormorant.className} text-3xl md:text-4xl font-semibold text-mocha`}>
            Featured Collection
          </h2>
        </motion.div>

<div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-28">

          {/* Text content — left side */}
          <motion.div
  key={current.id}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4 }}
  className="text-center md:text-left max-w-sm"
>
            <h3 className={`${cormorant.className} text-2xl md:text-3xl font-semibold text-mocha mb-2`}>
              {current.name}
            </h3>
            <p className="text-sm text-mocha/55 font-body mb-4 leading-relaxed">
              {current.desc}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <span className="text-xl font-bold text-gold-deep font-body">
                ₹ {current.price}
              </span>
              {current.oldPrice && (
                <span className="text-sm text-mocha/35 line-through font-body">
                  ₹ {current.oldPrice}
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gold-warm text-espresso font-semibold text-sm font-body px-7 py-3 rounded-full hover:bg-gold-deep transition-colors"
            >
              Shop Now
            </motion.button>
          </motion.div>

          {/* Orbit area — main fixed image + 4 arc satellites */}
<div className="relative w-full max-w-[420px] h-[400px] sm:h-[440px]">
            {/* Main image — fixed position, content crossfades */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.div
                animate={{
                  filter: 'drop-shadow(0 30px 45px rgba(61,43,31,0.28))',
                }}
                className="relative w-[230px] h-[230px] sm:w-[270px] sm:h-[270px] rounded-full overflow-hidden"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={false}
                    animate={{
                      opacity: product.id === current.id ? 1 : 0,
                      scale: product.id === current.id ? 1 : 1.1,
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${product.image}')` }}
                  />
                ))}

                {current.discount && (
                  <span className="absolute top-5 left-5 bg-gold-warm text-espresso text-[10px] font-bold font-body px-2.5 py-1 rounded-full z-10">
                    {current.discount}
                  </span>
                )}
              </motion.div>
            </div>

            {/* 4 satellite thumbnails on the arc */}
            {satellites.map((sat, i) => {
              const pos = arcPositions[i]
              return (
                <motion.button
                  key={sat.id}
                  onClick={() => goTo(sat.originalIndex)}
                  initial={false}
                  animate={{
                    left: `calc(50% + ${pos.x}%)`,
                    top: `calc(50% + ${pos.y}%)`,
                  }}
                  transition={SPRING}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white"
                    style={{
                      filter: 'drop-shadow(0 8px 16px rgba(61,43,31,0.18))',
                    }}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${sat.image}')` }}
                    />
                  </div>
                </motion.button>
              )
            })}
          </div>

        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-10">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-gold-warm' : 'w-2 bg-mocha/20 hover:bg-mocha/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}