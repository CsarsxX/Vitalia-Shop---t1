import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, AlertTriangle, ShieldCheck, Plus, Minus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MinecraftItemIcon } from '../common/MinecraftItemIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    discountAmount,
    finalTotalUSD,
    finalTotalPEN,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    setRoute,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    onClose();
    setRoute('checkout');
  };

  // Separate items by modality
  const oneblockItems = cart.filter(item => item.product.modality === 'oneblock');
  const lifestealItems = cart.filter(item => item.product.modality === 'lifesteal');
  const otherItems = cart.filter(item => item.product.modality !== 'oneblock' && item.product.modality !== 'lifesteal');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0A] border-l border-[#202020] text-[#F5F5F5] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 border-b border-[#202020] flex items-center justify-between bg-[#0e0e0e]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F5F5F5]">Carrito de Compras</h3>
                <p className="text-xs text-[#A0A0A0]">
                  {cart.length === 0 ? 'Sin artículos' : `${cart.length} ${cart.length === 1 ? 'producto' : 'productos'}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1a1a1a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#252525] flex items-center justify-center mx-auto text-[#606060]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F5F5]">Tu carrito está vacío</h4>
                  <p className="text-xs text-[#808080] max-w-xs mx-auto mt-1">
                    Explora nuestro catálogo de rangos comerciales, kits configurados y extras para OneBlock y LifeSteal.
                  </p>
                </div>
                <button
                  onClick={() => { onClose(); setRoute('catalog'); }}
                  className="px-5 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] text-xs font-bold uppercase transition-all"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* OneBlock Items */}
                {oneblockItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider border-b border-[#202020] pb-1.5">
                      <span>Artículos OneBlock</span>
                      <span className="text-[#808080] font-normal">{oneblockItems.length}</span>
                    </div>

                    <div className="space-y-3">
                      {oneblockItems.map(item => (
                        <CartItemCard 
                          key={item.product.id} 
                          item={item} 
                          onRemove={removeFromCart}
                          onUpdateQty={updateQuantity}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* LifeSteal Items */}
                {lifestealItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#FF4545] uppercase tracking-wider border-b border-[#202020] pb-1.5">
                      <span>Artículos LifeSteal</span>
                      <span className="text-[#808080] font-normal">{lifestealItems.length}</span>
                    </div>

                    <div className="space-y-3">
                      {lifestealItems.map(item => (
                        <CartItemCard 
                          key={item.product.id} 
                          item={item} 
                          onRemove={removeFromCart}
                          onUpdateQty={updateQuantity}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Items */}
                {otherItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider border-b border-[#202020] pb-1.5">
                      Otros Artículos
                    </div>
                    {otherItems.map(item => (
                      <CartItemCard 
                        key={item.product.id} 
                        item={item} 
                        onRemove={removeFromCart}
                        onUpdateQty={updateQuantity}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cart Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#202020] bg-[#0c0c0c] space-y-4">
              {/* Coupon Form */}
              <div>
                {activeCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#00FF87]/10 border border-[#00FF87]/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#00FF87]" />
                      <span className="font-mono font-bold text-[#00FF87]">{activeCoupon.code}</span>
                      <span className="text-[#A0A0A0]">
                        (-{activeCoupon.type === 'percentage' ? `${activeCoupon.value}%` : `$${activeCoupon.value.toFixed(2)}`})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#FF4545] hover:underline text-[11px] font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#606060]" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Código de descuento (ej. VITALIA10)"
                          className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-[#202020] hover:bg-[#2a2a2a] text-[#F5F5F5] text-xs font-semibold rounded-lg transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-[#FF4545] pl-1">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#A0A0A0]">
                  <span>Subtotal</span>
                  <span className="font-mono-numbers">${cartSubtotal.toFixed(2)} USD</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-[#00FF87]">
                    <span>Descuento aplicado</span>
                    <span className="font-mono-numbers">-${discountAmount.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#202020] flex items-baseline justify-between text-base font-bold text-[#F5F5F5]">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="text-[#FFD700] font-mono-numbers">
                      ${finalTotalUSD.toFixed(2)} <span className="text-xs text-[#A0A0A0]">USD</span>
                    </div>
                    <div className="text-[11px] text-[#A0A0A0] font-mono-numbers font-normal">
                      Aprox. S/ {finalTotalPEN.toFixed(2)} PEN (T/C {settings.exchangeRateUSD_PEN})
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#FFD700] hover:to-[#D4AF37] text-[#050505] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/15 transition-all"
                >
                  <span>Continuar al pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-center text-xs font-semibold text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
                >
                  Continuar comprando
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#606060] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00FF87]" />
                <span>Activación directa tras confirmación de comprobante</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ItemCardProps {
  item: { product: any; quantity: number };
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, q: number) => void;
}

const CartItemCard: React.FC<ItemCardProps> = ({ item, onRemove, onUpdateQty }) => {
  const isUnique = item.product.category === 'ranks' || item.product.category === 'upgrades' || item.product.toolType === 'pack';

  return (
    <div className="p-3.5 rounded-lg bg-[#121212] border border-[#202020] flex items-center justify-between gap-3 group hover:border-[#303030] transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#252525] flex items-center justify-center shrink-0">
          <MinecraftItemIcon 
            type={item.product.toolType || (item.product.category === 'ranks' ? 'helmet' : 'block')} 
            material="netherite"
            className="w-5 h-5"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-[#F5F5F5] truncate">{item.product.name}</h4>
            {item.product.badge && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shrink-0 font-semibold">
                {item.product.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#A0A0A0] mt-0.5">
            <span className="font-mono-numbers text-[#FFD700]">${(item.product.price || 0).toFixed(2)} USD</span>
            <span>·</span>
            <span className="capitalize">{item.product.modality}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {!isUnique ? (
          <div className="flex items-center gap-1.5 bg-[#181818] px-2 py-1 rounded border border-[#252525]">
            <button
              onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
              className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold font-mono-numbers px-1">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
              className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-[#707070] italic">Único</span>
        )}

        <button
          onClick={() => onRemove(item.product.id)}
          className="p-1.5 text-[#606060] hover:text-[#FF4545] rounded hover:bg-[#1a1a1a] transition-colors"
          title="Eliminar del carrito"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
