'use client'
import { motion } from 'framer-motion'

const posts = [
  { image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500', tall: false },
  { image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500', tall: true },
  { image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', tall: false },
  { image: 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=500', tall: true },
  { image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', tall: false },
  { image: 'https://images.unsplash.com/photo-1607006483879-7bd8e4e5b5f4?w=500', tall: true },
  { image: 'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=500', tall: false },
]

export default function InstagramSection() {
  return (
    <section className="py-12 bg-white w-full overflow-hidden">
      {/* Full width container — no padding */}
      <div className="relative w-full" style={{ height: '400px' }}>

        {/* Images strip — full width, items at varying heights */}
        <div className="flex w-full h-full items-center">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/cityhandloom"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
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

        {/* Center INSTAGRAM overlay — exact match to reference */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div
            className="flex flex-col items-center justify-center px-14 py-10"
            style={{ backgroundColor: 'rgba(245, 237, 232, 0.80)' }}
          >
            <p
              className="text-2xl md:text-3xl font-body font-light tracking-[0.4em] text-mocha"
            >
              INSTAGRAM
            </p>
            <a
              href="https://instagram.com/cityhandloom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-mocha/55 font-body mt-1.5 tracking-widest pointer-events-auto hover:text-gold-deep transition-colors"
            >
              @cityhandloom
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}