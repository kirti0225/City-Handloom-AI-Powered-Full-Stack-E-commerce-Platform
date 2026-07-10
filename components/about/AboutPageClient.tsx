'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import { Sparkles, Heart, Award, Users, ShoppingBag, Star } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14, mass: 1.1 }

const stats = [
  { value: '12K+', label: 'Products Sold', icon: <ShoppingBag size={20} /> },
  { value: '850+', label: 'Happy Customers', icon: <Heart size={20} /> },
  { value: '4.8★', label: 'Average Rating', icon: <Star size={20} /> },
  { value: '10+', label: 'Years Experience', icon: <Award size={20} /> },
]

const team = [
  { name: 'Rahul Sharma', role: 'Founder & CEO', image: '/images/product-1.jpg' },
  { name: 'Priya Gupta', role: 'Head of Design', image: '/images/product-2.jpg' },
  { name: 'Amit Verma', role: 'Master Weaver', image: '/images/product-3.jpg' },
  { name: 'Sunita Devi', role: 'Quality Expert', image: '/images/product-4.jpg' },
]

const values = [
  { title: 'Handcrafted with Love', desc: 'Every product is hand-woven by skilled artisans who have inherited the craft through generations, ensuring authenticity in every thread.' },
  { title: 'Premium Quality', desc: 'We use only the finest natural fibers — pure cotton, silk, and linen — sourced ethically from trusted suppliers across India.' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...SPRING, delay: i * 0.1 },
  }),
}

