import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Package, 
  ArrowRight, 
  Calendar, 
  User, 
  CreditCard 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types/store';

export const OrderLookupView: React.FC = () => {
  const { orders } = useStore();

  const [orderIdInput, setOrderIdInput] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setHasSearched(true);

    const cleanId = orderIdInput.trim().toUpperCase();
    const cleanVerify = verifyInput.trim().toLowerCase();

    if (!cleanId || !cleanVerify) {
      setErrorMsg('Debes ingresar el ID del pedido y la verificación correspondiente.');
      setSearchedOrder(null);
      return;
    }

    const found = orders.find(
      ord => ord.id.toUpperCase() === cleanId && 
      (ord.mcUsername.toLowerCase() === cleanVerify || ord.email.toLowerCase() === cleanVerify)
    );

    if (!found) {
      setErrorMsg('No se encontró ningún pedido que coincida con este ID y dato de verificación.');
      setSearchedOrder(null);
    } else {
      setSearchedOrder(found);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4">
      {/* Page Header */}
      <div className="text-center space-y-2 border-b border-[#202020] pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Rastreo Seguro</span>
        </div>
        <h1 className="text-3xl font-extrabold font-cinzel text-[#F5F5F5]">
          Consulta de Pedidos
        </h1>
        <p className="text-xs text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
          Ingresa tu identificador de compra y tu nombre de Minecraft o correo para conocer el estado de validación y despacho de tus artículos.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} className="bg-[#101010] p-6 rounded-2xl border border-[#252525] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D0D0D0] mb-1">
              Identificador del Pedido
            </label>
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
              placeholder="Ejemplo: VT-84920"
              className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#252525] rounded-xl text-xs text-[#F5F5F5] font-mono placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D0D0D0] mb-1">
              Verificación (Usuario o Correo)
            </label>
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="Tu nick de Minecraft o correo"
              className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#252525] rounded-xl text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-[#FF4545] flex items-center gap-1.5 bg-[#FF4545]/10 p-2.5 rounded-lg border border-[#FF4545]/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#050505] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Consultar pedido</span>
          </button>
        </div>
      </form>

      {/* Search Result */}
      {searchedOrder && (
        <div className="bg-[#101010] rounded-2xl border border-[#252525] overflow-hidden space-y-6 p-6 animate-in fade-in duration-200">
          {/* Header of Order */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#202020] pb-4">
            <div>
              <span className="text-[11px] font-mono text-[#D4AF37] block font-bold">ORDEN #{searchedOrder.id}</span>
              <h2 className="text-lg font-bold font-cinzel text-[#F5F5F5] mt-0.5">
                Destinatario: {searchedOrder.mcUsername}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {searchedOrder.paymentStatus === 'confirmed' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Pago Confirmado
                </span>
              ) : searchedOrder.paymentStatus === 'rejected' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF4545]/15 text-[#FF4545] border border-[#FF4545]/30">
                  <XCircle className="w-3.5 h-3.5" />
                  Pago Rechazado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFD700]/15 text-[#FFD700] border border-[#D4AF37]/30">
                  <Clock className="w-3.5 h-3.5" />
                  Pago en Revisión
                </span>
              )}
            </div>
          </div>

          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#141414] border border-[#202020] text-xs">
            <div>
              <span className="text-[#808080] block">Fecha de compra:</span>
              <span className="font-semibold text-[#F5F5F5]">{searchedOrder.createdAt}</span>
            </div>
            <div>
              <span className="text-[#808080] block">Modalidad:</span>
              <span className="font-semibold uppercase text-[#FEF9C2]">{searchedOrder.modality}</span>
            </div>
            <div>
              <span className="text-[#808080] block">Método de pago:</span>
              <span className="font-semibold uppercase text-[#F5F5F5]">{searchedOrder.paymentMethod}</span>
            </div>
            <div>
              <span className="text-[#808080] block">Código de referencia:</span>
              <span className="font-mono text-[#D4AF37] font-semibold">{searchedOrder.referenceCode}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
              Línea de Tiempo del Pedido
            </h3>
            <div className="border border-[#202020] rounded-xl p-5 bg-[#0e0e0e] space-y-4">
              {searchedOrder.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx < searchedOrder.timeline.length - 1 && (
                    <div className={`absolute left-2 top-5 bottom-0 w-0.5 -mb-4 ${
                      event.completed ? 'bg-[#00FF87]/40' : 'bg-[#252525]'
                    }`} />
                  )}
                  <div className="shrink-0 z-10">
                    {event.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00FF87] bg-[#0e0e0e] rounded-full" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#404040] bg-[#141414]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        event.completed ? 'text-[#F5F5F5]' : 'text-[#606060]'
                      }`}>
                        {event.step}
                      </span>
                      <span className="text-[10px] text-[#606060] font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#808080] mt-0.5">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
              Productos Adquiridos
            </h3>
            <div className="border border-[#202020] rounded-xl overflow-hidden divide-y divide-[#202020] text-xs">
              {searchedOrder.items.map((item, i) => (
                <div key={i} className="p-3 bg-[#121212] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-semibold text-[#F5F5F5]">{item.productName}</span>
                    <span className="text-[#808080]">x{item.quantity}</span>
                  </div>
                  <span className="font-mono-numbers text-[#FFD700] font-bold">
                    ${(item.unitPrice * item.quantity).toFixed(2)} USD
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#202020] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#808080]">Total abonado en moneda nacional:</span>
              <div className="text-base font-bold font-mono-numbers text-[#00FF87]">
                S/ {searchedOrder.totalPEN.toFixed(2)} PEN
              </div>
            </div>
            <div className="text-right">
              <span className="text-[#808080]">Total en dólares:</span>
              <div className="text-base font-bold font-mono-numbers text-[#FFD700]">
                ${searchedOrder.total.toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
