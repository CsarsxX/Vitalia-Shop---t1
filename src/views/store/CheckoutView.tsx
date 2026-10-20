import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  QrCode, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Modality, Order } from '../../types/store';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    finalTotalUSD,
    finalTotalPEN,
    activeCoupon,
    createOrder,
    settings,
    setRoute,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form fields
  const [mcUsername, setMcUsername] = useState('');
  const [email, setEmail] = useState('');
  const [modality, setModality] = useState<Modality>('oneblock');
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | 'paypal'>('yape');
  const [referenceInput, setReferenceInput] = useState('');
  const [formErrors, setFormErrors] = useState<{ mcUsername?: string; email?: string }>({});

  // Completed order state
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // If cart is empty and no submitted order, redirect back
  if (cart.length === 0 && !submittedOrder) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold font-cinzel text-[#F5F5F5]">Tu carrito está vacío</h2>
        <p className="text-xs text-[#A0A0A0]">
          Debes agregar al menos un producto a tu carrito antes de iniciar el proceso de checkout.
        </p>
        <button
          onClick={() => setRoute('catalog')}
          className="px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] text-xs font-bold uppercase transition-all"
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  // Step 1 Validation
  const handleValidateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { mcUsername?: string; email?: string } = {};

    if (!mcUsername.trim()) {
      errors.mcUsername = 'Ingresa tu nombre exacto de usuario en Minecraft.';
    } else if (mcUsername.trim().length < 3 || mcUsername.trim().length > 16) {
      errors.mcUsername = 'El nick de Minecraft debe tener entre 3 y 16 caracteres.';
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      errors.email = 'Ingresa un correo electrónico válido para recibir tu recibo.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setStep(2);
  };

  // Step 3 Submit "Ya he realizado el pago"
  const handleConfirmPayment = () => {
    const order = createOrder({
      mcUsername: mcUsername.trim(),
      email: email.trim(),
      modality,
      paymentMethod,
      referenceCode: referenceInput.trim() || undefined,
    });

    setSubmittedOrder(order);
    setStep(4); // Confirmation screen
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Checkout Progress Stepper */}
      {step < 4 && (
        <div className="border-b border-[#202020] pb-6">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className={`flex items-center gap-2 text-xs font-semibold ${
              step >= 1 ? 'text-[#FFD700]' : 'text-[#606060]'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                step >= 1 ? 'bg-[#D4AF37] text-[#050505]' : 'bg-[#181818] text-[#808080]'
              }`}>1</span>
              <span>Datos del Jugador</span>
            </div>

            <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-[#202020]'}`} />

            <div className={`flex items-center gap-2 text-xs font-semibold ${
              step >= 2 ? 'text-[#FFD700]' : 'text-[#606060]'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                step >= 2 ? 'bg-[#D4AF37] text-[#050505]' : 'bg-[#181818] text-[#808080]'
              }`}>2</span>
              <span>Revisión del Pedido</span>
            </div>

            <div className={`h-0.5 w-12 ${step >= 3 ? 'bg-[#D4AF37]' : 'bg-[#202020]'}`} />

            <div className={`flex items-center gap-2 text-xs font-semibold ${
              step >= 3 ? 'text-[#FFD700]' : 'text-[#606060]'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                step >= 3 ? 'bg-[#D4AF37] text-[#050505]' : 'bg-[#181818] text-[#808080]'
              }`}>3</span>
              <span>Método de Pago</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 1: DATOS DEL COMPRADOR ================= */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6 bg-[#101010] p-8 rounded-2xl border border-[#252525]">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
                Paso 1: Información de Destino
              </h2>
              <p className="text-xs text-[#A0A0A0] mt-1">
                Los objetos y permisos adquiridos se asignarán directamente al usuario de Minecraft especificado.
              </p>
            </div>

            <form onSubmit={handleValidateStep1} className="space-y-5">
              {/* Minecraft Nickname Field with skin preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D0D0D0] mb-1.5">
                  Usuario exacto de Minecraft <span className="text-[#FF4545]">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#606060]" />
                    <input
                      type="text"
                      value={mcUsername}
                      onChange={(e) => setMcUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      placeholder="Ejemplo: Steve_PvP"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-[#252525] rounded-xl text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Skin Avatar Preview */}
                  <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#252525] flex items-center justify-center shrink-0 overflow-hidden">
                    {mcUsername.trim().length >= 3 ? (
                      <img
                        src={`https://minotar.net/avatar/${mcUsername.trim()}/40`}
                        alt={mcUsername}
                        className="w-8 h-8 rounded"
                        onError={(e: any) => {
                          e.target.src = 'https://minotar.net/avatar/Steve/40';
                        }}
                      />
                    ) : (
                      <User className="w-5 h-5 text-[#606060]" />
                    )}
                  </div>
                </div>
                {formErrors.mcUsername && (
                  <p className="text-[11px] text-[#FF4545] mt-1">{formErrors.mcUsername}</p>
                )}
                <span className="text-[11px] text-[#707070] mt-1 block">
                  Asegúrate de escribir mayúsculas y minúsculas tal como aparecen en el juego.
                </span>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D0D0D0] mb-1.5">
                  Correo Electrónico <span className="text-[#FF4545]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#606060]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-[#252525] rounded-xl text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-[11px] text-[#FF4545] mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Modality selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D0D0D0] mb-1.5">
                  Modalidad de Recepción
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setModality('oneblock')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      modality === 'oneblock'
                        ? 'bg-[#1c170d] border-[#D4AF37] text-[#FFD700]'
                        : 'bg-[#141414] border-[#252525] text-[#A0A0A0]'
                    }`}
                  >
                    <div className="text-xs font-bold">OneBlock</div>
                    <div className="text-[11px] text-[#808080] mt-0.5">Isla, economía y minería</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModality('lifesteal')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      modality === 'lifesteal'
                        ? 'bg-[#240f0f] border-[#FF4545] text-[#FF6b6b]'
                        : 'bg-[#141414] border-[#252525] text-[#A0A0A0]'
                    }`}
                  >
                    <div className="text-xs font-bold">LifeSteal</div>
                    <div className="text-[11px] text-[#808080] mt-0.5">PvP, corazones y combate</div>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#202020] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRoute('cart')}
                  className="text-xs text-[#A0A0A0] hover:text-[#F5F5F5] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver al carrito
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#050505] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow"
                >
                  <span>Revisar pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Side Summary */}
          <div className="space-y-4 bg-[#0e0e0e] p-6 rounded-2xl border border-[#202020] h-fit">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F5F5] border-b border-[#202020] pb-2">
              Resumen de Compra
            </h3>
            <div className="space-y-2 text-xs">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between text-[#A0A0A0]">
                  <span className="truncate pr-2">{item.product.name} x{item.quantity}</span>
                  <span className="font-mono-numbers text-[#F5F5F5] shrink-0">
                    ${((item.product.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#202020] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#808080]">
                <span>Subtotal</span>
                <span className="font-mono-numbers">${cartSubtotal.toFixed(2)} USD</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#00FF87]">
                  <span>Descuento</span>
                  <span className="font-mono-numbers">-${discountAmount.toFixed(2)} USD</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#202020] flex justify-between font-bold text-sm text-[#F5F5F5]">
                <span>Total</span>
                <span className="font-mono-numbers text-[#FFD700]">${finalTotalUSD.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: REVISIÓN DEL PEDIDO ================= */}
      {step === 2 && (
        <div className="bg-[#101010] p-8 rounded-2xl border border-[#252525] space-y-6">
          <div>
            <h2 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
              Paso 2: Revisión de la Orden
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-1">
              Verifica los detalles antes de seleccionar la pasarela de pago.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#141414] border border-[#202020] text-xs">
            <div>
              <span className="text-[#808080] block">Jugador destinatario:</span>
              <span className="text-sm font-bold text-[#FFD700]">{mcUsername}</span>
            </div>
            <div>
              <span className="text-[#808080] block">Correo para recibo:</span>
              <span className="text-sm font-bold text-[#F5F5F5]">{email}</span>
            </div>
            <div>
              <span className="text-[#808080] block">Modalidad asignada:</span>
              <span className="font-semibold uppercase text-[#FEF9C2]">{modality}</span>
            </div>
            <div>
              <span className="text-[#808080] block">Tipo de cambio aplicado:</span>
              <span className="font-mono-numbers text-[#A0A0A0]">1 USD = S/ {settings.exchangeRateUSD_PEN} PEN</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
              Artículos en el pedido
            </h3>
            <div className="border border-[#202020] rounded-xl overflow-hidden divide-y divide-[#202020] text-xs">
              {cart.map(item => (
                <div key={item.product.id} className="p-3.5 bg-[#121212] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#F5F5F5]">{item.product.name}</h4>
                    <span className="text-[11px] text-[#808080] uppercase">{item.product.modality} · {item.product.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono-numbers text-[#F5F5F5]">
                      ${(item.product.price || 0).toFixed(2)} USD
                    </span>
                    <span className="text-[11px] text-[#808080] block">Cant: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#202020] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#808080]">Monto a pagar en moneda nacional:</span>
              <div className="text-2xl font-black font-mono-numbers text-[#00FF87]">
                S/ {finalTotalPEN.toFixed(2)} <span className="text-xs font-normal text-[#A0A0A0]">PEN</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#808080]">Total en dólares:</span>
              <div className="text-xl font-bold font-mono-numbers text-[#FFD700]">
                ${finalTotalUSD.toFixed(2)} <span className="text-xs text-[#A0A0A0]">USD</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#202020] flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-[#A0A0A0] hover:text-[#F5F5F5] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Editar datos
            </button>

            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#050505] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow"
            >
              <span>Continuar a métodos de pago</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: MÉTODOS DE PAGO ================= */}
      {step === 3 && (
        <div className="bg-[#101010] p-8 rounded-2xl border border-[#252525] space-y-8">
          <div>
            <h2 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
              Paso 3: Métodos de Pago
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-1">
              Selecciona tu billetera móvil para completar la transferencia.
            </p>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Yape */}
            <button
              type="button"
              onClick={() => setPaymentMethod('yape')}
              className={`p-4 rounded-xl border text-left transition-all ${
                paymentMethod === 'yape'
                  ? 'bg-[#1b1226] border-[#8a33db] text-white shadow-lg'
                  : 'bg-[#141414] border-[#252525] text-[#A0A0A0] hover:border-[#383838]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-[#c074fc]">Yape</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8a33db]/20 text-[#c074fc]">
                  Billetera BCP
                </span>
              </div>
              <p className="text-[11px] text-[#A0A0A0] mt-1">Transferencia inmediata sin comisión</p>
            </button>

            {/* Plin */}
            <button
              type="button"
              onClick={() => setPaymentMethod('plin')}
              className={`p-4 rounded-xl border text-left transition-all ${
                paymentMethod === 'plin'
                  ? 'bg-[#0f1d24] border-[#00b4d8] text-white shadow-lg'
                  : 'bg-[#141414] border-[#252525] text-[#A0A0A0] hover:border-[#383838]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-[#00b4d8]">Plin</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00b4d8]/20 text-[#00b4d8]">
                  Interbank / BBVA / Scotiabank
                </span>
              </div>
              <p className="text-[11px] text-[#A0A0A0] mt-1">Transferencias interbancarias directas</p>
            </button>

            {/* PayPal (En Mantenimiento) */}
            <div className="p-4 rounded-xl border bg-[#141414]/50 border-[#202020] opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-[#606060]">PayPal</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#FF4545]/15 text-[#FF4545] border border-[#FF4545]/20">
                  En mantenimiento
                </span>
              </div>
              <p className="text-[11px] text-[#707070] mt-1">
                {settings.paypalNotice}
              </p>
            </div>
          </div>

          {/* Active Payment Details Pane */}
          <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#202020] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: QR Real Placeholder Area & Holder info */}
            <div className="space-y-4 text-center md:text-left">
              {/* QR area - Dynamic based on method */}
              <div className="w-56 h-56 mx-auto md:mx-0 rounded-2xl bg-[#141414] border-2 border-[#252525] flex flex-col items-center justify-center p-2 relative group overflow-hidden">
                {paymentMethod === 'yape' ? (
                  <img 
                    src="/assets/aistudio/qr_yape_2395f396.jpeg" 
                    alt="QR Yape" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <QrCode className="w-16 h-16 text-[#D4AF37]/60" />
                    <span className="text-[11px] text-[#A0A0A0] mt-3 font-semibold text-center">
                      QR de {paymentMethod.toUpperCase()} no disponible
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs text-[#808080]">Titular de la cuenta:</div>
                <div className="text-base font-bold text-[#FFD700] flex items-center justify-center md:justify-start gap-2">
                  <span>{settings.paymentHolderName}</span>
                  <button
                    onClick={() => copyToClipboard(settings.paymentHolderName)}
                    className="text-[#A0A0A0] hover:text-[#F5F5F5]"
                    title="Copiar titular"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Exact Amount & Step Instructions */}
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#252525] space-y-1">
                <span className="text-xs text-[#808080] uppercase tracking-wider block">
                  Importe exacto a transferir
                </span>
                <div className="text-3xl font-extrabold font-mono-numbers text-[#00FF87]">
                  S/ {finalTotalPEN.toFixed(2)} <span className="text-xs text-[#A0A0A0]">PEN</span>
                </div>
                <span className="text-[11px] text-[#707070] block">
                  Equivalente a ${(finalTotalUSD).toFixed(2)} USD
                </span>
              </div>

              {/* Instructions */}
              <div className="space-y-2 text-xs text-[#A0A0A0]">
                <h4 className="font-bold text-[#F5F5F5] uppercase tracking-wider text-[11px]">
                  Instrucciones de Pago:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>Abre tu aplicación de <strong className="text-[#F5F5F5] capitalize">{paymentMethod}</strong>.</li>
                  <li>Escanea el código QR o transfiere al titular <strong className="text-[#FEF9C2]">{settings.paymentHolderName}</strong>.</li>
                  <li>Ingresa el monto exacto de <strong className="text-[#00FF87]">S/ {finalTotalPEN.toFixed(2)}</strong>.</li>
                  <li>Guarda tu comprobante o anota el número de operación.</li>
                </ol>
              </div>

              {/* Reference / Operation code input (optional) */}
              <div>
                <label className="block text-xs font-semibold text-[#D0D0D0] mb-1">
                  Número de Operación / Referencia (Opcional):
                </label>
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value)}
                  placeholder="Ejemplo: 928410"
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Action Button: "Ya he realizado el pago" */}
              <div className="flex items-center gap-3 bg-[#0c0c0c] p-4 rounded-xl border border-[#202020]">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-[#252525] bg-[#0c0c0c] checked:bg-[#D4AF37] focus:ring-offset-[#101010]"
                />
                <label htmlFor="terms" className="text-xs text-[#A0A0A0]">
                  He leído y acepto los <button onClick={() => setRoute('terms')} className="text-[#D4AF37] hover:underline">términos y condiciones</button> de la tienda.
                </label>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={!termsAccepted}
                className={`w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00FF87] to-[#00b862] hover:brightness-110 text-[#050505] text-xs font-black uppercase tracking-wider shadow-lg shadow-[#00FF87]/15 transition-all flex items-center justify-center gap-2 active:scale-95 ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ya he realizado el pago</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#202020] flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-[#A0A0A0] hover:text-[#F5F5F5] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a revisión
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: CONFIRMACIÓN Y ESTADO EN REVISIÓN ================= */}
      {step === 4 && submittedOrder && (
        <div className="bg-[#101010] p-8 sm:p-10 rounded-2xl border border-[#252525] space-y-8 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#FFD700]">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30 inline-block">
              Pago Notificado · Estado: En Revisión
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#F5F5F5]">
              Comprobante Recibido para Verificación
            </h2>

            <p className="text-xs text-[#A0A0A0] max-w-lg mx-auto leading-relaxed">
              Hemos registrado la notificación de tu abono. Tu pago <strong className="text-[#FF4545]">no está confirmado automáticamente</strong>; un administrador de Vitalia Network validará los fondos en la app bancaria para proceder con la entrega en el servidor.
            </p>
          </div>

          {/* Receipt Breakdown Card */}
          <div className="p-6 rounded-xl bg-[#0c0c0c] border border-[#202020] max-w-xl mx-auto space-y-4 text-xs">
            {/* Big Order ID */}
            <div className="p-8 rounded-2xl bg-[#0c0c0c] border border-[#252525] text-center mb-6">
              <p className="text-xs text-[#808080] uppercase tracking-widest mb-2">Identificador de Pedido</p>
              <h3 className="text-5xl font-black font-mono-numbers text-[#D4AF37]">
                {submittedOrder.id}
              </h3>
              <p className="text-xs text-[#FF4545] mt-4 font-bold">
                ¡IMPORTANTE! Si pierdes este ID, todo reclamo será denegado.
              </p>
            </div>

            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <span className="text-[#808080]">Código de Referencia:</span>
              <span className="font-mono text-xs font-semibold text-[#F5F5F5]">{submittedOrder.referenceCode}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <span className="text-[#808080]">Usuario Destinatario:</span>
              <span className="font-bold text-[#F5F5F5]">{submittedOrder.mcUsername}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <span className="text-[#808080]">Método de Pago Empleado:</span>
              <span className="font-semibold uppercase text-[#FEF9C2]">{submittedOrder.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <span className="text-[#808080]">Importe a Validar:</span>
              <div className="text-right">
                <span className="font-bold font-mono-numbers text-base text-[#00FF87]">
                  S/ {submittedOrder.totalPEN.toFixed(2)} PEN
                </span>
                <span className="text-[11px] text-[#808080] block">(${submittedOrder.total.toFixed(2)} USD)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[#808080]">Estado Actual del Pago:</span>
              <span className="font-semibold text-[#FFD700] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
                En revisión manual
              </span>
            </div>
          </div>

          {/* Timeline of Order */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#808080]">
              Línea de Tiempo del Pedido
            </div>
            <div className="border border-[#202020] rounded-xl p-4 bg-[#141414] space-y-3 text-xs">
              {submittedOrder.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {event.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00FF87]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#404040]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${event.completed ? 'text-[#F5F5F5]' : 'text-[#606060]'}`}>
                        {event.step}
                      </span>
                      <span className="text-[10px] text-[#606060] font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#808080] mt-0.5">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#202020]">
            <button
              onClick={() => setRoute('order-lookup')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-[#F5F5F5] text-xs font-semibold transition-colors"
            >
              Consultar este pedido en línea
            </button>

            <button
              onClick={() => setRoute('home')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] text-xs font-bold uppercase tracking-wider transition-all"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
