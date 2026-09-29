import { useEffect, useRef, useState } from 'react'
import { BrandLogo } from '@/components/brand/brand-logo'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/features/theme/theme-switcher'
import { useMediaQuery } from '@/hooks/use-media-query'

export interface NavigationItem {
  label: string
  href: string
  highlighted?: boolean
}

interface SiteHeaderProps {
  name: string
  homeHref: string
  navigation: NavigationItem[]
}

const desktopQuery = '(min-width: 768px)'

export function SiteHeader({ name, homeHref, navigation }: SiteHeaderProps) {
  const isDesktop = useMediaQuery(desktopQuery)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (isDesktop) setMenuOpen(false)
  }, [isDesktop])

  useEffect(() => {
    if (!menuOpen || isDesktop) return

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [isDesktop, menuOpen])

  const navigationContent = (
    <nav
      id={isDesktop ? undefined : 'menu-principal-mobile'}
      aria-label="Navegação principal"
      className={isDesktop ? 'flex items-center gap-1 text-sm font-semibold' : 'flex flex-col gap-1 text-base font-semibold'}
    >
      {navigation.map(({ label, href, highlighted }) =>
        highlighted ? (
          <Button key={href} asChild size="sm" variant="outline">
            <a href={href} onClick={() => setMenuOpen(false)}>
              {label} <span aria-hidden="true">↗</span>
            </a>
          </Button>
        ) : (
          <a
            key={href}
            className="flex min-h-11 items-center rounded-xl px-4 hover:bg-muted md:rounded-full"
            href={href}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ),
      )}
    </nav>
  )

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 px-5 py-3 md:flex-nowrap md:px-10">
        <a href={homeHref} className="flex min-h-11 min-w-0 items-center gap-3 text-base font-extrabold tracking-tight">
          <BrandLogo compact decorative />
          <span className="truncate">{name}</span>
        </a>

        {isDesktop ? (
          <div className="ml-auto flex items-center gap-3">
            {navigationContent}
            <ThemeSwitcher />
          </div>
        ) : (
          <button
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="menu-principal-mobile"
            onClick={() => setMenuOpen((open) => !open)}
            className="relative grid size-11 shrink-0 place-items-center rounded-full border border-border bg-surface hover:bg-muted"
          >
            <span aria-hidden="true" className="relative block h-5 w-5">
              <span className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[9px] block h-0.5 w-5 rounded-full bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute bottom-1 left-0 block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        )}

        {!isDesktop && menuOpen && (
          <div className="w-full border-t border-border pt-4 pb-2">
            {navigationContent}
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
              <span className="text-sm font-bold">Aparência</span>
              <ThemeSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
