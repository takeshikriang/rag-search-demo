import { createServerEntry, createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'

import { handleApiRequest, isApiPath } from './server/api'

const startFetch = createStartHandler(defaultStreamHandler)

export default createServerEntry({
  fetch: (request, options) => {
    const { pathname } = new URL(request.url)
    if (isApiPath(pathname)) {
      return handleApiRequest(request)
    }
    return startFetch(request, options)
  },
})
