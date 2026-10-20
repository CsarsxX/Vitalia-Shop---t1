import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  DollarSign, 
  Tag, 
  AlertTriangle, 
  Layers, 
  Heart, 
  Calendar, 
  Filter,
  Trash2 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminDashboardView: React.FC = () => {
  const { orders, products, coupons, auditLogs, settings, deleteOrder } = useStore();
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week'>('all');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'oneblock' | 'lifesteal'>('all');

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (modalityFilter !== 'all' && o.modality !== modalityFilter) return false;
    return true;
  });

  // KPI calculations
  const totalOrdersCount = filteredOrders.length;
  const pendingOrdersCount = filteredOrders.filter(o => o.paymentStatus === 'pending' || o.paymentStatus === 'under_review').length;
  const paymentsUnderReviewCount = filteredOrders.filter(o => o.paymentStatus === 'under_review').length;
  const paymentsConfirmedCount = filteredOrders.filter(o => o.paymentStatus === 'confirmed').length;
  const deliveriesPendingCount = filteredOrders.filter(o => o.paymentStatus === 'confirmed' && o.deliveryStatus === 'pending').length;
  const ordersDeliveredCount = filteredOrders.filter(o => o.deliveryStatus === 'delivered').length;
  const ordersCancelledCount = filteredOrders.filter(o => o.paymentStatus === 'cancelled' || o.paymentStatus === 'rejected').length;

  const totalSalesUSD = filteredOrders
    .filter(o => o.paymentStatus === 'confirmed')
    .reduce((sum, o) => sum + o.total, 0);

  const totalSalesPEN = totalSalesUSD * settings.exchangeRateUSD_PEN;
  const activeCouponsCount = coupons.filter(c => c.isActive).length;

  // Breakdown by modality
  const oneblockOrders = filteredOrders.filter(o => o.modality === 'oneblock').length;
  const lifestealOrders = filteredOrders.filter(o => o.modality === 'lifesteal').length;
  const oneblockPercent = totalOrdersCount > 0 ? Math.round((oneblockOrders / totalOrdersCount) * 100) : 50;
  const lifestealPercent = 100 - oneblockPercent;

  return (
    <div className="space-y-8">
      {/* Admin Dashboard Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-cinzel text-[#F5F5F5]">Dashboard Administrativo</h2>
      </div>

      {/* Control bar: Title + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-cinzel text-[#F5F5F5]">
            Dashboard General
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-0.5">
            Métricas clave de rendimiento, estados de cobro y entregas en servidor
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#121212] border border-[#202020] rounded-lg text-xs">
            <button
              onClick={() => setModalityFilter('all')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                modalityFilter === 'all' ? 'bg-[#252525] text-[#FFD700]' : 'text-[#808080]'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setModalityFilter('oneblock')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                modalityFilter === 'oneblock' ? 'bg-[#252525] text-[#FFD700]' : 'text-[#808080]'
              }`}
            >
              OneBlock
            </button>
            <button
              onClick={() => setModalityFilter('lifesteal')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                modalityFilter === 'lifesteal' ? 'bg-[#252525] text-[#FF4545]' : 'text-[#808080]'
              }`}
            >
              LifeSteal
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (10 required metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Total Orders */}
        <div className="p-4 rounded-xl bg-[#101010] border border-[#202020] space-y-1">
          <div className="flex items-center justify-between text-[#808080] text-xs">
            <span>Pedidos Totales</span>
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#F5F5F5]">
            {totalOrdersCount}
          </div>
          <span className="text-[10px] text-[#606060] block">Histórico de órdenes</span>
        </div>

        {/* Payments Under Review */}
        <div className="p-4 rounded-xl bg-[#14120a] border border-[#D4AF37]/40 space-y-1">
          <div className="flex items-center justify-between text-[#FFD700] text-xs">
            <span>Pagos en Revisión</span>
            <Clock className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#FFD700]">
            {paymentsUnderReviewCount}
          </div>
          <span className="text-[10px] text-[#A0A0A0] block">Requieren validación Yape/Plin</span>
        </div>

        {/* Payments Confirmed */}
        <div className="p-4 rounded-xl bg-[#0f1712] border border-[#00FF87]/30 space-y-1">
          <div className="flex items-center justify-between text-[#00FF87] text-xs">
            <span>Pagos Confirmados</span>
            <CheckCircle2 className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#00FF87]">
            {paymentsConfirmedCount}
          </div>
          <span className="text-[10px] text-[#606060] block">Abonos verificados</span>
        </div>

        {/* Pending Deliveries */}
        <div className="p-4 rounded-xl bg-[#101010] border border-[#202020] space-y-1">
          <div className="flex items-center justify-between text-[#808080] text-xs">
            <span>Entregas Pendientes</span>
            <Truck className="w-4 h-4 text-[#00b4d8]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#00b4d8]">
            {deliveriesPendingCount}
          </div>
          <span className="text-[10px] text-[#606060] block">En cola de consola MC</span>
        </div>

        {/* Delivered Orders */}
        <div className="p-4 rounded-xl bg-[#101010] border border-[#202020] space-y-1">
          <div className="flex items-center justify-between text-[#808080] text-xs">
            <span>Pedidos Entregados</span>
            <CheckCircle2 className="w-4 h-4 text-[#F5F5F5]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#F5F5F5]">
            {ordersDeliveredCount}
          </div>
          <span className="text-[10px] text-[#606060] block">Activados con éxito</span>
        </div>

        {/* Total Confirmed Sales USD */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#252525] space-y-1">
          <div className="flex items-center justify-between text-[#808080] text-xs">
            <span>Ventas Confirmadas</span>
            <DollarSign className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#00FF87]">
            ${totalSalesUSD.toFixed(2)}
          </div>
          <span className="text-[10px] text-[#808080] block font-mono-numbers">
            Equiv. S/ {totalSalesPEN.toFixed(2)} PEN
          </span>
        </div>

        {/* Orders Cancelled / Rejected */}
        <div className="p-4 rounded-xl bg-[#140e0e] border border-[#FF4545]/30 space-y-1">
          <div className="flex items-center justify-between text-[#FF4545] text-xs">
            <span>Rechazados / Cancelados</span>
            <XCircle className="w-4 h-4 text-[#FF4545]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#FF4545]">
            {ordersCancelledCount}
          </div>
          <span className="text-[10px] text-[#808080] block">Comprobantes no válidos</span>
        </div>

        {/* Active Coupons */}
        <div className="p-4 rounded-xl bg-[#101010] border border-[#202020] space-y-1">
          <div className="flex items-center justify-between text-[#808080] text-xs">
            <span>Cupones Activos</span>
            <Tag className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#FFD700]">
            {activeCouponsCount}
          </div>
          <span className="text-[10px] text-[#606060] block">Promociones vigentes</span>
        </div>

        {/* Pending Orders Total */}
        <div className="p-4 rounded-xl bg-[#101010] border border-[#202020] space-y-1">
          <div className="flex items-center justify-between text-[#808080] text-xs">
            <span>En Proceso</span>
            <Clock className="w-4 h-4 text-[#A0A0A0]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#F5F5F5]">
            {pendingOrdersCount}
          </div>
          <span className="text-[10px] text-[#606060] block">Pendiente + En Revisión</span>
        </div>

        {/* Catalog Items count */}
        <div className="p-4 rounded-xl bg-[#101010] border border-[#202020] space-y-1">
          <div className="flex items-center justify-between text-[#808080] text-xs">
            <span>Productos en Catálogo</span>
            <Layers className="w-4 h-4 text-[#A0A0A0]" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#F5F5F5]">
            {products.length}
          </div>
          <span className="text-[10px] text-[#606060] block">Rangos, kits y extras</span>
        </div>
      </div>

      {/* Visual Charts & Breakdown Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Evolution Chart (Clean SVG visual bar representation) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#101010] border border-[#202020] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
                Evolución de Ingresos Recientes
              </h3>
              <p className="text-xs text-[#808080]">Ingresos confirmados por día (USD)</p>
            </div>
            <span className="text-xs font-mono text-[#00FF87] font-semibold">+$41.68 esta semana</span>
          </div>

          {/* Bar Chart Graphics */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#202020]">
            {[
              { day: 'Lun', amount: 15.48, height: '40%' },
              { day: 'Mar', amount: 22.99, height: '55%' },
              { day: 'Mié', amount: 11.69, height: '30%' },
              { day: 'Jue', amount: 34.50, height: '80%' },
              { day: 'Vie', amount: 48.98, height: '95%' },
              { day: 'Sáb', amount: 29.00, height: '65%' },
              { day: 'Dom', amount: 24.99, height: '60%' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-[10px] font-mono-numbers text-[#A0A0A0] opacity-0 group-hover:opacity-100 transition-opacity">
                  ${bar.amount}
                </span>
                <div 
                  className="w-full max-w-[36px] bg-[#222222] group-hover:bg-[#D4AF37] rounded-t transition-all"
                  style={{ height: bar.height }}
                />
                <span className="text-[11px] text-[#606060] font-medium group-hover:text-[#F5F5F5]">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#707070] pt-1">
            <span>Días con mayor actividad: Viernes y Sábado</span>
            <span>Tipo de cambio: 1 USD = S/ {settings.exchangeRateUSD_PEN} PEN</span>
          </div>
        </div>

        {/* Modality & Orders Distribution */}
        <div className="p-6 rounded-2xl bg-[#101010] border border-[#202020] space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              Distribución por Modalidad
            </h3>
            <p className="text-xs text-[#808080]">Proporción de órdenes generadas</p>
          </div>

          {/* Progress bar split */}
          <div className="space-y-3">
            <div className="h-3 w-full bg-[#181818] rounded-full overflow-hidden flex">
              <div 
                className="bg-[#D4AF37] h-full transition-all"
                style={{ width: `${oneblockPercent}%` }}
              />
              <div 
                className="bg-[#FF4545] h-full transition-all"
                style={{ width: `${lifestealPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[#F5F5F5] font-semibold">OneBlock ({oneblockPercent}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4545]" />
                <span className="text-[#F5F5F5] font-semibold">LifeSteal ({lifestealPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Top Selling Products List */}
          <div className="pt-2 border-t border-[#202020] space-y-2.5">
            <h4 className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">
              Top Productos Populares
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-[#141414]">
                <span className="text-[#F5F5F5] font-medium">Rango Imperium (/fly)</span>
                <span className="font-mono-numbers text-[#D4AF37]">42 ventas</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#141414]">
                <span className="text-[#F5F5F5] font-medium">Pack 3x3 (Pico + Hacha)</span>
                <span className="font-mono-numbers text-[#D4AF37]">31 ventas</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#141414]">
                <span className="text-[#F5F5F5] font-medium">Aplanar la isla ($3.00)</span>
                <span className="font-mono-numbers text-[#D4AF37]">26 ventas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Orders Management Table (Delete 1 by 1 as requested) */}
      <div className="p-6 rounded-2xl bg-[#101010] border border-[#202020] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202020] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
                Gestión de Pedidos en Vivo (Limpiar 1 por 1)
              </h3>
              <span className="text-[10px] font-mono text-[#00FF87] bg-[#00FF87]/10 px-2 py-0.5 rounded border border-[#00FF87]/20 font-bold">
                Métricas reactivas
              </span>
            </div>
            <p className="text-xs text-[#808080] mt-0.5">
              Elimina pedidos uno por uno. Cada eliminación recalcula inmediatamente los totales y contadores del Dashboard.
            </p>
          </div>

          <div className="text-xs text-[#D4AF37] font-mono">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido activo' : 'pedidos activos'}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-10 text-center space-y-2 bg-[#0c0c0c] rounded-xl border border-[#1e1e1e]">
            <p className="text-xs font-semibold text-[#808080]">No hay pedidos registrados en esta vista.</p>
            <span className="text-[11px] text-[#606060]">Todos los pedidos fueron eliminados o no hay registros para el filtro seleccionado.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] text-[#808080] uppercase tracking-wider font-semibold border-b border-[#202020]">
                <tr>
                  <th className="py-3 px-3">ID Pedido</th>
                  <th className="py-3 px-3">Jugador / Nick</th>
                  <th className="py-3 px-3">Modalidad</th>
                  <th className="py-3 px-3">Monto Total</th>
                  <th className="py-3 px-3">Estado Pago</th>
                  <th className="py-3 px-3">Entrega</th>
                  <th className="py-3 px-3 text-right">Acción (1 por 1)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c]">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#141414]/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#D4AF37]">
                      #{order.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://minotar.net/avatar/${order.mcUsername}/28`}
                          alt={order.mcUsername}
                          className="w-5 h-5 rounded bg-[#202020]"
                          onError={(e: any) => { e.target.src = 'https://minotar.net/avatar/Steve/28'; }}
                        />
                        <div>
                          <span className="font-bold text-[#F5F5F5] block">{order.mcUsername}</span>
                          <span className="text-[10px] text-[#707070]">{order.createdAt}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        order.modality === 'oneblock' 
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' 
                          : 'bg-[#FF4545]/10 text-[#FF6b6b] border border-[#FF4545]/20'
                      }`}>
                        {order.modality}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono-numbers">
                      <span className="font-bold text-[#00FF87] block">S/ {order.totalPEN.toFixed(2)}</span>
                      <span className="text-[10px] text-[#808080]">${order.total.toFixed(2)} USD</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        order.paymentStatus === 'confirmed'
                          ? 'bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/30'
                          : order.paymentStatus === 'rejected'
                          ? 'bg-[#FF4545]/10 text-[#FF4545] border border-[#FF4545]/30'
                          : 'bg-[#FFD700]/10 text-[#FFD700] border border-[#D4AF37]/30'
                      }`}>
                        {order.paymentStatus === 'confirmed' ? 'Confirmado' : order.paymentStatus === 'rejected' ? 'Rechazado' : 'En Revisión'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        order.deliveryStatus === 'delivered' ? 'text-[#00FF87]' : 'text-[#808080]'
                      }`}>
                        {order.deliveryStatus === 'delivered' ? 'Entregado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteOrder(order.id)}
                        className="px-2.5 py-1.5 rounded bg-[#281515] hover:bg-[#3d1818] text-[#FF6b6b] hover:text-[#FF4545] border border-[#FF4545]/30 font-semibold text-[11px] transition-colors inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Eliminar este pedido 1 por 1 y actualizar dashboard"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Administrative Audit Activity */}
      <div className="p-6 rounded-2xl bg-[#101010] border border-[#202020] space-y-4">
        <div className="flex items-center justify-between border-b border-[#202020] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              Actividad Administrativa Reciente
            </h3>
            <p className="text-xs text-[#808080]">Registro cronológico de acciones ejecutadas por el equipo</p>
          </div>
          <span className="text-xs text-[#D4AF37] font-semibold font-mono">
            {auditLogs.length} eventos registrados
          </span>
        </div>

        <div className="divide-y divide-[#1f1f1f] text-xs">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${
                  log.result === 'success' ? 'bg-[#00FF87]' : log.result === 'warning' ? 'bg-[#FFD700]' : 'bg-[#FF4545]'
                }`} />
                <div>
                  <span className="font-bold text-[#F5F5F5]">{log.action}:</span>{' '}
                  <span className="text-[#A0A0A0]">{log.targetResource}</span>
                  <p className="text-[11px] text-[#707070] mt-0.5">{log.details}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-semibold text-[#D4AF37] block">{log.adminName}</span>
                <span className="text-[10px] text-[#606060] font-mono">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
