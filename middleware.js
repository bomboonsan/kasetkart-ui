import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname } = req.nextUrl
  const isLogin = pathname === '/login'
  const token = req.cookies.get('token')?.value

  if (!token && !isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    // เก็บ path เดิมใน query เพื่อ redirect กลับหลังล็อกอิน (ถ้าต้องการ)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // ป้องกันทุกหน้า ยกเว้น static/_next/api/login
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|public|login).*)'
  ],
}

