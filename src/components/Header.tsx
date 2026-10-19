import React, { useState } from 'react';
import { useWorkshopCloud } from '../context/WorkshopCloudContext';
import { ScreenId } from '../types';

interface HeaderProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeScreen, onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isCloudConnected, syncStatusText, signIn, logOut } = useWorkshopCloud();

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-dim/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
        <div className="max-w-2xl mx-auto h-20 px-margin flex items-center justify-between gap-space-sm">
          <button
            type="button"
            onClick={() => onNavigate('optimizador-2d')}
            className="flex items-center gap-space-sm min-w-0 text-left focus:outline-none"
          >
            <img
              alt="Muebles J&L Monogram Logo"
              referrerPolicy="no-referrer"
              className="h-8 w-auto object-contain shrink-0 rounded-lg"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WU5lkICCmUpQpNnxj-vpo1r6m5VBDg5NuihUG-e2MUBnHQ6s-AhqdQveDSJB3wiLGsdrNQwLdmkwIByW9kuYL0-NrUyrY57PGgsW0ZsV9QQFClumQNcqi7l4EYmcO2CGoFKbzpni9YZXFBs0NDeq_RT2bO6XllX6PuPYOZH8hdszEK2oAht3yoefbyCCr3AEls1DbQ1DA1JIRW20413hJwqXfFF9YBRNF5STouE8qHVN2O-jp0CIrzan9M"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-title-sm text-title-sm text-on-surface font-bold tracking-tight truncate">
                  Muebles J&amp;L
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high/90 text-on-surface-variant font-label-md text-[10px] tracking-wide uppercase shrink-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCloudConnected ? 'bg-tertiary animate-pulse' : 'bg-primary'
                    }`}
                  ></span>
                  {isCloudConnected ? 'NUBE FIREBASE • Villa Luzuriaga' : 'TALLER ACTIVO • Villa Luzuriaga'}
                </span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-space-xs shrink-0">
            <button
              type="button"
              onClick={async () => {
                if (!user) {
                  try {
                    await signIn();
                  } catch {
                    setShowProfile(true);
                  }
                } else {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }
              }}
              className={`h-9 px-3 rounded-full flex items-center gap-1.5 text-[11px] font-semibold transition-all active:scale-95 ${
                isCloudConnected
                  ? 'bg-tertiary/15 text-tertiary border border-tertiary/30'
                  : 'bg-primary-container/20 text-primary border border-primary/30 hover:bg-primary-container/30'
              }`}
              title={syncStatusText}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isCloudConnected ? 'cloud_done' : 'cloud_sync'}
              </span>
              <span className="hidden sm:inline">
                {isCloudConnected ? 'Sincronizado' : 'Conectar Nube'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              aria-label="Notificaciones de taller"
              className="relative w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all bg-surface-container/60"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-tertiary"></span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              aria-label="Perfil de operador"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 active:scale-95 transition-transform overflow-hidden"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Usuario'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Popover */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-22 px-4"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface-container-high p-4 shadow-2xl border border-outline-variant/30 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                <span className="font-title-sm text-title-sm font-bold text-on-surface">Alertas de Taller J&amp;L</span>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate('pedidos');
                  setShowNotifications(false);
                }}
                className="p-3 rounded-2xl bg-surface-container hover:bg-surface-bright text-left flex items-start gap-3 transition-colors"
              >
                <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">local_shipping</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-body-md font-semibold text-on-surface">Despacho Inminente #PED-1084</span>
                  <span className="text-label-md text-on-surface-variant">Estudio Arq. Rossi • Mañana 10:30 hs (Ramos Mejía)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('inventario');
                  setShowNotifications(false);
                }}
                className="p-3 rounded-2xl bg-surface-container hover:bg-surface-bright text-left flex items-start gap-3 transition-colors"
              >
                <span className="material-symbols-outlined text-error text-[20px] mt-0.5">warning</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-body-md font-semibold text-on-surface">3 Insumos en Quiebre de Stock</span>
                  <span className="text-label-md text-on-surface-variant">Cantos Roble Dakar 22mm, Tornillos 7x50 y Mezzo 18mm</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('optimizador-2d');
                  setShowNotifications(false);
                }}
                className="p-3 rounded-2xl bg-surface-container hover:bg-surface-bright text-left flex items-start gap-3 transition-colors"
              >
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">precision_manufacturing</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-body-md font-semibold text-on-surface">Optimizador Guillotina al 88.4%</span>
                  <span className="text-label-md text-on-surface-variant">14/14 cortes ubicados en Placa Carvalho Mezzo 18mm</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operator Profile & Firebase Cloud Popover */}
      {showProfile && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-22 px-4"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface-container-high p-4 shadow-2xl border border-outline-variant/30 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-title-sm overflow-hidden">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Usuario'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    'JL'
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-title-sm text-title-sm font-bold text-on-surface">
                    {user?.displayName || 'Leandro Llanes • J&L'}
                  </span>
                  <span className="text-label-md text-on-surface-variant">
                    {user?.email || 'Maestro Carpintero & Admin • Villa Luzuriaga'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Cloud Sync Status Card */}
            <div className="p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isCloudConnected ? 'text-tertiary' : 'text-primary'
                  }`}
                >
                  {isCloudConnected ? 'cloud_done' : 'cloud_off'}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-label-md font-bold text-on-surface truncate">
                    {syncStatusText}
                  </span>
                  <span className="text-[11px] text-on-surface-variant truncate">
                    {isCloudConnected
                      ? 'Cortes, pedidos, stock y caja sincronizados en tiempo real'
                      : 'Inicia sesión con Google para sincronizar dispositivos'}
                  </span>
                </div>
              </div>
              {user ? (
                <button
                  type="button"
                  onClick={() => logOut()}
                  className="px-3 py-1.5 rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-on-surface text-label-md font-semibold shrink-0"
                >
                  Salir
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-label-md font-bold shrink-0"
                >
                  Conectar Google
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-2xl bg-surface-container flex flex-col">
                <span className="text-[10px] uppercase text-on-surface-variant">Sucursal Base</span>
                <span className="text-body-md font-semibold text-on-surface mt-0.5">Garibaldi y Triunvirato</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-surface-container flex flex-col">
                <span className="text-[10px] uppercase text-on-surface-variant">Estado Sierra Escuadradora</span>
                <span className="text-body-md font-semibold text-primary mt-0.5">3.2 mm • Calibrada</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(
                [
                  { id: 'optimizador-2d', label: 'Optimizador 2D', icon: 'grid_view' },
                  { id: 'pedidos', label: 'Pedidos & Ventas', icon: 'receipt_long' },
                  { id: 'inventario', label: 'Inventario', icon: 'inventory_2' },
                  { id: 'catalogo-3d', label: 'Catálogo 3D', icon: 'view_in_ar' },
                  { id: 'finanzas', label: 'Finanzas & Caja', icon: 'payments' },
                  { id: 'fletes-y-gps', label: 'Logística GPS', icon: 'local_shipping' },
                ] as { id: ScreenId; label: string; icon: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setShowProfile(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-label-md flex items-center gap-1.5 transition-all ${
                    activeScreen === item.id
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
