import React from 'react';

export const GoldenFallingMeteor: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Primary soft golden meteor */}
      <div className="absolute top-[8%] right-[15%] animate-meteor-smooth">
        <div className="relative">
          {/* Glowing head of meteor */}
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#FFF2A3] to-[#FFD700] shadow-[0_0_12px_3px_rgba(255,215,0,0.65)]" />
          
          {/* Smooth golden tail extending backwards */}
          <div 
            className="absolute top-1/2 left-2 -translate-y-1/2 h-[1.8px] w-[220px] sm:w-[320px] rounded-full bg-gradient-to-r from-[#FFD700]/90 via-[#D4AF37]/40 to-transparent blur-[0.4px]"
            style={{ transformOrigin: 'left center' }}
          />

          {/* Faint stardust particles */}
          <div className="absolute top-[-3px] left-[60px] w-1 h-1 rounded-full bg-[#FEF9C2]/50 blur-[0.5px]" />
          <div className="absolute top-[4px] left-[130px] w-1 h-1 rounded-full bg-[#FEF9C2]/40 blur-[0.5px]" />
          <div className="absolute top-[-1px] left-[210px] w-1 h-1 rounded-full bg-[#D4AF37]/30 blur-[0.5px]" />
        </div>
      </div>

      {/* Secondary softer, smaller golden meteor with delay */}
      <div className="absolute top-[22%] right-[5%] animate-meteor-secondary">
        <div className="relative">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FFF5C0] to-[#E5C158] shadow-[0_0_8px_2px_rgba(255,215,0,0.45)]" />
          <div 
            className="absolute top-1/2 left-1.5 -translate-y-1/2 h-[1.2px] w-[160px] sm:w-[240px] rounded-full bg-gradient-to-r from-[#FFD700]/70 via-[#D4AF37]/30 to-transparent blur-[0.4px]"
            style={{ transformOrigin: 'left center' }}
          />
        </div>
      </div>

      {/* Gentle golden ambient stardust twinkle in the background */}
      <div className="absolute top-1/4 left-1/5 w-1 h-1 rounded-full bg-[#FFD700]/40 animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-[#FEF9C2]/30 animate-pulse" style={{ animationDuration: '3s' }} />
    </div>
  );
};
