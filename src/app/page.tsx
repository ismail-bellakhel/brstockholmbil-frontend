import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getSiteSettings, getFeaturedVehicles, getLatestArticles } from '@/lib/api/wordpress'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { ArticleCard } from '@/components/blog/ArticleCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Begagnade bilar i Farsta, Stockholm',
  description:
    'BR Stockholm Bil — oberoende bilhandlare i Farsta. Noggrant utvalda begagnade bilar för privatpersoner och företag. Finansiering via DNB Finans och Mymoney.',
}

export default async function HomePage() {
  const [settings, featuredVehicles, collectorVehicles, articles] = await Promise.all([
    getSiteSettings(),
    getFeaturedVehicles('regular'),
    getFeaturedVehicles('collector'),
    getLatestArticles(3),
  ])

  return (
    <>
      <section className="relative min-h-[80vh] flex items-end bg-stone-900">
        {settings?.hero_image && (
          <Image
            src={settings.hero_image.url}
            alt="Hero"
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
            unoptimized={settings.hero_image.url.startsWith('data:')}
          />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <p className="text-[11px] tracking-widest uppercase text-stone-300 mb-6">
              {settings?.dealership_name ?? 'Bilhandlare'}
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-8">
              {settings?.hero_headline ?? 'Varje bil har\nen historia.'}
            </h1>

            <p className="text-lg text-stone-300 mb-10 max-w-lg leading-relaxed">
              {settings?.hero_subheadline ??
                'Vi presenterar noggrant utvalda begagnade bilar och tidlösa samlarbilar. Kvalitet och ärlighet i varje affär.'}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#vehicles"
                className="inline-flex items-center gap-2 bg-white text-stone-900 px-7 py-3.5 text-sm tracking-wide hover:bg-stone-100 transition-colors"
              >
                {settings?.hero_cta_label ?? 'Se alla bilar'}
              </Link>

              <Link
                href="#premium"
                className="inline-flex items-center gap-2 border border-white text-white px-7 py-3.5 text-sm tracking-wide hover:bg-white hover:text-stone-900 transition-colors"
              >
                Premiumbilar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featuredVehicles.length > 0 && (
        <section id="vehicles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-10">
            <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-2">
              Utvalda bilar
            </p>
            <h2 className="text-2xl font-light text-stone-900">Aktuellt i lager</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.slice(0, 3).map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 2} />
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <Link
              href="/vehicles"
              className="inline-block border border-stone-900 text-stone-900 px-6 py-3 text-sm tracking-wide hover:bg-stone-900 hover:text-white transition-colors duration-200"
            >
              Se alla bilar
            </Link>
          </div>
        </section>
      )}

      {collectorVehicles.length > 0 && (
        <section id="premium" className="bg-stone-950 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="text-[11px] tracking-widest uppercase text-stone-500 mb-2">
                Premiumbilar
              </p>
              <h2 className="text-2xl font-light text-white">
                Sällsynta och klassiska bilar
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectorVehicles.slice(0, 3).map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                href="/collector"
                className="inline-block border border-white text-white px-6 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-colors duration-200"
              >
                Se alla premiumbilar
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-4">
              Varför välja oss
            </p>
            <h2 className="text-3xl font-light text-stone-900 mb-6 leading-snug">
              Oberoende och personlig service i Farsta
            </h2>
            <p className="text-stone-500 leading-relaxed mb-8">
              Vi är en oberoende bilhandlare som sätter kunden i centrum. Varje bil vi tar in
              granskas noggrant — servicehistorik, skick och ägarhistoria presenteras alltid öppet.
              Inga dolda avgifter, inga överraskningar.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Noggrant utvald', desc: 'Varje bil granskas innan den erbjuds till försäljning' },
                { label: 'Transparent', desc: 'Full historik och tydlig prissättning alltid' },
                { label: 'Finansiering', desc: 'Enkel finansiering via DNB Finans och Mymoney' },
                { label: 'Personlig', desc: 'Privat och företag — vi tar oss tid för varje kund' },
              ].map(({ label, desc }) => (
                <div key={label}>
                  <p className="font-medium text-stone-900 mb-1">{label}</p>
                  <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-10 text-sm border border-stone-900 px-6 py-3 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors"
            >
              Läs mer om oss
            </Link>
          </div>

          <div className="relative aspect-[4/3] bg-stone-100">
            <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-sm">
              Showroom — Mårbackagatan 19, Farsta
            </div>
          </div>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-stone-100">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-2">
                Nyheter & artiklar
              </p>
              <h2 className="text-2xl font-light text-stone-900">Senaste från oss</h2>
            </div>
            <Link href="/blog" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Alla artiklar →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-stone-50 border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-light text-stone-900 mb-4">
            Redo att hitta din nästa bil?
          </h2>
          <p className="text-stone-500 mb-10 max-w-xl mx-auto">
            Kontakta oss för ett personligt möte. Vi hjälper dig hitta rätt bil — oavsett om det
            är en pålitlig vardagsbil eller en sällsynt samlarbil.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-stone-900 text-white px-8 py-3.5 text-sm tracking-wide hover:bg-stone-800 transition-colors"
            >
              Kontakta oss
            </Link>

            <Link
              href="/vehicles"
              className="border border-stone-300 text-stone-700 px-8 py-3.5 text-sm tracking-wide hover:border-stone-900 hover:text-stone-900 transition-colors"
            >
              Bläddra i lagret
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}