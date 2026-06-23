"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Brain, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [bloqueadoHasta, setBloqueadoHasta] = useState<number>(0);

  const estaBloqueado = Date.now() < bloqueadoHasta;
  const segundosBloq = Math.ceil((bloqueadoHasta - Date.now()) / 1000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (estaBloqueado) return;
    setLoading(true);
    setError("");

    try {
      // 1. Pedir token de acceso al backend de Java en el puerto 8080
      //const response = await axios.post("http://localhost:8080/api/auth/login", form);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await axios.post(`${baseUrl}/api/auth/login`, form);
      const { token, rol } = response.data;

      // 2. Guardar JWT en cookie HttpOnly usando nuestro Route Handler de Next.js
      await axios.post("/api/auth/set-cookie", { token, rol });

      // 3. Redirigir al dashboard limpio
      router.push("/dashboard");
    } catch (err: any) {
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);
      
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
      
      if (nuevosIntentos >= 3) {
        setBloqueadoHasta(Date.now() + 30000); // Bloqueo de 30 segundos
        setError("Demasiados intentos fallidos. Espera 30 segundos.");
        setIntentosFallidos(0);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 mb-4">
          <Brain className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">UQ AI Intranet</h2>
        <p className="mt-2 text-sm text-slate-400">Control de accesos con protección contra Fuerza Bruta</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/50 border border-slate-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="ejemplo@uqai.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Contraseña</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading || estaBloqueado}
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium py-3 rounded-lg shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? "Verificando..." : estaBloqueado ? `Bloqueado (${segundosBloq}s)` : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}