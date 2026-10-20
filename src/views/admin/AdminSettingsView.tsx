import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  CreditCard, 
  Terminal, 
  Shield, 
  Palette, 
  QrCode, 
  Save, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const [activeTab, setActiveTab] = useState<'store' | 'payments' | 'minecraft' | 'appearance'>('payments');
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#202020] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">Configuración General del Sistema</h1>
          <p className="text-xs text-[#808080]">Parámetros de tienda, pasarelas de pago, tipo de cambio e integración Minecraft</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Configuración guardada</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#202020] pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'payments' ? 'bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30' : 'text-[#808080] hover:text-[#F5F5F5]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Pagos, QR & Tipo de Cambio</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'store' ? 'bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30' : 'text-[#808080] hover:text-[#F5F5F5]'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Parámetros de Tienda</span>
        </button>

        <button
          onClick={() => setActiveTab('minecraft')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'minecraft' ? 'bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30' : 'text-[#808080] hover:text-[#F5F5F5]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Conexión Minecraft & Comandos</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'appearance' ? 'bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30' : 'text-[#808080] hover:text-[#F5F5F5]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Identidad Visual</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* ================= TAB PAGOS ================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Exchange rate & Account holder */}
            <div className="p-6 rounded-2xl bg-[#101010] border border-[#202020] space-y-4">
              <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
                Titular Bancario & Tipo de Cambio Oficial
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-bold">
                    Nombre del Titular Oficial (Yape & Plin)
                  </label>
                  <input
                    type="text"
                    value={formData.paymentHolderName}
                    onChange={(e) => setFormData({ ...formData, paymentHolderName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-[#606060] mt-1 block">
                    Nombre verificado que visualizan los compradores: <strong>Milvan Bac</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-[#A0A0A0] mb-1 font-bold">
                    Tipo de Cambio (USD a PEN)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#D4AF37] font-bold">1 USD = S/</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.exchangeRateUSD_PEN}
                      onChange={(e) => setFormData({ ...formData, exchangeRateUSD_PEN: parseFloat(e.target.value) || 3.65 })}
                      className="w-32 px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#00FF87] font-mono-numbers font-bold text-sm focus:border-[#D4AF37] focus:outline-none"
                      required
                    />
                    <span className="text-[#808080]">PEN</span>
                  </div>
                  <span className="text-[10px] text-[#606060] mt-1 block">
                    Se utiliza automáticamente para calcular el total exacto en soles durante el checkout.
                  </span>
                </div>
              </div>
            </div>

            {/* QR Setup Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Yape QR */}
              <div className="p-6 rounded-2xl bg-[#101010] border border-[#252525] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#c074fc] uppercase tracking-wider text-sm">
                    Código QR Oficial de Yape
                  </h4>
                  <span className="text-[10px] text-[#808080]">BCP</span>
                </div>

                <div className="w-full h-44 rounded-xl bg-[#141414] border-2 border-[#252525] flex flex-col items-center justify-center p-4 text-center">
                  <QrCode className="w-12 h-12 text-[#c074fc]" />
                  <span className="text-xs font-semibold text-[#F5F5F5] mt-2">
                    QR de Yape Actual
                  </span>
                  <img src="/assets/aistudio/qr_yape_2395f396.jpeg" alt="Yape QR" className="max-h-24 mt-2 object-contain" />
                </div>

                <div>
                  <label className="block text-[#808080] mb-1">Teléfono visible / Número de Yape</label>
                  <input
                    type="text"
                    value={formData.yapePhone}
                    onChange={(e) => setFormData({ ...formData, yapePhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono"
                  />
                </div>
              </div>

              {/* Plin QR */}
              <div className="p-6 rounded-2xl bg-[#101010] border border-[#252525] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#00b4d8] uppercase tracking-wider text-sm">
                    Código QR Oficial de Plin
                  </h4>
                  <span className="text-[10px] text-[#808080]">Interbank / BBVA</span>
                </div>

                <div className="w-full h-44 rounded-xl bg-[#141414] border-2 border-[#252525] flex flex-col items-center justify-center p-4 text-center">
                  <QrCode className="w-12 h-12 text-[#00b4d8]" />
                  <span className="text-xs font-semibold text-[#F5F5F5] mt-2">
                    QR de Plin no configurado
                  </span>
                </div>

                <div>
                  <label className="block text-[#808080] mb-1">Teléfono visible / Número de Plin</label>
                  <input
                    type="text"
                    value={formData.plinPhone}
                    onChange={(e) => setFormData({ ...formData, plinPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* PayPal Maintenance Notice */}
            <div className="p-6 rounded-2xl bg-[#101010] border border-[#252525] space-y-3">
              <h4 className="font-bold text-[#A0A0A0] uppercase tracking-wider text-xs">
                Configuración de PayPal
              </h4>
              <div>
                <label className="block text-[#808080] mb-1">Mensaje de estado para compradores</label>
                <input
                  type="text"
                  value={formData.paypalNotice}
                  onChange={(e) => setFormData({ ...formData, paypalNotice: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5]"
                />
                <span className="text-[10px] text-[#606060] mt-1 block">
                  El botón de PayPal se mantendrá deshabilitado con la insignia «En mantenimiento».
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB TIENDA ================= */}
        {activeTab === 'store' && (
          <div className="p-6 rounded-2xl bg-[#101010] border border-[#202020] space-y-4">
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              Datos Generales de la Tienda
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Nombre Comercial</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5]"
                />
              </div>
              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Moneda Principal de Catálogo</label>
                <input
                  type="text"
                  value="USD (Dólares Estadounidenses)"
                  disabled
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#808080] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-[#F5F5F5]">
                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                  className="w-4 h-4 rounded bg-[#141414] border-[#252525] accent-[#D4AF37]"
                />
                <span className="font-semibold">Activar Modo de Mantenimiento General</span>
              </label>
              <p className="text-[11px] text-[#707070] mt-1 pl-6">
                Muestra un aviso preventivo en la cabecera informando actualizaciones técnicas.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB MINECRAFT ================= */}
        {activeTab === 'minecraft' && (
          <div className="p-6 rounded-2xl bg-[#101010] border border-[#202020] space-y-5">
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              Parámetros de Integración con el Servidor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Dirección IP Oficial</label>
                <input
                  type="text"
                  value={formData.serverIp}
                  onChange={(e) => setFormData({ ...formData, serverIp: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#FEF9C2] font-mono"
                />
              </div>
              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Plugin de Permisos Objetivo</label>
                <input
                  type="text"
                  value="LuckPerms v5.4 (MySQL Datastore)"
                  disabled
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#808080] cursor-not-allowed font-mono"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-[#A0A0A0] font-bold">Plantilla de Comando de Entrega de Rangos</label>
              <div className="p-3 rounded-lg bg-[#0c0c0c] border border-[#252525] font-mono text-[11px] text-[#00FF87]">
                lp user {`{player}`} parent add {`{rank_id}`}
              </div>
              <span className="text-[10px] text-[#606060]">
                Los tokens {`{player}`} y {`{rank_id}`} son reemplazados dinámicamente al aprobar el pago.
              </span>
            </div>
          </div>
        )}

        {/* ================= TAB APARIENCIA ================= */}
        {activeTab === 'appearance' && (
          <div className="p-6 rounded-2xl bg-[#101010] border border-[#202020] space-y-4">
            <h3 className="text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              Identidad Visual Oficial
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#050505] border border-[#252525] space-y-1">
                <span className="text-[#808080] block text-[10px]">Fondo Principal</span>
                <span className="font-mono text-[#F5F5F5] font-bold">#050505</span>
              </div>
              <div className="p-3 rounded-lg bg-[#101010] border border-[#252525] space-y-1">
                <span className="text-[#808080] block text-[10px]">Superficie Tarjetas</span>
                <span className="font-mono text-[#F5F5F5] font-bold">#101010</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1c170d] border border-[#D4AF37]/40 space-y-1">
                <span className="text-[#D4AF37] block text-[10px]">Dorado Principal</span>
                <span className="font-mono text-[#FFD700] font-bold">#D4AF37</span>
              </div>
              <div className="p-3 rounded-lg bg-[#151f18] border border-[#00FF87]/30 space-y-1">
                <span className="text-[#00FF87] block text-[10px]">Verde Éxito</span>
                <span className="font-mono text-[#00FF87] font-bold">#00FF87</span>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="pt-4 border-t border-[#202020] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 shadow"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración General</span>
          </button>
        </div>
      </form>
    </div>
  );
};
