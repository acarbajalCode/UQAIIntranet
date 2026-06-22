import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, rol } = await req.json();
    const res = NextResponse.json({ success: true });

    // Guardar token como HttpOnly (Seguro contra XSS)
    res.cookies.set("auth_token", token, {
      httpOnly: true,    
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 86400,     
      path: "/",
    });

    // Guardar rol accesible para modificar la interfaz dinámicamente
    res.cookies.set("user_rol", rol, {
      httpOnly: false,   
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Error interno al procesar cookies" }, { status: 500 });
  }
}