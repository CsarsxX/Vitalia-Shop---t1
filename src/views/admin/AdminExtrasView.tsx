import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Pickaxe, 
  Package, 
  Edit, 
  Save, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { MinecraftItemIcon } from '../../components/common/MinecraftItemIcon';

export const AdminExtrasView: React.FC = () => {
  const { products, updateProduct } = useStore();

  // The 7 specific items specified in prompt table
  const extrasList = products.filter(p => 
    p.id === 'upgrade-flatten-island' ||
    p.id === 'tool-pickaxe-3x3' ||
    p.id === 'tool-pickaxe-eff-35' ||
    p.id === 'tool-axe-3x3' ||
    p.id === 'bundle-pack-3x3' ||
    p.id === 'special-kit-destructor' ||
    p.id === 'special-kit-god'
  );

  const [editingExtra, setEditingExtra] = useState<Product | null>(null);

  const handleSaveExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExtra) return;
    updateProduct(editingExtra);
    setEditingExtra(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#202020] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
            Gestión de Extras Exclusivos OneBlock
          </h1>
          <p className="text-xs text-[#808080]">
            Configura precios y disponibilidad de herramientas 3x3, mejora de superficie «Aplanar la isla» y kits de asedio
          </p>
        </div>
        <span className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
          7 Artículos OneBlock
        </span>
      </div>

      {/* Table */}
      <div className="bg-[#101010] border border-[#202020] rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-xs text-[#A0A0A0]">
          <thead className="bg-[#141414] text-[11px] uppercase tracking-wider text-[#808080] border-b border-[#202020]">
            <tr>
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4">Efecto / Especificación</th>
              <th className="py-3 px-4">Precio Actual</th>
              <th className="py-3 px-4">Insignia</th>
              <th className="py-3 px-4">Estado de Compra</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {extrasList.map(extra => {
              const isPending = extra.price === null;
              const isFlatten = extra.id === 'upgrade-flatten-island';
              const isEff35 = extra.id === 'tool-pickaxe-eff-35';
              const isPack = extra.id === 'bundle-pack-3x3';

              return (
                <tr key={extra.id} className="hover:bg-[#141414] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-[#181818] border border-[#252525] flex items-center justify-center">
                        <MinecraftItemIcon type={extra.toolType || (extra.category === 'special_kits' ? 'helmet' : 'block')} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#F5F5F5] block">{extra.name}</span>
                        <span className="text-[10px] text-[#606060] font-mono">{extra.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#D0D0D0]">
                    {isFlatten && <span>Capa única de GRASS_BLOCK en superficie</span>}
                    {isEff35 && <span className="font-mono text-[#FEF9C2]">Eficiencia XXXV · Fortuna V estrictamente</span>}
                    {isPack && <span className="text-[#00FF87] font-semibold">Pico 3x3 + Hacha 3x3 (Ahorro $2.50)</span>}
                    {extra.effectArea && <span>Minería/Tala en área {extra.effectArea}</span>}
                    {extra.category === 'special_kits' && <span>Conjunto completo Netherite</span>}
                  </td>

                  <td className="py-3.5 px-4 font-mono-numbers">
                    {isPending ? (
                      <span className="text-[#FFD700] italic font-semibold">Por configurar</span>
                    ) : (
                      <span className="text-sm font-bold text-[#00FF87]">${extra.price?.toFixed(2)} USD</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-semibold uppercase">
                      {extra.badge || 'EXTRA'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      extra.isActive && !isPending
                        ? 'bg-[#00FF87]/15 text-[#00FF87]'
                        : 'bg-[#FFD700]/15 text-[#FFD700]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${extra.isActive && !isPending ? 'bg-[#00FF87]' : 'bg-[#FFD700]'}`} />
                      <span>{extra.isActive && !isPending ? 'Disponible para compra' : 'Bloqueado (Sin precio)'}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setEditingExtra({ ...extra })}
                      className="px-2.5 py-1.5 rounded bg-[#181818] hover:bg-[#252525] text-[#D4AF37] font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{isPending ? 'Fijar Precio' : 'Editar'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Extra Modal */}
      {editingExtra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-[#252525] rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <h3 className="text-base font-bold font-cinzel text-[#F5F5F5]">
                Configurar Extra: {editingExtra.name}
              </h3>
              <button
                onClick={() => setEditingExtra(null)}
                className="p-1 text-[#808080] hover:text-[#F5F5F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExtra} className="space-y-4">
              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Precio en USD</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingExtra.price ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : parseFloat(e.target.value);
                    setEditingExtra({
                      ...editingExtra,
                      price: val,
                      isActive: val !== null && val > 0,
                    });
                  }}
                  placeholder="Asigna un precio numérico para habilitar este extra"
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono-numbers focus:border-[#D4AF37] focus:outline-none"
                />
                <span className="text-[10px] text-[#606060] mt-1 block">
                  Si dejas el campo vacío, el producto quedará marcado como «Pendiente de configuración» y no podrá comprarse.
                </span>
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Descripción</label>
                <textarea
                  rows={2}
                  value={editingExtra.description}
                  onChange={(e) => setEditingExtra({ ...editingExtra, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {editingExtra.id === 'upgrade-flatten-island' && (
                <div className="p-3 rounded-lg bg-[#141812] border border-[#3b821e]/40 text-[#A0A0A0] space-y-1">
                  <span className="font-bold text-[#00FF87] block">Material Asignado: GRASS_BLOCK</span>
                  <p className="text-[11px]">
                    El comando del servidor ejecuta el reemplazo de superficie exclusivamente con una sola capa de césped.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="extraActive"
                  checked={editingExtra.isActive}
                  onChange={(e) => setEditingExtra({ ...editingExtra, isActive: e.target.checked })}
                  disabled={editingExtra.price === null}
                  className="w-4 h-4 rounded bg-[#141414] border-[#252525] accent-[#00FF87]"
                />
                <label htmlFor="extraActive" className="text-xs text-[#D0D0D0] cursor-pointer">
                  Activar y permitir compras en la tienda
                </label>
              </div>

              <div className="pt-4 border-t border-[#202020] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingExtra(null)}
                  className="px-4 py-2 bg-[#202020] text-[#A0A0A0] rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Extra</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
