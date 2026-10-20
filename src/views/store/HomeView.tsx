import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Heart, 
  Pickaxe, 
  Package, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Swords, 
  Globe 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RankCard } from '../../components/store/RankCard';
import { RankUpgradeCard } from '../../components/store/RankUpgradeCard';
import { MinecraftItemIcon } from '../../components/common/MinecraftItemIcon';
import { GoldenFallingMeteor } from '../../components/common/GoldenFallingMeteor';

interface Props {
  onViewDetails: (product: any) => void;
  onViewKit: (product: any) => void;
}

export const HomeView: React.FC<Props> = ({ onViewDetails, onViewKit }) => {
  const { products, setRoute, addToCart } = useStore();

  const [activeRankTab, setActiveRankTab] = useState<'oneblock' | 'lifesteal' | 'global'>('oneblock');

  // Commercial ranks for OneBlock (Level 1 to 6, max $29.00)
  const oneblockRanks = products
    .filter(p => p.category === 'ranks' && p.modality === 'oneblock')
    .sort((a, b) => (a.rankLevel || 0) - (b.rankLevel || 0));

  // Commercial ranks for LifeSteal (Level 1 to 6, max $21.90)
  const lifestealRanks = products
    .filter(p => p.category === 'ranks' && p.modality === 'lifesteal')
    .sort((a, b) => (a.rankLevel || 0) - (b.rankLevel || 0));

  // Commercial ranks for Global (+45% over normal price)
  const globalRanks = products
    .filter(p => p.category === 'ranks' && p.modality === 'global')
    .sort((a, b) => (a.rankLevel || 0) - (b.rankLevel || 0));

  // Featured extras
  const flattenIsland = products.find(p => p.id === 'upgrade-flatten-island');
  const bundlePack = products.find(p => p.id === 'bundle-pack-3x3');
  const kitDestructor = products.find(p => p.id === 'special-kit-destructor');

  return (
    <div className="space-y-24">
      {/* Hero Section with Gentle Golden Falling Meteor */}
      <section className="relative min-h-[580px] lg:h-[620px] rounded-2xl overflow-hidden border border-[#202020] flex items-center">
        {/* Background Image with Measured Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_vitalia_meteor_bg_1792451579340.jpg"
            alt="Vitalia Network Paisaje Minecraft con Meteorito Dorado"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-65 contrast-110"
          />

          {/* Gentle, non-intrusive golden falling meteor in the background */}
          <GoldenFallingMeteor />

          {/* Measured Scrim for WCAG contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/40" />
          <div className="absolute inset-0 bg-radial at-center from-transparent via-[#050505]/60 to-[#050505]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161616]/80 border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Temporada Activa 2026 · OneBlock & LifeSteal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-cinzel tracking-tight text-[#F5F5F5] uppercase leading-tight [text-wrap:balance]">
            TU AVENTURA. TU IMPERIO. <span className="bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FEF9C2] bg-clip-text text-transparent">TU LEGADO.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#C0C0C0] max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
            Mejora tu experiencia y lleva tu progreso al siguiente nivel. Adquiere rangos comerciales, ascensos económicos con 15% de descuento en la diferencia y herramientas 3x3 masivas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setRoute('ranks')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#050505] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 transition-all duration-150 active:scale-95"
            >
              <span>Explorar rangos</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRoute('catalog')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#141414]/90 hover:bg-[#202020] text-[#F5F5F5] border border-[#303030] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span>Descubrir modalidades</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modalidades Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#202020] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Elige tu Campo de Batalla
            </span>
            <h2 className="text-2xl font-bold font-cinzel text-[#F5F5F5] mt-1">
              Modalidades Principales
            </h2>
          </div>
          <span className="text-xs text-[#808080] hidden sm:inline">
            Servidores independientes con economías separadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card ONEBLOCK */}
          <div className="relative rounded-2xl bg-[#0e0e0e] border border-[#202020] hover:border-[#D4AF37]/40 p-8 flex flex-col justify-between group transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#2c2c2c] flex items-center justify-center text-[#D4AF37]">
                  <MinecraftItemIcon type="grass_block" className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20">
                  Economía & Construcción
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold font-cinzel text-[#F5F5F5] group-hover:text-[#FFD700] transition-colors">
                  ONEBLOCK
                </h3>
                <p className="text-xs text-[#A0A0A0] mt-2 leading-relaxed">
                  Comienza en un bloque solitario suspendido en el vacío. Extrae materiales infinitos, expande tu isla, forja megagranjas y domina el cielo con /fly a partir de Imperium.
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-2 space-y-1.5 text-xs text-[#C0C0C0]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Mejora exclusiva: «Aplanar la isla» por $3.00 USD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Rango Vitalia máximo por $29.00 USD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>Herramientas 3x3 masivas y Kits Destructor / God</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#1c1c1c]">
              <button
                onClick={() => setRoute('oneblock')}
                className="w-full py-3 rounded-lg bg-[#181818] group-hover:bg-[#D4AF37] text-[#F5F5F5] group-hover:text-[#050505] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Explorar OneBlock</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card LIFESTEAL */}
          <div className="relative rounded-2xl bg-[#0e0e0e] border border-[#202020] hover:border-[#FF4545]/40 p-8 flex flex-col justify-between group transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#1f1111] border border-[#3d1a1a] flex items-center justify-center text-[#FF4545]">
                  <Heart className="w-7 h-7 text-[#FF4545] fill-[#FF4545]/30" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF4545] bg-[#FF4545]/10 px-2.5 py-1 rounded border border-[#FF4545]/20">
                  PvP Hardcore & Supervivencia
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold font-cinzel text-[#F5F5F5] group-hover:text-[#FF6b6b] transition-colors">
                  LIFESTEAL
                </h3>
                <p className="text-xs text-[#A0A0A0] mt-2 leading-relaxed">
                  Supervivencia despiadada donde cada muerte cuesta un corazón y cada baja te otorga salud extra. Mismos 6 rangos equilibrados con precios accesibles (Vitalia Máximo a $21.90 USD).
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-2 space-y-1.5 text-xs text-[#C0C0C0]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4545]" />
                  <span>Mismos rangos: Pulso, Ascend, Imperium, Infinity, Vital, Vitalia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4545]" />
                  <span>Precios rebajados: desde $1.99 hasta $21.90 USD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4545]" />
                  <span>Hasta +6 corazones permanentes y baúles anti-saqueo</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#1c1c1c]">
              <button
                onClick={() => setRoute('lifesteal')}
                className="w-full py-3 rounded-lg bg-[#181818] group-hover:bg-[#FF4545] text-[#F5F5F5] group-hover:text-[#ffffff] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Explorar LifeSteal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Rank Upgrade Module (Difference - 15% discount) */}
      <section>
        <RankUpgradeCard />
      </section>

      {/* Rangos Comerciales Tabs: OneBlock, LifeSteal, Global */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#202020] pb-4 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catálogo de Rangos Comerciales</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#F5F5F5] mt-1">
              {activeRankTab === 'oneblock' 
                ? 'Rangos OneBlock ($2.99 - $29.00)' 
                : activeRankTab === 'lifesteal' 
                ? 'Rangos LifeSteal ($1.99 - $21.90)' 
                : 'Rangos Globales Red Completa (+45%)'}
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#101010] border border-[#252525] rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveRankTab('oneblock')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRankTab === 'oneblock'
                  ? 'bg-[#1c170d] text-[#FFD700] border border-[#D4AF37]/40 shadow'
                  : 'text-[#808080] hover:text-[#F5F5F5]'
              }`}
            >
              OneBlock
            </button>
            <button
              onClick={() => setActiveRankTab('lifesteal')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRankTab === 'lifesteal'
                  ? 'bg-[#261010] text-[#FF6b6b] border border-[#FF4545]/40 shadow'
                  : 'text-[#808080] hover:text-[#F5F5F5]'
              }`}
            >
              LifeSteal (Hasta $21.90)
            </button>
            <button
              onClick={() => setActiveRankTab('global')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeRankTab === 'global'
                  ? 'bg-[#181818] text-[#FEF9C2] border border-[#D4AF37]/40 shadow'
                  : 'text-[#808080] hover:text-[#F5F5F5]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Global (+45%)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Rank Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRankTab === 'oneblock' && oneblockRanks.map(rank => (
            <RankCard
              key={rank.id}
              rank={rank}
              onViewDetails={onViewDetails}
              onViewKit={onViewKit}
            />
          ))}

          {activeRankTab === 'lifesteal' && lifestealRanks.map(rank => (
            <RankCard
              key={rank.id}
              rank={rank}
              onViewDetails={onViewDetails}
              onViewKit={onViewKit}
            />
          ))}

          {activeRankTab === 'global' && globalRanks.map(rank => (
            <RankCard
              key={rank.id}
              rank={rank}
              onViewDetails={onViewDetails}
              onViewKit={onViewKit}
            />
          ))}
        </div>
      </section>

      {/* Extras & Mejoras OneBlock Spotlight */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#202020] pb-4">
          <div>
            <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Exclusivos de OneBlock
            </span>
            <h2 className="text-2xl font-bold font-cinzel text-[#F5F5F5] mt-1">
              Mejoras de Isla & Herramientas Especiales
            </h2>
          </div>
          <button
            onClick={() => setRoute('extras')}
            className="text-xs font-semibold text-[#D4AF37] hover:text-[#FFD700] hover:underline flex items-center gap-1"
          >
            <span>Ver todos los extras</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flatten Island Card */}
          {flattenIsland && (
            <div className="p-6 rounded-xl bg-[#101010] border border-[#252525] hover:border-[#383838] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#252525] flex items-center justify-center">
                    <MinecraftItemIcon type="grass_block" className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-[#00FF87] bg-[#00FF87]/10 px-2 py-0.5 rounded border border-[#00FF87]/20 uppercase">
                    Mejora de Isla
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-cinzel text-[#F5F5F5]">{flattenIsland.name}</h3>
                  <p className="text-xs text-[#A0A0A0] mt-1 line-clamp-2">
                    {flattenIsland.description}
                  </p>
                </div>
                <div className="text-2xl font-black font-mono-numbers text-[#FFD700]">
                  ${flattenIsland.price?.toFixed(2)} <span className="text-xs text-[#808080]">USD</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1c1c1c]">
                <button
                  onClick={() => onViewDetails(flattenIsland)}
                  className="py-2 px-3 rounded-lg bg-[#181818] hover:bg-[#222] text-[#A0A0A0] hover:text-[#F5F5F5] text-xs font-semibold transition-colors"
                >
                  Ver detalles
                </button>
                <button
                  onClick={() => addToCart(flattenIsland)}
                  className="py-2 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] text-xs font-bold uppercase transition-all"
                >
                  Comprar
                </button>
              </div>
            </div>
          )}

          {/* Bundle Pack 3x3 */}
          {bundlePack && (
            <div className="p-6 rounded-xl bg-[#121212] border-2 border-[#D4AF37]/60 shadow-lg flex flex-col justify-between space-y-4 relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#1c170d] border border-[#D4AF37]/40 flex items-center justify-center text-[#FFD700]">
                    <Pickaxe className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#050505] bg-[#FFD700] px-2 py-0.5 rounded uppercase tracking-wider">
                    Pack Ahorro (-$2.50)
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-cinzel text-[#FFD700]">{bundlePack.name}</h3>
                  <p className="text-xs text-[#A0A0A0] mt-1 line-clamp-2">
                    Pico 3x3 + Hacha 3x3 combinados. Ahorro inmediato de $2.50 USD.
                  </p>
                </div>
                <div className="text-2xl font-black font-mono-numbers text-[#F5F5F5]">
                  ${bundlePack.price?.toFixed(2)} <span className="text-xs text-[#808080] line-through">$10.00</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#202020]">
                <button
                  onClick={() => onViewDetails(bundlePack)}
                  className="py-2 px-3 rounded-lg bg-[#181818] hover:bg-[#222] text-[#A0A0A0] hover:text-[#F5F5F5] text-xs font-semibold transition-colors"
                >
                  Ver detalles
                </button>
                <button
                  onClick={() => addToCart(bundlePack)}
                  className="py-2 px-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#050505] text-xs font-bold uppercase transition-all shadow"
                >
                  Comprar
                </button>
              </div>
            </div>
          )}

          {/* Kit Destructor */}
          {kitDestructor && (
            <div className="p-6 rounded-xl bg-[#140e0e] border border-[#4a1919] hover:border-[#FF4545]/50 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#251010] border border-[#4a1919] flex items-center justify-center text-[#FF4545]">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-[#FF4545] bg-[#FF4545]/15 px-2 py-0.5 rounded border border-[#FF4545]/30 uppercase">
                    Poder Avanzado (Prot X)
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-cinzel text-[#F5F5F5]">{kitDestructor.name}</h3>
                  <p className="text-xs text-[#A0A0A0] mt-1 line-clamp-2">
                    Armadura completa de netherite con Protección 10 y armas de combate.
                  </p>
                </div>
                <div className="text-2xl font-black font-mono-numbers text-[#FFD700]">
                  ${kitDestructor.price?.toFixed(2)} <span className="text-xs text-[#808080]">USD</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#251515]">
                <button
                  onClick={() => onViewKit(kitDestructor)}
                  className="py-2 px-3 rounded-lg bg-[#1a1212] hover:bg-[#281818] text-[#A0A0A0] hover:text-[#F5F5F5] text-xs font-semibold transition-colors"
                >
                  Ver contenido
                </button>
                <button
                  onClick={() => addToCart(kitDestructor)}
                  className="py-2 px-3 rounded-lg bg-[#b52a2a] hover:bg-[#d93838] text-white text-xs font-bold uppercase transition-all"
                >
                  Comprar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
