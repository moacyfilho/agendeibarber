import { auth } from "@/auth"
import { NextResponse } from "next/server"

// Next.js 16: middleware.ts renamed to proxy.ts
// See: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
export default auth((req) => {
  const isLogged = !!req.auth
  const { nextUrl } = req

  // Proteger /dashboard quando não logado
  if (nextUrl.pathname.startsWith("/dashboard") && !isLogged) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  // Qualquer /[slug]/painel → redireciona para /dashboard (requer login)
  if (nextUrl.pathname.endsWith("/painel") && !isLogged) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  // Redirecionar login para dashboard quando já logado
  if (nextUrl.pathname === "/auth/login" && isLogged) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/admin/:path*", "/admin", "/:slug/painel"],
}
