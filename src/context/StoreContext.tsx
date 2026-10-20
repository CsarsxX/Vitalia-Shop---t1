import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Coupon, 
  Order, 
  AdminUser, 
  AuditLog, 
  StoreSettings, 
  Modality 
} from '../types/store';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_SETTINGS, 
  INITIAL_COUPONS, 
  INITIAL_ORDERS,
  INITIAL_ADMIN_USERS,
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export type StoreRoute = 
  | 'home'
  | 'catalog'
  | 'oneblock'
  | 'lifesteal'
  | 'global'
  | 'ranks'
  | 'upgrades'
  | 'kits'
  | 'extras'
  | 'cart'
  | 'checkout'
  | 'order-lookup'
  | 'help'
  | 'terms'
  | 'privacy'
  | 'admin-login'
  | 'admin';

export interface ToastInfo {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface StoreContextType {
  // Navigation
  route: StoreRoute;
  setRoute: (r: StoreRoute) => void;
  // Products
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  // Discounts
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  discountAmount: number;
  finalTotalUSD: number;
  finalTotalPEN: number;
  // Orders
  orders: Order[];
  createOrder: (orderData: {
    mcUsername: string;
    email: string;
    modality: Modality;
    paymentMethod: 'yape' | 'plin' | 'paypal';
    referenceCode?: string;
  }) => Order;
  updateOrderStatus: (
    orderId: string, 
    paymentStatus: Order['paymentStatus'], 
    deliveryStatus: Order['deliveryStatus'], 
    notes?: string
  ) => void;
  deleteOrder: (orderId: string) => void;
  // Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  // Admin & Security
  adminUsers: AdminUser[];
  currentAdmin: AdminUser | null;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  addAdminUser: (user: AdminUser) => void;
  updateAdminUser: (user: AdminUser) => void;
  deleteAdminUser: (userId: string) => void;
  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, targetResource: string, details: string, result?: 'success' | 'warning' | 'error') => void;
  // Toasts
  toasts: ToastInfo[];
  showToast: (title: string, description: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;
  // Active modal details
  activeDetailProduct: Product | null;
  setActiveDetailProduct: (p: Product | null) => void;
  activeInventoryKit: { title: string; badge?: string; items: any[] } | null;
  setActiveInventoryKit: (k: { title: string; badge?: string; items: any[] } | null) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRouteState] = useState<StoreRoute>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const deleted: string[] = JSON.parse(localStorage.getItem('vitalia_deleted_orders') || '[]');
      const saved = localStorage.getItem('vitalia_orders');
      if (saved) {
        const parsed = JSON.parse(saved) as Order[];
        return parsed.filter(o => !deleted.includes(o.id));
      }
      return INITIAL_ORDERS.filter(o => !deleted.includes(o.id));
    } catch {
      return INITIAL_ORDERS;
    }
  });
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [activeInventoryKit, setActiveInventoryKit] = useState<{ title: string; badge?: string; items: any[] } | null>(null);

  useEffect(() => {
    // Orders listener from Firestore
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      let deletedIds: string[] = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem('vitalia_deleted_orders') || '[]');
      } catch {
        deletedIds = [];
      }

      if (!snapshot.empty) {
        const ordersData = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as Order;
          return {
            ...data,
            id: data.id || docSnap.id,
            _docId: docSnap.id,
          };
        });

        // Filter out any order that has been explicitly deleted
        const activeOrders = ordersData.filter(o => !deletedIds.includes(o.id) && !deletedIds.includes((o as any)._docId));
        activeOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(activeOrders);
        try {
          localStorage.setItem('vitalia_orders', JSON.stringify(activeOrders));
        } catch {}
      } else {
        // If Firestore is empty on very first store boot, seed once if not initialized
        const hasInitialized = localStorage.getItem('vitalia_store_initialized');
        if (!hasInitialized) {
          localStorage.setItem('vitalia_store_initialized', 'true');
          const cleanInitial = INITIAL_ORDERS.filter(o => !deletedIds.includes(o.id));
          cleanInitial.forEach(order => {
            setDoc(doc(db, 'orders', order.id), order).catch(() => {});
          });
          setOrders(cleanInitial);
          try {
            localStorage.setItem('vitalia_orders', JSON.stringify(cleanInitial));
          } catch {}
        } else {
          // If already initialized and Firestore collection is empty, keep empty! Do not resurrect!
          setOrders([]);
          try {
            localStorage.setItem('vitalia_orders', JSON.stringify([]));
          } catch {}
        }
      }
    }, (error) => {
      console.warn('Firestore onSnapshot notice:', error);
    });
    
    return () => {
      unsubscribeOrders();
    };
  }, []);

  // Sync route with browser hash for intuitive back/forward navigation
  const setRoute = (r: StoreRoute) => {
    setRouteState(r);
    window.location.hash = r;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as StoreRoute;
      if (hash && [
        'home', 'catalog', 'oneblock', 'lifesteal', 'global', 'ranks', 'upgrades', 'kits', 'extras', 
        'cart', 'checkout', 'order-lookup', 'help', 'terms', 'privacy', 
        'admin-login', 'admin'
      ].includes(hash)) {
        setRouteState(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const showToast = (title: string, description: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (action: string, targetResource: string, details: string, result: 'success' | 'warning' | 'error' = 'success') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      adminName: currentAdmin?.name || 'Administrador',
      action,
      targetResource,
      details,
      result,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Products update
  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    addAuditLog('Actualización de Producto', updated.name, `Precio: ${updated.price ? '$' + updated.price : 'Pendiente'}`);
    showToast('Producto actualizado', `Se han guardado los cambios en ${updated.name}`, 'success');
  };

  const addProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
    addAuditLog('Creación de Producto', newProd.name, `Categoría: ${newProd.category}`);
    showToast('Producto creado', `${newProd.name} añadido al catálogo`, 'success');
  };

  // Cart operations
  const addToCart = (product: Product): { success: boolean; message?: string } => {
    if (product.price === null) {
      showToast('Producto no disponible', 'Este artículo aún está pendiente de configuración de precio por la administración.', 'warning');
      return { success: false, message: 'Precio no configurado' };
    }

    // Check if unique product (ranks, tools) is already in cart
    const isUnique = product.category === 'ranks' || product.category === 'upgrades' || product.toolType === 'pack';
    const existing = cart.find(item => item.product.id === product.id);

    if (existing && isUnique) {
      showToast('Artículo único', `${product.name} ya está en tu carrito. Los rangos y mejoras no son acumulables múltiples veces.`, 'warning');
      return { success: false, message: 'Producto único ya presente' };
    }

    // Check if user is adding individual tool when they already have the bundle pack
    if (product.id === 'tool-pickaxe-3x3' || product.id === 'tool-axe-3x3') {
      const hasPack = cart.some(item => item.product.id === 'bundle-pack-3x3');
      if (hasPack) {
        showToast('Aviso de Paquete', 'Ya tienes el Pack 3x3 en tu carrito, el cual ya incluye esta herramienta con descuento.', 'info');
      }
    }

    // Check if adding pack when individual tools already exist
    if (product.id === 'bundle-pack-3x3') {
      const hasTool = cart.some(item => item.product.id === 'tool-pickaxe-3x3' || item.product.id === 'tool-axe-3x3');
      if (hasTool) {
        showToast('Pack Ahorro agregado', 'Nota: Ya tenías herramientas 3x3 individuales en tu carrito. Te sugerimos revisar tu carrito para evitar duplicados.', 'info');
      }
    }

    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });

    showToast('Producto añadido', `${product.name} se agregó a tu carrito de compras`, 'success');
    return { success: true };
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Producto eliminado', 'El artículo fue retirado del carrito', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price || 0) * item.quantity, 0);

  // Coupon calculations
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      showToast('Cupón no válido', 'El código ingresado no existe o no se encuentra activo.', 'error');
      return { success: false, message: 'Código no válido' };
    }

    if (found.usedCount >= found.maxUses) {
      showToast('Cupón agotado', 'Este código ha alcanzado el límite máximo de usos permitidos.', 'error');
      return { success: false, message: 'Límite de usos alcanzado' };
    }

    if (found.minSpend && cartSubtotal < found.minSpend) {
      showToast('Monto insuficiente', `Este cupón requiere una compra mínima de $${found.minSpend.toFixed(2)} USD.`, 'warning');
      return { success: false, message: `Mínimo de compra $${found.minSpend}` };
    }

    // Check modality restriction if any
    if (found.applicableModality && found.applicableModality !== 'global') {
      const hasMatchingItem = cart.some(item => item.product.modality === found.applicableModality);
      if (!hasMatchingItem) {
        showToast('Modalidad no aplicable', `Este cupón solo es válido para artículos de la modalidad ${found.applicableModality.toUpperCase()}.`, 'warning');
        return { success: false, message: 'Modalidad no coincide' };
      }
    }

    setActiveCoupon(found);
    showToast('Cupón aplicado', `Descuento ${found.type === 'percentage' ? found.value + '%' : '$' + found.value.toFixed(2)} activado con éxito.`, 'success');
    return { success: true, message: 'Cupón aplicado con éxito' };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('Cupón removido', 'Se ha retirado el cupón de descuento.', 'info');
  };

  const createCoupon = (c: Coupon) => {
    setCoupons(prev => [c, ...prev]);
    addAuditLog('Creación de Cupón', c.code, `Tipo: ${c.type}, Valor: ${c.value}`);
    showToast('Cupón creado', `Código ${c.code} registrado correctamente`, 'success');
  };

  const updateCoupon = (c: Coupon) => {
    setCoupons(prev => prev.map(item => item.code === c.code ? c : item));
    addAuditLog('Modificación de Cupón', c.code, `Activo: ${c.isActive ? 'Sí' : 'No'}`);
    showToast('Cupón actualizado', `Cambios guardados en ${c.code}`, 'success');
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    if (activeCoupon?.code === code) setActiveCoupon(null);
    addAuditLog('Eliminación de Cupón', code, 'Cupón eliminado del sistema', 'warning');
    showToast('Cupón eliminado', `El cupón ${code} ha sido borrado`, 'info');
  };

  // Discount calculation
  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.type === 'percentage') {
      discountAmount = (cartSubtotal * activeCoupon.value) / 100;
    } else {
      discountAmount = Math.min(activeCoupon.value, cartSubtotal);
    }
  }

  const finalTotalUSD = Math.max(0, cartSubtotal - discountAmount);
  const finalTotalPEN = finalTotalUSD * settings.exchangeRateUSD_PEN;

  // Order creation
  const createOrder = (orderData: {
    mcUsername: string;
    email: string;
    modality: Modality;
    paymentMethod: 'yape' | 'plin' | 'paypal';
    referenceCode?: string;
  }): Order => {
    const orderId = `VT-${Math.floor(10000 + Math.random() * 90000)}`;
    const refCode = orderData.referenceCode || `${orderData.paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      referenceCode: refCode,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      mcUsername: orderData.mcUsername,
      email: orderData.email,
      modality: orderData.modality,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        unitPrice: item.product.price || 0,
        quantity: item.quantity,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      total: finalTotalUSD,
      totalPEN: finalTotalPEN,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'under_review',
      deliveryStatus: 'pending',
      assignedAdmin: 'Por asignar',
      internalNotes: `Pedido registrado mediante ${orderData.paymentMethod.toUpperCase()}. En espera de confirmación de comprobante bancario.`,
      timeline: [
        { step: 'Pedido creado', timestamp: new Date().toLocaleTimeString(), description: 'El comprador generó la orden de compra.', completed: true },
        { step: 'Pago notificado', timestamp: new Date().toLocaleTimeString(), description: `Comprador notificó abono mediante ${orderData.paymentMethod.toUpperCase()}.`, completed: true },
        { step: 'Pago en revisión', timestamp: new Date().toLocaleTimeString(), description: 'Comprobante y referencia en cola de validación administrativa.', completed: true },
        { step: 'Pago confirmado', timestamp: '-', description: 'Aprobación bancaria pendiente.', completed: false },
        { step: 'Entrega pendiente', timestamp: '-', description: 'En espera de despacho al servidor.', completed: false },
        { step: 'Entregado', timestamp: '-', description: 'Activación completada.', completed: false },
      ],
    };

    // Optimistically update local state immediately
    const updatedOrdersList = [newOrder, ...orders.filter(o => o.id !== newOrder.id)];
    setOrders(updatedOrdersList);
    try {
      localStorage.setItem('vitalia_orders', JSON.stringify(updatedOrdersList));
    } catch {}

    // Save to Firestore using orderId as the document ID
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(err => {
      console.warn('Notice saving order to Firestore:', err);
    });

    // Increment coupon used count if applicable
    if (activeCoupon) {
      setCoupons(prev => prev.map(c => c.code === activeCoupon.code ? { ...c, usedCount: c.usedCount + 1 } : c));
    }

    addAuditLog('Nuevo Pedido Registrado', newOrder.id, `Usuario: ${newOrder.mcUsername}, Total: $${newOrder.total.toFixed(2)} USD (S/ ${newOrder.totalPEN.toFixed(2)})`);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    paymentStatus: Order['paymentStatus'], 
    deliveryStatus: Order['deliveryStatus'], 
    notes?: string
  ) => {
    const targetOrder = orders.find(ord => ord.id === orderId);

    const updatedTimeline = targetOrder?.timeline.map(event => {
      if (event.step === 'Pago confirmado' && (paymentStatus === 'confirmed' || paymentStatus === 'rejected')) {
        return {
          ...event,
          completed: paymentStatus === 'confirmed',
          description: paymentStatus === 'confirmed' ? 'Pago verificado por administración.' : 'Pago rechazado.',
          timestamp: new Date().toLocaleTimeString(),
        };
      }
      if (event.step === 'Entrega pendiente' && paymentStatus === 'confirmed') {
        return { ...event, completed: true, timestamp: new Date().toLocaleTimeString() };
      }
      if (event.step === 'Entregado' && deliveryStatus === 'delivered') {
        return {
          ...event,
          completed: true,
          description: 'Objetos y permisos entregados en el servidor.',
          timestamp: new Date().toLocaleTimeString(),
        };
      }
      return event;
    }) || [];

    const updatedFields = {
      paymentStatus,
      deliveryStatus,
      internalNotes: notes || targetOrder?.internalNotes || 'Actualizado por administración.',
      assignedAdmin: currentAdmin?.name || targetOrder?.assignedAdmin || 'Administración',
      timeline: updatedTimeline,
    };

    // Optimistic local state update
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, ...updatedFields } : ord);
    setOrders(updated);
    try {
      localStorage.setItem('vitalia_orders', JSON.stringify(updated));
    } catch {}

    // Update in Firestore
    const firestoreId = (targetOrder as any)?._docId || orderId;
    updateDoc(doc(db, 'orders', firestoreId), updatedFields).catch(err => {
      console.warn('Notice updating order in Firestore:', err);
    });
    if (firestoreId !== orderId) {
      updateDoc(doc(db, 'orders', orderId), updatedFields).catch(() => {});
    }

    addAuditLog('Actualización de Pedido', orderId, `Estado Pago: ${paymentStatus}, Entrega: ${deliveryStatus}`);
    showToast('Pedido actualizado', `Se actualizaron los estados del pedido ${orderId}`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    const toDelete = orders.find(o => o.id === orderId);
    const firestoreId = (toDelete as any)?._docId || orderId;
    
    // 1. Permanently register in deleted IDs blacklist
    try {
      const deleted: string[] = JSON.parse(localStorage.getItem('vitalia_deleted_orders') || '[]');
      if (!deleted.includes(orderId)) deleted.push(orderId);
      if (firestoreId && !deleted.includes(firestoreId)) deleted.push(firestoreId);
      localStorage.setItem('vitalia_deleted_orders', JSON.stringify(deleted));
    } catch {}

    // 2. Optimistic local state update
    const updated = orders.filter(o => o.id !== orderId && (o as any)._docId !== orderId);
    setOrders(updated);
    try {
      localStorage.setItem('vitalia_orders', JSON.stringify(updated));
    } catch {}

    // 3. Delete in Firestore
    deleteDoc(doc(db, 'orders', firestoreId)).catch(err => {
      console.warn('Notice deleting order from Firestore:', err);
    });
    if (firestoreId !== orderId) {
      deleteDoc(doc(db, 'orders', orderId)).catch(() => {});
    }

    addAuditLog('Eliminación de Pedido', orderId, `Pedido de ${toDelete?.mcUsername || 'Desconocido'} eliminado por administración`, 'warning');
    showToast('Pedido eliminado', `La orden ${orderId} fue retirada de los registros`, 'info');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('Configuración Actualizada', 'Sistema General', 'Modificación de parámetros generales');
    showToast('Ajustes guardados', 'Los parámetros de la tienda se actualizaron con éxito', 'success');
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    const found = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);
    
    // Check for the specific master password
    if (found && pass === '2026-vitalia-network-wazita-@@@') {
      setCurrentAdmin(found);
      addAuditLog('Inicio de Sesión', 'Panel Administrativo', `Acceso autorizado para ${found.name} (${found.role})`);
      showToast('Bienvenido al Panel', `Sesión iniciada como ${found.name}`, 'success');
      return true;
    }
    
    showToast('Error de autenticación', 'Credenciales incorrectas', 'error');
    return false;
  };

  const logoutAdmin = () => {
    if (currentAdmin) {
      addAuditLog('Cierre de Sesión', 'Panel Administrativo', `Sesión finalizada por ${currentAdmin.name}`);
    }
    setCurrentAdmin(null);
    setRoute('admin-login');
    showToast('Sesión cerrada', 'Has salido del panel de administración', 'info');
  };

  const addAdminUser = (u: AdminUser) => {
    setAdminUsers(prev => [...prev, u]);
    addAuditLog('Alta de Administrador', u.email, `Rol asignado: ${u.role}`);
    showToast('Usuario creado', `Se ha registrado al usuario ${u.name}`, 'success');
  };

  const updateAdminUser = (u: AdminUser) => {
    setAdminUsers(prev => prev.map(item => item.id === u.id ? u : item));
    addAuditLog('Modificación de Usuario', u.email, `Estado: ${u.isActive ? 'Activo' : 'Inactivo'}, Rol: ${u.role}`);
    showToast('Usuario actualizado', `Cambios guardados para ${u.name}`, 'success');
  };

  const deleteAdminUser = (userId: string) => {
    const target = adminUsers.find(u => u.id === userId);
    if (target?.role === 'SUPER_ADMIN' && adminUsers.filter(u => u.role === 'SUPER_ADMIN').length <= 1) {
      showToast('Acción denegada', 'No puedes eliminar al único Super Administrador del sistema.', 'error');
      return;
    }
    setAdminUsers(prev => prev.filter(u => u.id !== userId));
    addAuditLog('Baja de Administrador', target?.email || userId, `Cuenta eliminada por ${currentAdmin?.name}`, 'warning');
    showToast('Usuario eliminado', `La cuenta de ${target?.name || 'Administrador'} ha sido dada de baja`, 'info');
  };

  return (
    <StoreContext.Provider value={{
      route,
      setRoute,
      products,
      updateProduct,
      addProduct,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotalCount,
      cartSubtotal,
      coupons,
      activeCoupon,
      applyCoupon,
      removeCoupon,
      createCoupon,
      updateCoupon,
      deleteCoupon,
      discountAmount,
      finalTotalUSD,
      finalTotalPEN,
      orders,
      createOrder,
      updateOrderStatus,
      deleteOrder,
      settings,
      updateSettings,
      adminUsers,
      currentAdmin,
      loginAdmin,
      logoutAdmin,
      addAdminUser,
      updateAdminUser,
      deleteAdminUser,
      auditLogs,
      addAuditLog,
      toasts,
      showToast,
      dismissToast,
      activeDetailProduct,
      setActiveDetailProduct,
      activeInventoryKit,
      setActiveInventoryKit,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
