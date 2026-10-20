import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  ToggleLeft, 
  ToggleRight, 
  Eye, 
  Layers, 
  Sparkles, 
  X, 
  Save 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, Modality } from '../../types/store';
import { MinecraftItemIcon } from '../../components/common/MinecraftItemIcon';

export const AdminProductsView: React.FC = () => {
  const { products, updateProduct, addProduct } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'ranks' | 'kits' | 'tools' | 'upgrades' | 'oneblock' | 'lifesteal'>('all');
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filtered = products.filter(p => {
    if (activeTab === 'ranks' && p.category !== 'ranks') return false;
    if (activeTab === 'kits' && p.category !== 'rank_kits' && p.category !== 'special_kits') return false;
    if (activeTab === 'tools' && p.category !== 'tools') return false;
    if (activeTab === 'upgrades' && p.category !== 'upgrades') return false;
    if (activeTab === 'oneblock' && p.modality !== 'oneblock') return false;
    if (activeTab === 'lifesteal' && p.modality !== 'lifesteal') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleToggleActive = (prod: Product) => {
    updateProduct({ ...prod, isActive: !prod.isActive });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202020] pb-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">Catálogo Completo de Productos</h1>
          <p className="text-xs text-[#808080]">Administra precios, descripciones, modalidades y visibilidad en tienda</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#606060]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#121212] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#202020] pb-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'ranks', label: 'Rangos' },
          { id: 'kits', label: 'Kits' },
          { id: 'tools', label: 'Herramientas' },
          { id: 'upgrades', label: 'Mejoras de Isla' },
          { id: 'oneblock', label: 'OneBlock' },
          { id: 'lifesteal', label: 'LifeSteal' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30'
                : 'text-[#808080] hover:text-[#F5F5F5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#101010] border border-[#202020] rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-xs text-[#A0A0A0]">
          <thead className="bg-[#141414] text-[11px] uppercase tracking-wider text-[#808080] border-b border-[#202020]">
            <tr>
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4">Modalidad</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Precio (USD)</th>
              <th className="py-3 px-4">Insignia</th>
              <th className="py-3 px-4">Visibilidad</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {filtered.map(prod => {
              const isPending = prod.price === null;
              return (
                <tr key={prod.id} className="hover:bg-[#141414] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#181818] border border-[#252525] flex items-center justify-center">
                        <MinecraftItemIcon 
                          type={prod.toolType || (prod.category === 'ranks' ? 'helmet' : 'block')} 
                          className="w-4 h-4" 
                        />
                      </div>
                      <div>
                        <span className="font-bold text-[#F5F5F5] block">{prod.name}</span>
                        <span className="text-[10px] text-[#606060] font-mono">{prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 uppercase font-semibold text-[#FEF9C2] text-[11px]">
                    {prod.modality}
                  </td>
                  <td className="py-3 px-4 text-[#A0A0A0] capitalize">
                    {prod.category.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-mono-numbers">
                    {isPending ? (
                      <span className="text-[#FFD700] italic text-[11px]">Por configurar</span>
                    ) : (
                      <span className="font-bold text-[#00FF87]">${prod.price?.toFixed(2)} USD</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {prod.badge ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-semibold">
                        {prod.badge}
                      </span>
                    ) : (
                      <span className="text-[#505050]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                        prod.isActive
                          ? 'bg-[#00FF87]/15 text-[#00FF87]'
                          : 'bg-[#252525] text-[#808080]'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${prod.isActive ? 'bg-[#00FF87]' : 'bg-[#606060]'}`} />
                      <span>{prod.isActive ? 'Activo' : 'Oculto'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setEditingProduct({ ...prod })}
                      className="p-1.5 rounded bg-[#181818] hover:bg-[#252525] text-[#D4AF37] transition-colors"
                      title="Editar producto"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#0f0f0f] border border-[#252525] rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <h3 className="text-base font-bold text-[#F5F5F5] font-cinzel">
                Editar Producto: {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-[#808080] hover:text-[#F5F5F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A0A0A0] mb-1">Nombre Comercial</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#A0A0A0] mb-1">Precio en USD (Dejar vacío si pendiente)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ 
                      ...editingProduct, 
                      price: e.target.value === '' ? null : parseFloat(e.target.value) 
                    })}
                    placeholder="Ejemplo: 9.99"
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A0A0A0] mb-1">Descripción Breve</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A0A0A0] mb-1">Insignia / Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    placeholder="Ej. PACK AHORRO"
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#A0A0A0] mb-1">Modalidad</label>
                  <select
                    value={editingProduct.modality}
                    onChange={(e: any) => setEditingProduct({ ...editingProduct, modality: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="oneblock">OneBlock</option>
                    <option value="lifesteal">LifeSteal</option>
                    <option value="global">Global</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingProduct.isActive}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#141414] border-[#252525] accent-[#D4AF37]"
                />
                <label htmlFor="isActive" className="text-xs text-[#D0D0D0] cursor-pointer">
                  Habilitar producto y permitir compras en la tienda
                </label>
              </div>

              <div className="pt-4 border-t border-[#202020] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-[#202020] text-[#A0A0A0] rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
