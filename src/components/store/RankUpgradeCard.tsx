import React, { useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp, Check, Shield, ShoppingBag, Percent } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Modality, Product } from '../../types/store';

export const RankUpgradeCard: React.FC = () => {
  const { products, addToCart } = useStore();

  const [selectedModality, setSelectedModality] = useState<Modality>('oneblock');

  const modalityRanks = products
    .filter(p => p.category === 'ranks' && p.modality === selectedModality && p.price !== null)
    .sort((a, b) => (a.rankLevel || 0) - (b.rankLevel || 0));

  const [fromRankId, setFromRankId] = useState<string>(modalityRanks[0]?.id || 'rank-pulso');
  const [toRankId, setToRankId] = useState<string>(modalityRanks[modalityRanks.length - 1]?.id || 'rank-vitalia');

  // Update selections when modality changes
  const handleModalityChange = (m: Modality) => {
    setSelectedModality(m);
    const ranks = products
      .filter(p => p.category === 'ranks' && p.modality === m && p.price !== null)
      .sort((a, b) => (a.rankLevel || 0) - (b.rankLevel || 0));
    if (ranks.length >= 2) {
      setFromRankId(ranks[0].id);
      setToRankId(ranks[ranks.length - 1].id);
    }
  };

  const fromRank = modalityRanks.find(r => r.id === fromRankId) || modalityRanks[0];
  const eligibleTargetRanks = modalityRanks.filter(r => (r.rankLevel || 0) > (fromRank?.rankLevel || 0));
  const toRank = eligibleTargetRanks.find(r => r.id === toRankId) || eligibleTargetRanks[eligibleTargetRanks.length - 1] || eligibleTargetRanks[0];

  const priceFrom = fromRank?.price || 0;
  const priceTo = toRank?.price || 0;
  const rawDiff = Math.max(0, priceTo - priceFrom);
  const discount15 = rawDiff * 0.15; // 15% discount as requested
  const finalUpgradePrice = Math.max(0.99, Number((rawDiff - discount15).toFixed(2)));

  const handleAddUpgradeToCart = () => {
    if (!fromRank || !toRank || rawDiff <= 0) return;

    const upgradeProduct: Product = {
      id: `upgrade-${fromRank.name.toLowerCase()}-to-${toRank.name.toLowerCase()}-${selectedModality}`,
      name: `Upgrade: ${fromRank.name} → ${toRank.name}`,
      tagline: `Mejora de rango con 15% de descuento en la diferencia`,
      price: finalUpgradePrice,
      currency: 'USD',
      modality: selectedModality,
      category: 'upgrades',
      badge: '15% DTO DIFERENCIA',
      description: `Mejora oficial desde el rango ${fromRank.name} (Nivel ${fromRank.rankLevel}) hasta ${toRank.name} (Nivel ${toRank.rankLevel}) en ${selectedModality.toUpperCase()}.`,
      longDescription: `Ahorra el 15% del costo de la diferencia. Se te descontará el valor de tu rango previo ${fromRank.name} ($${priceFrom.toFixed(2)}) del rango superior ${toRank.name} ($${priceTo.toFixed(2)}) más un 15% de bonificación ($${discount15.toFixed(2)} de ahorro).`,
      isActive: true,
      perks: toRank.perks,
      commands: toRank.commands,
      hasFly: toRank.hasFly,
      playerVaults: toRank.playerVaults,
      homes: toRank.homes,
    };

    addToCart(upgradeProduct);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#14120c] via-[#0f0f0f] to-[#121212] border-2 border-[#D4AF37]/40 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Decorative corner tag */}
      <div className="absolute top-0 right-0 bg-gradient-to-l from-[#D4AF37] to-[#B89628] text-[#050505] text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider shadow flex items-center gap-1">
        <Percent className="w-3 h-3" />
        <span>Diferencia - 15% de Descuento</span>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Sistema de Ascenso Económico</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold font-cinzel text-[#F5F5F5]">
          Upgrade de Rango Oficial
        </h3>
        <p className="text-xs text-[#A0A0A0] max-w-2xl leading-relaxed">
          ¿Ya tienes un rango previo en el servidor? No pagues el precio completo: abona únicamente la diferencia entre rangos con un <strong className="text-[#00FF87]">15% de descuento adicional</strong>.
        </p>
      </div>

      {/* Modality toggle */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-[#808080] font-semibold">Modalidad:</span>
        <div className="flex items-center gap-1 p-1 bg-[#0a0a0a] border border-[#252525] rounded-xl">
          <button
            type="button"
            onClick={() => handleModalityChange('oneblock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedModality === 'oneblock'
                ? 'bg-[#1c170d] text-[#FFD700] border border-[#D4AF37]/40'
                : 'text-[#808080] hover:text-[#F5F5F5]'
            }`}
          >
            OneBlock
          </button>
          <button
            type="button"
            onClick={() => handleModalityChange('lifesteal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedModality === 'lifesteal'
                ? 'bg-[#261010] text-[#FF6b6b] border border-[#FF4545]/40'
                : 'text-[#808080] hover:text-[#F5F5F5]'
            }`}
          >
            LifeSteal
          </button>
        </div>
      </div>

      {/* Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* From Rank */}
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#202020] space-y-2">
          <label className="block text-xs font-bold text-[#A0A0A0] uppercase tracking-wider">
            1. Tu Rango Actual:
          </label>
          <select
            value={fromRankId}
            onChange={(e) => {
              setFromRankId(e.target.value);
              const cur = modalityRanks.find(r => r.id === e.target.value);
              const validTargets = modalityRanks.filter(r => (r.rankLevel || 0) > (cur?.rankLevel || 0));
              if (validTargets.length > 0) {
                setToRankId(validTargets[validTargets.length - 1].id);
              }
            }}
            className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#252525] rounded-lg text-xs font-bold text-[#F5F5F5] focus:outline-none focus:border-[#D4AF37]"
          >
            {modalityRanks.slice(0, -1).map(r => (
              <option key={r.id} value={r.id}>
                {r.name} (Nivel {r.rankLevel}) — ${(r.price || 0).toFixed(2)} USD
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[#707070] block">
            Valor base acreditado: <strong className="text-[#FEF9C2] font-mono">${priceFrom.toFixed(2)} USD</strong>
          </span>
        </div>

        {/* Target Rank */}
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#202020] space-y-2">
          <label className="block text-xs font-bold text-[#FFD700] uppercase tracking-wider">
            2. Rango al que deseas subir:
          </label>
          <select
            value={toRankId}
            onChange={(e) => setToRankId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#141414] border border-[#D4AF37]/50 rounded-lg text-xs font-bold text-[#FFD700] focus:outline-none focus:border-[#FFD700]"
          >
            {eligibleTargetRanks.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} (Nivel {r.rankLevel}) — ${(r.price || 0).toFixed(2)} USD {r.hasFly ? '★ /fly' : ''}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[#707070] block">
            Precio regular sin upgrade: <strong className="text-[#A0A0A0] font-mono">${priceTo.toFixed(2)} USD</strong>
          </span>
        </div>
      </div>

      {/* Live Calculation Strip */}
      <div className="p-4 rounded-xl bg-[#0a0a0a]/90 border border-[#252525] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-[#A0A0A0]">
            <span>Diferencia regular:</span>
            <span className="font-mono-numbers line-through">${rawDiff.toFixed(2)} USD</span>
            <span>·</span>
            <span className="text-[#00FF87] font-semibold">Descuento 15%: -${discount15.toFixed(2)} USD</span>
          </div>
          <div className="text-[11px] text-[#707070]">
            Fórmula de ascenso: (Precio Deseado - Precio Actual) - 15%
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase text-[#808080] block font-bold">Total a Pagar</span>
            <div className="text-2xl font-black font-mono-numbers text-[#FFD700]">
              ${finalUpgradePrice.toFixed(2)} <span className="text-xs text-[#A0A0A0]">USD</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddUpgradeToCart}
            disabled={rawDiff <= 0}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#050505] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95 transition-all shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Comprar Upgrade</span>
          </button>
        </div>
      </div>
    </div>
  );
};
