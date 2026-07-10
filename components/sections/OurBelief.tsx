'use client'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
})

const beliefs = [
  { id: 1, label: 'Our Belief' },
  { id: 2, label: 'Our Belief' },
  { id: 3, label: 'Our Belief' },
  { id: 4, label: 'Our Belief' },
]

export default function OurBelief() {
  return (
    <section className="bg-white py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {beliefs.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full border-2 border-gold-light flex items-center justify-center bg-petal/30 hover:bg-petal/50 transition-colors">
                <Heart
                  size={32}
                  className="text-gold-deep"
                  strokeWidth={1.5}
                />
              </div>
              <span className={`${cormorant.className} text-base font-medium text-gold-deep`}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}