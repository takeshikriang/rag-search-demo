import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'

import { queryClient } from '../lib/query-client'

import appCss from '../styles.css?url'

export interface RouterContext {
  queryClient: typeof queryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'ShadeFinder — AI Eyewear Assistant' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
