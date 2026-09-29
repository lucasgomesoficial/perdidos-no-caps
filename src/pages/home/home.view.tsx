import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { AboutSection } from './components/about-section'
import { ContactSection } from './components/contact-section'
import {
  EventsSection,
  EventsSectionSkeleton,
} from './components/events-section'
import { HeroSection } from './components/hero-section'
import { RulesSection } from './components/rules-section'
import type { HomeViewModel } from './home.types'

export function HomeView({
  content,
  navigation,
  socialLinks,
  isLoading,
  showEvents,
  showRules,
  showContact,
}: HomeViewModel) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:p-4 focus:text-foreground focus:shadow-xl"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader
        name={content.name}
        homeHref="#inicio"
        navigation={navigation}
      />
      <main id="conteudo">
        <HeroSection
          name={content.name}
          tagline={content.tagline}
          description={content.description}
        />
        <AboutSection about={content.about} activities={content.activities} />
        {isLoading ? (
          <EventsSectionSkeleton />
        ) : (
          showEvents && <EventsSection events={content.events} />
        )}
        {showRules && <RulesSection rules={content.rules} />}
        {showContact && <ContactSection socialLinks={socialLinks} />}
      </main>
      <SiteFooter name={content.name} />
    </>
  )
}
