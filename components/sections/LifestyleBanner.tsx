'use client'
import { motion } from 'framer-motion'

export default function LifestyleBanner() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-3 h-[600px] md:h-[550px] px-3">

        {/* Left — large wide image with Explore More */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden group cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('/images/lifestyle-main.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 via-transparent to-transparent" />
          <button className="absolute bottom-8 left-8 px-7 py-3.5 bg-gold-warm text-espresso text-sm font-semibold font-body hover:bg-gold-deep transition-colors">
            Explore More
          </button>
        </motion.div>

        {/* Right — two stacked images */}
        <div className="grid grid-rows-2 gap-3 h-full">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('/images/lifestyle-1.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 text-white text-base font-semibold font-body">
              View more
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden group cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('/images/lifestyle-2.jpg')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />
            <span className="absolute bottom-5 left-5 text-white text-base font-semibold font-body">
              View more
            </span>
          </motion.div>
        </div>

      </div>
    </section>
  )
}