import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLogged = !!req.auth
  const { nextUrl } = req

  // Se estiver tentando acessar /dashboard e não estiver logado -> Login
  if (nextUrl.pathname.startsWith("/dashboard") && !isLogged) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl))
  }

  // Se estiver logado e for pra login -> Dashboard
  if (nextUrl.pathname === "/auth/login" && isLogged) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

// Proteger rotas que começam com /dashboard e a página de login
export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
}
