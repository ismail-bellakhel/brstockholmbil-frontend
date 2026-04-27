import Image from 'next/image'
import Link from 'next/link'
import type { Vehicle } from '@/types'
import { formatPrice, formatMileage } from '@/lib/utils/metadata'

interface VehicleCardProps {
  vehicle: Vehicle
  priority?: boolean  // true for above-the-fold cards
}

const STATUS_LABELS: Record<Vehicle['status'], string> = {
  available: '',
  sold: 'Såld',
  reserved: 'Reserverad',
  incoming: 'Inkommande',
}

const STATUS_STYLES: Record<Vehicle['status'], string> = {
  available: '',
  sold: 'bg-stone-100 text-stone-500',
  reserved: 'bg-amber-50 text-amber-700',
  incoming: 'bg-sky-50 text-sky-700',
}

export function VehicleCard({ vehicle, priority = false }: VehicleCardProps) {
  const { specs, price, currency, status, category, blocket_url, show_internal_detail_page } = vehicle
  const statusLabel = STATUS_LABELS[status]
  const isSold = status === 'sold'

  const cardContent = (
    <>
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        {vehicle.hero_image ? (
          <Image
            src={vehicle.hero_image.sizes.large ?? vehicle.hero_image.url}
            alt={`${specs.brand} ${specs.model} ${specs.year}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.02] ${isSold ? 'grayscale' : ''}`}
            priority={priority}
            unoptimized={vehicle.hero_image.url.startsWith('data:')}
          />
        ) : (
          <div className="w-full h-full bg-stone-200 flex items-center justify-center">
            <span className="text-stone-400 text-sm">Ingen bild</span>
          </div>
        )}

        {/* Category badge — collector only */}
        {category === 'collector' && (
          <span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] tracking-widest uppercase px-2.5 py-1">
            Samlarbil
          </span>
        )}

        {/* Status badge */}
        {statusLabel && (
          <span className={`absolute top-3 right-3 text-[10px] tracking-widest uppercase px-2.5 py-1 ${STATUS_STYLES[status]}`}>
            {statusLabel}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-0.5">
              {specs.brand}
            </p>
            <h3 className="font-medium text-stone-900 leading-snug">
              {specs.model} · {specs.year}
            </h3>
          </div>
          <p className="text-right shrink-0 font-medium text-stone-900">
            {formatPrice(price, currency)}
          </p>
        </div>

        {/* Quick specs */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 mb-5">
          <span>{formatMileage(specs.mileage)}</span>
          <span className="capitalize">{specs.fuel}</span>
          <span className="capitalize">{specs.transmission}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {show_internal_detail_page && (
            <span className="flex-1 text-center text-xs tracking-wide border border-stone-900 px-3 py-2 text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-200 cursor-pointer">
              Visa bil
            </span>
          )}
          {blocket_url && (
            <a
              href={blocket_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs tracking-wide border border-stone-300 px-3 py-2 text-stone-600 hover:border-stone-500 hover:text-stone-900 transition-colors duration-200"
            >
              Blocket ↗
            </a>
          )}
        </div>
      </div>
    </>
  )

  if (show_internal_detail_page) {
    return (
      <Link
        href={`/vehicles/${vehicle.slug}`}
        className="group block border border-stone-200 hover:border-stone-400 transition-colors duration-300 bg-white"
      >
        {cardContent}
      </Link>
    )
  }

  // No internal page — card is not a link, Blocket is the only action
  return (
    <div className="border border-stone-200 bg-white">
      {cardContent}
    </div>
  )
}
