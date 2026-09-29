import { BrandLogo } from '@/components/brand/brand-logo'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  name: string
  tagline: string
  description: string
}

export function HeroSection({ name, tagline, description }: HeroSectionProps) {
  return (
    <section id="inicio" aria-labelledby="titulo" className="hero-sky relative overflow-hidden border-b border-border">
      <div aria-hidden="true" className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_15%_20%,var(--brand-yellow)_0_1px,transparent_2px),radial-gradient(circle_at_35%_75%,var(--accent-blue)_0_1px,transparent_2px),radial-gradient(circle_at_88%_68%,var(--foreground)_0_1px,transparent_2px)] [background-size:180px_180px,240px_240px,210px_210px]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-10 md:pb-24 md:pt-20">
        <div className="relative z-10">
          <p className="mb-6 inline-flex rounded-full border border-primary/30 bg-background/55 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary backdrop-blur">
            Um grupo inclusivo · 18 anos ou mais
          </p>
          <h1 id="titulo" className="max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            <span className="brush-underline">{name}</span>
          </h1>
          <p className="mt-8 max-w-xl text-xl font-bold leading-snug text-accent-blue sm:text-2xl">{tagline}</p>
          <p className="mt-5 max-w-lg text-base text-foreground/75">{description}</p>
          <Button asChild className="mt-9 shadow-lg shadow-black/10">
            <a href="#sobre">Conheça o grupo <span aria-hidden="true">↓</span></a>
          </Button>
        </div>
        <div className="relative mx-auto w-full max-w-[31rem]">
          <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-brand-yellow/20 blur-3xl" />
          <BrandLogo eager className="brand-shadow relative z-10" />
        </div>
      </div>
    </section>
  )
}
