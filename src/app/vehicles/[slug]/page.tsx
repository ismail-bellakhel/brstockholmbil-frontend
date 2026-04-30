import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getVehicleBySlug, getVehicleSlugs, getSiteSettings, getVehicles } from '@/lib/api/wordpress'
import { buildVehicleMetadata, vehicleJsonLd, formatPrice, formatMileage } from '@/lib/utils/metadata'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { VehicleGallery } from '@/components/vehicles/VehicleGallery'

export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getVehicleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const [vehicle, settings] = await Promise.all([
    getVehicleBySlug(slug),
    getSiteSettings(),
  ])

  if (!vehicle) return {}

  return buildVehicleMetadata(vehicle, settings)
}

const FUEL_LABELS: Record<string, string> = {
  petrol: 'Bensin',
  diesel: 'Diesel',
  electric: 'El',
  hybrid: 'Hybrid',
  'plug-in-hybrid': 'Laddhybrid',
  other: 'Annat',
}

const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: 'Automat',
  manual: 'Manuell',
}

const DRIVETRAIN_LABELS: Record<string, string> = {
  fwd: 'Framhjulsdrift',
  rwd: 'Bakhjulsdrift',
  awd: 'Fyrhjulsdrift',
  '4wd': '4WD',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Till salu',
  sold: 'Såld',
  reserved: 'Reserverad',
  incoming: 'Inkommande',
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params

  const [vehicle, settings] = await Promise.all([
    getVehicleBySlug(slug),
    getSiteSettings(),
  ])

  if (!vehicle) notFound()

  if (!vehicle.show_internal_detail_page && vehicle.blocket_url) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 mb-6">Den här bilen visas på Blocket.</p>
        <a
          href={vehicle.blocket_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 text-sm hover:bg-stone-800 transition-colors"
        >
          Visa på Blocket ↗
        </a>
      </div>
    )
  }

  const { items: related } = await getVehicles({ category: vehicle.category }, 1, 4)
  const relatedVehicles = related.filter((v) => v.id !== vehicle.id).slice(0, 3)

  const specs = vehicle.specs
  const isCollector = vehicle.category === 'collector'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd(vehicle)) }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8" aria-label="Brödsmulor">
          <Link href="/" className="hover:text-stone-700 transition-colors">Hem</Link>
          <span>/</span>
          <Link
            href={isCollector ? '/collector' : '/vehicles'}
            className="hover:text-stone-700 transition-colors"
          >
            {isCollector ? 'Premiumbilar' : 'Bilar till salu'}
          </Link>
          <span>/</span>
          <span className="text-stone-600">{specs.brand} {specs.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <VehicleGallery vehicle={vehicle} />
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              {isCollector && (
                <span className="text-[10px] tracking-widest uppercase bg-stone-900 text-white px-2.5 py-1">
                  Premiumbil
                </span>
              )}

              <span
                className={`text-[10px] tracking-widest uppercase px-2.5 py-1 border ${
                  vehicle.status === 'available'
                    ? 'border-stone-200 text-stone-400'
                    : 'border-amber-200 text-amber-700 bg-amber-50'
                }`}
              >
                {STATUS_LABELS[vehicle.status]}
              </span>
            </div>

            <p className="text-sm text-stone-400 tracking-wide mb-1">{specs.brand}</p>
            <h1 className="text-3xl font-light text-stone-900 mb-1">{specs.model}</h1>
            <p className="text-stone-400 mb-6">{specs.year}</p>

            <p className="text-3xl font-medium text-stone-900 mb-8">
              {formatPrice(vehicle.price, vehicle.currency)}
            </p>

            {vehicle.short_description && (
              <p className="text-stone-600 leading-relaxed mb-8 border-t border-stone-100 pt-6">
                {vehicle.short_description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 border-t border-stone-100 pt-6">
              {[
                { label: 'Miltal', value: formatMileage(specs.mileage) },
                { label: 'Drivmedel', value: FUEL_LABELS[specs.fuel] ?? specs.fuel },
                { label: 'Växellåda', value: TRANSMISSION_LABELS[specs.transmission] ?? specs.transmission },
                { label: 'Drivlina', value: DRIVETRAIN_LABELS[specs.drivetrain] ?? specs.drivetrain },
                { label: 'Motor', value: specs.engine },
                { label: 'Effekt', value: `${specs.horsepower} hk` },
                { label: 'Exteriörfärg', value: specs.exterior_color },
                { label: 'Interiörfärg', value: specs.interior_color },
              ]
                .filter(({ value }) => value && value !== '0 hk')
                .map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] tracking-wider uppercase text-stone-400 mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-stone-900">{value}</p>
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="w-full text-center bg-stone-900 text-white py-3.5 text-sm tracking-wide hover:bg-stone-800 transition-colors"
              >
                Kontakta oss om denna bil
              </Link>

              {vehicle.blocket_url && (
                <a
                  href={vehicle.blocket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center border border-stone-300 text-stone-700 py-3.5 text-sm tracking-wide hover:border-stone-900 hover:text-stone-900 transition-colors"
                >
                  Visa annons på Blocket ↗
                </a>
              )}

              <a
                href={`tel:${settings?.phone}`}
                className="w-full text-center text-stone-500 py-2 text-sm hover:text-stone-900 transition-colors"
              >
                Ring oss: {settings?.phone ?? '—'}
              </a>
            </div>
          </div>
        </div>

        {vehicle.full_description && (
          <div className="mt-14 max-w-3xl">
            <h2 className="text-xl font-light text-stone-900 mb-6 pb-4 border-b border-stone-100">
              Om bilen
            </h2>
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: vehicle.full_description }}
            />
          </div>
        )}

        {relatedVehicles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-100">
            <h2 className="text-xl font-light text-stone-900 mb-8">
              Fler {isCollector ? 'premiumbilar' : 'bilar'} i lager
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}