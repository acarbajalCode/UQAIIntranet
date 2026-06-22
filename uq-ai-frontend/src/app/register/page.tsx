'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../api/api';
import { Brain, User, Mail, Lock, Briefcase, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    area: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // POST al endpoint de registro público del backend (/api/auth/register)
      await api.post('/auth/register', formData);
      setSuccess(true);
      
      // Redireccionar al login automáticamente después de 2 segundos de éxito
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Hubo un problema al registrar la cuenta. Inténtalo de nuevo.');
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
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Registro de Operador
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Crea una nueva credencial para la intranet de UQ AI
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/50 border border-slate-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Armando" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Apellidos</label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Carbajal" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Área / Unidad Informativa</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input type="text" name="area" value={formData.area} onChange={handleChange} required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Sistemas / Desarrollo" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="armando@uqai.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Contraseña de Seguridad</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="••••••••" />
              </div>
            </div>

            {success && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>¡Operador registrado con éxito! Redireccionando...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
                  </>
                ) : (
                  'Completar Registro'
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-slate-400">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}