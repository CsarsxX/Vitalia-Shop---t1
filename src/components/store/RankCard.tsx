import React from 'react';
import { Sparkles, Shield, Check, Feather, Key, Package, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types/store';
import { useStore } from '../../context/StoreContext';

interface Props {
  rank: Product;
  onViewDetails: (rank: Product) => void;
  onViewKit: (rank: Product) => void;
}

export const RankCard: React.FC<Props> = ({ rank, onViewDetails, onViewKit }) => {
  const { addToCart } = useStore();

  const isVitalia = rank.rankLevel === 6 || rank.name === 'Vitalia';
  const isVital = rank.rankLevel === 5 || rank.name === 'Vital';
  const isImperium = rank.rankLevel === 3 || rank.name === 'Imperium';
  const hasFly = rank.hasFly;

  return (
    <div
      className={`relative rounded-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
        isVitalia
          ? 'bg-gradient-to-b from-[#18150c] to-[#0d0d0d] border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.2)]'
          : isVital
          ? 'bg-[#121212] border border-[#D4AF37]/60 shadow-lg'
          : 'bg-[#101010] border border-[#252525] hover:border-[#383838]'
      }`}
    >
      {/* Top Banner Accent */}
      {isVitalia && (
        <div className="bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-[#050505] text-[11px] font-extrabold uppercase py-1 text-center tracking-widest flex items-center justify-center gap-1.5 shadow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RANGO MÁXIMO SUPREMO</span>
        </div>
      )}

      {isVital && (
        <div className="bg-[#201d14] text-[#D4AF37] border-b border-[#D4AF37]/20 text-[10px] font-bold uppercase py-1 text-center tracking-wider">
          Rango Élite Pre-Máximo
        </div>
      )}

      {/* Card Header & Price */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono-numbers font-semibold text-[#808080]">
                Nivel {rank.rankLevel || 1}
              </span>
              <span className="text-[#404040]">·</span>
              <span className="text-[11px] text-[#A0A0A0] uppercase font-semibold">
                {rank.modality}
              </span>
            </div>

            <h3 className={`text-xl font-extrabold font-cinzel mt-0.5 ${
              isVitalia ? 'text-[#FFD700]' : isVital ? 'text-[#FEF9C2]' : 'text-[#F5F5F5]'
            }`}>
              {rank.name}
            </h3>
          </div>

          {/* Badge */}
          {hasFly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30 shrink-0">
              <Feather className="w-3 h-3 text-[#D4AF37]" />
              <span>Vuelo Incluido</span>
            </span>
          )}
        </div>

        <p className="text-xs text-[#A0A0A0] min-h-[34px] leading-relaxed">
          {rank.description}
        </p>

        {/* Price Box */}
        <div className="mt-4 pt-4 border-t border-[#202020] flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[#808080]">Precio único</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black font-mono-numbers ${
                isVitalia ? 'text-[#FFD700]' : 'text-[#F5F5F5]'
              }`}>
                ${(rank.price || 0).toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-[#A0A0A0]">USD</span>
            </div>
          </div>

          {/* Player Vaults and Homes quick metrics */}
          <div className="text-right text-[11px] font-mono-numbers text-[#A0A0A0] space-y-0.5">
            <div><strong className="text-[#F5F5F5]">{rank.playerVaults}</strong> PlayerVaults</div>
            <div><strong className="text-[#F5F5F5]">{rank.homes}</strong> Homes (/sethome)</div>
          </div>
        </div>
      </div>

      {/* Perks List */}
      <div className="px-6 py-4 bg-[#0d0d0d]/70 border-t border-b border-[#202020] space-y-2.5 flex-1">
        <div className="text-[11px] font-bold text-[#808080] uppercase tracking-wider mb-2">
          Ventajas Destacadas
        </div>

        {/* Fly perk explicit showcase */}
        <div className={`flex items-start gap-2 text-xs ${
          hasFly ? 'text-[#00FF87] font-medium' : 'text-[#606060]'
        }`}>
          <div className="shrink-0 mt-0.5">
            {hasFly ? (
              <Feather className="w-3.5 h-3.5 text-[#00FF87]" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border border-[#404040] inline-block text-[9px] text-center leading-3">✕</span>
            )}
          </div>
          <span>
            {hasFly ? 'Comando /fly permanente en tu isla' : 'Comando /fly no incluido'}
          </span>
        </div>

        {/* Dynamic Perks */}
        {(rank.perks || []).slice(0, 4).map((perk, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-[#D0D0D0] leading-snug">
            <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
            <span>{perk}</span>
          </div>
        ))}

        {/* Kit Included Link */}
        {rank.kitIncludedName && (
          <div className="pt-2 border-t border-[#1c1c1c] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#FEF9C2]">
              <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold">{rank.kitIncludedName}</span>
            </div>
            {rank.kitItems && rank.kitItems.length > 0 && (
              <button
                onClick={() => onViewKit(rank)}
                className="text-[11px] text-[#D4AF37] hover:text-[#FFD700] hover:underline font-semibold"
              >
                Ver inventario
              </button>
            )}
          </div>
        )}
      </div>

      {/* Buttons Action Bar */}
      <div className="p-6 pt-4 bg-[#101010] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(rank)}
            className="py-2.5 px-3 rounded-lg bg-[#181818] hover:bg-[#222222] text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#252525] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Beneficios</span>
          </button>

          <button
            onClick={() => addToCart(rank)}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-all duration-150 active:scale-95 ${
              isVitalia
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#050505] hover:brightness-110'
                : 'bg-[#202020] hover:bg-[#D4AF37] text-[#F5F5F5] hover:text-[#050505] border border-[#303030]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
