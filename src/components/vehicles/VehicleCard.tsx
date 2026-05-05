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
  sold: 'bg-white/70 text-stone-500 border border-white/50 backdrop-blur-md',
  reserved: 'bg-amber-50/80 text-amber-700 border border-amber-100/80 backdrop-blur-md',
  incoming: 'bg-sky-50/80 text-sky-700 border border-sky-100/80 backdrop-blur-md',
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { specs, price, currency, status, category, show_internal_detail_page } = vehicle
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
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
              isSold ? 'grayscale' : ''
            }`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-stone-200 flex items-center justify-center">
            <span className="text-stone-400 text-sm">Ingen bild</span>
          </div>
        )}

        {category === 'collector' && (
          <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] tracking-widest uppercase px-2.5 py-1">
            Premiumbil
          </span>
        )}

        {statusLabel && (
          <span
            className={`absolute top-3 right-3 text-[10px] tracking-widest uppercase px-2.5 py-1 ${STATUS_STYLES[status]}`}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className="p-5 bg-white/75 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
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

        {show_internal_detail_page && (
          <span className="block w-full text-center text-xs tracking-wide border border-white/40 bg-white/25 backdrop-blur-md px-3 py-2.5 text-stone-900 shadow-sm transition-all duration-200 cursor-pointer group-hover:bg-stone-900/90 group-hover:text-white group-hover:border-stone-900">
            Visa bil
          </span>
        )}
      </div>
    </>
  )

  if (show_internal_detail_page) {
    return (
      <Link
        href={`/vehicles/${vehicle.slug}`}
        className="group block overflow-hidden border border-white/40 bg-white/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.10)] hover:border-stone-300/70 transition-all duration-300"
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div className="overflow-hidden border border-white/40 bg-white/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {cardContent}
    </div>
  )
}