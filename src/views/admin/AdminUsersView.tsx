import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Key, 
  Check, 
  X, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminUser, AdminRole } from '../../types/store';

export const AdminUsersView: React.FC = () => {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser, currentAdmin } = useStore();

  const [isInviting, setIsInviting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'SUPPORT' as AdminRole,
  });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
  });

  const handleDeleteUser = (user: AdminUser) => {
    setConfirmModal({
      isOpen: true,
      title: `¿Eliminar administrador ${user.name}?`,
      description: `Esta acción revocará de inmediato todas las credenciales y accesos de ${user.email} al panel de Vitalia Network.`,
      action: () => {
        deleteAdminUser(user.id);
        setConfirmModal({ isOpen: false, title: '', description: '', action: () => {} });
      },
    });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    addAdminUser({
      id: `adm-${Date.now()}`,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role,
      isActive: true,
      lastLogin: 'Nunca',
      createdAt: new Date().toISOString().substring(0, 10),
    });

    setIsInviting(false);
    setNewUser({ name: '', email: '', role: 'SUPPORT' });
  };

  const handleToggleActive = (user: AdminUser) => {
    if (user.role === 'SUPER_ADMIN') {
      alert('Por seguridad no es posible desactivar una cuenta con rol SUPER_ADMIN.');
      return;
    }
    updateAdminUser({ ...user, isActive: !user.isActive });
  };

  const rolePermissions: { role: AdminRole; label: string; desc: string; perms: string[] }[] = [
    {
      role: 'SUPER_ADMIN',
      label: 'Super Administrador',
      desc: 'Control total de la infraestructura, pagos, permisos, catálogo y finanzas.',
      perms: ['Gestión completa de usuarios', 'Edición de precios y rangos', 'Aprobación de pagos', 'Configuración bancaria', 'Acceso a auditoría'],
    },
    {
      role: 'ADMIN',
      label: 'Administrador de Tienda',
      desc: 'Gestión diaria del catálogo comercial, cupones y validación de comprobantes.',
      perms: ['Edición de productos y kits', 'Creación de cupones', 'Aprobación y rechazo de pagos', 'Marcar entregas'],
    },
    {
      role: 'SUPPORT',
      label: 'Equipo de Soporte',
      desc: 'Atención al comprador y revisión preliminar de tickets e incidencias.',
      perms: ['Consulta de pedidos', 'Añadir notas internas', 'Reintentar despacho'],
    },
    {
      role: 'AUDITOR',
      label: 'Auditor Financiero',
      desc: 'Acceso de solo lectura para conciliaciones bancarias y supervisión de registros.',
      perms: ['Lectura de pedidos', 'Lectura de pagos', 'Consulta de logs de auditoría'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#202020] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-cinzel text-[#F5F5F5]">
            Usuarios Administrativos & Permisos RBAC
          </h1>
          <p className="text-xs text-[#808080]">
            Control de cuentas autorizadas para gestionar pedidos, catálogo y parámetros de Vitalia
          </p>
        </div>

        <button
          onClick={() => setIsInviting(true)}
          className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] text-xs font-bold uppercase transition-all flex items-center gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invitar Administrador</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#101010] border border-[#202020] rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-xs text-[#A0A0A0]">
          <thead className="bg-[#141414] text-[11px] uppercase tracking-wider text-[#808080] border-b border-[#202020]">
            <tr>
              <th className="py-3 px-4">Administrador</th>
              <th className="py-3 px-4">Correo Electrónico</th>
              <th className="py-3 px-4">Rol Asignado</th>
              <th className="py-3 px-4">Último Acceso</th>
              <th className="py-3 px-4">Fecha de Alta</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {adminUsers.map(user => {
              const isSuper = user.role === 'SUPER_ADMIN';
              return (
                <tr key={user.id} className="hover:bg-[#141414] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#181818] border border-[#252525] flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-[#F5F5F5]">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#D0D0D0] text-[11px]">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isSuper
                        ? 'bg-[#D4AF37]/15 text-[#FFD700] border border-[#D4AF37]/30'
                        : user.role === 'ADMIN'
                        ? 'bg-[#00FF87]/10 text-[#00FF87]'
                        : 'bg-[#202020] text-[#A0A0A0]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#808080] text-[11px]">
                    {user.lastLogin}
                  </td>
                  <td className="py-3.5 px-4 text-[#808080]">
                    {user.createdAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(user)}
                      disabled={isSuper}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        user.isActive
                          ? 'bg-[#00FF87]/15 text-[#00FF87]'
                          : 'bg-[#FF4545]/15 text-[#FF4545]'
                      }`}
                    >
                      <span>{user.isActive ? 'Activo' : 'Inactivo'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={user.role}
                        disabled={isSuper}
                        onChange={(e) => updateAdminUser({ ...user, role: e.target.value as AdminRole })}
                        className="bg-[#141414] border border-[#252525] text-[#F5F5F5] rounded px-2 py-1 text-[11px] focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPPORT">SUPPORT</option>
                        <option value="AUDITOR">AUDITOR</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={isSuper && adminUsers.filter(u => u.role === 'SUPER_ADMIN').length <= 1}
                        className="p-1.5 rounded bg-[#181818] hover:bg-[#281515] text-[#808080] hover:text-[#FF4545] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Eliminar administrador del sistema"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Permissions Matrix */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-cinzel text-[#F5F5F5] uppercase tracking-wider">
          Matriz de Privilegios por Rol
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rolePermissions.map(rp => (
            <div key={rp.role} className="p-4 rounded-xl bg-[#101010] border border-[#202020] space-y-3">
              <div>
                <span className="text-[10px] font-bold font-mono text-[#D4AF37] uppercase">{rp.role}</span>
                <h4 className="text-xs font-bold text-[#F5F5F5] mt-0.5">{rp.label}</h4>
                <p className="text-[11px] text-[#808080] mt-1 leading-snug">{rp.desc}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#1c1c1c]">
                {rp.perms.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#C0C0C0]">
                    <Check className="w-3 h-3 text-[#00FF87] shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#0f0f0f] border border-[#252525] rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#202020] pb-3">
              <h3 className="text-base font-bold font-cinzel text-[#F5F5F5]">Invitar Administrador</h3>
              <button onClick={() => setIsInviting(false)} className="p-1 text-[#808080] hover:text-[#F5F5F5]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Nombre Completo</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ej. Rodrigo Quispe"
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Correo Electrónico</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="admin.rodrigo@vitalianetwork.net"
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#A0A0A0] mb-1 font-bold">Rol de Acceso</label>
                <select
                  value={newUser.role}
                  onChange={(e: any) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#141414] border border-[#252525] rounded-lg text-[#F5F5F5] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="ADMIN">ADMIN (Gestor de Tienda)</option>
                  <option value="SUPPORT">SUPPORT (Soporte)</option>
                  <option value="AUDITOR">AUDITOR (Solo Lectura)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Control Total)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#202020] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviting(false)}
                  className="px-4 py-2 bg-[#202020] text-[#A0A0A0] rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#FFD700] text-[#050505] font-bold rounded-lg flex items-center gap-1.5"
                >
                  <span>Registrar Usuario</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#121212] border border-[#252525] rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF4545]/10 border border-[#FF4545]/30 flex items-center justify-center text-[#FF4545] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5]">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.action}
                className="px-4 py-2 text-xs font-bold bg-[#FF4545] hover:bg-[#ff5c5c] text-white rounded-lg transition-colors"
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
