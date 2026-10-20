import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  AlertTriangle, 
  User, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Trash2, 
  X 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderPaymentStatus, OrderDeliveryStatus } from '../../types/store';

export const AdminOrdersView: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderPaymentStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [internalNoteText, setInternalNoteText] = useState('');

  // Confirmation modal state for critical actions
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
  });

  // Filtered orders
  const filtered = orders.filter(ord => {
    if (statusFilter !== 'all' && ord.paymentStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchUser = ord.mcUsername.toLowerCase().includes(q);
      const matchEmail = ord.email.toLowerCase().includes(q);
      const matchRef = ord.referenceCode.toLowerCase().includes(q);
      if (!matchId && !matchUser && !matchEmail && !matchRef) return false;
    }
    return true;
  });

  const handleOpenActionModal = (title: string, description: string, action: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      action: () => {
        action();
        setConfirmModal({ isOpen: false, title: '', description: '', action: () => {} });
      },
    });
  };

  const handleApprovePayment = (order: Order) => {
    handleOpenActionModal(
      '¿Aprobar pago de ' + order.id + '?',
      'Esta acción confirmará la recepción de los fondos (S/ ' + order.totalPEN.toFixed(2) + ' PEN) y marcará la entrega como pendiente de activación en LuckPerms.',
      () => {
        updateOrderStatus(order.id, 'confirmed', 'pending', 'Pago validado en cuenta por el administrador.');
        if (selectedOrder?.id === order.id) {
          setSelectedOrder(prev => prev ? { ...prev, paymentStatus: 'confirmed', deliveryStatus: 'pending' } : null);
        }
      }
    );
  };

  const handleRejectPayment = (order: Order) => {
    handleOpenActionModal(
      '¿Rechazar pago de ' + order.id + '?',
      'Se marcará el comprobante como no acreditado o no válido en la plataforma.',
      () => {
        updateOrderStatus(order.id, 'rejected', 'failed', 'Comprobante no acreditado en la app bancaria.');
        if (selectedOrder?.id === order.id) {
          setSelectedOrder(prev => prev ? { ...prev, paymentStatus: 'rejected', deliveryStatus: 'failed' } : null);
        }
      }
    );
  };

  const handleCompleteDelivery = (order: Order) => {
    handleOpenActionModal(
      '¿Marcar entrega como completada?',
      'Se confirmará que los comandos de entrega fueron ejecutados con éxito en la consola de ' + order.modality.toUpperCase() + '.',
      () => {
        updateOrderStatus(order.id, 'confirmed', 'delivered', 'Entrega finalizada en el servidor.');
        if (selectedOrder?.id === order.id) {
          setSelectedOrder(prev => prev ? { ...prev, deliveryStatus: 'delivered' } : null);
        }
      }
    );
  };

  const handleDeleteOrder = (order: Order) => {
    handleOpenActionModal(
      '¿Eliminar pedido ' + order.id + '?',
      'Esta acción eliminará de forma permanente la orden de ' + order.mcUsername + ' (S/ ' + order.totalPEN.toFixed(2) + ' PEN) y actualizará de inmediato las estadísticas del Dashboard.',
      () => {
        deleteOrder(order.id);
        if (selectedOrder?.id === order.id) {
          setSelectedOrder(null);
        }
      }
    );
  };

  const handleSaveNote = () => {
    if (!selectedOrder || !internalNoteText.trim()) return;
    updateOrderStatus(selectedOrder.id, selectedOrder.paymentStatus, selectedOrder.deliveryStatus, internalNoteText.trim());
    setSelectedOrder(prev => prev ? { ...prev, internalNotes: internalNoteText.trim() } : null);
    setInternalNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202020] pb-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">Gestión de Pedidos</h1>
          <p className="text-xs text-[#808080]">Supervisa compras, comprobantes bancarios y estados de entrega</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#606060]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por ID, usuario o ref..."
              className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="bg-[#121212] border border-[#252525] text-[#F5F5F5] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">Todos los estados</option>
            <option value="under_review">En revisión</option>
            <option value="confirmed">Confirmados</option>
            <option value="rejected">Rechazados</option>
            <option value="cancelled">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#101010] border border-[#202020] rounded-xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A0A0A0]">
            <thead className="bg-[#141414] text-[11px] uppercase tracking-wider text-[#808080] border-b border-[#202020]">
              <tr>
                <th className="py-3 px-4">Pedido / Fecha</th>
                <th className="py-3 px-4">Usuario Minecraft</th>
                <th className="py-3 px-4">Modalidad</th>
                <th className="py-3 px-4">Productos</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Estado Pago</th>
                <th className="py-3 px-4">Estado Entrega</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-xs text-[#606060]">
                    No se encontraron órdenes registradas con los filtros actuales.
                  </td>
                </tr>
              ) : (
                filtered.map(order => {
                  const isReview = order.paymentStatus === 'under_review';
                  const isConfirmed = order.paymentStatus === 'confirmed';
                  const isRejected = order.paymentStatus === 'rejected';

                  return (
                    <tr key={order.id} className="hover:bg-[#141414] transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#FFD700] block">{order.id}</span>
                        <span className="text-[10px] text-[#606060]">{order.createdAt}</span>
                      </td>

                      {/* MC User with avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://minotar.net/avatar/${order.mcUsername}/32`}
                            alt={order.mcUsername}
                            className="w-6 h-6 rounded bg-[#202020]"
                            onError={(e: any) => { e.target.src = 'https://minotar.net/avatar/Steve/32'; }}
                          />
                          <div>
                            <span className="font-bold text-[#F5F5F5] block">{order.mcUsername}</span>
                            <span className="text-[10px] text-[#707070]">{order.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Modality */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          order.modality === 'oneblock' 
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' 
                            : 'bg-[#FF4545]/10 text-[#FF6b6b] border border-[#FF4545]/20'
                        }`}>
                          {order.modality}
                        </span>
                      </td>

                      {/* Items summary */}
                      <td className="py-3.5 px-4 max-w-[160px] truncate">
                        <span className="text-[#D0D0D0]" title={order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}>
                          {order.items.map(i => i.productName).join(', ')}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-mono-numbers">
                        <span className="font-bold text-[#00FF87] block">S/ {order.totalPEN.toFixed(2)}</span>
                        <span className="text-[10px] text-[#808080]">${order.total.toFixed(2)} USD</span>
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-[#FEF9C2]">
                        {order.paymentMethod}
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isConfirmed 
                            ? 'bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/30'
                            : isRejected
                            ? 'bg-[#FF4545]/10 text-[#FF4545] border border-[#FF4545]/30'
                            : 'bg-[#FFD700]/10 text-[#FFD700] border border-[#D4AF37]/30'
                        }`}>
                          {isConfirmed ? 'Confirmado' : isRejected ? 'Rechazado' : 'En Revisión'}
                        </span>
                      </td>

                      {/* Delivery Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          order.deliveryStatus === 'delivered'
                            ? 'bg-[#00FF87]/10 text-[#00FF87]'
                            : order.deliveryStatus === 'pending'
                            ? 'bg-[#00b4d8]/10 text-[#00b4d8]'
                            : 'bg-[#252525] text-[#808080]'
                        }`}>
                          {order.deliveryStatus === 'delivered' ? 'Entregado' : order.deliveryStatus === 'pending' ? 'Pendiente' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Assigned Admin */}
                      <td className="py-3.5 px-4 text-[11px] text-[#A0A0A0]">
                        {order.assignedAdmin || 'Sin asignar'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1.5 rounded bg-[#181818] hover:bg-[#252525] text-[#F5F5F5] font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Detalle</span>
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="p-1.5 rounded bg-[#181818] hover:bg-[#281515] text-[#808080] hover:text-[#FF4545] transition-colors"
                            title="Eliminar este pedido permanentemente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Sidebar Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#0f0f0f] border border-[#252525] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-[#202020] bg-[#141414] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#D4AF37] font-bold">ORDEN #{selectedOrder.id}</span>
                <h3 className="text-base font-bold text-[#F5F5F5]">Detalles de Transacción</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#A0A0A0] hover:text-[#F5F5F5] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Buyer & Verification Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#141414] border border-[#202020]">
                <div>
                  <span className="text-[#808080] block">Usuario de Minecraft:</span>
                  <span className="font-bold text-sm text-[#FFD700]">{selectedOrder.mcUsername}</span>
                </div>
                <div>
                  <span className="text-[#808080] block">Correo del Comprador:</span>
                  <span className="font-semibold text-[#F5F5F5]">{selectedOrder.email}</span>
                </div>
                <div>
                  <span className="text-[#808080] block">Modalidad Asignada:</span>
                  <span className="font-semibold uppercase text-[#FEF9C2]">{selectedOrder.modality}</span>
                </div>
                <div>
                  <span className="text-[#808080] block">Referencia Bancaria:</span>
                  <span className="font-mono text-[#D4AF37] font-bold">{selectedOrder.referenceCode}</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#A0A0A0]">Artículos Adquiridos</h4>
                <div className="border border-[#202020] rounded-xl overflow-hidden divide-y divide-[#202020]">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="p-3 bg-[#121212] flex items-center justify-between">
                      <span className="font-semibold text-[#F5F5F5]">{it.productName} (x{it.quantity})</span>
                      <span className="font-mono-numbers text-[#FFD700]">${(it.unitPrice * it.quantity).toFixed(2)} USD</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#202020] flex items-center justify-between">
                <div>
                  <span className="text-[#808080]">Monto a validar:</span>
                  <div className="text-xl font-bold font-mono-numbers text-[#00FF87]">
                    S/ {selectedOrder.totalPEN.toFixed(2)} PEN
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#808080]">Dólares:</span>
                  <div className="text-base font-bold font-mono-numbers text-[#FFD700]">
                    ${selectedOrder.total.toFixed(2)} USD
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#A0A0A0]">Nota Administrativa Interna</h4>
                <div className="p-3 rounded-lg bg-[#141414] border border-[#202020] text-[#D0D0D0]">
                  {selectedOrder.internalNotes || 'Sin notas registradas.'}
                </div>
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    placeholder="Escribir nota o motivo de actualización..."
                    className="flex-1 px-3 py-1.5 bg-[#141414] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 bg-[#252525] hover:bg-[#303030] text-[#F5F5F5] font-semibold rounded-lg text-xs transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>

              {/* Administrative Actions Group */}
              <div className="pt-3 border-t border-[#202020] space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-[#A0A0A0]">Acciones Administrativas</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleApprovePayment(selectedOrder)}
                    className="py-2.5 px-3 rounded-lg bg-[#00FF87]/15 hover:bg-[#00FF87]/25 text-[#00FF87] border border-[#00FF87]/30 font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aprobar Pago</span>
                  </button>

                  <button
                    onClick={() => handleRejectPayment(selectedOrder)}
                    className="py-2.5 px-3 rounded-lg bg-[#FF4545]/15 hover:bg-[#FF4545]/25 text-[#FF4545] border border-[#FF4545]/30 font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rechazar Pago</span>
                  </button>

                  <button
                    onClick={() => handleCompleteDelivery(selectedOrder)}
                    className="py-2.5 px-3 rounded-lg bg-[#00b4d8]/15 hover:bg-[#00b4d8]/25 text-[#00b4d8] border border-[#00b4d8]/30 font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Marcar Entregado</span>
                  </button>

                  <button
                    onClick={() => handleDeleteOrder(selectedOrder)}
                    className="py-2.5 px-3 rounded-lg bg-[#FF4545]/15 hover:bg-[#FF4545]/25 text-[#FF4545] border border-[#FF4545]/30 font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Pedido</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#202020] bg-[#0c0c0c] flex items-center justify-between">
              <span className="text-[11px] text-[#606060]">Eliminar pedidos actualiza las métricas del Dashboard en tiempo real.</span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#202020] hover:bg-[#2a2a2a] text-[#F5F5F5] font-semibold text-xs rounded-lg transition-colors"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#121212] border border-[#252525] rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD700] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5]">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.action}
                className="px-4 py-2 text-xs font-bold bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] rounded-lg transition-colors"
              >
                Confirmar Acción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
