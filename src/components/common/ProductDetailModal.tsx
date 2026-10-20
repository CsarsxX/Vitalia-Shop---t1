import React from 'react';
import { X, Sparkles, Check, Feather, Shield, Swords, ShoppingBag, Package, Layers, Info } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';
import { MinecraftItemIcon } from './MinecraftItemIcon';

interface Props {
  product: Product | null;
  onClose: () => void;
  onOpenInventoryKit: (kit: { title: string; badge?: string; items: any[] }) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  onClose,
  onOpenInventoryKit,
}) => {
  const { addToCart } = useStore();

  if (!product) return null;

  const isPendingPrice = product.price === null;
  const isRank = product.category === 'ranks';
  const isVitalia = product.name === 'Vitalia';

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleOpenKit = () => {
    if (product.kitItems && product.kitItems.length > 0) {
      onOpenInventoryKit({
        title: product.kitIncludedName || `Inventario de ${product.name}`,
        badge: product.badge,
        items: product.kitItems,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#101010] border border-[#252525] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#202020] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#252525] flex items-center justify-center text-[#D4AF37]">
              <MinecraftItemIcon 
                type={product.toolType || (isRank ? 'helmet' : 'block')} 
                material="netherite" 
                className="w-6 h-6" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-cinzel text-[#F5F5F5]">{product.name}</h3>
                {product.badge && (
                  <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30 uppercase">
                    {product.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                Modalidad: <span className="text-[#F5F5F5] uppercase font-semibold">{product.modality}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#202020] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Tagline & Main description */}
          <div>
            {product.tagline && (
              <h4 className="text-sm font-semibold text-[#FFD700] mb-1">
                {product.tagline}
              </h4>
            )}
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              {product.longDescription || product.description}
            </p>
          </div>

          {/* Specific Island Upgrade Section: Aplanar la isla */}
          {product.id === 'upgrade-flatten-island' && (
            <div className="p-4 rounded-lg bg-[#141812] border border-[#3b821e]/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00FF87]">
                <Layers className="w-4 h-4" />
                <span>Especificación Técnica: Relleno de Superficie</span>
              </div>
              <p className="text-xs text-[#D0D0D0] leading-relaxed">
                El comando del servidor ejecuta un reemplazo topográfico que cubre la superficie habitable de tu isla con una sola capa perfecta de bloques <code className="text-[#FFD700] bg-black/40 px-1 py-0.5 rounded">GRASS_BLOCK</code>. No modifica cofres existentes ni añade capas adicionales innecesarias de piedra o tierra inferior.
              </p>
            </div>
          )}

          {/* Specific Tool Section */}
          {product.enchantments && product.enchantments.length > 0 && (
            <div className="p-4 rounded-lg bg-[#141414] border border-[#202020] space-y-2.5">
              <div className="text-xs font-bold text-[#808080] uppercase tracking-wider flex items-center justify-between">
                <span>Encantamientos Especiales</span>
                {product.effectArea && (
                  <span className="text-[#00FF87] font-mono">Área de efecto: {product.effectArea}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.enchantments.map((ench, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c1c1c] border border-[#282828] text-xs font-mono-numbers text-[#FEF9C2]">
                    <Swords className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{ench.name} {ench.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ranks Specific Perks & Fly status */}
          {isRank && (
            <div className="space-y-4">
              {/* Fly status box */}
              <div className={`p-3.5 rounded-lg border flex items-center justify-between text-xs ${
                product.hasFly 
                  ? 'bg-[#121c15] border-[#00FF87]/30 text-[#00FF87]' 
                  : 'bg-[#151515] border-[#252525] text-[#808080]'
              }`}>
                <div className="flex items-center gap-2">
                  <Feather className="w-4 h-4" />
                  <span className="font-semibold">
                    {product.hasFly ? 'Acceso al comando /fly Incluido' : 'Comando /fly No Incluido en este rango'}
                  </span>
                </div>
                <span className="text-[11px] font-mono">
                  {product.hasFly ? 'Habilitado' : 'Bloqueado'}
                </span>
              </div>

              {/* Vaults & Homes metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#202020]">
                  <span className="text-[11px] text-[#808080] uppercase tracking-wider block">PlayerVaults Personales</span>
                  <span className="text-lg font-bold font-mono-numbers text-[#F5F5F5] mt-1 block">
                    {product.playerVaults} Baúles (/pv)
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#141414] border border-[#202020]">
                  <span className="text-[11px] text-[#808080] uppercase tracking-wider block">Puntos de Teletransporte</span>
                  <span className="text-lg font-bold font-mono-numbers text-[#F5F5F5] mt-1 block">
                    {product.homes} Homes (/sethome)
                  </span>
                </div>
              </div>

              {/* Full perks list */}
              {product.perks && product.perks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#808080] uppercase tracking-wider">
                    Todos los Beneficios Incluidos
                  </div>
                  <div className="space-y-1.5">
                    {product.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#D0D0D0]">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commands list */}
              {product.commands && product.commands.length > 0 && (
                <div className="p-3.5 rounded-lg bg-[#0e0e0e] border border-[#1f1f1f]">
                  <div className="text-[11px] font-bold text-[#808080] uppercase tracking-wider mb-2">
                    Comandos Disponibles
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.commands.map((cmd, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#181818] border border-[#252525] text-xs font-mono text-[#D4AF37]">
                        {cmd}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kit Included Trigger Button */}
          {product.kitItems && product.kitItems.length > 0 && (
            <div className="p-4 rounded-lg bg-[#141414] border border-[#202020] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h5 className="text-xs font-bold text-[#F5F5F5]">
                    {product.kitIncludedName || 'Inventario de Objetos'}
                  </h5>
                  <p className="text-[11px] text-[#A0A0A0]">
                    {product.kitItems.length} objetos especiales con encantamientos
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenKit}
                className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#D4AF37] hover:text-[#050505] text-[#F5F5F5] text-xs font-semibold transition-colors"
              >
                Inspeccionar Kit
              </button>
            </div>
          )}
        </div>

        {/* Footer / Price & Add to Cart */}
        <div className="p-6 border-t border-[#202020] bg-[#0c0c0c] flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#808080] uppercase tracking-wider block">Importe Total</span>
            {isPendingPrice ? (
              <span className="text-sm font-semibold text-[#FFD700] italic">
                Pendiente de configuración
              </span>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono-numbers text-[#F5F5F5]">
                  ${(product.price || 0).toFixed(2)}
                </span>
                <span className="text-xs font-bold text-[#A0A0A0]">USD</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
            >
              Cerrar
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isPendingPrice || !product.isActive}
              className={`py-2.5 px-5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                isPendingPrice || !product.isActive
                  ? 'bg-[#202020] text-[#606060] cursor-not-allowed border border-[#2a2a2a]'
                  : 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#050505] shadow-lg shadow-[#D4AF37]/20 active:scale-95'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isPendingPrice ? 'No disponible' : 'Agregar al carrito'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
