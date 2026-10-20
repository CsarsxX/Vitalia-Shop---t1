import React, { useState } from 'react';
import { 
  Sparkles, 
  Feather, 
  Edit, 
  Package, 
  Check, 
  Save, 
  X, 
  Shield 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';

export const AdminRanksView: React.FC = () => {
  const { products, updateProduct } = useStore();

  const ranks = products
    .filter(p => p.category === 'ranks' && p.modality === 'oneblock')
    .sort((a, b) => (a.rankLevel || 0) - (b.rankLevel || 0));

  const [editingRank, setEditingRank] = useState<Product | null>(null);

  const handleSaveRank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRank) return;

    // Enforce max $29.00 USD rule
    if (editingRank.price && editingRank.price > 29.00) {
      alert('Regla comercial: El precio del rango no puede superar los $29.00 USD.');
      return;
    }

    updateProduct(editingRank);
    setEditingRank(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#202020] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
            Gestión de los Seis Rangos Comerciales
          </h1>
          <p className="text-xs text-[#808080]">
            Progresión oficial de Pulso a Vitalia. Comando /fly activo a partir de Imperium y tope comercial de $29.00 USD.
          </p>
        </div>
        <span className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
          6 Rangos Comerciales Fijos
        </span>
      </div>

      {/* Ranks Cards List in Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ranks.map(rank => {
          const isVitalia = rank.rankLevel === 6;
          const isVital = rank.rankLevel === 5;
          const isImperium = rank.rankLevel === 3;

          return (
            <div
              key={rank.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
                isVitalia
                  ? 'bg-[#18150c] border-[#D4AF37] shadow-lg'
                  : 'bg-[#101010] border-[#252525]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#808080]">
                    NIVEL {rank.rankLevel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {rank.hasFly ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/30 uppercase">
                        <Feather className="w-3 h-3" />
                        /fly Activo
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#606060] uppercase font-bold">
                        /fly Inactivo
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-cinzel text-[#F5F5F5]">{rank.name}</h3>
                  <p className="text-xs text-[#A0A0A0] mt-1 line-clamp-2">{rank.description}</p>
                </div>

                {/* Vaults & Homes */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#0c0c0c] border border-[#202020] text-xs">
                  <div>
                    <span className="text-[#808080] block text-[10px]">PlayerVaults</span>
                    <span className="font-bold font-mono-numbers text-[#F5F5F5]">{rank.playerVaults}</span>
                  </div>
                  <div>
                    <span className="text-[#808080] block text-[10px]">Homes (/sethome)</span>
                    <span className="font-bold font-mono-numbers text-[#F5F5F5]">{rank.homes}</span>
                  </div>
                </div>

                <div className="text-xs text-[#FEF9C2] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Kit asignado: <strong>{rank.kitIncludedName}</strong></span>
                </div>

                <div className="pt-2 border-t border-[#1f1f1f] flex items-baseline justify-between">
                  <span className="text-xs text-[#808080]">Precio actual</span>
                  <span className="text-2xl font-black font-mono-numbers text-[#FFD700]">
                    ${rank.price?.toFixed(2)} <span className="text-xs text-[#808080]">USD</span>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#202020]">
                <button
                  onClick={() => setEditingRank({ ...rank })}
                  className="w-full py-2 px-3 rounded-lg bg-[#202020] hover:bg-[#D4AF37] hover:text-[#050505] text-[#F5F5F5] text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Configuración</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rank Edit Modal */}
      {editingRank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#0f0f0f] border border-[#252525] rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <div>
                <span className="text-[11px] font-mono text-[#D4AF37] uppercase font-bold">Nivel {editingRank.rankLevel}</span>
                <h3 className="text-lg font-bold font-cinzel text-[#F5F5F5]">
                  Configuración del Rango: {editingRank.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingRank(null)}
                className="p-1 text-[#808080] hover:text-[#F5F5F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRank} className="space-y-4">
              {/* Apartado 1: Precio y descripción */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#202020] space-y-3">
                <h4 className="font-bold text-[#FFD700] uppercase text-[11px]">1. Precio & Descripción Comercial</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A0A0A0] mb-1">Precio en USD (Máximo $29.00)</label>
                    <input
                      type="number"
                      step="0.01"
                      max={29.00}
                      value={editingRank.price ?? ''}
                      onChange={(e) => setEditingRank({ ...editingRank, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#0c0c0c] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono-numbers focus:border-[#D4AF37] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#A0A0A0] mb-1">Insignia Promocional</label>
                    <input
                      type="text"
                      value={editingRank.badge || ''}
                      onChange={(e) => setEditingRank({ ...editingRank, badge: e.target.value })}
                      placeholder="Ej. RANGO MÁXIMO"
                      className="w-full px-3 py-2 bg-[#0c0c0c] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#A0A0A0] mb-1">Descripción de la tarjeta</label>
                  <textarea
                    rows={2}
                    value={editingRank.description}
                    onChange={(e) => setEditingRank({ ...editingRank, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c0c] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Apartado 2: Beneficios numéricos y /fly */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#202020] space-y-3">
                <h4 className="font-bold text-[#FFD700] uppercase text-[11px]">2. Almacenamiento & Comando /fly</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A0A0A0] mb-1">PlayerVaults personales (/pv)</label>
                    <input
                      type="number"
                      value={editingRank.playerVaults || 0}
                      onChange={(e) => setEditingRank({ ...editingRank, playerVaults: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#0c0c0c] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono-numbers focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A0A0A0] mb-1">Homes disponibles (/sethome)</label>
                    <input
                      type="number"
                      value={editingRank.homes || 0}
                      onChange={(e) => setEditingRank({ ...editingRank, homes: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-[#0c0c0c] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono-numbers focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasFly"
                      checked={editingRank.hasFly}
                      onChange={(e) => setEditingRank({ ...editingRank, hasFly: e.target.checked })}
                      className="w-4 h-4 rounded bg-[#0c0c0c] border-[#252525] accent-[#00FF87]"
                    />
                    <label htmlFor="hasFly" className="text-xs text-[#F5F5F5] cursor-pointer font-semibold flex items-center gap-1.5">
                      <Feather className="w-3.5 h-3.5 text-[#00FF87]" />
                      <span>Habilitar acceso al comando /fly en este rango (Requerido desde Imperium)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Apartado 3: Kit incluido */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#202020] space-y-2">
                <h4 className="font-bold text-[#FFD700] uppercase text-[11px]">3. Kit Propio Asociado</h4>
                <div>
                  <label className="block text-[#A0A0A0] mb-1">Nombre del Kit Asignado</label>
                  <input
                    type="text"
                    value={editingRank.kitIncludedName || ''}
                    onChange={(e) => setEditingRank({ ...editingRank, kitIncludedName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0c0c] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#606060] mt-1 block">
                    El contenido detallado de los objetos y encantamientos se administra en la sección de Kits.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#202020] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRank(null)}
                  className="px-4 py-2 bg-[#202020] text-[#A0A0A0] rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Rango</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