export default function AboutPageClient() {
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: true, margin: '-80px' })

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero — same layout as reference: title left, image right */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '280px' }}>
        {/* Background full width */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/lifestyle-main.jpg')` }}
        />
        {/* Light overlay on left for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(253,240,236,0.98) 0%, rgba(253,240,236,0.90) 45%, rgba(253,240,236,0.2) 100%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 flex items-center" style={{ minHeight: '280px', paddingTop: '120px', paddingBottom: '40px' }}>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className={`${cormorant.className} text-5xl md:text-7xl font-semibold text-mocha mb-3`}
            >
              About Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="text-xs text-mocha/50 font-body"
            >
              HOME <span className="mx-2">›</span> ABOUT US
            </motion.p>
          </div>
        </div>
      </div>

      {/* Who We Are — image left, content right */}
      <section className="px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* Left — image with quote card */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={SPRING}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden" style={{ height: '460px' }}>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/images/lifestyle-1.jpg')` }}
              />
            </div>
            {/* Floating quote card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.3 }}
              className="absolute bottom-8 right-0 translate-x-6 bg-white rounded-2xl shadow-xl p-5 max-w-[210px]"
            >
              <p className={`${cormorant.className} text-sm italic text-mocha leading-relaxed mb-3`}>
                "Weaving tradition into every thread, luxury into every home."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-petal flex items-center justify-center">
                  <span className={`${cormorant.className} text-xs font-semibold text-gold-deep`}>RS</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-mocha font-body">Rahul Sharma</p>
                  <p className="text-[10px] text-mocha/50 font-body">Founder, City Handloom</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={SPRING}
          >
            <p className="text-xs text-gold-deep font-body font-semibold tracking-widest uppercase mb-2">
              Who We Are
            </p>
            <h2 className={`${cormorant.className} text-3xl md:text-4xl font-semibold text-mocha leading-tight mb-4`}>
              Handloom is about passion,
              <span className="italic text-gold-warm"> not just fabric</span>
            </h2>
            <p className="text-sm text-mocha/65 font-body leading-relaxed mb-6">
              City Handloom was born in the heart of Kanpur — India's textile capital. Founded in 2014, we set out with a simple mission: to bring the beauty of authentic handloom weaving to every Indian home, while keeping the age-old craft alive and our artisans thriving.
            </p>

            {values.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-5 pb-5 border-b border-petal/60 last:border-0"
              >
                <p className="text-sm font-semibold text-mocha font-body mb-1">{v.title}</p>
                <p className="text-xs text-mocha/60 font-body leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.3 }}
              className="mt-4"
            >
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gold-warm text-espresso font-semibold text-sm font-body px-8 py-3 rounded-sm hover:bg-gold-deep transition-colors"
                >
                  DISCOVER MORE
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-12 px-4 md:px-8 lg:px-16 border-y border-petal/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isStatsInView ? 'visible' : 'hidden'}
              className="text-center"
            >
              <p className={`${cormorant.className} text-4xl md:text-5xl font-semibold text-gold-warm mb-1`}>
                {stat.value}
              </p>
              <p className="text-xs text-mocha/55 font-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Full width CTA banner */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '460px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/lifestyle-2.jpg')` }}
        />
        <div className="absolute inset-0 bg-espresso/65" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs text-gold-warm font-body tracking-widest uppercase mb-3"
          >
            Get Started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
            className={`${cormorant.className} text-3xl md:text-5xl font-semibold text-white leading-tight mb-4 max-w-2xl`}
          >
            Do styling your home with our
            <span className="italic text-gold-warm"> best handloom designs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
            className="text-sm text-white/70 font-body max-w-lg mb-8"
          >
            Every piece in our collection tells a story of craftsmanship, culture, and care.
          </motion.p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gold-warm text-espresso font-semibold text-sm font-body px-8 py-3.5 rounded-sm hover:bg-gold-deep transition-colors"
            >
              DISCOVER MORE
            </motion.button>
          </Link>
        </div>

        {/* 3 service cards — overlapping banner bottom */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 md:px-8 lg:px-16 z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Users size={22} className="text-gold-deep" />, title: 'Design for Personal', desc: 'Custom handloom designs tailored to your home decor preferences and color palette.' },
              { icon: <ShoppingBag size={22} className="text-gold-deep" />, title: 'Massive Production', desc: 'Corporate gifting and bulk orders handled with the same care as individual pieces.' },
              { icon: <Award size={22} className="text-gold-deep" />, title: 'Special Event Styling', desc: 'Curated gifting hampers for weddings, festivals, and special celebrations.' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-lg p-5 flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-petal flex items-center justify-center flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-mocha font-body mb-1">{card.title}</p>
                  <p className="text-xs text-mocha/55 font-body leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Space for overlapping cards */}
      <div className="bg-white" style={{ height: '80px' }} />

      {/* Team */}
      <section className="bg-white px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-3"
          >
            <p className="text-xs text-gold-deep font-body font-semibold tracking-widest uppercase mb-2">
              Meet Our Team
            </p>
            <h2 className={`${cormorant.className} text-3xl md:text-4xl font-semibold text-mocha`}>
              We serve uniqueness because
            </h2>
            <h2 className={`${cormorant.className} text-3xl md:text-4xl font-semibold text-mocha mb-2`}>
              you are unique to us
            </h2>
            <div className="w-12 h-0.5 bg-gold-warm mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="text-center group cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${member.image}')` }}
                  />
                </div>
                <h3 className={`${cormorant.className} text-lg font-semibold text-mocha`}>{member.name}</h3>
                <p className="text-xs text-mocha/55 font-body mb-2">{member.role}</p>
                <div className="flex justify-center gap-2">
                  {[
                    <svg key="fb" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                    <svg key="tw" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                    <svg key="yt" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
                    <svg key="ig" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
                  ].map((icon, j) => (
                    <div key={j} className="w-6 h-6 rounded-full bg-petal/60 flex items-center justify-center text-mocha/60 hover:bg-gold-warm hover:text-white transition-colors cursor-pointer">
                      {icon}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner logos */}
      <section className="bg-petal/20 py-10 px-4 md:px-8 lg:px-16 border-t border-petal/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-8 justify-between">
          <p className="text-sm font-semibold text-mocha font-body whitespace-nowrap">
            Our Amazing Clients Worldwide:
          </p>
          <div className="flex flex-wrap gap-8 items-center flex-1 justify-around">
            {['Craftsvilla', 'IndiaMART', 'Amazon', 'Flipkart'].map((brand, i) => (
              <motion.p
                key={brand}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`${cormorant.className} text-2xl font-semibold text-mocha/30 hover:text-mocha/60 transition-colors cursor-pointer`}
              >
                {brand}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}