import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

export const TermsView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="border-b border-[#202020] pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Información Legal</span>
        </div>
        <h1 className="text-3xl font-extrabold font-cinzel text-[#F5F5F5]">
          Términos, Condiciones y Política de Privacidad
        </h1>
        <p className="text-xs text-[#A0A0A0] mt-1">
          Última actualización: Octubre 2026. Al utilizar esta tienda y realizar un pedido, aceptas las siguientes pautas.
        </p>
      </div>

      <div className="space-y-6 text-xs text-[#A0A0A0] leading-relaxed bg-[#101010] p-8 rounded-2xl border border-[#252525]">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
            1. Naturaleza de los Bienes Digitales
          </h2>
          <p>
            Todos los artículos ofrecidos en Vitalia Network Store (rangos, kits virtuales, permisos de comandos como /fly y mejoras de islas) son bienes intangibles y virtuales de uso exclusivo dentro de los servidores de juego de Vitalia Network. Ningún producto otorga propiedad legal sobre el software de Minecraft o la infraestructura del servidor.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
            2. Proceso de Pago y Verificación
          </h2>
          <p>
            Los pagos se efectúan a través de los canales móviles autorizados (Yape y Plin) a nombre del titular Milvan Bac. El envío de una notificación de pago en la web no constituye una aprobación inmediata. Todos los pagos están sujetos a revisión manual por el equipo administrativo antes de liberar los comandos de entrega al usuario de Minecraft.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
            3. Política de Reembolsos y Devoluciones
          </h2>
          <p>
            Debido a la naturaleza digital e irrevocable de los bienes activados en el servidor, no se admiten reembolsos una vez que el rango o paquete ha sido validado y entregado. Los intentos de fraude, contracargos o suplantación de comprobantes conllevarán el bloqueo permanente del usuario en la red de Vitalia Network.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
            4. Reglas del Servidor y Sanciones
          </h2>
          <p>
            La adquisición de un rango no exime al jugador del cumplimiento estricto del reglamento de convivencia. Los jugadores sancionados por uso de hacks, lenguaje ofensivo o abuso de bugs mantendrán su sanción sin derecho a restitución económica.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
            5. Protección de Datos y Privacidad
          </h2>
          <p>
            Vitalia Network recopila únicamente el correo electrónico, nick de Minecraft y el código de comprobante para fines exclusivos de facturación interna, auditoría y resolución de incidencias. No compartimos información con terceros comerciales.
          </p>
        </section>
      </div>
    </div>
  );
};
