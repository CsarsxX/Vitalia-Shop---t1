import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HelpView: React.FC = () => {
  const { settings } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Cuánto tiempo tarda en activarse mi rango o paquete?',
      a: 'Una vez que notificas tu pago mediante Yape o Plin, un administrador valida manualmente los fondos en la app bancaria (habitualmente entre 5 y 15 minutos en horario diurno). Una vez aprobado, el sistema ejecuta de inmediato los comandos correspondientes en la consola del servidor.',
    },
    {
      q: '¿A partir de qué rango se incluye el comando /fly?',
      a: 'El comando /fly para OneBlock está incluido a partir del rango Imperium (Nivel 3), así como en los rangos Infinity (Nivel 4), Vital (Nivel 5) y Vitalia (Nivel 6). Los rangos Pulso y Ascend no incluyen este comando.',
    },
    {
      q: '¿Cómo funciona la mejora «Aplanar la isla»?',
      a: 'Es un servicio técnico para OneBlock que rellena la superficie de tu isla con una capa uniforme de bloques GRASS_BLOCK, dejándola perfectamente plana para tus proyectos. No destruye cofres existentes ni añade capas de tierra o piedra sobrantes.',
    },
    {
      q: '¿Por qué algunos productos tienen precio «Por configurar»?',
      a: 'Artículos legendarios como el Pico Efficiency 35 o el Kit God se encuentran pendientes de fijación de precio oficial por parte de la administración. Tan pronto como el equipo configure el importe en el panel administrativo, estarán disponibles para su compra directa.',
    },
    {
      q: '¿Puedo comprar productos de LifeSteal para OneBlock?',
      a: 'No. Ambas modalidades cuentan con economías y progresiones estrictamente independientes para garantizar un equilibrio de juego justo. Asegúrate de seleccionar la modalidad adecuada durante el checkout.',
    },
    {
      q: '¿Por qué PayPal aparece en mantenimiento?',
      a: 'Actualmente estamos optimizando las integraciones de divisas internacionales. Los métodos oficiales y habilitados al instante son Yape y Plin para moneda local peruana.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-4">
      <div className="text-center space-y-2 border-b border-[#202020] pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Centro de Asistencia</span>
        </div>
        <h1 className="text-3xl font-extrabold font-cinzel text-[#F5F5F5]">
          Preguntas Frecuentes & Soporte
        </h1>
        <p className="text-xs text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
          Encuentra respuestas inmediatas a las dudas más comunes sobre pagos, entrega de rangos y modalidades de Vitalia Network.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-xl bg-[#101010] border border-[#252525] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors"
              >
                <span className="text-sm font-bold text-[#F5F5F5]">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#D4AF37] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#808080] shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#A0A0A0] leading-relaxed border-t border-[#1a1a1a]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support CTA card */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-[#252525] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F5F5F5]">¿Necesitas atención personalizada?</h3>
            <p className="text-xs text-[#A0A0A0]">Abre un ticket de soporte en nuestro Discord oficial 24/7.</p>
          </div>
        </div>

        <a
          href={settings.discordLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
        >
          Unirse a Discord
        </a>
      </div>
    </div>
  );
};
