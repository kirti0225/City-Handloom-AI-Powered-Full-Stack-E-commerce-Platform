'use client'
import { useState, useEffect } from 'react'
import HorizontalProductSection from '@/components/ui/HorizontalProductSection'
import { api } from '@/lib/api'

export default function Trending() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    api.getProducts({ trending: 'true', limit: '10' })
      .then(d => setProducts(d.data.products || []))
      .catch(() => {})
  }, [])

  return (
    <HorizontalProductSection
      title="Trending"
      viewAllHref="/products?sort=rating"
      products={products}
      bg="#FDF0EC"
    />
  )
}