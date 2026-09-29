import { useState } from 'react'
import type { GroupEvent } from '@/features/group/group.types'

interface EventsSectionProps { events: GroupEvent[] }

function EventCard({ event }: { event: GroupEvent }) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(event.image ? 'loading' : 'error')
  return (
    <article className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-elevated shadow-[0_18px_50px_-32px_hsl(var(--shadow-color)/0.55)]">
      {event.image && imageState !== 'error' && (
        <div className="relative overflow-hidden border-b border-border bg-muted" style={{ aspectRatio: `${event.image.width} / ${event.image.height}` }}>
          {imageState === 'loading' && <div role="status" aria-label={`Carregando imagem de ${event.title}`} className="absolute inset-0 animate-pulse bg-muted motion-reduce:animate-none" />}
          <img src={event.image.url} alt={event.image.alt} width={event.image.width} height={event.image.height} loading="lazy" decoding="async" onLoad={() => setImageState('loaded')} onError={() => setImageState('error')} className={`absolute inset-0 size-full object-contain transition-opacity duration-300 motion-reduce:transition-none ${imageState === 'loaded' ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      )}
      <div className="relative p-7">
        <div aria-hidden="true" className="absolute left-7 top-0 h-1 w-12 -translate-y-1/2 rounded-full bg-brand-yellow" />
        <h3 className="text-xl font-black tracking-tight">{event.title}</h3>
        <p className="mt-3 whitespace-pre-line text-foreground/70">{event.description}</p>
      </div>
    </article>
  )
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <section id="eventos" aria-labelledby="eventos-titulo" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
      <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Próximos encontros</p>
      <h2 id="eventos-titulo" className="text-3xl font-black tracking-[-0.025em] sm:text-4xl">Eventos do grupo.</h2>
      <ul aria-label="Eventos do grupo" className="mt-10 grid items-start gap-6 md:grid-cols-2">
        {events.map((event, index) => <li key={`${event.title}-${index}`}><EventCard event={event} /></li>)}
      </ul>
    </section>
  )
}

export function EventsSectionSkeleton() {
  return (
    <section role="status" aria-label="Carregando eventos" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
      <span className="sr-only">Carregando eventos</span>
      <div className="h-3 w-32 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div className="mt-4 h-9 w-64 animate-pulse rounded bg-muted motion-reduce:animate-none" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[0, 1].map((item) => <div key={item} className="overflow-hidden rounded-[1.75rem] border border-border bg-elevated"><div className="aspect-video animate-pulse bg-muted motion-reduce:animate-none" /><div className="space-y-3 p-7"><div className="h-6 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" /><div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" /></div></div>)}
      </div>
    </section>
  )
}
