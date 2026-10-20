import React, { useState } from 'react';
import { FileText, Search, Filter, ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLogsView: React.FC = () => {
  const { auditLogs } = useStore();

  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'all' && !log.action.toLowerCase().includes(filterAction.toLowerCase())) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!log.adminName.toLowerCase().includes(q) && 
          !log.targetResource.toLowerCase().includes(q) && 
          !log.details.toLowerCase().includes(q) &&
          !log.action.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#202020] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
            Logs & Auditoría de Acciones
          </h1>
          <p className="text-xs text-[#808080]">
            Registro inmutable de solo lectura para supervisar modificaciones de precios, pagos y accesos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#606060]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en logs..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#121212] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-[#121212] border border-[#252525] text-[#F5F5F5] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Todas las acciones</option>
            <option value="Pago">Validaciones de Pago</option>
            <option value="Producto">Cambios de Producto/Precio</option>
            <option value="Cupón">Gestión de Cupones</option>
            <option value="Sesión">Inicios de Sesión</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[#101010] border border-[#202020] rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-xs text-[#A0A0A0]">
          <thead className="bg-[#141414] text-[11px] uppercase tracking-wider text-[#808080] border-b border-[#202020]">
            <tr>
              <th className="py-3 px-4">Fecha y Hora</th>
              <th className="py-3 px-4">Administrador</th>
              <th className="py-3 px-4">Acción</th>
              <th className="py-3 px-4">Recurso Afectado</th>
              <th className="py-3 px-4">Detalles del Cambio</th>
              <th className="py-3 px-4 text-right">Resultado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {filteredLogs.map(log => {
              const isSuccess = log.result === 'success';
              const isWarning = log.result === 'warning';

              return (
                <tr key={log.id} className="hover:bg-[#141414] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#808080] text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#F5F5F5]">
                    {log.adminName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#D4AF37]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-[#FEF9C2] font-medium">
                    {log.targetResource}
                  </td>
                  <td className="py-3.5 px-4 text-[#D0D0D0] max-w-sm">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isSuccess
                        ? 'bg-[#00FF87]/15 text-[#00FF87]'
                        : isWarning
                        ? 'bg-[#FFD700]/15 text-[#FFD700]'
                        : 'bg-[#FF4545]/15 text-[#FF4545]'
                    }`}>
                      {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>{log.result}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
