import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ["/dashboard"];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  // Si intenta entrar al dashboard sin token, Next.js lo rebota al login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si ya está logueado e intenta ir a /login, lo manda al dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};