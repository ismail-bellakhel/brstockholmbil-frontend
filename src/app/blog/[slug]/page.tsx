import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getArticleBySlug,
  getArticleSlugs,
  getSiteSettings,
  getLatestArticles,
} from '@/lib/api/wordpress'
import { buildArticleMetadata, articleJsonLd, formatDate } from '@/lib/utils/metadata'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { AdSlot, AffiliateBlock, NativePromoBlock } from '@/components/ads/AdSlot'

export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [article, settings] = await Promise.all([
    getArticleBySlug(slug),
    getSiteSettings(),
  ])
  if (!article) return {}
  return buildArticleMetadata(article, settings)
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const [article, settings, relatedArticles] = await Promise.all([
    getArticleBySlug(slug),
    getSiteSettings(),
    getLatestArticles(4),
  ])

  if (!article) notFound()

  const related = relatedArticles.filter((a) => a.slug !== article.slug).slice(0, 3)

  // Resolve ad settings: post-level override → global settings fallback
  const ads = article.ad_settings
  const adsEnabled = settings?.ads_enabled ?? false
  const publisherId = settings?.adsense_publisher_id ?? ''

  // Determine which ad zones to render
  const showTopAd = adsEnabled && ads.show_top_ad && !!settings?.ad_slot_article_top
  const showInlineAd1 = adsEnabled && ads.show_inline_ads && !!settings?.ad_slot_article_inline_1
  const showInlineAd2 = adsEnabled && ads.show_inline_ads && !!settings?.ad_slot_article_inline_2
  const showSidebarAd = adsEnabled && ads.show_sidebar_ad && !!settings?.ad_slot_article_sidebar
  const showBottomAd = adsEnabled && ads.show_bottom_ad && !!settings?.ad_slot_article_bottom

  const category = article.categories[0]

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article, settings)) }}
      />

      <article>
        {/* Article header */}
        <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8" aria-label="Brödsmulor">
            <Link href="/" className="hover:text-stone-700 transition-colors">Hem</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-stone-700 transition-colors">Nyheter</Link>
            {category && (
              <>
                <span>/</span>
                <span className="text-stone-600">{category.name}</span>
              </>
            )}
          </nav>

          {/* Category + date */}
          <div className="flex items-center gap-4 mb-5">
            {category && (
              <span className="text-[10px] tracking-widest uppercase text-stone-400">
                {category.name}
              </span>
            )}
            <span className="text-stone-200">·</span>
            <time dateTime={article.published_at} className="text-[11px] text-stone-400">
              {formatDate(article.published_at)}
            </time>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-light text-stone-900 leading-tight mb-4">
            {article.title}
          </h1>

          {/* Subheadline */}
          {article.subheadline && (
            <p className="text-lg text-stone-500 leading-relaxed mb-6">
              {article.subheadline}
            </p>
          )}

          {/* Author */}
          {article.author.name && (
            <div className="flex items-center gap-3 pt-5 border-t border-stone-100">
              {article.author.avatar && (
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                  unoptimized={article.author.avatar.startsWith('data:')}
                />
              )}
              <span className="text-sm text-stone-500">{article.author.name}</span>
            </div>
          )}
        </header>

        {/* Hero image — full-width */}
        {article.featured_image && (
          <div className="relative aspect-[21/9] max-h-[480px] overflow-hidden bg-stone-100 mb-2">
            <Image
              src={article.featured_image.sizes.large ?? article.featured_image.url}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized={article.featured_image.url.startsWith('data:')}
            />
          </div>
        )}

        {/* ── Ad Zone 1: Top ad — below hero, above content ──────────────────── */}
        {showTopAd && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
            <AdSlot
              slot="article_top"
              slotId={settings?.ad_slot_article_top ?? ''}
              publisherId={publisherId}
            />
          </div>
        )}

        {/* Article intro */}
        {article.intro && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <p className="text-lg text-stone-600 leading-relaxed border-l-2 border-stone-200 pl-5">
              {article.intro}
            </p>
          </div>
        )}

        {/* ── Content + Sidebar layout ───────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12 lg:gap-16">
            {/* Main content column */}
            <div className="flex-1 min-w-0 max-w-3xl">
              {/*
                Article body — WordPress generates HTML content.
                We inject ad zones by splitting the content.
                Simple approach: render content in thirds, inject ads between sections.
                For production: use a remark/rehype pipeline or custom content parser.
              */}
              <ArticleBody
                content={article.content}
                showInlineAd1={showInlineAd1}
                showInlineAd2={showInlineAd2}
                slotId1={settings?.ad_slot_article_inline_1 ?? ''}
                slotId2={settings?.ad_slot_article_inline_2 ?? ''}
                publisherId={publisherId}
                showAffiliateBlock={ads.show_affiliate_block}
                showNativePromo={ads.show_native_promo}
                affiliateDisclosure={settings?.affiliate_disclosure}
              />

              {/* ── Ad Zone 5: Bottom ad ─────────────────────────────────────── */}
              {showBottomAd && (
                <div className="my-10">
                  <AdSlot
                    slot="article_bottom"
                    slotId={settings?.ad_slot_article_bottom ?? ''}
                    publisherId={publisherId}
                  />
                </div>
              )}

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-8 border-t border-stone-100">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-stone-500 border border-stone-200 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            {showSidebarAd && (
              <aside className="hidden xl:block w-64 shrink-0">
                <AdSlot
                  slot="article_sidebar"
                  slotId={settings?.ad_slot_article_sidebar ?? ''}
                  publisherId={publisherId}
                />
              </aside>
            )}
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-stone-100">
            <h2 className="text-xl font-light text-stone-900 mb-8">Fler artiklar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}

