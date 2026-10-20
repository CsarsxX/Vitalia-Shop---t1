import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, CheckCircle2, XCircle, Calendar, Save, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types/store';

export const AdminCouponsView: React.FC = () => {
  const { coupons, createCoupon, updateCoupon, deleteCoupon, currentAdmin } = useStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    type: 'percentage',
    value: 10,
    validFrom: new Date().toISOString().substring(0, 10),
    validUntil: '2026-12-31',
    maxUses: 50,
    usedCount: 0,
    minSpend: 5.0,
    isActive: true,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code?.trim()) return;

    createCoupon({
      code: newCoupon.code.trim().toUpperCase(),
      type: newCoupon.type as any,
      value: Number(newCoupon.value) || 0,
      validFrom: newCoupon.validFrom || '',
      validUntil: newCoupon.validUntil || '',
      maxUses: Number(newCoupon.maxUses) || 100,
      usedCount: 0,
      minSpend: Number(newCoupon.minSpend) || 0,
      isActive: true,
      createdBy: currentAdmin?.name || 'Administrador',
    });

    setIsCreating(false);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 10,
      validFrom: new Date().toISOString().substring(0, 10),
      validUntil: '2026-12-31',
      maxUses: 50,
      usedCount: 0,
      minSpend: 5.0,
      isActive: true,
    });
  };

  const handleToggle = (coupon: Coupon) => {
    updateCoupon({ ...coupon, isActive: !coupon.isActive });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#202020] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
            Códigos de Descuento & Promociones
          </h1>
          <p className="text-xs text-[#808080]">
            Crea y administra cupones porcentuales o de importe fijo con límites de canje
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] text-xs font-bold uppercase transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Crear Nuevo Cupón</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#101010] border border-[#202020] rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-xs text-[#A0A0A0]">
          <thead className="bg-[#141414] text-[11px] uppercase tracking-wider text-[#808080] border-b border-[#202020]">
            <tr>
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Descuento</th>
              <th className="py-3 px-4">Vigencia</th>
              <th className="py-3 px-4">Usos Realizados</th>
              <th className="py-3 px-4">Compra Mínima</th>
              <th className="py-3 px-4">Creado Por</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {coupons.map(coupon => (
              <tr key={coupon.code} className="hover:bg-[#141414] transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#FFD700]">
                  {coupon.code}
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#F5F5F5]">
                  {coupon.type === 'percentage' ? `${coupon.value}% de descuento` : `$${coupon.value.toFixed(2)} USD fijos`}
                </td>
                <td className="py-3.5 px-4 text-[#808080] font-mono">
                  {coupon.validFrom} al {coupon.validUntil}
                </td>
                <td className="py-3.5 px-4 font-mono-numbers">
                  <span className="text-[#F5F5F5] font-bold">{coupon.usedCount}</span> / {coupon.maxUses}
                </td>
                <td className="py-3.5 px-4 font-mono-numbers text-[#D0D0D0]">
                  ${coupon.minSpend?.toFixed(2) || '0.00'} USD
                </td>
                <td className="py-3.5 px-4 text-[#808080]">
                  {coupon.createdBy}
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleToggle(coupon)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                      coupon.isActive ? 'bg-[#00FF87]/15 text-[#00FF87]' : 'bg-[#252525] text-[#808080]'
                    }`}
                  >
                    <span>{coupon.isActive ? 'Activo' : 'Pausado'}</span>
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => deleteCoupon(coupon.code)}
                    className="p-1.5 text-[#606060] hover:text-[#FF4545] transition-colors"
                    title="Eliminar cupón"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#0f0f0f] border border-[#252525] rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <h3 className="text-base font-bold font-cinzel text-[#F5F5F5]">Nuevo Código de Descuento</h3>
              <button onClick={() => setIsCreating(false)} className="p-1 text-[#808080] hover:text-[#F5F5F5]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Código del Cupón</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="Ej. VERANO2026"
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono uppercase focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-bold">Tipo de Descuento</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e: any) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="percentage">Porcentual (%)</option>
                    <option value="fixed">Fijo en USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-bold">Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono-numbers focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-bold">Límite de Canjes</label>
                  <input
                    type="number"
                    value={newCoupon.maxUses}
                    onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono-numbers focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-bold">Compra Mínima ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCoupon.minSpend}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono-numbers focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#202020] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-[#202020] text-[#A0A0A0] rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cupón</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
