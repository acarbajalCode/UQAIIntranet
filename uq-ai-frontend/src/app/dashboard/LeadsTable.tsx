'use client';

import React, { useState } from 'react';
import { User, Mail, Building2, Phone, Calendar, Eye } from 'lucide-react';

interface Lead {
  id: number;
  nombre: string;
  email: string;
  empresa: string;
  telefono: string;
  mensaje: string;
  fechaRegistro: string;
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Tabla Principal */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Cliente / Contacto</th>
                  <th className="px-6 py-4">Empresa</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      No hay registros de leads comerciales en el sistema.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{lead.nombre}</div>
                        <div className="text-xs text-slate-400">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{lead.empresa || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedLead(lead)} 
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-md hover:bg-indigo-500 hover:text-white transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" /> Inspeccionar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Panel Lateral de Inspección (Ficha del Lead) */}
      <div className="lg:col-span-1">
        {selectedLead ? (
          <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur sticky top-24 transition-all duration-300">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-4">Ficha del Lead Comercial</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Nombre del Solicitante</div>
                  <div className="text-sm font-medium text-white">{selectedLead.nombre}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Correo de Contacto</div>
                  <div className="text-sm font-medium text-indigo-300 break-all">{selectedLead.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Razón Social / Empresa</div>
                  <div className="text-sm font-medium text-white">{selectedLead.empresa || 'No especificada'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Teléfono Fijo / Móvil</div>
                  <div className="text-sm font-medium text-slate-200">{selectedLead.telefono || 'No registrado'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Fecha de Captura</div>
                  <div className="text-sm font-medium text-slate-200">
                    {new Date(selectedLead.fechaRegistro).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 mt-2">
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">Requerimiento o Mensaje</div>
                <div className="bg-slate-900/60 rounded-lg p-3 text-sm text-slate-300 max-h-40 overflow-y-auto leading-relaxed whitespace-pre-wrap border border-slate-800">
                  {selectedLead.mensaje || 'Sin mensaje adicional.'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/20 border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 h-48 flex flex-col items-center justify-center gap-2">
            <Eye className="h-8 w-8 text-slate-600" />
            <p className="text-sm px-4">Selecciona un lead de la tabla para inspeccionar sus requerimientos comerciales.</p>
          </div>
        )}
      </div>
    </div>
  );
}