// ─── ArticleBody — content with injected ad zones ─────────────────────────────

interface ArticleBodyProps {
  content: string
  showInlineAd1: boolean
  showInlineAd2: boolean
  slotId1: string
  slotId2: string
  publisherId: string
  showAffiliateBlock: boolean
  showNativePromo: boolean
  affiliateDisclosure?: string
}

function ArticleBody({
  content,
  showInlineAd1,
  showInlineAd2,
  slotId1,
  slotId2,
  publisherId,
  showAffiliateBlock,
  showNativePromo,
  affiliateDisclosure,
}: ArticleBodyProps) {
  /**
   * Ad injection strategy:
   * Split article content at paragraph boundaries.
   * Insert ad zones after content thirds.
   *
   * Simple split on </p> tags — works for typical WordPress output.
   * For richer content (Gutenberg blocks), use a proper HTML parser.
   */
  const paragraphs = content.split(/(?<=<\/p>)/).filter(Boolean)
  const totalParagraphs = paragraphs.length

  const third = Math.max(3, Math.floor(totalParagraphs / 3))
  const twoThirds = third * 2

  const part1 = paragraphs.slice(0, third).join('')
  const part2 = paragraphs.slice(third, twoThirds).join('')
  const part3 = paragraphs.slice(twoThirds).join('')

  return (
    <div>
      {/* Part 1 */}
      <div
        className="prose-article"
        dangerouslySetInnerHTML={{ __html: part1 }}
      />

      {/* ── Ad Zone 2: Inline ad 1 ────────────────────────────────────────── */}
      {showInlineAd1 && slotId1 && (
        <AdSlot slot="article_inline_1" slotId={slotId1} publisherId={publisherId} className="my-8" />
      )}

      {/* Part 2 */}
      {part2 && (
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: part2 }}
        />
      )}

      {/* ── Affiliate block (optional, post-level toggle) ─────────────────── */}
      {showAffiliateBlock && (
        <AffiliateBlock
          headline="Rekommenderat tillbehör"
          description="Välj rätt bilförsäkring för din nästa bil. Jämför priser och hitta det bästa alternativet för dina behov."
          ctaLabel="Jämför försäkringar"
          ctaUrl="https://www.brstockholmbil.se/kontakt"
          disclosure={affiliateDisclosure ?? 'I samarbete med'}
        />
      )}

      {/* ── Ad Zone 3: Inline ad 2 ────────────────────────────────────────── */}
      {showInlineAd2 && slotId2 && (
        <AdSlot slot="article_inline_2" slotId={slotId2} publisherId={publisherId} className="my-8" />
      )}

      {/* Part 3 */}
      {part3 && (
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: part3 }}
        />
      )}

      {/* ── Native promo block (optional, post-level toggle) ──────────────── */}
      {showNativePromo && (
        <NativePromoBlock
          label="Sponsrat innehåll"
          headline="Hitta din nästa bil på Blocket"
          body="Blocket har tusentals bilar till salu varje dag. Sök bland privatpersoner och återförsäljare."
          ctaLabel="Gå till Blocket"
          ctaUrl="https://blocket.se/bilar"
          brandName="Blocket"
        />
      )}
    </div>
  )
}
