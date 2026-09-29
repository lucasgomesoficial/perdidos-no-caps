interface SiteFooterProps { name: string }

export function SiteFooter({ name }: SiteFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#05080d] text-white">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 py-9 text-sm md:flex-row md:items-center md:px-10">
        <p className="font-black text-brand-yellow">{name}</p>
        <p className="text-white/65">Grupo inclusivo · Para maiores de 18 anos · Desenvolvido por <a className="font-semibold text-white underline decoration-brand-yellow underline-offset-4" href="https://www.instagram.com/lucasgomesdev/" target="_blank" rel="noopener noreferrer">Lucas Gomes</a></p>
      </div>
    </footer>
  )
}
