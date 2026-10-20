import React from 'react';

interface Props {
  type: string;
  className?: string;
  material?: string;
}

export const MinecraftItemIcon: React.FC<Props> = ({ type, className = 'w-6 h-6', material = 'netherite' }) => {
  const isNetherite = material === 'netherite';
  const isDiamond = material === 'diamond';
  const isIron = material === 'iron';

  const toolColor = isDiamond ? '#2be4dc' : isIron ? '#d8d8d8' : '#4a424d';
  const toolBorder = isDiamond ? '#1aa09a' : isIron ? '#909090' : '#231e25';

  switch (type) {
    case 'sword':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <path d="M14.5 17.5L3 6V3h3l11.5 11.5" stroke={toolColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 19l2 2 4-4-2-2" stroke="#855" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 19l2 2" stroke="#bda" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="6" cy="6" r="1.5" fill={toolColor} />
        </svg>
      );

    case 'pickaxe':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <path d="M14.5 17.5L5 8" stroke="#855233" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M19 5c-3-2-7-1-10 2l3 3c2-3 5-4 7-5z" fill={toolColor} stroke={toolBorder} strokeWidth="1.5" />
          <path d="M5 19l4-4" stroke="#855233" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M9 15l2 2" stroke={toolColor} strokeWidth="2" />
        </svg>
      );

    case 'axe':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <path d="M16 19L5 8" stroke="#855233" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M13 3h6v6l-3 3-4-2z" fill={toolColor} stroke={toolBorder} strokeWidth="1.5" />
          <path d="M6 18l3-3" stroke="#855233" strokeWidth="2" />
        </svg>
      );

    case 'helmet':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <rect x="4" y="5" width="16" height="13" rx="3" fill={toolColor} stroke={toolBorder} strokeWidth="1.5" />
          <rect x="7" y="11" width="3" height="3" fill="#0A0A0A" />
          <rect x="14" y="11" width="3" height="3" fill="#0A0A0A" />
          <rect x="10" y="14" width="4" height="4" fill="#0A0A0A" />
        </svg>
      );

    case 'chestplate':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <path d="M5 4h4l3 3 3-3h4v8l-3 2v6H8v-6l-3-2V4z" fill={toolColor} stroke={toolBorder} strokeWidth="1.5" />
          <path d="M9 4v7h6V4" stroke={toolBorder} strokeWidth="1" />
        </svg>
      );

    case 'leggings':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <path d="M5 4h14v6l-2 10h-3l-2-6-2 6H7L5 10V4z" fill={toolColor} stroke={toolBorder} strokeWidth="1.5" />
        </svg>
      );

    case 'boots':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <path d="M4 8h5v5l2 3v4H4V8zm11 0h5v12h-7v-4l2-3V8z" fill={toolColor} stroke={toolBorder} strokeWidth="1.5" />
        </svg>
      );

    case 'golden_apple':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <circle cx="12" cy="14" r="7" fill="#FFD700" stroke="#D4AF37" strokeWidth="1.5" />
          <path d="M12 7c0-3 2-4 3-4" stroke="#855" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 7c-1-2 1-3 2-3" stroke="#00FF87" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="12" r="1.5" fill="#FEF9C2" />
        </svg>
      );

    case 'totem':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="7" y="4" width="10" height="7" rx="2" fill="#FFD700" stroke="#D4AF37" strokeWidth="1.5" />
          <rect x="9" y="6" width="2" height="2" fill="#00FF87" />
          <rect x="13" y="6" width="2" height="2" fill="#00FF87" />
          <rect x="5" y="10" width="14" height="4" rx="1" fill="#FFD700" stroke="#D4AF37" strokeWidth="1.5" />
          <rect x="9" y="14" width="6" height="7" rx="1" fill="#FFD700" stroke="#D4AF37" strokeWidth="1.5" />
        </svg>
      );

    case 'block':
    case 'grass_block':
    case 'island_upgrade':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          {/* Isometric top grass */}
          <polygon points="12,3 21,8 12,13 3,8" fill="#4fa62d" stroke="#3b821e" strokeWidth="1" />
          {/* Left dirt side */}
          <polygon points="3,8 12,13 12,21 3,16" fill="#866043" stroke="#68472f" strokeWidth="1" />
          {/* Right dirt side */}
          <polygon points="21,8 12,13 12,21 21,16" fill="#6d4c32" stroke="#523722" strokeWidth="1" />
          {/* Grass dripping border */}
          <polyline points="3,10 6,11 9,10 12,14 15,11 18,12 21,10" stroke="#4fa62d" strokeWidth="1.5" fill="none" />
        </svg>
      );

    case 'elytra':
    case 'wings':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <path d="M12 4C8 7 4 12 4 18c3-1 6-4 8-8 2 4 5 7 8 8 0-6-4-11-8-14z" fill="#444152" stroke="#8d84a3" strokeWidth="1.5" />
          <line x1="12" y1="4" x2="12" y2="20" stroke="#252525" strokeWidth="1.5" />
        </svg>
      );

    case 'key':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <circle cx="8" cy="8" r="4" stroke="#FFD700" strokeWidth="2" fill="none" />
          <line x1="11" y1="11" x2="20" y2="20" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="16" x2="18" y2="14" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="18" x2="20" y2="16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
          <rect x="5" y="5" width="14" height="14" rx="2" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="#D4AF37" />
        </svg>
      );
  }
};
