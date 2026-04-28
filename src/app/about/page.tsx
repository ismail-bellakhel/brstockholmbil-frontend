import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Om oss',
  description: 'BR Stockholm Bil är en oberoende bilhandlare i Farsta, Stockholm. Vi hjälper privatpersoner och företag att hitta rätt begagnad bil med trygg historia och tydlig prissättning.',
}

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Intro */}
      <div className="max-w-2xl mb-16">
        <p className="text-[11px] tracking-widest uppercase text-stone-400 mb-3">Om oss</p>
        <h1 className="text-4xl font-light text-stone-900 mb-6 leading-tight">
          En bilhandlare du kan lita på
        </h1>
        <p className="text-lg text-stone-500 leading-relaxed">
          BR Stockholm Bil är en oberoende bilhandlare i Farsta, Stockholm. Vi hjälper
          privatpersoner och företag att hitta rätt begagnad bil — med ärlighet och
          personlig service som grund.
        </p>
      </div>

      {/* Two-column story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>
            Som oberoende handlare är vi inte bundna till ett enda märke eller en
            kedja. Det ger oss friheten att välja ut bilar baserat på kvalitet och
            historia — inte kvoter eller kampanjer. Varje bil vi erbjuder är noggrant
            granskad innan den når lagret.
          </p>
          <p>
            Vi granskar servicehistorik, kontrollerar skick och dokumenterar eventuella
            anmärkningar öppet. Om en bil inte uppfyller våra krav tar vi inte in den.
            Det är enkelt, men det kräver disciplin.
          </p>
          <p>
            Hos oss hittar du pålitliga vardagsbilar för familjen och pendlingen, liksom
            mer exklusiva alternativ och klassiker i Premiumbilar.
          </p>
        </div>

        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>
            Vi hjälper både privatpersoner och företag. För företag erbjuder vi
            en enkel och smidig process för fordonsköp, med möjlighet till finansiering
            via DNB Finans och Mymoney.
          </p>
          <p>
            Finansiering ska inte vara krångligt. Vi ser till att du förstår villkoren
            och hjälper dig jämföra alternativ — utan onödig byråkrati.
          </p>
          <p>
            Välkommen att besöka oss på Mårbackagatan 19 i Farsta. Vi tar oss tid
            för varje kund, oavsett om du vet precis vad du letar efter eller
            behöver lite vägledning.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="border-t border-stone-100 pt-14 mb-16">
        <h2 className="text-2xl font-light text-stone-900 mb-10">Vad vi står för</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Ärlighet',
              desc: 'Vi presenterar varje bil precis som den är — inga överdrifter, inga förskönande beskrivningar.',
            },
            {
              title: 'Oberoende',
              desc: 'Inte bundna till märke eller kedja. Vi väljer bilar efter kvalitet, inte kvoter.',
            },
            {
              title: 'Finansiering',
              desc: 'Enkel finansiering via DNB Finans och Mymoney — för både privat och företag.',
            },
            {
              title: 'Personlig',
              desc: 'Du pratar direkt med oss. Inga mellanhänder, inga säljtricks.',
            },
          ].map(({ title, desc }) => (
            <div key={title}>
              <h3 className="font-medium text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Practical info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 border-t border-stone-100 pt-14">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3">Adress</p>
          <p className="text-stone-700 leading-relaxed">
            Mårbackagatan 19<br />
            123 43 Farsta<br />
            Stockholm
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3">Öppettider</p>
          <p className="text-stone-700 leading-relaxed">
            Måndag–Fredag: 10:00–18:00<br />
            Lördag: 11:00–15:00<br />
            Söndag: Stängt
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-3">Kontakt</p>
          <p className="text-stone-700 leading-relaxed">
            <a href="tel:08920315" className="hover:text-stone-900 transition-colors">08-920 315</a><br />
            <a href="mailto:info@brstockholmbil.se" className="hover:text-stone-900 transition-colors">
              info@brstockholmbil.se
            </a>
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-stone-50 border border-stone-100 p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-medium text-stone-900 mb-1">Vill du sälja din bil till oss?</h3>
          <p className="text-sm text-stone-500">
            Vi tar alltid emot välskötta bilar. Kontakta oss för en värdering utan förpliktelser.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 border border-stone-900 text-stone-900 px-6 py-3 text-sm tracking-wide hover:bg-stone-900 hover:text-white transition-colors"
        >
          Kontakta oss
        </Link>
      </div>
    </div>
  )
}
