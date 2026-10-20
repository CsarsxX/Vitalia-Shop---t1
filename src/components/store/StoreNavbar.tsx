import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Shield, Sparkles, Copy, Check } from 'lucide-react';
import { useStore, StoreRoute } from '../../context/StoreContext';

interface Props {
  onOpenCart: () => void;
}

export const StoreNavbar: React.FC<Props> = ({ onOpenCart }) => {
  const { route, setRoute, cartTotalCount, settings, currentAdmin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedIp, setCopiedIp] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(settings.serverIp);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const navLinks: { label: string; target: StoreRoute }[] = [
    { label: 'Inicio', target: 'home' },
    { label: 'Tienda', target: 'catalog' },
    { label: 'OneBlock', target: 'oneblock' },
    { label: 'LifeSteal', target: 'lifesteal' },
    { label: 'Global', target: 'global' },
    { label: 'Rangos', target: 'ranks' },
    { label: 'Upgrades (-15%)', target: 'upgrades' },
    { label: 'Kits', target: 'kits' },
    { label: 'Extras', target: 'extras' },
    { label: 'Ayuda', target: 'help' },
  ];

  const handleNavClick = (target: StoreRoute) => {
    setRoute(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-[#202020]">
      {/* Top micro announcement bar */}
      <div className="bg-[#0A0A0A] border-b border-[#1c1c1c] px-4 py-1.5 text-xs text-[#A0A0A0] flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-semibold text-[11px] uppercase tracking-wider">Servidor Oficial</span>
            <span className="text-[#404040]">|</span>
            <span className="hidden sm:inline">Conéctate a</span>
            <button
              onClick={handleCopyIp}
              className="inline-flex items-center gap-1.5 text-[#FEF9C2] font-mono hover:text-[#FFD700] transition-colors"
              title="Copiar IP del servidor"
            >
              <span>{settings.serverIp}</span>
              {copiedIp ? <Check className="w-3 h-3 text-[#00FF87]" /> : <Copy className="w-3 h-3 text-[#A0A0A0]" />}
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => handleNavClick('order-lookup')}
              className="hover:text-[#F5F5F5] transition-colors"
            >
              Consultar Pedido
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1c170d] to-[#111111] border border-[#D4AF37]/40 flex items-center justify-center shadow-lg group-hover:border-[#FFD700] transition-all duration-200">
            <span className="font-cinzel text-lg font-bold text-[#FFD700]">V</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-wider font-cinzel text-[#F5F5F5] group-hover:text-[#FFD700] transition-colors whitespace-nowrap">
              VITALIA
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] font-semibold uppercase -mt-1">
              NETWORK STORE
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#A0A0A0]">
          {navLinks.map((link) => {
            const isActive = route === link.target;
            return (
              <button
                key={link.target}
                onClick={() => handleNavClick(link.target)}
                className={`transition-colors whitespace-nowrap py-1 relative hover:text-[#F5F5F5] ${
                  isActive ? 'text-[#FFD700] font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Shopping Bag */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-lg bg-[#101010] border border-[#252525] text-[#F5F5F5] hover:border-[#D4AF37]/50 hover:bg-[#161616] transition-all"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4AF37] text-[#050505] text-[11px] font-bold flex items-center justify-center font-mono-numbers shadow-md animate-in zoom-in-50">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('catalog')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#050505] text-xs font-bold tracking-wide uppercase shadow-lg shadow-[#D4AF37]/15 transition-all duration-150 active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explorar tienda</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg bg-[#101010] border border-[#252525] text-[#A0A0A0] hover:text-[#F5F5F5]"
            aria-label="Alternar menú móvil"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#202020] bg-[#0A0A0A] px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                route === link.target 
                  ? 'bg-[#161616] text-[#FFD700] font-semibold border border-[#D4AF37]/30' 
                  : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#121212]'
              }`}
            >
              <span>{link.label}</span>
              {route === link.target && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </button>
          ))}

          <div className="pt-3 border-t border-[#202020] flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('order-lookup')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#121212]"
            >
              Consultar estado de pedido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
