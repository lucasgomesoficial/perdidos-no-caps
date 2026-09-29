import { useTheme } from './use-theme'
import type { ThemePreference } from './theme.types'

const options: Array<{ value: ThemePreference; label: string; symbol: string }> = [
  { value: 'system', label: 'Sistema', symbol: '◐' },
  { value: 'light', label: 'Claro', symbol: '☀' },
  { value: 'dark', label: 'Escuro', symbol: '☾' },
]

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme()

  return (
    <div
      role="group"
      aria-label="Aparência"
      className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background/80 p-1 shadow-sm backdrop-blur"
    >
      {options.map(({ value, label, symbol }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={preference === value}
          title={label}
          onClick={() => setPreference(value)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full px-2 text-xs font-bold transition-colors hover:bg-muted aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          <span aria-hidden="true" className="text-base leading-none">
            {symbol}
          </span>
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  )
}
