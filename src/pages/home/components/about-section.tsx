interface AboutSectionProps {
  about: string
  activities: string[]
}

export function AboutSection({ about, activities }: AboutSectionProps) {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[0.8fr_1.4fr] md:px-10 md:py-24">
        <div>
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Sobre nós</p>
          <h2 id="sobre-titulo" className="text-3xl font-black tracking-[-0.025em] sm:text-4xl">Conheça o grupo.</h2>
          <div aria-hidden="true" className="mt-6 h-1.5 w-16 -rotate-1 rounded-full bg-brand-yellow" />
        </div>
        <div>
          <p className="max-w-2xl whitespace-pre-line text-lg text-foreground/80">{about}</p>
          {activities.length > 0 && (
            <ul aria-label="Atividades do grupo" className="mt-9 flex flex-wrap gap-3">
              {activities.map((activity, index) => (
                <li key={index} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold shadow-sm">{activity}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
