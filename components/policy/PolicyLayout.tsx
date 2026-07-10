'use client'
import { motion } from 'framer-motion'
import { Cormorant_Garamond } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'] })
const SPRING = { type: 'spring' as const, stiffness: 80, damping: 14 }

interface Section {
  title: string
  content: string | string[]
}

interface Props {
  title: string
  lastUpdated: string
  intro: string
  sections: Section[]
}

export default function PolicyLayout({ title, lastUpdated, intro, sections }: Props) {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="pt-28 md:pt-32 pb-10 px-4 md:px-8 border-b border-petal/60">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-mocha/50 font-body mb-2"
          >
            Home <span className="mx-1.5">›</span> {title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className={`${cormorant.className} text-3xl md:text-5xl font-semibold text-mocha mb-3`}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-mocha/40 font-body"
          >
            Last updated: {lastUpdated}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Intro */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-mocha/70 font-body leading-relaxed mb-10 pb-10 border-b border-petal/60"
          >
            {intro}
          </motion.p>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...SPRING, delay: i * 0.05 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-petal flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-gold-deep font-body">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className={`${cormorant.className} text-xl font-semibold text-mocha mb-3`}>
                      {section.title}
                    </h2>
                    {Array.isArray(section.content) ? (
                      <ul className="space-y-2">
                        {section.content.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-mocha/70 font-body leading-relaxed">
                            <span className="text-gold-warm mt-1.5 flex-shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-mocha/70 font-body leading-relaxed">{section.content}</p>
                    )}
                  </div>
                </div>
                {i < sections.length - 1 && <div className="mt-8 border-b border-petal/40" />}
              </motion.div>
            ))}
          </div>

          {/* Contact note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-petal/30 rounded-2xl p-6 text-center"
          >
            <p className="text-sm text-mocha/70 font-body">
              Questions about this policy? Contact us at{' '}
              <a href="mailto:hello@cityhandloom.com" className="text-gold-deep underline">
                hello@cityhandloom.com
              </a>
              {' '}or call{' '}
              <a href="tel:+919876543210" className="text-gold-deep underline">
                +91 98765 43210
              </a>
            </p>
          </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  )
}