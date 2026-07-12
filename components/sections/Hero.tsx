'use client'
import { useState, useEffect } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const slides = [
  {
    image: '/images/bedsheet-b.jpeg',
    titleNormal: 'All The',
    titleItalic: 'Way to',
    titleLine2: 'the Bedroom',
    subtitle: 'Pure cotton handloom bedsheets, curtains and fabrics — crafted with tradition',
    cta: 'Explore More',
  },
  {
    image: '/images/curtains-b.jpeg',
    titleNormal: 'Drape Your',
    titleItalic: 'World in',
    titleLine2: 'Elegance',
    subtitle: 'Handwoven curtains that bring warmth and tradition to every window',
    cta: 'Shop Curtains',
  },
  {
    image: '/images/blanket-b.jpeg',
    titleNormal: 'Wrapped in',
    titleItalic: 'Pure',
    titleLine2: 'Comfort',
    subtitle: 'Soft, breathable quilts handcrafted by skilled artisans',
    cta: 'View Quilts',
  },
  {
    image: '/images/pillow-b.jpeg',
    titleNormal: 'Rest in',
    titleItalic: 'Total',
    titleLine2: 'Softness',
    subtitle: 'Premium pillow covers designed for everyday luxury',
    cta: 'Shop Pillows',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => setCurrent(index)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative w-full h-[55vh] md:h-[85vh] min-h-[400px] md:min-h-[500px] overflow-hidden -mt-1">

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${slides[current].image}')`,
              filter: 'brightness(0.85)',
            }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(200, 155, 109, 0.64) 40%, rgba(74, 46, 30, 0.16) 59%)',
            }}
          />

          {/* Content with responsive padding and text constraints */}
          <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-22 max-w-5xl">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`${cormorant.className} text-3xl md:text-6xl font-semibold text-white leading-tight mb-3 md:mb-4`}
            >
              {slides[current].titleNormal}{' '}
              <span className="text-gold-warm italic">{slides[current].titleItalic}</span>
              <br />
              {slides[current].titleLine2}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/80 text-xs md:text-base font-body mb-6 md:mb-8 max-w-md md:max-w-none leading-relaxed"
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-fit px-6 py-2.5 md:px-8 md:py-3 bg-gold-warm text-espresso font-body font-semibold text-xs md:text-sm tracking-wider hover:bg-gold-deep transition-colors duration-300"
            >
              {slides[current].cta}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left/Right arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-gold-warm' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

    </section>
  )
}