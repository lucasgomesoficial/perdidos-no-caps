import type { NavigationItem } from '@/components/layout/site-header'
import { useGroupContent } from '@/features/group/hooks/use-group-content'
import type { GroupContent } from '@/features/group/group.types'
import type { HomeViewModel, SocialLink } from './home.types'

export function useHomeController(
  initialContent?: GroupContent,
): HomeViewModel {
  const { content, isLoading } = useGroupContent(initialContent)
  const socialLinks: SocialLink[] = []

  if (content.instagram) {
    socialLinks.push({
      label: 'Instagram',
      href: content.instagram,
      variant: 'default',
    })
  }
  if (content.facebook) {
    socialLinks.push({
      label: 'Facebook',
      href: content.facebook,
      variant: 'outline',
    })
  }

  const showEvents = content.events.length > 0
  const showRules = content.rules.length > 0
  const showContact = socialLinks.length > 0
  const navigation: NavigationItem[] = [{ label: 'O grupo', href: '#sobre' }]

  if (showEvents) navigation.push({ label: 'Eventos', href: '#eventos' })
  if (showRules) navigation.push({ label: 'Convivência', href: '#regras' })
  if (showContact)
    navigation.push({
      label: 'Nossas redes',
      href: '#contato',
      highlighted: true,
    })

  return {
    content,
    navigation,
    socialLinks,
    isLoading,
    showEvents,
    showRules,
    showContact,
  }
}
