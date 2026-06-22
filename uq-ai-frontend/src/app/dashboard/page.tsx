import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Brain, ShieldCheck, LogOut } from "lucide-react";
import LeadsTable from "./LeadsTable";

// Función del lado del servidor para comunicarse de forma segura con Spring Boot
async function getLeads(token: string) {
  try {
    const res = await fetch("http://localhost:8080/api/leads", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store", // Evita que se cacheen los datos de auditoría (OWASP A04)
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error en fetch de leads:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  const rol   = cookieStore.get("user_rol")?.value;

  // SEGURIDAD: Si no hay un token en el servidor, se deniega el acceso y redirige al login inmediatamente
  if (!token) {
    redirect("/login");
  }

  // CONTROL DE ACCESOS (RBAC): Solo si el rol es ADMIN se realiza la petición al backend de Java
  const leads = rol === "ADMIN" ? await getLeads(token) : [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navbar Superior Corporativo */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-white">
              Panel UQ AI {rol === "ADMIN" ? "👑 Admin" : "👤 Operador User"}
            </h1>
          </div>
          
          {/* Formulario Nativo de Cierre de Sesión Seguro por método POST */}
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg transition-colors text-sm shadow-md">
              <LogOut className="h-4 w-4" /> Cerrar Sesión
            </button>
          </form>
        </div>

        {/* Encabezado de la Consola */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white">Consola de Control</h2>
          <p className="text-sm text-slate-400 mt-1">
            Registros de solicitudes comerciales capturados desde la Landing Page externa.
          </p>
        </div>

        {/* CASO ADMINISTRADOR: Renderiza la tabla interactiva responsiva con el visor lateral */}
        {rol === "ADMIN" && <LeadsTable leads={leads} />}

        {/* CASO OPERADOR (USER): Renderiza la tarjeta de bloqueo seguro e información restringida */}
        {rol !== "ADMIN" && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6 shadow-xl max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
            <ShieldCheck className="h-14 w-14 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Autenticación Correcta</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bienvenido al sistema corporativo. Actualmente posees el rol de operador <span className="text-indigo-400 font-bold">USER</span>. 
              Tu cuenta no cuenta con permisos de auditoría para listar las bases de datos de leads comerciales externos.
            </p>
            <div className="text-xs text-slate-500 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
              ID de Sesión Protegido mediante Cookie Server-Side HttpOnly
            </div>
          </div>
        )}

      </div>
    </div>
  );
}