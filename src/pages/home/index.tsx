import type { GroupContent } from '@/features/group/group.types'
import { useHomeController } from './home.controller'
import { HomeView } from './home.view'

interface HomePageProps {
  initialContent?: GroupContent
}

export function HomePage({ initialContent }: HomePageProps) {
  const viewModel = useHomeController(initialContent)
  return <HomeView {...viewModel} />
}
