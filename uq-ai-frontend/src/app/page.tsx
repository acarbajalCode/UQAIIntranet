'use client';

import React, { useState } from 'react';
import api from '../api/api';
import { Shield, Brain, Rocket, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function LandingPage() {
  // Estados para capturar los datos del formulario de Leads
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    telefono: '',
    mensaje: ''
  });

  // Estados para manejar el estado de la petición HTTP
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // POST directo al endpoint público del Backend (/api/leads) mediante nuestro cliente Axios
      await api.post('/leads', formData);
      setSuccess(true);
      // Limpiar el formulario tras el éxito
      setFormData({ nombre: '', email: '', empresa: '', telefono: '', mensaje: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Hubo un error al enviar tus datos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Encabezado / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              UQ AI Solution Company
            </span>
          </div>
          <nav className="flex gap-4">
            <a href="/login" className="text-sm font-medium text-slate-300 hover:text-white border border-slate-700 px-4 py-2 rounded-lg transition-colors">
              Intranet Operadores
            </a>
          </nav>
        </div>
      </header>

      {/* Sección Hero / Introducción */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
              <Shield className="h-4 w-4" /> Programación Segura & IA Certificada
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Automatización de Procesos Corporativos con Inteligencia Artificial
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Optimizamos los flujos de trabajo de tu organización implementando modelos híbridos de Machine Learning y capas robustas de ciberseguridad industrial.
            </p>
            
            {/* Características */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Modelos de Predicción Avanzada</h3>
                  <p className="text-sm text-slate-400">Análisis predictivo de alta fidelidad adaptado a tu rubro.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Registro de Leads */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-8 backdrop-blur shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Contáctanos</h2>
            <p className="text-sm text-slate-400 mb-6">Déjanos tus datos comerciales y un especialista te responderá en breve.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Nombre Completo *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Armando Carbajal" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Correo Corporativo *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="ejemplo@uqai.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="+51 987654321" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Empresa</label>
                <input type="text" name="empresa" value={formData.empresa} onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Minimarket Express S.A.C." />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Mensaje o Consulta</label>
                <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="Cuéntanos sobre tus necesidades de automatización..."></textarea>
              </div>

              {/* Mensajes de Alerta Controlados */}
              {success && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span>¡Solicitud enviada con éxito! Nos comunicaremos pronto.</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium py-3 rounded-lg transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Procesando...
                  </>
                ) : (
                  'Enviar Solicitud Comercial'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}