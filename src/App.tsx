/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { StoreNavbar } from './components/store/StoreNavbar';
import { StoreFooter } from './components/store/StoreFooter';
import { CartDrawer } from './components/store/CartDrawer';
import { ToastNotification } from './components/store/ToastNotification';
import { ProductDetailModal } from './components/common/ProductDetailModal';
import { InventoryGridModal } from './components/common/InventoryGridModal';

import { HomeView } from './views/store/HomeView';
import { CatalogView } from './views/store/CatalogView';
import { CheckoutView } from './views/store/CheckoutView';
import { OrderLookupView } from './views/store/OrderLookupView';
import { HelpView } from './views/store/HelpView';
import { TermsView } from './views/store/TermsView';

import { AdminLoginView } from './views/admin/AdminLoginView';
import { AdminLayout } from './views/admin/AdminLayout';
import { Product } from './types/store';

function StoreAppContent() {
  const {
    route,
    setRoute,
    currentAdmin,
    activeDetailProduct,
    setActiveDetailProduct,
    activeInventoryKit,
    setActiveInventoryKit,
  } = useStore();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // If user navigates to admin routes
  if (route === 'admin-login') {
    return <AdminLoginView />;
  }

  if (route === 'admin') {
    // If not logged in, prompt login
    if (!currentAdmin) {
      return <AdminLoginView />;
    }
    return <AdminLayout />;
  }

  const handleViewDetails = (prod: Product) => {
    setActiveDetailProduct(prod);
  };

  const handleViewKit = (prod: Product) => {
    if (prod.kitItems && prod.kitItems.length > 0) {
      setActiveInventoryKit({
        title: prod.kitIncludedName || `Inventario de ${prod.name}`,
        badge: prod.badge,
        items: prod.kitItems,
      });
    } else {
      setActiveDetailProduct(prod);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between selection:bg-[#D4AF37]/30 selection:text-[#FFD700]">
      {/* Navigation Bar */}
      <StoreNavbar onOpenCart={() => setCartDrawerOpen(true)} />

      {/* Main Public Store Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {route === 'home' && (
          <HomeView
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'catalog' && (
          <CatalogView
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'oneblock' && (
          <CatalogView
            presetModality="oneblock"
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'lifesteal' && (
          <CatalogView
            presetModality="lifesteal"
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'global' && (
          <CatalogView
            presetModality="global"
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'ranks' && (
          <CatalogView
            presetCategory="ranks"
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'upgrades' && (
          <CatalogView
            presetCategory="upgrades"
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'kits' && (
          <CatalogView
            presetCategory="kits"
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'extras' && (
          <CatalogView
            presetModality="oneblock"
            presetCategory="tools"
            onViewDetails={handleViewDetails}
            onViewKit={handleViewKit}
          />
        )}

        {route === 'cart' && (
          <div className="max-w-2xl mx-auto py-8">
            {/* Direct view of cart drawer if user visits #cart */}
            <div className="bg-[#101010] p-6 rounded-2xl border border-[#252525]">
              <h2 className="text-xl font-bold font-cinzel mb-4">Carrito de Compras</h2>
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="px-4 py-2 bg-[#D4AF37] text-[#050505] font-bold rounded-lg text-xs"
              >
                Abrir Carrito Lateral
              </button>
            </div>
          </div>
        )}

        {route === 'checkout' && <CheckoutView />}

        {route === 'order-lookup' && <OrderLookupView />}

        {route === 'help' && <HelpView />}

        {(route === 'terms' || route === 'privacy') && <TermsView />}
      </main>

      {/* Footer */}
      <StoreFooter />

      {/* Modals & Overlays */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />

      <ToastNotification />

      <ProductDetailModal
        product={activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        onOpenInventoryKit={(kit) => {
          setActiveDetailProduct(null);
          setActiveInventoryKit(kit);
        }}
      />

      {activeInventoryKit && (
        <InventoryGridModal
          isOpen={!!activeInventoryKit}
          onClose={() => setActiveInventoryKit(null)}
          title={activeInventoryKit.title}
          badge={activeInventoryKit.badge}
          items={activeInventoryKit.items}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreAppContent />
    </StoreProvider>
  );
}
