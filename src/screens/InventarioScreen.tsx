import React, { useState } from 'react';

type CategoryId = 'all' | 'placas' | 'cantos' | 'herrajes' | 'insumos';

interface InventoryItem {
  id: string;
  cat: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  specLabel: string;
  cornerTag: string;
  title: string;
  priceLabel: string;
  image: string;
  stock: number;
  minSuggested: number;
  unit: string;
  statusType: 'bajo' | 'critico' | 'normal' | 'optimo';
  urgentButtonLabel?: string;
  urgentButtonIcon?: string;
}

const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: '1',
    cat: 'placas',
    categoryLabel: 'Placas',
    specLabel: '• Faplac 2.75x1.83m',
    cornerTag: '18mm',
    title: 'Placa Carvalho Mezzo 18mm',
    priceLabel: '$48.200 / unidad',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFMD6KDHidiQNMT-Psf0lI6Numt03rT3fKTyWWb8zH2Ei3z5XLeViyRzbhQeNMoUYgT4PQJxwJ8zC-SjUlBETOFXtzn_f5mXGrXAz9eaPQkSkiNkQ440n117Ok8EWRT4Uoi3mcswFiZ7_j0M8x9xio5PSXHNeoGkzoIOGDeQZRekRV9vjNjij-UgSbs4fm0QsIHGzd3_MBPYXjO26VOepZpkqgmF61Yr_L0YbLR9r8iofyHJhR9lUeFg',
    stock: 4,
    minSuggested: 6,
    unit: 'un',
    statusType: 'bajo',
  },
  {
    id: '2',
    cat: 'cantos',
    categoryLabel: 'Cantos PVC',
    specLabel: '• Rollo 0.45mm',
    cornerTag: '22mm',
    title: 'Cantos Roble Dakar 22mm',
    priceLabel: '$340 / metro lineal',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCS4ZH1ozdXNYTx6M0HdWyhx6KSavd6M3pDhlOH-zW7OtMLQQm_jJlYOSGEksAzUXs-x-fKB7IzVJoYvOmM0cT1V4eKjgw5SEiA_UvVYWueD7YR1FlaTn6FnFcvB5UC0oeDBCCH-1I2Uf6xcZyfhyHc5HyBOwlUgRPypBhjkr0zqS6PLASZmZ6QO0bYwmir-vIlUVkwzL2rnpOLkudRQh8zrjLVEhm8JjeeKEwze8Zml2KPvPLSlYcTVw',
    stock: 18,
    minSuggested: 50,
    unit: 'm',
    statusType: 'critico',
    urgentButtonLabel: 'Pedir a Distribuidor',
    urgentButtonIcon: 'shopping_cart_checkout',
  },
  {
    id: '3',
    cat: 'herrajes',
    categoryLabel: 'Herrajes',
    specLabel: '• Cierre Suave',
    cornerTag: '45cm',
    title: 'Correderas Telescópicas 45cm',
    priceLabel: '$9.800 / par (Ducasse)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWseLanin0qi4PIzEP4YX0sBD9gJOJRwvSoBi0alVDON-IoF6brolPwujCL15SjmlbrSOL2hxXtF6xuUruPITn_jizhiAwtXlLr2ojcCXx3q0sAGTtZNOVbsSjfaz8TMzQUcyoXU44oIijEphHb43O66kf3pWHCI8OSULki_r20WBrNgCRgiNZD70cIUxhgAeeMFWC0zMtQxo_2khQqI52SXiTiDGjARLUNNNq3qfEW_v6vE3QxpqdJQ',
    stock: 14,
    minSuggested: 10,
    unit: 'pares',
    statusType: 'normal',
  },
  {
    id: '4',
    cat: 'insumos',
    categoryLabel: 'Insumos',
    specLabel: '• Allen Zincado',
    cornerTag: '7x50',
    title: 'Tornillos Soberbios 7x50mm',
    priceLabel: '$18.500 / caja 500u',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBM_72jvNxrexmCLHbBYCSwtcc9W1A_e5CodiRG45Yh-8Ox3ynl9GihuCLx2F9R64dWIjBTrWnAkpPzGZNCPmw2BCm-KmHBrQAhHLKIGFkD0YgwNs2jUwAw0CKsDtF91OVY75C2th8Dn4a-U9kAODrHlLhf13n0_1MkXPHMwfGFAi8MMuDUlOY_Q-6KiCfqRZ2KWwTSb1v8EsNgYrocC48jViUegUrUGTT-oOpa6v7_O2ZpsihvyPyAEw',
    stock: 120,
    minSuggested: 500,
    unit: 'un',
    statusType: 'critico',
    urgentButtonLabel: 'Reponer Caja',
    urgentButtonIcon: 'inventory',
  },
  {
    id: '5',
    cat: 'placas',
    categoryLabel: 'Placas',
    specLabel: '• Guillermina 2.75x1.83',
    cornerTag: '18mm',
    title: 'Placa Blanco Puro 18mm',
    priceLabel: '$39.400 / unidad',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbJfWRGRZRXR_2KeD0RB06XQmSnbnlQZinziKIQXOjOA3MUNi8bJbevEXlcvA4wK4HDWE-gWnBlcBTNwIwmHSPEBYwyPeWAz50XqWwrVk_S6b21Uv0duJi-ynVzBdldRFvqhsypoUk9A6z3TWblh8m3LO2lQ8P-9-9E3ZfjQGy124IZpU-uhmwQs-L7VJtw94ElvcuRaNdv4IGNLmYyDgusxNQLy2UgfIVqGNvC1n3juoEjOQD6z-v7A',
    stock: 8,
    minSuggested: 4,
    unit: 'un',
    statusType: 'optimo',
  },
];

