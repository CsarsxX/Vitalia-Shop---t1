import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  Shield, 
  Pickaxe, 
  Package, 
  Sparkles, 
  Eye, 
  ShoppingBag, 
  AlertCircle, 
  ChevronDown 
} from 'lucide-react';
import { useStore, StoreRoute } from '../../context/StoreContext';
import { Product, Modality, ProductCategory } from '../../types/store';
import { RankCard } from '../../components/store/RankCard';
import { MinecraftItemIcon } from '../../components/common/MinecraftItemIcon';

interface Props {
  presetModality?: Modality;
  presetCategory?: string;
  onViewDetails: (product: Product) => void;
  onViewKit: (product: Product) => void;
}

export const CatalogView: React.FC<Props> = ({
  presetModality,
  presetCategory,
  onViewDetails,
  onViewKit,
}) => {
  const { products, addToCart } = useStore();

  const [selectedModality, setSelectedModality] = useState<Modality | 'all'>(presetModality || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(presetCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Filter products
  const filteredProducts = products.filter(product => {
    // Modality filter
    if (selectedModality !== 'all' && product.modality !== selectedModality) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'ranks' && product.category !== 'ranks') return false;
      if (selectedCategory === 'kits' && product.category !== 'rank_kits' && product.category !== 'special_kits') return false;
      if (selectedCategory === 'tools' && product.category !== 'tools') return false;
      if (selectedCategory === 'upgrades' && product.category !== 'upgrades') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchTag = product.badge?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return (a.price ?? 999) - (b.price ?? 999);
    }
    if (sortBy === 'price-desc') {
      return (b.price ?? -1) - (a.price ?? -1);
    }
    // Featured / default sort: by category and rank level
    if (a.category === 'ranks' && b.category === 'ranks') {
      return (a.rankLevel || 0) - (b.rankLevel || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-10">
      {/* Catalog Header */}
      <div className="border-b border-[#202020] pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catálogo Oficial</span>
        </div>
        <h1 className="text-3xl font-extrabold font-cinzel text-[#F5F5F5]">
          {selectedModality === 'oneblock' 
            ? 'Tienda OneBlock' 
            : selectedModality === 'lifesteal' 
            ? 'Tienda LifeSteal' 
            : 'Explorar Todos los Productos'}
        </h1>
        <p className="text-xs text-[#A0A0A0] mt-1 max-w-2xl leading-relaxed">
          Rangos comerciales oficiales con comando /fly, armaduras completas con Protección 10 y 15, herramientas 3x3 masivas y mejoras de superficie para tu isla.
        </p>
      </div>

      {/* Control Bar: Modalities + Categories + Search + Sort */}
      <div className="space-y-4">
        {/* Modality Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-[#101010] border border-[#252525] rounded-xl">
            <button
              onClick={() => setSelectedModality('all')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedModality === 'all'
                  ? 'bg-[#202020] text-[#FFD700] shadow-sm'
                  : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
              }`}
            >
              Todas las Modalidades
            </button>
            <button
              onClick={() => setSelectedModality('oneblock')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedModality === 'oneblock'
                  ? 'bg-[#1c170d] text-[#FFD700] border border-[#D4AF37]/40 shadow-sm'
                  : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
              }`}
            >
              <MinecraftItemIcon type="grass_block" className="w-4 h-4" />
              <span>OneBlock</span>
            </button>
            <button
              onClick={() => setSelectedModality('lifesteal')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedModality === 'lifesteal'
                  ? 'bg-[#220d0d] text-[#FF6b6b] border border-[#FF4545]/40 shadow-sm'
                  : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FF4545]" />
              <span>LifeSteal (Hasta $21.90)</span>
            </button>
            <button
              onClick={() => setSelectedModality('global')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                selectedModality === 'global'
                  ? 'bg-[#181818] text-[#FEF9C2] border border-[#D4AF37]/40 shadow-sm'
                  : 'text-[#A0A0A0] hover:text-[#F5F5F5]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span>Global (+45%)</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#606060]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o ventaja..."
              className="w-full pl-9 pr-3 py-2 bg-[#101010] border border-[#252525] rounded-xl text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Category Filters & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'ranks', label: 'Rangos Oficiales' },
              { id: 'kits', label: 'Kits de Combate' },
              { id: 'tools', label: 'Herramientas 3x3' },
              { id: 'upgrades', label: 'Mejoras de Isla' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30'
                    : 'bg-[#121212] text-[#808080] hover:text-[#F5F5F5] border border-[#1e1e1e]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2 text-xs text-[#A0A0A0]">
            <span>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#121212] border border-[#252525] text-[#F5F5F5] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#D4AF37] text-xs"
            >
              <option value="featured">Destacados / Nivel</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-[#0d0d0d] rounded-2xl border border-[#202020]">
          <div className="w-12 h-12 rounded-full bg-[#161616] flex items-center justify-center mx-auto text-[#606060]">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#F5F5F5]">No se encontraron productos</h3>
          <p className="text-xs text-[#808080] max-w-sm mx-auto">
            No existen artículos con los filtros seleccionados. Intenta restablecer los filtros de modalidad o categoría.
          </p>
          <button
            onClick={() => { setSelectedModality('all'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 bg-[#202020] hover:bg-[#2a2a2a] text-xs font-semibold rounded-lg text-[#F5F5F5] transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map(product => {
            if (product.category === 'ranks') {
              return (
                <RankCard
                  key={product.id}
                  rank={product}
                  onViewDetails={onViewDetails}
                  onViewKit={onViewKit}
                />
              );
            }

            // General Product Card (Tools, Kits, Upgrades)
            const isPendingPrice = product.price === null;
            const isSpecialKit = product.category === 'special_kits';
            const isTool = product.category === 'tools';

            return (
              <div
                key={product.id}
                className="rounded-xl bg-[#101010] border border-[#252525] hover:border-[#383838] transition-all duration-200 flex flex-col justify-between p-6 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#252525] flex items-center justify-center text-[#D4AF37]">
                      <MinecraftItemIcon 
                        type={product.toolType || (isSpecialKit ? 'helmet' : 'block')} 
                        material="netherite" 
                        className="w-6 h-6" 
                      />
                    </div>

                    {product.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        product.badge.includes('SUPREMO') || product.badge.includes('AHORRO')
                          ? 'bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30'
                          : product.badge.includes('PENDIENTE')
                          ? 'bg-[#404040]/30 text-[#A0A0A0] border border-[#404040]'
                          : 'bg-[#181818] text-[#00FF87] border border-[#00FF87]/20'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-[#808080] uppercase tracking-wider">
                      {product.modality} · {product.category.replace('_', ' ')}
                    </div>
                    <h3 className="text-lg font-bold font-cinzel text-[#F5F5F5] mt-0.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#A0A0A0] mt-1.5 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Enchantments / Special Specs */}
                  {product.enchantments && product.enchantments.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {product.enchantments.map((ench, i) => (
                        <span key={i} className="text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-[#181818] border border-[#252525] text-[#FEF9C2]">
                          {ench.name} {ench.level}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="pt-3 border-t border-[#1c1c1c] flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-[#808080] block">Precio</span>
                      {isPendingPrice ? (
                        <span className="text-xs font-semibold text-[#D4AF37] italic">
                          Por configurar en panel
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono-numbers text-[#F5F5F5]">
                            ${product.price?.toFixed(2)}
                          </span>
                          <span className="text-xs font-semibold text-[#A0A0A0]">USD</span>
                          {product.savingAmount && (
                            <span className="text-[11px] text-[#00FF87] ml-2">
                              Ahorro ${product.savingAmount.toFixed(2)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {isSpecialKit && (
                      <button
                        onClick={() => onViewKit(product)}
                        className="text-xs text-[#D4AF37] hover:text-[#FFD700] hover:underline font-semibold"
                      >
                        Ver inventario
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1c1c1c]">
                  <button
                    onClick={() => onViewDetails(product)}
                    className="py-2.5 px-3 rounded-lg bg-[#181818] hover:bg-[#222] text-[#A0A0A0] hover:text-[#F5F5F5] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detalles</span>
                  </button>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={isPendingPrice || !product.isActive}
                    className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      isPendingPrice || !product.isActive
                        ? 'bg-[#1c1c1c] text-[#606060] cursor-not-allowed border border-[#252525]'
                        : 'bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] shadow'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isPendingPrice ? 'No disponible' : 'Comprar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
