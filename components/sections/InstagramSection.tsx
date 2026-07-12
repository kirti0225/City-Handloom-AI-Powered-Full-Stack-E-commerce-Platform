'use client'
import { motion } from 'framer-motion'

const posts = [
  { image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500', tall: false },
  { image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', tall: true },
  { image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', tall: false },
  { image: 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=500', tall: true },
  { image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', tall: false },
  { image: 'https://images.unsplash.com/photo-1607006483879-7bd8e4e5b5f4?w=500', tall: true },
]

export default function InstagramSection() {
  return (
    <section className="py-0 md:py-12 bg-white w-full overflow-hidden">
      {/* Container wrapper */}
      <div className="relative w-full">

        {/* Mobile: 3 Rows, 2 Columns Edge-to-Edge Grid with No Padding, Gaps, or Radius */}
        <div className="grid grid-cols-2 gap-0 px-0 md:hidden">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/cityhandloom"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative w-full aspect-[4/3] overflow-hidden block rounded-none"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 active:scale-105"
                style={{ backgroundImage: `url('${post.image}')` }}
              />
            </motion.a>
          ))}
        </div>

        {/* Desktop View Layout Strip */}
        <div className="hidden md:flex w-full h-[400px] items-center">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/cityhandloom"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, zIndex: 10 }}
              className="relative flex-1 overflow-hidden group"
              style={{
                height: post.tall ? '340px' : '260px',
                alignSelf: post.tall ? 'flex-start' : 'flex-end',
                marginTop: post.tall ? '0px' : '40px',
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${post.image}')` }}
              />
            </motion.a>
          ))}
        </div>

        {/* Center Overlay Container Brand Box */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4">
          <div
            className="flex flex-col items-center justify-center px-8 py-6 md:px-14 md:py-10 max-w-full backdrop-blur-sm rounded-xl border border-white/20 shadow-xl"
            style={{ backgroundColor: 'rgba(245, 237, 232, 0.85)' }}
          >
            <p
              className="text-xl sm:text-2xl md:text-3xl font-body font-light tracking-[0.3em] md:tracking-[0.4em] text-mocha m-0 text-center whitespace-nowrap"
            >
              INSTAGRAM
            </p>
            <a
              href="https://instagram.com/cityhandloom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs text-mocha/55 font-body mt-1 md:mt-1.5 tracking-widest pointer-events-auto hover:text-gold-deep transition-colors"
            >
              @cityhandloom
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}