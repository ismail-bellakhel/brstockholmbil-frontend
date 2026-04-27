import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/api/wordpress'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontakta BR Stockholm Bil — ring 08-920 315 eller besök oss på Mårbackagatan 19 i Farsta. Öppet måndag–fredag 10–18, lördag 11–15.',
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const hours = settings?.opening_hours

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-2">Kontakt</p>
          <h1 className="text-3xl font-light text-stone-900 mb-6">Välkommen att höra av dig</h1>
          <p className="text-stone-500 leading-relaxed mb-10 max-w-sm">
            Vi tar oss tid för varje kund. Kontakta oss för att boka ett möte, fråga om en bil i lager
            eller diskutera ett köp eller en inbytesaffär.
          </p>

          {/* Contact details */}
          <div className="space-y-6 mb-10">
            {settings?.phone && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">Telefon</p>
                <a href={`tel:${settings.phone}`} className="font-medium text-stone-900 hover:text-stone-600 transition-colors">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings?.email && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">E-post</p>
                <a href={`mailto:${settings.email}`} className="font-medium text-stone-900 hover:text-stone-600 transition-colors">
                  {settings.email}
                </a>
              </div>
            )}
            {settings?.address && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-1">Adress</p>
                <p className="font-medium text-stone-900">{settings.address}</p>
              </div>
            )}
          </div>

          {/* Opening hours */}
          {hours && (
            <div>
              <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-4">Öppettider</p>
              <table className="text-sm w-full max-w-xs">
                <tbody className="divide-y divide-stone-100">
                  {[
                    ['Måndag', hours.monday],
                    ['Tisdag', hours.tuesday],
                    ['Onsdag', hours.wednesday],
                    ['Torsdag', hours.thursday],
                    ['Fredag', hours.friday],
                    ['Lördag', hours.saturday],
                    ['Söndag', hours.sunday],
                  ].filter(([, v]) => v).map(([day, time]) => (
                    <tr key={day}>
                      <td className="py-2 text-stone-500">{day}</td>
                      <td className="py-2 text-stone-900 text-right">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contact form */}
        <div>
          <div className="bg-stone-50 border border-stone-100 p-8">
            <h2 className="text-xl font-light text-stone-900 mb-6">Skicka ett meddelande</h2>
            {/* 
              Contact form — integrate with a form provider like:
              - Resend (email)
              - Formspree
              - WP CF7 REST API
              - Server action with nodemailer
              
              Client component with server action is the recommended approach.
              Placeholder fields below.
            */}
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-[10px] tracking-widest uppercase text-stone-500 mb-2">
                    Förnamn
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-900 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                    placeholder="Förnamn"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[10px] tracking-widest uppercase text-stone-500 mb-2">
                    Efternamn
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-900 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                    placeholder="Efternamn"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] tracking-widest uppercase text-stone-500 mb-2">
                  E-post
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-900 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                  placeholder="din@email.se"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[10px] tracking-widest uppercase text-stone-500 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-900 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                  placeholder="070 000 00 00"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-[10px] tracking-widest uppercase text-stone-500 mb-2">
                  Ärende
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-900 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                >
                  <option value="">Välj ärende</option>
                  <option value="buy">Köpa en bil</option>
                  <option value="sell">Sälja min bil</option>
                  <option value="trade">Inbyte</option>
                  <option value="collector">Fråga om samlarbil</option>
                  <option value="other">Annat</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] tracking-widest uppercase text-stone-500 mb-2">
                  Meddelande
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-900 bg-white focus:outline-none focus:border-stone-900 transition-colors resize-none"
                  placeholder="Skriv ditt meddelande här..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-3.5 text-sm tracking-wide hover:bg-stone-800 transition-colors"
              >
                Skicka meddelande
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map — Mårbackagatan 19, Farsta */}
      <div className="mt-16 h-72 bg-stone-100 border border-stone-200 overflow-hidden">
        <iframe
          title="BR Stockholm Bil — Mårbackagatan 19, Farsta"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2040.123!2d18.0836!3d59.2456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMårbackagatan+19%2C+123+43+Farsta!5e0!3m2!1ssv!2sse!4v1700000000000"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
