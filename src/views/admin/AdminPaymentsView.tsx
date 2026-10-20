import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  ExternalLink 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types/store';

export const AdminPaymentsView: React.FC = () => {
  const { orders, updateOrderStatus, settings } = useStore();
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'yape' | 'plin'>('all');
  const [searchRef, setSearchRef] = useState('');

  const reviewOrders = orders.filter(o => {
    if (selectedMethod !== 'all' && o.paymentMethod !== selectedMethod) return false;
    if (searchRef.trim()) {
      const q = searchRef.toLowerCase();
      if (!o.referenceCode.toLowerCase().includes(q) && !o.id.toLowerCase().includes(q) && !o.mcUsername.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleApprove = (ord: Order) => {
    updateOrderStatus(ord.id, 'confirmed', 'pending', 'Pago validado en cuenta por el administrador.');
  };

  const handleReject = (ord: Order) => {
    updateOrderStatus(ord.id, 'rejected', 'failed', 'Operación rechazada: no figura abono en app bancaria.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#202020] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">Revisión de Pagos & Transferencias</h1>
          <p className="text-xs text-[#808080]">Valida códigos de operación Yape y Plin frente al extracto bancario</p>
        </div>

        {/* Bank Config Snapshot */}
        <div className="flex items-center gap-4 text-xs bg-[#141414] px-3.5 py-2 rounded-xl border border-[#252525]">
          <div>
            <span className="text-[#808080] block text-[10px]">Titular Oficial:</span>
            <span className="font-bold text-[#FFD700]">{settings.paymentHolderName}</span>
          </div>
          <div className="border-l border-[#252525] pl-4">
            <span className="text-[#808080] block text-[10px]">Tipo de Cambio:</span>
            <span className="font-mono text-[#00FF87] font-bold">1 USD = S/ {settings.exchangeRateUSD_PEN}</span>
          </div>
        </div>
      </div>

      {/* Method filter chips & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedMethod('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedMethod === 'all'
                ? 'bg-[#202020] text-[#FFD700] border border-[#D4AF37]/30'
                : 'bg-[#121212] text-[#808080] hover:text-[#F5F5F5]'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setSelectedMethod('yape')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedMethod === 'yape'
                ? 'bg-[#1b1226] text-[#c074fc] border border-[#8a33db]/40'
                : 'bg-[#121212] text-[#808080] hover:text-[#F5F5F5]'
            }`}
          >
            Yape BCP
          </button>
          <button
            onClick={() => setSelectedMethod('plin')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedMethod === 'plin'
                ? 'bg-[#0f1d24] text-[#00b4d8] border border-[#00b4d8]/40'
                : 'bg-[#121212] text-[#808080] hover:text-[#F5F5F5]'
            }`}
          >
            Plin
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#606060]" />
          <input
            type="text"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder="Buscar referencia o pedido..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#121212] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Payment Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviewOrders.map(ord => {
          const isUnderReview = ord.paymentStatus === 'under_review';
          const isConfirmed = ord.paymentStatus === 'confirmed';
          const isRejected = ord.paymentStatus === 'rejected';

          return (
            <div
              key={ord.id}
              className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                isUnderReview
                  ? 'bg-[#14120a] border-[#D4AF37]/50 shadow-md'
                  : isConfirmed
                  ? 'bg-[#0f1411] border-[#00FF87]/20 opacity-80'
                  : 'bg-[#140e0e] border-[#FF4545]/20 opacity-80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#FFD700]">{ord.id}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    isUnderReview
                      ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#D4AF37]/30'
                      : isConfirmed
                      ? 'bg-[#00FF87]/15 text-[#00FF87]'
                      : 'bg-[#FF4545]/15 text-[#FF4545]'
                  }`}>
                    {isUnderReview ? 'En Revisión' : isConfirmed ? 'Aprobado' : 'Rechazado'}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-[#808080]">Jugador destinatario:</div>
                  <div className="text-sm font-bold text-[#F5F5F5]">{ord.mcUsername}</div>
                </div>

                <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#202020] space-y-1 text-xs">
                  <div className="flex justify-between text-[#808080]">
                    <span>Referencia:</span>
                    <span className="font-mono font-bold text-[#FEF9C2]">{ord.referenceCode}</span>
                  </div>
                  <div className="flex justify-between text-[#808080]">
                    <span>Billetera:</span>
                    <span className="font-semibold uppercase text-[#F5F5F5]">{ord.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[#808080] pt-1 border-t border-[#1a1a1a]">
                    <span>Monto requerido:</span>
                    <span className="font-mono font-bold text-[#00FF87]">S/ {ord.totalPEN.toFixed(2)} PEN</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#202020] flex gap-2">
                {isUnderReview ? (
                  <>
                    <button
                      onClick={() => handleApprove(ord)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#00FF87]/15 hover:bg-[#00FF87]/25 text-[#00FF87] border border-[#00FF87]/30 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aprobar Abono</span>
                    </button>
                    <button
                      onClick={() => handleReject(ord)}
                      className="py-2 px-3 rounded-lg bg-[#FF4545]/15 hover:bg-[#FF4545]/25 text-[#FF4545] border border-[#FF4545]/30 font-bold text-xs transition-colors"
                      title="Rechazar comprobante"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-[11px] text-[#707070] italic text-center w-full py-1">
                    Gestión finalizada por {ord.assignedAdmin}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
