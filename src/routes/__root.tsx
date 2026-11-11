import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotFoundPage } from '@/components/error-pages'
import { SiteHeader, SiteFooter, MobileNav } from '@/components/site-chrome'

import '../styles.css'

const siteName = 'FF_BETAL — Battle Rooms & Squad Arena'
const siteDescription = 'FF_BETAL: a dark, red-hot battle royale hub. Create custom rooms, join squads by room code and earn virtual coins. No real money, ever.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { name: 'theme-color', content: '#0d0707' },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  }),
  links: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Teko:wght@500;600;700&display=swap',
    },
  ],
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          <SiteHeader />
          <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
          <SiteFooter />
          <MobileNav />
        </TooltipProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
