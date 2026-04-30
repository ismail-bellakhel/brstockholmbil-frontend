import type { Metadata } from 'next'
import { getVehicles } from '@/lib/api/wordpress'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import type { VehicleCategory, VehicleFilters } from '@/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Bilar till salu',
  description: 'Bläddra bland våra noggrant utvalda begagnade bilar. Transparenta priser och ärlig information.',
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    brand?: string
    fuel?: string
    transmission?: string
    page?: string
  }>
}

export default async function VehiclesPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const page = Number(sp.page ?? 1)

  const filters: VehicleFilters = {
    category: (sp.category as VehicleCategory) ?? 'regular',
    brand: sp.brand,
    fuel: sp.fuel as VehicleFilters['fuel'],
    transmission: sp.transmission as VehicleFilters['transmission'],
  }

  const { items: vehicles, total, total_pages } = await getVehicles(filters, page, 12)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="mb-10">
        <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-2">Lager</p>
        <h1 className="text-3xl font-light text-stone-900">Bilar till salu</h1>
        <p className="text-stone-500 mt-2">{total} bilar tillgängliga</p>
      </div>

      <div className="flex gap-1 mb-8 border border-stone-200 w-fit">
        {[
          { value: 'regular', label: 'Begagnade bilar' },
          { value: 'collector', label: 'Premiumbilar' },
        ].map(({ value, label }) => (
          <a
            key={value}
            href={`/vehicles?category=${value}`}
            className={`px-5 py-2.5 text-sm tracking-wide transition-colors ${
              (filters.category ?? 'regular') === value
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            {label}
          </a>
        ))}
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
                  href={`/vehicles?category=${filters.category}&page=${p}`}
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
        <div className="text-center py-20 border border-stone-100">
          <p className="text-stone-400 mb-2">Inga bilar hittades</p>
          <p className="text-sm text-stone-400">Prova att justera filtren eller kom tillbaka senare.</p>
        </div>
      )}
    </div>
  )
}