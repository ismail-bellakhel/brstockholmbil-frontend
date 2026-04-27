import type { Metadata } from 'next'
import { getVehicles } from '@/lib/api/wordpress'
import { VehicleCard } from '@/components/vehicles/VehicleCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Samlarsektionen — Klassiska och sällsynta bilar',
  description: 'Noggrant utvalda samlarbilar, klassiker och specialbilar. Varje bil har en historia värd att berätta.',
}

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function CollectorPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const page = Number(sp.page ?? 1)
  const { items: vehicles, total, total_pages } = await getVehicles({ category: 'collector' }, page, 12)

  return (
    <div>
      {/* Hero band — dark, editorial */}
      <div className="bg-stone-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] tracking-widest uppercase text-stone-500 mb-3">Samlarsektionen</p>
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-5 max-w-2xl leading-tight">
            Bilar med historia
          </h1>
          <p className="text-stone-400 max-w-xl leading-relaxed">
            Vi specialiserar oss på klassiska bilar, tidlösa design­ikoner och sällsynta modeller
            som fortfarande rör sig precis som de ska. Varje bil är noggrant dokumenterad och verifierad.
          </p>
        </div>
      </div>

      {/* Vehicles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-stone-500">{total} samlarbilar tillgängliga</p>
        </div>

        {vehicles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle, i) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} priority={i < 3} />
              ))}
            </div>

            {total_pages > 1 && (
              <nav className="mt-12 flex justify-center gap-2" aria-label="Sidnavigation">
                {Array.from({ length: total_pages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`/collector?page=${p}`}
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
          <div className="text-center py-24">
            <p className="text-stone-400 mb-2">Inga samlarbilar tillgängliga just nu.</p>
            <p className="text-sm text-stone-400">
              Kontakta oss — vi hjälper dig hitta det du letar efter.
            </p>
          </div>
        )}
      </div>

      {/* Trust section — relevant for collector buyers */}
      <div className="bg-stone-50 border-t border-stone-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            {
              title: 'Verifierad historia',
              desc: 'Vi granskar servicehistorik, besiktningsprotokoll och ägarhistoria för varje samlarbil.',
            },
            {
              title: 'Expertbedömning',
              desc: 'Karosseri, mekanik och originalitet bedöms av kunniga specialister.',
            },
            {
              title: 'Diskret affär',
              desc: 'Vi förstår att köp och försäljning av samlarbilar kräver tid, förtroende och diskretion.',
            },
          ].map(({ title, desc }) => (
            <div key={title}>
              <h3 className="font-medium text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
