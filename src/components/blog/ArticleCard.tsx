import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/types'
import { formatDate } from '@/lib/utils/metadata'

interface ArticleCardProps {
  article: Article
  priority?: boolean
  size?: 'default' | 'large'
}

export function ArticleCard({ article, priority = false, size = 'default' }: ArticleCardProps) {
  const category = article.categories[0]

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block"
    >
      {/* Image */}
      {article.featured_image && (
        <div className={`relative overflow-hidden bg-stone-100 mb-4 ${size === 'large' ? 'aspect-[16/9]' : 'aspect-[3/2]'}`}>
          <Image
            src={article.featured_image.sizes.large ?? article.featured_image.url}
            alt={article.title}
            fill
            sizes={size === 'large' ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority={priority}
            unoptimized={article.featured_image.url.startsWith('data:')}
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mb-2">
        {category && (
          <span className="text-[10px] tracking-widest uppercase text-stone-400">
            {category.name}
          </span>
        )}
        <span className="text-[10px] text-stone-300">·</span>
        <time
          dateTime={article.published_at}
          className="text-[10px] tracking-wide text-stone-400"
        >
          {formatDate(article.published_at)}
        </time>
      </div>

      {/* Title */}
      <h3 className={`font-medium text-stone-900 leading-snug group-hover:text-stone-600 transition-colors ${size === 'large' ? 'text-xl mb-2' : 'text-base mb-1.5'}`}>
        {article.title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">
        {article.excerpt}
      </p>
    </Link>
  )
}
