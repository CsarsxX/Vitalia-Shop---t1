import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Heart, ExternalLink, HelpCircle, MessageSquare } from 'lucide-react';
import { useStore, StoreRoute } from '../../context/StoreContext';

export const StoreFooter: React.FC = () => {
  const { setRoute, settings, currentAdmin } = useStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a] text-[#A0A0A0] text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center">
                <span className="font-cinzel text-sm font-bold text-[#FFD700]">V</span>
              </div>
              <span className="font-cinzel text-base font-bold text-[#F5F5F5] tracking-wider">
                VITALIA NETWORK
              </span>
            </div>
            <p className="text-xs text-[#808080] max-w-sm leading-relaxed">
              Servidor hispano de Minecraft especializado en modalidades OneBlock y LifeSteal competitivas. Adquiere rangos exclusivos, kits configurados y mejoras de isla para llevar tu progreso al siguiente nivel.
            </p>

            {/* Server IP pill */}
            <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-lg bg-[#0e0e0e] border border-[#252525] text-xs">
              <span className="text-[#808080]">IP:</span>
              <span className="font-mono text-[#FEF9C2] font-semibold">{settings.serverIp}</span>
              <button
                onClick={handleCopy}
                className="ml-2 text-[#D4AF37] hover:text-[#FFD700] transition-colors"
                title="Copiar dirección"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] mb-4">Catálogo</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setRoute('catalog')} className="hover:text-[#FFD700] transition-colors">
                  Todos los Productos
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('oneblock')} className="hover:text-[#FFD700] transition-colors">
                  Modalidad OneBlock
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('lifesteal')} className="hover:text-[#FFD700] transition-colors">
                  Modalidad LifeSteal
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('ranks')} className="hover:text-[#FFD700] transition-colors">
                  Rangos Comerciales
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('kits')} className="hover:text-[#FFD700] transition-colors">
                  Kits Especiales
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('extras')} className="hover:text-[#FFD700] transition-colors">
                  Extras OneBlock
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] mb-4">Soporte & Ayuda</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setRoute('order-lookup')} className="hover:text-[#FFD700] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Consultar Pedido
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('help')} className="hover:text-[#FFD700] transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Preguntas Frecuentes
                </button>
              </li>
              <li>
                <a href={settings.discordLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD700] transition-colors flex items-center gap-1.5">
                  Discord Comunitario
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <span className="text-[#606060]">Atención: Lun - Dom (24/7)</span>
              </li>
            </ul>
          </div>

          {/* Legal & Administration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] mb-4">Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setRoute('terms')} className="hover:text-[#FFD700] transition-colors">
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button onClick={() => setRoute('privacy')} className="hover:text-[#FFD700] transition-colors">
                  Política de Privacidad
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bottom */}
        <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#606060]">
          <p>
            © {new Date().getFullYear()} Vitalia Network Store. Todos los derechos reservados.
          </p>
          <p className="max-w-xl text-center md:text-right">
            No estamos afiliados ni respaldados de ninguna manera por Mojang Studios ni Microsoft Corporation. Minecraft es una marca registrada de Mojang Synergies AB.
          </p>
        </div>
      </div>
    </footer>
  );
};
