import logoUrl from '@/assets/perdidos-no-caps-logo.webp'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  className?: string
  eager?: boolean
  compact?: boolean
  decorative?: boolean
}

export function BrandLogo({ className, eager = false, compact = false, decorative = false }: BrandLogoProps) {
  return (
    <img
      src={logoUrl}
      alt={decorative ? '' : 'Perdidos no CAPS'}
      width={1254}
      height={1254}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      className={cn('aspect-square object-contain', compact ? 'size-11 rounded-full' : 'w-full', className)}
    />
  )
}
