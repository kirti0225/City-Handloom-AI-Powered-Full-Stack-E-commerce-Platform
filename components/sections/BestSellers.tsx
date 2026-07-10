'use client'
import { useState, useEffect } from 'react'
import HorizontalProductSection from '@/components/ui/HorizontalProductSection'
import { api } from '@/lib/api'

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    api.getProducts({ bestSellers: 'true', limit: '10' })
      .then(d => setProducts(d.data.products || []))
      .catch(() => {})
  }, [])

  return (
    <HorizontalProductSection
      title="Our BestSeller Products"
      viewAllHref="/products?sort=popular"
      products={products}
      bg="#fff"
    />
  )
}