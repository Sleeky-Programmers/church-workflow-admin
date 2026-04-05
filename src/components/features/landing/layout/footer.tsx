'use client'
import { Span } from '@/components/ui/typography/Text';

export default function Footer() {
  const partners = [
    'ProfitWell',
    'Appcues',
    'ShipBob',
    'Bench',
    'Subbly',
    'Demio',
  ]
  return (
    <footer className="w-full"> 
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 place-items-center">
          {partners.map((partner) => (
            <Span
              key={partner}
              variant="partner" 
            >
              {partner}
            </Span>
          ))}
        </div>
      </div>
    </footer>
  )
}