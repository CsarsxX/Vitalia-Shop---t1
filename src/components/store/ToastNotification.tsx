import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastNotification: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-[#101010]/95 border-[#00FF87]/40 text-[#F5F5F5]'
                : isError
                ? 'bg-[#101010]/95 border-[#FF4545]/40 text-[#F5F5F5]'
                : isWarning
                ? 'bg-[#101010]/95 border-[#D4AF37]/40 text-[#F5F5F5]'
                : 'bg-[#101010]/95 border-[#252525] text-[#F5F5F5]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#00FF87]" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#FF4545]" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-[#FFD700]" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-[#A0A0A0]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#F5F5F5]">{toast.title}</h4>
              <p className="text-xs text-[#A0A0A0] mt-0.5 leading-relaxed">{toast.description}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
