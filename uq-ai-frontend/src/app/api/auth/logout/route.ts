import { NextResponse } from "next/server";

export async function POST() {
  // Creamos la redirección nativa apuntando hacia la pantalla de login
  const res = NextResponse.redirect(new URL("/login", "http://localhost:3000"));

  // Eliminamos las cookies expirándolas de forma inmediata en el servidor (Max-Age=0)
  res.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("user_rol", "", { maxAge: 0, path: "/" });

  return res;
}