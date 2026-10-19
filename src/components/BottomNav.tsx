import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'optimizador-2d', label: 'Optimizador 2D', icon: 'grid_view' },
  { id: 'pedidos', label: 'Pedidos', icon: 'receipt_long' },
  { id: 'inventario', label: 'Inventario', icon: 'inventory_2' },
  { id: 'catalogo', label: 'Catálogo', icon: 'list_alt' },
  { id: 'catalogo-3d', label: 'Modelo 3D', icon: 'view_in_ar' },
  { id: 'finanzas', label: 'Finanzas', icon: 'payments' },
  { id: 'fletes-y-gps', label: 'Fletes & Rutas', icon: 'local_shipping' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 w-full z-50 pointer-events-none pb-safe px-margin mb-3">
      <nav
        aria-label="Navegación principal del taller"
        className="pointer-events-auto mx-auto max-w-xl bg-surface-container-low/90 backdrop-blur-2xl rounded-full p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.65)] border border-white/5 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3.5 h-11 rounded-full shrink-0 text-label-md transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-[0_4px_16px_rgba(102,76,255,0.4)] font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
