import type { NavigationItem } from '@/components/layout/site-header'
import type { GroupContent } from '@/features/group/group.types'

export interface SocialLink {
  label: string
  href: string
  variant: 'default' | 'outline'
}

export interface HomeViewModel {
  content: GroupContent
  navigation: NavigationItem[]
  socialLinks: SocialLink[]
  isLoading: boolean
  showEvents: boolean
  showRules: boolean
  showContact: boolean
}
