import CategoryPageClient from '@/components/products/CategoryPageClient'

interface Props {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  return <CategoryPageClient category={category} />
}