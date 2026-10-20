import React, { useState } from 'react';
import { X, Sparkles, Shield, Swords } from 'lucide-react';
import { MinecraftInventoryItem } from '../../types/store';
import { MinecraftItemIcon } from './MinecraftItemIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  items: MinecraftInventoryItem[];
}

export const InventoryGridModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  items,
}) => {
  const [hoveredItem, setHoveredItem] = useState<MinecraftInventoryItem | null>(null);

  if (!isOpen) return null;

  // Minecraft chest inventory typically has 27 slots (9 cols x 3 rows)
  const totalSlots = 27;
  const gridSlots: (MinecraftInventoryItem | null)[] = Array(totalSlots).fill(null);
  items.forEach((item, index) => {
    if (index < totalSlots) {
      gridSlots[index] = item;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#101010] border border-[#252525] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#252525] bg-[#141414]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F5F5F5]">{title}</h3>
                {badge && (
                  <span className="text-[11px] font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-[#A0A0A0] mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#202020] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inventory Body */}
        <div className="p-6">
          <div className="text-xs uppercase tracking-wider text-[#A0A0A0] font-semibold mb-3 flex items-center justify-between">
            <span>Contenedor de Recompensas ({items.length} objetos)</span>
            <span className="text-[11px] text-[#D4AF37]">Pasa el cursor para ver encantamientos</span>
          </div>

          {/* Minecraft Slots Grid */}
          <div className="bg-[#0c0c0c] p-3 rounded-lg border border-[#202020]">
            <div className="grid grid-cols-9 gap-1.5">
              {gridSlots.map((item, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`mc-slot relative aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-150 ${
                    item ? 'hover:scale-105 hover:z-10' : 'opacity-40'
                  }`}
                >
                  {item && (
                    <>
                      <MinecraftItemIcon 
                        type={item.iconType} 
                        material={item.material}
                        className="w-8 h-8 drop-shadow" 
                      />
                      {item.count > 1 && (
                        <span className="absolute bottom-1 right-1 text-[11px] font-bold text-[#FEF9C2] font-mono-numbers drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                          {item.count}
                        </span>
                      )}
                      {item.enchantments && item.enchantments.length > 0 && (
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Item Lore Tooltip / Inspection Pane */}
          <div className="mt-4 p-4 rounded-lg bg-[#141414] border border-[#252525] min-h-[96px]">
            {hoveredItem ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-[#FFD700] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {hoveredItem.name}
                  </h4>
                  <span className="text-xs text-[#A0A0A0] font-mono-numbers">
                    Cantidad: x{hoveredItem.count}
                  </span>
                </div>

                {hoveredItem.enchantments && hoveredItem.enchantments.length > 0 ? (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                    {hoveredItem.enchantments.map((ench, i) => (
                      <span key={i} className="text-xs text-[#FEF9C2] flex items-center gap-1 font-mono-numbers">
                        <Swords className="w-3 h-3 text-[#D4AF37]" />
                        {ench.name} {ench.level}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#A0A0A0] italic mt-1">Objeto estándar sin encantamientos añadidos.</p>
                )}

                {hoveredItem.lore && hoveredItem.lore.length > 0 && (
                  <div className="mt-2 text-xs text-[#9d80d8] border-t border-[#252525] pt-1.5">
                    {hoveredItem.lore.join(' • ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-[#707070] italic">
                Coloca el cursor sobre cualquier casilla del inventario para inspeccionar sus atributos y encantamientos.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#252525] bg-[#0c0c0c] text-xs text-[#A0A0A0]">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
            Entrega automática mediante comando de servidor
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#101010] bg-[#D4AF37] hover:bg-[#FFD700] rounded-lg transition-colors"
          >
            Cerrar vista
          </button>
        </div>
      </div>
    </div>
  );
};
