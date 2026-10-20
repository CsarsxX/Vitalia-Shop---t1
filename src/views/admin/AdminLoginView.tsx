import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, setRoute } = useStore();

  const [email, setEmail] = useState('');
  
  // Load saved credentials on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('adminEmail');
    const savedPass = localStorage.getItem('adminPassword');
    if (savedEmail) setEmail(savedEmail);
    if (savedPass) setPassword(savedPass);
  }, []);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Debes ingresar tu correo electrónico corporativo y contraseña.');
      return;
    }

    // Save credentials if rememberMe is checked
    if (rememberMe) {
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminPassword', password);
    } else {
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminPassword');
    }

    setIsLoading(true);
    setTimeout(() => {
      const ok = loginAdmin(email, password);
      setIsLoading(false);
      if (ok) {
        setRoute('admin');
      } else {
        setErrorMsg('Credenciales inválidas o cuenta inactiva. Verifica tus datos de acceso.');
      }
    }, 300);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-[#0c0c0c] border border-[#202020] p-8 sm:p-10 rounded-2xl shadow-2xl relative">
        {/* Back to store link */}
        <button
          onClick={() => setRoute('home')}
          className="text-xs text-[#808080] hover:text-[#F5F5F5] flex items-center gap-1.5 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a la tienda pública</span>
        </button>

        {/* Logo and title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1c170d] to-[#111111] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#FFD700] shadow-lg">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-extrabold font-cinzel text-[#F5F5F5] tracking-wide">
            VITALIA CONTROL
          </h2>
          <p className="text-xs text-[#808080]">
            Panel de Gestión Administrativa para e-commerce y servidores
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#FF4545]/10 border border-[#FF4545]/30 text-xs text-[#FF4545] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 rounded-lg bg-[#00FF87]/10 border border-[#00FF87]/30 text-xs text-[#00FF87] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#A0A0A0] mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#606060]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="baciliosachun.1@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#141414] border border-[#252525] rounded-xl text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => setInfoMsg('Para restablecer credenciales corporativas, contacta a soporte@vitalianetwork.net.')}
                className="text-[11px] text-[#D4AF37] hover:underline"
              >
                ¿Olvidaste tu clave?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-[#606060]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-[#141414] border border-[#252525] rounded-xl text-xs text-[#F5F5F5] placeholder-[#606060] focus:outline-none focus:border-[#D4AF37]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#606060] hover:text-[#A0A0A0]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#A0A0A0]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#141414] border-[#252525] accent-[#D4AF37]"
              />
              <span>Recordar sesión en este equipo</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] text-[#F5F5F5] hover:text-[#FFD700] border border-[#303030] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Iniciar Sesión Manual</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#1c1c1c] text-center text-[11px] text-[#606060]">
          Entorno restringido · Acceso autorizado para administradores de Vitalia Network
        </div>
      </div>
    </div>
  );
};
