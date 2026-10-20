import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CreditCard, 
  Package, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
  ChevronRight, 
  Bell 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminOrdersView } from './AdminOrdersView';
import { AdminPaymentsView } from './AdminPaymentsView';
import { AdminProductsView } from './AdminProductsView';
import { AdminRanksView } from './AdminRanksView';
import { AdminKitsView } from './AdminKitsView';
import { AdminExtrasView } from './AdminExtrasView';
import { AdminCouponsView } from './AdminCouponsView';
import { AdminUsersView } from './AdminUsersView';
import { AdminLogsView } from './AdminLogsView';
import { AdminSettingsView } from './AdminSettingsView';

export type AdminSection = 
  | 'dashboard'
  | 'orders'
  | 'payments'
  | 'products'
  | 'ranks'
  | 'kits'
  | 'extras'
  | 'coupons'
  | 'users'
  | 'logs'
  | 'settings';

export const AdminLayout: React.FC = () => {
  const { currentAdmin, logoutAdmin, setRoute, orders } = useStore();

  useEffect(() => {
    return () => {
      logoutAdmin();
    };
  }, []);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingPaymentsCount = orders.filter(o => o.paymentStatus === 'under_review').length;

  const navItems: { id: AdminSection; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag, badge: orders.length },
    { id: 'payments', label: 'Pagos', icon: CreditCard, badge: pendingPaymentsCount },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'ranks', label: 'Rangos', icon: Award },
    { id: 'kits', label: 'Kits', icon: ShieldCheck },
    { id: 'extras', label: 'Extras OneBlock', icon: Sparkles },
    { id: 'coupons', label: 'Descuentos', icon: Tag },
    { id: 'users', label: 'Usuarios Staff', icon: Users },
    { id: 'logs', label: 'Logs y Auditoría', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const handleSelectSection = (id: AdminSection) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-[#1f1f1f] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand header */}
          <div className="p-5 border-b border-[#1c1c1c] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1c170d] to-[#111111] border border-[#D4AF37]/50 flex items-center justify-center text-[#FFD700] shadow">
                <span className="font-cinzel text-base font-bold">V</span>
              </div>
              <div>
                <span className="font-cinzel text-sm font-extrabold tracking-wider text-[#F5F5F5] block">
                  VITALIA CONTROL
                </span>
                <span className="text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase">
                  Admin Software
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-[#808080] hover:text-[#F5F5F5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (11 sections) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#181818] text-[#FFD700] border border-[#D4AF37]/30 shadow-sm'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#121212]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#707070]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono-numbers font-bold ${
                      item.id === 'payments' && pendingPaymentsCount > 0
                        ? 'bg-[#FFD700] text-[#050505]'
                        : 'bg-[#222222] text-[#808080]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin profile & Logout (Section 12) */}
          <div className="p-4 border-t border-[#1c1c1c] bg-[#0c0c0c] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#252525] flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                {currentAdmin?.name.charAt(0) || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-[#F5F5F5] block truncate">
                  {currentAdmin?.name || 'Administrador'}
                </span>
                <span className="text-[10px] font-mono text-[#D4AF37] block">
                  {currentAdmin?.role || 'ADMIN'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1a1a1a]">
              <button
                onClick={logoutAdmin}
                className="py-1.5 px-2 rounded-lg bg-[#141414] hover:bg-[#202020] text-[#A0A0A0] hover:text-[#F5F5F5] text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                title="Ir a la tienda de jugadores"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Ver Tienda</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="py-1.5 px-2 rounded-lg bg-[#181212] hover:bg-[#261515] text-[#FF4545] text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                title="Cerrar sesión administrativa"
              >
                <LogOut className="w-3 h-3" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#050505]/95 backdrop-blur-md border-b border-[#1c1c1c] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#121212] border border-[#252525] text-[#A0A0A0] hover:text-[#F5F5F5]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#606060]">Panel</span>
              <span className="text-[#404040]">/</span>
              <span className="font-semibold text-[#F5F5F5] capitalize">
                {navItems.find(n => n.id === activeSection)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {pendingPaymentsCount > 0 && (
              <button
                onClick={() => setActiveSection('payments')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFD700]/10 text-[#FFD700] border border-[#D4AF37]/30 hover:bg-[#FFD700]/20 transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>{pendingPaymentsCount} pagos por revisar</span>
              </button>
            )}

            <button
              onClick={() => setRoute('home')}
              className="px-3.5 py-1.5 rounded-lg bg-[#161616] hover:bg-[#222222] border border-[#252525] text-[#A0A0A0] hover:text-[#F5F5F5] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Tienda Pública</span>
            </button>
          </div>
        </header>

        {/* Page Content View */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeSection === 'dashboard' && <AdminDashboardView />}
          {activeSection === 'orders' && <AdminOrdersView />}
          {activeSection === 'payments' && <AdminPaymentsView />}
          {activeSection === 'products' && <AdminProductsView />}
          {activeSection === 'ranks' && <AdminRanksView />}
          {activeSection === 'kits' && <AdminKitsView />}
          {activeSection === 'extras' && <AdminExtrasView />}
          {activeSection === 'coupons' && <AdminCouponsView />}
          {activeSection === 'users' && <AdminUsersView />}
          {activeSection === 'logs' && <AdminLogsView />}
          {activeSection === 'settings' && <AdminSettingsView />}
        </main>
      </div>
    </div>
  );
};
