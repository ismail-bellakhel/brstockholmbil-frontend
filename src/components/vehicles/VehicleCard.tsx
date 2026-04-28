import Link from 'next/link'
import type { Vehicle } from '@/types'
import { formatPrice, formatMileage } from '@/lib/utils/metadata'

interface VehicleCardProps {
  vehicle: Vehicle
  priority?: boolean
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

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { specs, price, currency, status, category, blocket_url, show_internal_detail_page } = vehicle
  const statusLabel = STATUS_LABELS[status]
  const isSold = status === 'sold'
  const imageUrl = vehicle.hero_image?.sizes?.large || vehicle.hero_image?.url || ''

  const cardContent = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${specs.brand} ${specs.model} ${specs.year}`}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${isSold ? 'grayscale' : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-stone-200 flex items-center justify-center">
            <span className="text-stone-400 text-sm">Ingen bild</span>
          </div>
        )}

        {category === 'collector' && (
          <span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] tracking-widest uppercase px-2.5 py-1">
            Premiumbil
          </span>
        )}

        {statusLabel && (
          <span className={`absolute top-3 right-3 text-[10px] tracking-widest uppercase px-2.5 py-1 ${STATUS_STYLES[status]}`}>
            {statusLabel}
          </span>
        )}
      </div>

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

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 mb-5">
          <span>{formatMileage(specs.mileage)}</span>
          <span className="capitalize">{specs.fuel}</span>
          <span className="capitalize">{specs.transmission}</span>
        </div>

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

  return <div className="border border-stone-200 bg-white">{cardContent}</div>
}