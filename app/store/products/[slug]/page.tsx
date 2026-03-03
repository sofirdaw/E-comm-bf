// app/store/products/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/store/ProductDetailClient'
import { ProductCard } from '@/components/store/ProductCard'
import { ReviewSection } from '@/components/store/ReviewSection'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      variants: true,
    },
  })

  if (!product) return null

  // Increment views
  await prisma.product.update({
    where: { id: product.id },
    data: { views: { increment: 1 } },
  }).catch(() => { })

  // Related products (same category)
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      published: true,
      NOT: { id: product.id },
    },
    take: 4,
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { rating: 'desc' },
  })

  return { product, related }
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params
  const data = await getProduct(resolvedParams.slug)
  if (!data) return { title: 'Produit introuvable' }

  return {
    title: data.product.name,
    description: data.product.description.substring(0, 160),
    openGraph: {
      title: data.product.name,
      description: data.product.description.substring(0, 160),
      images: [data.product.images[0]],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params
  const data = await getProduct(resolvedParams.slug)
  if (!data) notFound()

  const { product, related } = data

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ProductDetailClient product={product as any} />

      {/* Customer Reviews */}
      <ReviewSection productId={product.id} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
