export { default } from 'next-auth/middleware'

export const config = {
  // Protect all routes except API, static assets, and the login page
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|public|login).*)'
  ],
}
