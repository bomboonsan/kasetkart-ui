import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname } = req.nextUrl
  const isLogin = pathname === '/login'
  const token = req.cookies.get('jwt')?.value

  // If there's no token and the user isn't already on the login page,
  // redirect them to /login and preserve the original path in `next`.
  if (!token && !isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Exclude API routes and Next.js static assets from this middleware
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|public|login).*)'
  ],
}

