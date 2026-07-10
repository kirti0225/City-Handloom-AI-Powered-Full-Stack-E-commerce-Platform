'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
})

const videos = [
  {
    id: 1,
    category: 'Curtains',
    desc: 'Best bedsheet very comfort',
    price: 560,
    oldPrice: 560,
    video: '/videos/video-1.mp4',
    poster: '/images/video-1-poster.jpg',
  },
  {
    id: 2,
    category: 'Curtains',
    desc: 'Best bedsheet very comfort',
    price: 560,
    oldPrice: 560,
    video: '/videos/video-2.mp4',
    poster: '/images/video-2-poster.jpg',
  },
  {
    id: 3,
    category: 'Curtains',
    desc: 'Best Blanket very comfort and soft',
    price: 560,
    oldPrice: 560,
    video: '/videos/video-3.mp4',
    poster: '/images/video-3-poster.jpg',
  },
  {
    id: 4,
    category: 'Curtains',
    desc: 'Best pillow cover very comfort',
    price: 560,
    oldPrice: 560,
    video: '/videos/video-4.mp4',
    poster: '/images/video-4-poster.jpg',
  },
]

function VideoCard({ video, index }: { video: typeof videos[0]; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="cursor-pointer group"
    >
      {/* Video player */}
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-md bg-mocha/10 mb-3"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={video.video}
          poster={video.poster}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-espresso/10 group-hover:bg-espresso/20 transition-colors pointer-events-none" />

        {/* Play / Pause button */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md"
        >
          {isPlaying ? (
            <Pause size={14} className="text-mocha fill-mocha" />
          ) : (
            <Play size={14} className="text-mocha fill-mocha ml-0.5" />
          )}
        </motion.div>
      </div>

      {/* Info */}
      <p className="text-xs text-mocha/50 font-body mb-1">
        {video.category}
      </p>
      <p className="text-sm text-mocha font-body mb-2 leading-snug">
        {video.desc}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-mocha font-body">
          ₹ {video.price}
        </span>
        <span className="text-xs text-mocha/40 line-through font-body">
          ₹ {video.oldPrice}
        </span>
      </div>
    </motion.div>
  )
}

export default function WatchingVideos() {
  return (
    <section className="bg-white py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        <h2 className={`${cormorant.className} text-2xl md:text-3xl font-semibold text-mocha mb-8`}>
          Buy Watching Videos
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}