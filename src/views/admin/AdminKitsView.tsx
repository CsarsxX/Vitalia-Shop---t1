import React, { useState } from 'react';
import { 
  Package, 
  Sparkles, 
  Shield, 
  Edit, 
  Plus, 
  Check, 
  Save, 
  X, 
  Swords, 
  Eye 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, MinecraftInventoryItem } from '../../types/store';
import { MinecraftItemIcon } from '../../components/common/MinecraftItemIcon';

export const AdminKitsView: React.FC = () => {
  const { products, updateProduct, setActiveInventoryKit } = useStore();

  const [selectedKitTab, setSelectedKitTab] = useState<'ranks' | 'special'>('special');
  const [editingKitProduct, setEditingKitProduct] = useState<Product | null>(null);

  // Ranks with kits
  const rankKits = products.filter(p => p.category === 'ranks' && p.kitItems && p.kitItems.length > 0);

  // Special standalone kits
  const specialKits = products.filter(p => p.category === 'special_kits');

  const handleSaveKit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKitProduct) return;
    updateProduct(editingKitProduct);
    setEditingKitProduct(null);
  };

  const handleInspectKit = (prod: Product) => {
    if (prod.kitItems) {
      setActiveInventoryKit({
        title: prod.kitIncludedName || prod.name,
        badge: prod.badge,
        items: prod.kitItems,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#202020] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
            Gestión de Kits & Cuadrícula de Inventario
          </h1>
          <p className="text-xs text-[#808080]">
            Administra los kits incluidos por rango y los kits especiales de combate Destructor y God
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#121212] border border-[#202020] rounded-lg">
          <button
            onClick={() => setSelectedKitTab('special')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedKitTab === 'special'
                ? 'bg-[#252525] text-[#FFD700]'
                : 'text-[#808080] hover:text-[#F5F5F5]'
            }`}
          >
            Kits Especiales OneBlock (Destructor & God)
          </button>
          <button
            onClick={() => setSelectedKitTab('ranks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedKitTab === 'ranks'
                ? 'bg-[#252525] text-[#FFD700]'
                : 'text-[#808080] hover:text-[#F5F5F5]'
            }`}
          >
            Kits Incluidos de Rango ({rankKits.length})
          </button>
        </div>
      </div>

      {/* Special Kits Display */}
      {selectedKitTab === 'special' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialKits.map(kit => {
            const isDestructor = kit.id === 'special-kit-destructor';
            const isGod = kit.id === 'special-kit-god';
            const isPendingPrice = kit.price === null;

            return (
              <div
                key={kit.id}
                className={`p-6 rounded-2xl border space-y-5 flex flex-col justify-between ${
                  isGod
                    ? 'bg-gradient-to-b from-[#18150c] to-[#0f0f0f] border-2 border-[#D4AF37]/80 shadow-xl'
                    : 'bg-[#150f0f] border border-[#4a1919]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isGod ? 'bg-[#201a0a] text-[#FFD700] border border-[#D4AF37]/50' : 'bg-[#261010] text-[#FF4545] border border-[#4a1919]'
                      }`}>
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-cinzel text-[#F5F5F5]">{kit.name}</h3>
                        <span className="text-[10px] text-[#A0A0A0] uppercase font-mono">Armadura Netherite Completa</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                      isGod
                        ? 'bg-[#D4AF37]/20 text-[#FFD700] border border-[#D4AF37]/30'
                        : 'bg-[#FF4545]/20 text-[#FF4545] border border-[#FF4545]/30'
                    }`}>
                      {kit.badge}
                    </span>
                  </div>

                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    {kit.description}
                  </p>

                  {/* Minecraft Inventory Preview Slot Grid */}
                  <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[#202020] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#808080]">
                      <span>Inventario ({kit.kitItems?.length || 0} objetos)</span>
                      <span className="text-[#D4AF37]">
                        {isDestructor ? 'Protección X' : 'Protección XV'}
                      </span>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {(kit.kitItems || []).map((it, idx) => (
                        <div
                          key={idx}
                          className="mc-slot aspect-square rounded flex items-center justify-center p-1 relative cursor-pointer group"
                          title={`${it.name} x${it.count}`}
                        >
                          <MinecraftItemIcon type={it.iconType} material="netherite" className="w-5 h-5" />
                          {it.count > 1 && (
                            <span className="absolute bottom-0.5 right-1 text-[10px] font-mono-numbers text-[#FEF9C2] font-bold">
                              {it.count}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Configuration Status */}
                  <div className="pt-2 border-t border-[#202020] flex items-baseline justify-between text-xs">
                    <div>
                      <span className="text-[#808080] block text-[11px]">Precio de venta:</span>
                      {isPendingPrice ? (
                        <div className="text-sm font-bold text-[#FFD700] italic">
                          Pendiente de configuración
                        </div>
                      ) : (
                        <div className="text-2xl font-black font-mono-numbers text-[#00FF87]">
                          ${kit.price?.toFixed(2)} <span className="text-xs text-[#808080]">USD</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[#808080] block text-[11px]">Estado en tienda:</span>
                      <span className={`font-semibold ${kit.isActive ? 'text-[#00FF87]' : 'text-[#FFD700]'}`}>
                        {kit.isActive ? 'Habilitado para compra' : 'Bloqueado (Sin precio)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#202020] flex gap-2">
                  <button
                    onClick={() => handleInspectKit(kit)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#181818] hover:bg-[#222222] text-[#F5F5F5] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Ver Ventana Completa</span>
                  </button>

                  <button
                    onClick={() => setEditingKitProduct({ ...kit })}
                    className="py-2 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{isPendingPrice ? 'Asignar Precio' : 'Editar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rank Kits List */}
      {selectedKitTab === 'ranks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankKits.map(rank => (
            <div key={rank.id} className="p-5 rounded-xl bg-[#101010] border border-[#252525] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#808080] font-bold">Nivel {rank.rankLevel}</span>
                  <span className="text-[10px] text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                    {rank.kitIncludedName}
                  </span>
                </div>

                <h3 className="text-base font-bold font-cinzel text-[#F5F5F5]">{rank.name} Kit</h3>

                {/* Grid */}
                <div className="p-2.5 bg-[#0a0a0a] rounded-lg border border-[#202020]">
                  <div className="grid grid-cols-6 gap-1.5">
                    {(rank.kitItems || []).map((it, idx) => (
                      <div key={idx} className="mc-slot aspect-square rounded flex items-center justify-center p-1 relative" title={it.name}>
                        <MinecraftItemIcon type={it.iconType} className="w-4 h-4" />
                        {it.count > 1 && (
                          <span className="absolute bottom-0 right-0.5 text-[9px] font-mono-numbers text-[#FEF9C2] font-bold">
                            {it.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1f1f1f]">
                <button
                  onClick={() => handleInspectKit(rank)}
                  className="w-full py-2 rounded-lg bg-[#181818] hover:bg-[#252525] text-[#D4AF37] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspeccionar Cuadrícula</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kit Edit Modal (Allows configuring Kit God price, etc.) */}
      {editingKitProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-[#252525] rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <h3 className="text-base font-bold font-cinzel text-[#F5F5F5]">
                Configurar Kit: {editingKitProduct.name}
              </h3>
              <button
                onClick={() => setEditingKitProduct(null)}
                className="p-1 text-[#808080] hover:text-[#F5F5F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKit} className="space-y-4">
              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Precio Oficial en USD</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingKitProduct.price ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : parseFloat(e.target.value);
                    setEditingKitProduct({
                      ...editingKitProduct,
                      price: val,
                      isActive: val !== null && val > 0, // Auto activate if valid price is provided
                    });
                  }}
                  placeholder="Ejemplo: 12.00 (Asignar precio activa la venta)"
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono-numbers focus:border-[#D4AF37] focus:outline-none"
                />
                <span className="text-[10px] text-[#606060] mt-1 block">
                  Al ingresar un precio válido, el producto se habilitará automáticamente para los jugadores en la tienda.
                </span>
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Descripción del Kit</label>
                <textarea
                  rows={2}
                  value={editingKitProduct.description}
                  onChange={(e) => setEditingKitProduct({ ...editingKitProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="kitActive"
                  checked={editingKitProduct.isActive}
                  onChange={(e) => setEditingKitProduct({ ...editingKitProduct, isActive: e.target.checked })}
                  disabled={editingKitProduct.price === null}
                  className="w-4 h-4 rounded bg-[#141414] border-[#252525] accent-[#00FF87]"
                />
                <label htmlFor="kitActive" className="text-xs text-[#D0D0D0] cursor-pointer">
                  Habilitar venta en la tienda pública
                </label>
              </div>

              <div className="pt-4 border-t border-[#202020] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingKitProduct(null)}
                  className="px-4 py-2 bg-[#202020] text-[#A0A0A0] rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Configuración</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
