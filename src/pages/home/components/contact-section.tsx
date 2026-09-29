import { Button } from '@/components/ui/button'
import type { SocialLink } from '../home.types'

interface ContactSectionProps { socialLinks: SocialLink[] }

export function ContactSection({ socialLinks }: ContactSectionProps) {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-accent-blue p-8 text-white shadow-xl md:p-12">
        <div aria-hidden="true" className="absolute -right-20 -top-24 size-64 rounded-full border-[22px] border-brand-yellow/25" />
        <div className="relative max-w-2xl">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-yellow">Vamos conversar</p>
          <h2 id="contato-titulo" className="text-3xl font-black tracking-[-0.025em] sm:text-4xl">Quer conhecer melhor?</h2>
          <p className="mt-4 max-w-xl text-white/85">Fale com a gente pelas redes sociais para saber mais sobre o grupo e como participar.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {socialLinks.map(({ label, href }) => <Button key={href} asChild className="bg-brand-yellow text-[#17130a] hover:bg-brand-yellow/85"><a href={href} target="_blank" rel="noopener noreferrer">{label} <span className="sr-only">(abre em nova aba)</span><span aria-hidden="true">↗</span></a></Button>)}
          </div>
        </div>
      </div>
    </section>
  )
}