export const InventarioScreen: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Item Form State
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'Placas' | 'Cantos PVC' | 'Herrajes' | 'Insumos'>('Placas');
  const [newUnit, setNewUnit] = useState('un');
  const [newStock, setNewStock] = useState(1);
  const [newMin, setNewMin] = useState(5);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  const adjustStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStock = Math.max(0, item.stock + delta);
        showToast(
          delta > 0 ? `Cantidad sumada: ${nextStock}` : `Cantidad restada: ${nextStock}`
        );
        return { ...item, stock: nextStock };
      })
    );
  };

  const handleSaveNewItem = () => {
    if (!newName.trim()) {
      showToast('Ingresa el nombre del material');
      return;
    }
    const catMap: Record<string, Exclude<CategoryId, 'all'>> = {
      Placas: 'placas',
      'Cantos PVC': 'cantos',
      Herrajes: 'herrajes',
      Insumos: 'insumos',
    };
    const created: InventoryItem = {
      id: String(Date.now()),
      cat: catMap[newCat] || 'placas',
      categoryLabel: newCat,
      specLabel: '• Ingreso Manual',
      cornerTag: '18mm',
      title: newName.trim(),
      priceLabel: '$42.000 / unidad',
      image: INITIAL_ITEMS[0].image,
      stock: Number(newStock) || 1,
      minSuggested: Number(newMin) || 5,
      unit: newUnit,
      statusType: Number(newStock) < Number(newMin) ? 'bajo' : 'optimo',
    };
    setItems([created, ...items]);
    setNewName('');
    setShowNewItemModal(false);
    showToast('Material guardado en inventario');
  };

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.cat === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrit =
      !onlyCritical || item.statusType === 'critico' || item.statusType === 'bajo';
    return matchesCat && matchesSearch && matchesCrit;
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 gap-space-md">
      {/* Operational Header Stats & Title */}
      <div className="flex flex-col gap-space-xs mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">warehouse</span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
              Inventario de Taller
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
            <span className="font-telemetry-unit text-telemetry-unit text-on-surface-variant font-semibold">
              ACTUALIZADO HOY
            </span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Gestión de placas, cantos, herrajes e insumos en tiempo real.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-space-sm bg-surface-container p-space-md rounded-2xl shadow-sm">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-10 rounded-full bg-surface-container-high text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/60 focus:outline-none focus:bg-surface-container-highest transition-all"
            placeholder="Buscar por código, placa, espesor, marca..."
            type="text"
          />
          <button
            type="button"
            onClick={() => {
              setOnlyCritical(!onlyCritical);
              showToast(
                !onlyCritical ? 'Filtrando ítems críticos / bajos' : 'Mostrando todos los ítems'
              );
            }}
            className={`absolute right-3 p-1 rounded-full flex items-center justify-center ${
              onlyCritical ? 'text-tertiary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
          </button>
        </div>

        {/* Horizontal Category Selector with Admin Action */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pt-1">
          {(
            [
              { id: 'all', label: 'Todos', count: 38 },
              { id: 'placas', label: 'Placas & Melaminas', count: 12 },
              { id: 'cantos', label: 'Cantos PVC', count: 6 },
              { id: 'herrajes', label: 'Herrajes & Guías', count: 14 },
              { id: 'insumos', label: 'Tornillos & Insumos', count: 6 },
            ] as { id: CategoryId; label: string; count: number }[]
          ).map((chip) => {
            const isSelected = selectedCategory === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(chip.id);
                  setOnlyCritical(false);
                }}
                className={`shrink-0 px-3.5 h-8 rounded-full font-label-md text-label-md flex items-center gap-1.5 active:scale-95 transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary font-semibold shadow-sm'
                    : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-on-primary/20' : 'bg-surface-container'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowCategoriesModal(true)}
            className="shrink-0 px-3 h-8 rounded-full bg-surface-container-highest/80 text-secondary hover:text-on-surface font-label-md text-label-md flex items-center gap-1 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Categorías</span>
          </button>
        </div>
      </div>

      {/* Operational Flow Fast Action Buttons */}
      <div className="grid grid-cols-2 gap-space-sm">
        <button
          type="button"
          onClick={() => setShowNewItemModal(true)}
          className="flex items-center justify-center gap-2 h-13 py-3 px-4 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm active:scale-98"
        >
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
          </div>
          <span className="truncate">+ Ingreso Stock</span>
        </button>

        <button
          type="button"
          onClick={() => showToast('Iniciando ronda de inventario físico')}
          className="flex items-center justify-center gap-2 h-13 py-3 px-4 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm active:scale-98"
        >
          <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
          </div>
          <span className="truncate">Ajuste Físico</span>
        </button>
      </div>

      {/* Critical Threshold Warning Banner */}
      <div className="flex flex-col bg-surface-container-high rounded-2xl p-space-md shadow-md overflow-hidden relative">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-tertiary-container/20 blur-2xl pointer-events-none"></div>
        <div className="flex items-start justify-between gap-space-sm z-10">
          <div className="flex items-start gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-sm text-title-sm text-tertiary font-bold tracking-tight">
                Atención: 3 ítems en quiebre
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 line-clamp-2">
                Cantos PVC Dakar, Tornillos 7x50mm y Mezzo 18mm requieren reposición para los
                proyectos de esta semana.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setOnlyCritical(!onlyCritical);
              showToast(
                !onlyCritical ? 'Mostrando 3 ítems en quiebre' : 'Mostrando catálogo completo'
              );
            }}
            className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md flex items-center gap-1 active:scale-95 transition-transform"
          >
            <span>{onlyCritical ? 'Todos' : 'Ver'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Inventory Items List */}
      <div className="flex flex-col gap-space-sm">
        {filteredItems.map((item) => {
          const pct = Math.min(100, Math.round((item.stock / item.minSuggested) * 100));
          return (
            <div
              key={item.id}
              className="flex flex-col bg-surface-container rounded-3xl p-space-md shadow-md relative overflow-hidden transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center relative">
                    <img
                      className="w-full h-full object-cover"
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      src={item.image}
                    />
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-surface-dim/80 text-[9px] font-mono text-on-surface">
                      {item.cornerTag}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-[11px] font-medium">
                        {item.categoryLabel}
                      </span>
                      <span className="text-on-surface-variant font-label-md text-[11px]">
                        {item.specLabel}
                      </span>
                    </div>
                    <h2 className="font-title-sm text-title-sm text-on-surface font-bold truncate mt-0.5">
                      {item.title}
                    </h2>
                    <span className="font-body-md text-body-md text-on-surface-variant font-mono text-[13px]">
                      {item.priceLabel}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {item.statusType === 'bajo' && (
                  <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/30 text-tertiary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span>Bajo</span>
                  </div>
                )}
                {item.statusType === 'critico' && (
                  <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-semibold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    <span>Crítico</span>
                  </div>
                )}
                {item.statusType === 'normal' && (
                  <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-secondary font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span>Normal</span>
                  </div>
                )}
                {item.statusType === 'optimo' && (
                  <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container/30 text-primary-fixed font-label-md text-label-md font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>Óptimo</span>
                  </div>
                )}
              </div>

              {/* Micro Stock Telemetry & Progress Gauge */}
              <div className="mt-3 flex flex-col gap-1.5 bg-surface-container-low p-3 rounded-2xl">
                <div className="flex items-center justify-between text-on-surface font-label-md text-label-md">
                  <span className="text-on-surface-variant font-medium">
                    Stock:{' '}
                    <strong
                      className={`font-telemetry-num text-[17px] ${
                        item.statusType === 'critico' ? 'text-error' : 'text-on-surface'
                      }`}
                    >
                      {item.stock}
                    </strong>{' '}
                    {item.unit}
                  </span>
                  <span className="text-on-surface-variant">
                    Mínimo sugerido: <strong>{item.minSuggested}</strong> {item.unit}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.statusType === 'critico'
                        ? 'bg-error'
                        : item.statusType === 'bajo'
                        ? 'bg-tertiary'
                        : item.statusType === 'normal'
                        ? 'bg-secondary'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="mt-3 pt-2 flex items-center justify-between gap-space-sm">
                {item.urgentButtonLabel ? (
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Orden de reposición (${item.title}) enviada a compras`)
                    }
                    className="flex-1 h-10 px-4 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {item.urgentButtonIcon}
                    </span>
                    <span>{item.urgentButtonLabel}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => showToast(`Editando ficha técnica: ${item.title}`)}
                    className="text-secondary hover:text-on-surface font-label-md text-label-md flex items-center gap-1 py-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    <span>Editar Ficha</span>
                  </button>
                )}

                <div className="flex items-center gap-1 bg-surface-container-high rounded-full p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => adjustStock(item.id, -1)}
                    aria-label="Restar unidad"
                    className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="font-telemetry-num text-telemetry-num text-on-surface px-2 text-center select-none">
                    {item.stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustStock(item.id, 1)}
                    aria-label="Sumar unidad"
                    className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-bright flex items-center justify-center text-on-surface active:scale-90 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Floating Action Trigger */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowNewItemModal(true)}
          className="w-full h-14 rounded-full bg-primary text-on-primary font-headline-md text-headline-md font-semibold shadow-[0_8px_24px_rgba(102,76,255,0.4)] flex items-center justify-center gap-2 active:scale-98 transition-transform"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
          <span>+ Nuevo Insumo / Material</span>
        </button>
      </div>

      {/* Modal 1: Category Management Tray */}
      {showCategoriesModal && (
        <div
          className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowCategoriesModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-high rounded-t-3xl sm:rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md border-t sm:border-0 border-outline-variant/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">category</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  Administrar Categorías
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoriesModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Modifica, añade o limpia grupos de insumos del taller.
            </p>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {[
                'Placas & Melaminas',
                'Cantos PVC',
                'Herrajes & Guías',
                'Tornillos & Insumos',
              ].map((catName) => (
                <div
                  key={catName}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-container"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                      drag_handle
                    </span>
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      {catName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => showToast(`Categoría "${catName}" actualizada`)}
                      className="p-1.5 text-on-surface-variant hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast(`No se puede eliminar categoría activa`)}
                      className="p-1.5 text-on-surface-variant hover:text-error"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <input
                className="flex-1 h-11 px-4 rounded-full bg-surface-container text-on-surface text-body-md focus:outline-none"
                placeholder="Nombre nueva categoría..."
                type="text"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCategoriesModal(false);
                  showToast('Categoría agregada al taller');
                }}
                className="px-4 h-11 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-semibold active:scale-95 transition-transform shrink-0"
              >
                + Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: New Item / Material */}
      {showNewItemModal && (
        <div
          className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowNewItemModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-high rounded-t-3xl sm:rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_box</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  Nuevo Material / Insumo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewItemModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                  Nombre del Material
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                  placeholder="Ej: Placa Roble Americano 18mm"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as any)}
                    className="w-full h-12 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                  >
                    <option value="Placas">Placas</option>
                    <option value="Cantos PVC">Cantos PVC</option>
                    <option value="Herrajes">Herrajes</option>
                    <option value="Insumos">Insumos</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Unidad de Medida
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full h-12 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                  >
                    <option value="un">Unidades (Placas)</option>
                    <option value="m">Metros (Cantos)</option>
                    <option value="pares">Pares (Guías)</option>
                    <option value="un">Caja / Cantidad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Stock Inicial
                  </label>
                  <input
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none font-mono"
                    type="number"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Alerta Mínima
                  </label>
                  <input
                    value={newMin}
                    onChange={(e) => setNewMin(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none font-mono"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveNewItem}
              className="w-full h-13 py-3 rounded-full bg-primary text-on-primary font-headline-md text-headline-md font-semibold mt-2 active:scale-98 transition-transform"
            >
              Guardar en Inventario
            </button>
          </div>
        </div>
      )}

      {/* Interactive Feedback Toast */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-surface-bright text-on-surface font-label-md text-label-md shadow-2xl flex items-center gap-2 pointer-events-none z-50">
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
