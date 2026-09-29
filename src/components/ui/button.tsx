import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-extrabold transition-[color,background-color,border-color,transform] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-0.5',
  { variants: { variant: { default: 'bg-primary text-primary-foreground hover:bg-primary/85', outline: 'border border-border bg-background text-foreground hover:border-primary/45 hover:bg-muted' }, size: { default: 'min-h-11 px-6 py-3', sm: 'min-h-11 px-4 py-2' } }, defaultVariants: { variant: 'default', size: 'default' } },
)

export function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
