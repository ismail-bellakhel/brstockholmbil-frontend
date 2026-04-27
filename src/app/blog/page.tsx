import type { Metadata } from 'next'
import { getArticles } from '@/lib/api/wordpress'
import { ArticleCard } from '@/components/blog/ArticleCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Nyheter & Artiklar',
  description: 'Nyheter, guider och tips om bilar från vårt team. Köpguider, marknadsanalyser och reportage om klassiska bilar.',
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const page = Number(sp.page ?? 1)
  const { items: articles, total, total_pages } = await getArticles(page, 12)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-2">Nyheter & artiklar</p>
        <h1 className="text-3xl font-light text-stone-900 mb-3">Från oss</h1>
        <p className="text-stone-500">
          Guider, marknadsanalyser och reportage om bilar och samlarsektionen.
        </p>
      </div>

      {/* Article grid */}
      {articles.length > 0 ? (
        <>
          {/* First article — large */}
          <div className="mb-12">
            <ArticleCard article={articles[0]} priority size="large" />
          </div>

          {/* Rest — 3-column grid */}
          {articles.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total_pages > 1 && (
            <nav className="mt-12 flex justify-center gap-2" aria-label="Sidnavigation">
              {Array.from({ length: total_pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/blog?page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                    p === page
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900'
                  }`}
                >
                  {p}
                </a>
              ))}
            </nav>
          )}
        </>
      ) : (
        <p className="text-stone-400 text-center py-20">Inga artiklar publicerade ännu.</p>
      )}
    </div>
  )
}
