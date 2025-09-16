import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware: short-circuit any legacy Pages Router _document requests.
// Prevents ENOENT lookups for .next/server/pages/_document.js in an App Router only project.
export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url)
  if (pathname === '/_document') {
    return new NextResponse('Not Found', { status: 404 })
  }
  return NextResponse.next()
}

// Match exactly /_document (no subpaths)
export const config = {
  matcher: '/_document'
}
