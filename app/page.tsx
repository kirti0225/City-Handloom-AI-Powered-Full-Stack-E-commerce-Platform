import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import ShopByCategory from '@/components/sections/ShopByCategory'
import BestSellers from '@/components/sections/BestSellers'
import GifBanner from '@/components/sections/GifBanner'
import Trending from '@/components/sections/Trending'
import YouMayAlsoLike from '@/components/sections/YouMayAlsoLike'
import BestHomeAccessories from '@/components/sections/BestHomeAccessories'
import InstagramSection from '@/components/sections/InstagramSection'
import WatchingVideos from '@/components/sections/WatchingVideos'

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <ShopByCategory />
      <BestSellers />
      <GifBanner />
      <Trending />
      <YouMayAlsoLike />
      <BestHomeAccessories />
      <InstagramSection />
      <WatchingVideos />
      <Footer />
    </main>
  )
}