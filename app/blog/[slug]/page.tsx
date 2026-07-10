import BlogPostClient from '@/components/blog/BlogPostClient'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <BlogPostClient slug={(await params).slug} />
}