import type { GroupRule } from '@/features/group/group.types'

interface RulesSectionProps { rules: GroupRule[] }

export function RulesSection({ rules }: RulesSectionProps) {
  return (
    <section id="regras" aria-labelledby="regras-titulo" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Convivência</p>
        <h2 id="regras-titulo" className="max-w-2xl text-3xl font-black tracking-[-0.025em] sm:text-4xl">Respeito faz parte do encontro.</h2>
        <ol aria-label="Regras de convivência" className="mt-10 grid gap-4 lg:grid-cols-2">
          {rules.map((rule, index) => (
            <li key={index} className="flex gap-5 rounded-2xl border border-border bg-background p-6 shadow-sm">
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-yellow font-black text-[#17130a]">{String(index + 1).padStart(2, '0')}</span>
              <div><h3 className="font-black">{rule.title}</h3><p className="mt-2 whitespace-pre-line text-foreground/70">{rule.description}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
