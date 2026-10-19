import React, { useState } from 'react';
import {
  CloudInventoryCat,
  CloudInventoryItem,
  useWorkshopCloud,
} from '../context/WorkshopCloudContext';

type CategoryId = 'all' | CloudInventoryCat | 'cortes';
type InventoryItem = CloudInventoryItem;

const DEFAULT_IMAGES: Record<CloudInventoryCat, string> = {
  placas:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBFMD6KDHidiQNMT-Psf0lI6Numt03rT3fKTyWWb8zH2Ei3z5XLeViyRzbhQeNMoUYgT4PQJxwJ8zC-SjUlBETOFXtzn_f5mXGrXAz9eaPQkSkiNkQ440n117Ok8EWRT4Uoi3mcswFiZ7_j0M8x9xio5PSXHNeoGkzoIOGDeQZRekRV9vjNjij-UgSbs4fm0QsIHGzd3_MBPYXjO26VOepZpkqgmF61Yr_L0YbLR9r8iofyHJhR9lUeFg',
  cantos:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCS4ZH1ozdXNYTx6M0HdWyhx6KSavd6M3pDhlOH-zW7OtMLQQm_jJlYOSGEksAzUXs-x-fKB7IzVJoYvOmM0cT1V4eKjgw5SEiA_UvVYWueD7YR1FlaTn6FnFcvB5UC0oeDBCCH-1I2Uf6xcZyfhyHc5HyBOwlUgRPypBhjkr0zqS6PLASZmZ6QO0bYwmir-vIlUVkwzL2rnpOLkudRQh8zrjLVEhm8JjeeKEwze8Zml2KPvPLSlYcTVw',
  herrajes:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWseLanin0qi4PIzEP4YX0sBD9gJOJRwvSoBi0alVDON-IoF6brolPwujCL15SjmlbrSOL2hxXtF6xuUruPITn_jizhiAwtXlLr2ojcCXx3q0sAGTtZNOVbsSjfaz8TMzQUcyoXU44oIijEphHb43O66kf3pWHCI8OSULki_r20WBrNgCRgiNZD70cIUxhgAeeMFWC0zMtQxo_2khQqI52SXiTiDGjARLUNNNq3qfEW_v6vE3QxpqdJQ',
  insumos:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBM_72jvNxrexmCLHbBYCSwtcc9W1A_e5CodiRG45Yh-8Ox3ynl9GihuCLx2F9R64dWIjBTrWnAkpPzGZNCPmw2BCm-KmHBrQAhHLKIGFkD0YgwNs2jUwAw0CKsDtF91OVY75C2th8Dn4a-U9kAODrHlLhf13n0_1MkXPHMwfGFAi8MMuDUlOY_Q-6KiCfqRZ2KWwTSb1v8EsNgYrocC48jViUegUrUGTT-oOpa6v7_O2ZpsihvyPyAEw',
};

const CAT_LABEL_MAP: Record<CloudInventoryCat, string> = {
  placas: 'Placas',
  cantos: 'Cantos PVC',
  herrajes: 'Herrajes',
  insumos: 'Insumos',
};

function computeStockStatus(
  stock: number,
  minSuggested: number
): InventoryItem['statusType'] {
  if (stock <= 0 || stock <= Math.floor(minSuggested * 0.4)) return 'critico';
  if (stock < minSuggested) return 'bajo';
  if (stock >= minSuggested * 1.5) return 'optimo';
  return 'normal';
}

export const InventarioScreen: React.FC = () => {
  const {
    inventory: items,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateInventoryStock,
  } = useWorkshopCloud();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Item Form State
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<CloudInventoryCat>('placas');
  const [newSpec, setNewSpec] = useState('• Faplac 2.75x1.83m');
  const [newCornerTag, setNewCornerTag] = useState('18mm');
  const [newPriceLabel, setNewPriceLabel] = useState('$42.000 / unidad');
  const [newUnit, setNewUnit] = useState('un');
  const [newStock, setNewStock] = useState(5);
  const [newMin, setNewMin] = useState(4);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const adjustStock = (id: string, delta: number) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const nextStock = Math.max(0, item.stock + delta);
    const nextStatus = computeStockStatus(nextStock, item.minSuggested);
    updateInventoryStock(id, nextStock, nextStatus);
    showToast(
      delta > 0 ? `Cantidad sumada: ${nextStock} ${item.unit}` : `Cantidad restada: ${nextStock} ${item.unit}`
    );
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Ingresa el nombre del material o insumo');
      return;
    }
    const stockVal = Math.max(0, Number(newStock) || 0);
    const minVal = Math.max(1, Number(newMin) || 1);
    const created: InventoryItem = {
      id: `inv-${Date.now()}`,
      cat: newCat,
      categoryLabel: CAT_LABEL_MAP[newCat],
      specLabel: (newSpec.trim().startsWith('•') ? newSpec.trim() : `• ${newSpec.trim()}`).slice(0, 80),
      cornerTag: (newCornerTag.trim() || '18mm').slice(0, 20),
      title: newName.trim().slice(0, 140),
      priceLabel: (newPriceLabel.trim() || '$15.000 / unidad').slice(0, 60),
      image: DEFAULT_IMAGES[newCat],
      stock: stockVal,
      minSuggested: minVal,
      unit: (newUnit.trim() || 'un').slice(0, 30),
      statusType: computeStockStatus(stockVal, minVal),
    };
    createInventoryItem(created);
    setNewName('');
    setShowNewItemModal(false);
    showToast(`Material "${created.title}" agregado al inventario`);
  };

  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.title.trim()) {
      showToast('El nombre del material no puede estar vacío');
      return;
    }
    const stockVal = Math.max(0, Number(editingItem.stock) || 0);
    const minVal = Math.max(0, Number(editingItem.minSuggested) || 0);
    const updated: InventoryItem = {
      ...editingItem,
      title: editingItem.title.trim().slice(0, 140),
      categoryLabel: CAT_LABEL_MAP[editingItem.cat],
      stock: stockVal,
      minSuggested: minVal,
      statusType: computeStockStatus(stockVal, minVal),
    };
    updateInventoryItem(updated);
    setEditingItem(null);
    showToast(`Ficha de "${updated.title}" actualizada en tiempo real`);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    deleteInventoryItem(item.id);
    if (editingItem?.id === item.id) {
      setEditingItem(null);
    }
    showToast(`"${item.title}" eliminado del inventario`);
  };

  const filteredItems = items.filter((item) => {
    let matchesCat = false;
    if (selectedCategory === 'all') {
      matchesCat = true;
    } else if (selectedCategory === 'cortes') {
      matchesCat =
        item.categoryLabel.toLowerCase().includes('corte') ||
        item.urgentButtonIcon === 'content_cut';
    } else if (selectedCategory === 'placas') {
      matchesCat =
        item.cat === 'placas' &&
        !item.categoryLabel.toLowerCase().includes('corte') &&
        item.urgentButtonIcon !== 'content_cut';
    } else {
      matchesCat = item.cat === selectedCategory;
    }

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cornerTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.priceLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrit =
      !onlyCritical || item.statusType === 'critico' || item.statusType === 'bajo';
    return matchesCat && matchesSearch && matchesCrit;
  });

  const criticalCount = items.filter(
    (it) => it.statusType === 'critico' || it.statusType === 'bajo'
  ).length;

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
              CRUD TIEMPO REAL
            </span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Agrega, edita o elimina placas, cortes, cantos, herrajes e insumos en tiempo real.
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
            placeholder="Buscar por código, corte, placa, espesor, medidas..."
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

        {/* Horizontal Category Selector */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pt-1">
          {(
            [
              { id: 'all', label: 'Todos', count: items.length },
              {
                id: 'cortes',
                label: 'Cortes de Placa',
                count: items.filter(
                  (i) =>
                    i.categoryLabel.toLowerCase().includes('corte') ||
                    i.urgentButtonIcon === 'content_cut'
                ).length,
              },
              {
                id: 'placas',
                label: 'Placas Enteras',
                count: items.filter(
                  (i) =>
                    i.cat === 'placas' &&
                    !i.categoryLabel.toLowerCase().includes('corte') &&
                    i.urgentButtonIcon !== 'content_cut'
                ).length,
              },
              {
                id: 'cantos',
                label: 'Cantos PVC',
                count: items.filter((i) => i.cat === 'cantos').length,
              },
              {
                id: 'herrajes',
                label: 'Herrajes & Guías',
                count: items.filter((i) => i.cat === 'herrajes').length,
              },
              {
                id: 'insumos',
                label: 'Tornillos & Insumos',
                count: items.filter((i) => i.cat === 'insumos').length,
              },
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
          <span className="truncate">+ Agregar Objeto / Stock</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setOnlyCritical(!onlyCritical);
            showToast(
              !onlyCritical ? 'Filtrando alertas de stock bajo' : 'Mostrando todos los objetos'
            );
          }}
          className="flex items-center justify-center gap-2 h-13 py-3 px-4 rounded-2xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm active:scale-98"
        >
          <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
          </div>
          <span className="truncate">
            {onlyCritical ? 'Ver Todo el Stock' : `Alertas (${criticalCount})`}
          </span>
        </button>
      </div>

      {/* Critical Threshold Warning Banner */}
      {criticalCount > 0 && (
        <div className="flex flex-col bg-surface-container-high rounded-2xl p-space-md shadow-md overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-tertiary-container/20 blur-2xl pointer-events-none"></div>
          <div className="flex items-start justify-between gap-space-sm z-10">
            <div className="flex items-start gap-space-sm min-w-0">
              <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">warning</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-sm text-title-sm text-tertiary font-bold tracking-tight">
                  Atención: {criticalCount} ítem{criticalCount === 1 ? '' : 's'} en quiebre / bajo
                </span>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 line-clamp-2">
                  Revisa las existencias de placas, cantos o insumos por debajo del mínimo sugerido.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOnlyCritical(!onlyCritical);
                showToast(
                  !onlyCritical
                    ? `Mostrando ${criticalCount} ítems en alerta`
                    : 'Mostrando catálogo completo'
                );
              }}
              className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>{onlyCritical ? 'Todos' : 'Ver'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Inventory Items List with Full Edit & Delete */}
      <div className="flex flex-col gap-space-sm">
        {filteredItems.map((item) => {
          const pct = Math.min(
            100,
            Math.round((item.stock / Math.max(1, item.minSuggested)) * 100)
          );
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-md text-[11px] font-semibold flex items-center gap-1 ${
                          item.categoryLabel.toLowerCase().includes('corte') ||
                          item.urgentButtonIcon === 'content_cut'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {(item.categoryLabel.toLowerCase().includes('corte') ||
                          item.urgentButtonIcon === 'content_cut') && (
                          <span className="material-symbols-outlined text-[13px]">
                            content_cut
                          </span>
                        )}
                        <span>{item.categoryLabel}</span>
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

                {/* Status Badge + Quick Edit/Delete */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {item.statusType === 'bajo' && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-label-md text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                      <span>Bajo</span>
                    </div>
                  )}
                  {item.statusType === 'critico' && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-[11px] font-semibold animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                      <span>Crítico</span>
                    </div>
                  )}
                  {item.statusType === 'normal' && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-secondary font-label-md text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      <span>Normal</span>
                    </div>
                  )}
                  {item.statusType === 'optimo' && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container/30 text-primary-fixed font-label-md text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span>Óptimo</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...item })}
                      title="Editar Objeto"
                      className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item)}
                      title="Eliminar Objeto"
                      className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant flex items-center justify-center transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...item })}
                    className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-bright text-secondary hover:text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    <span>Editar Ficha</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item)}
                    className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Eliminar</span>
                  </button>
                </div>

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
                  Categorías de Inventario
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
            <div className="flex flex-col gap-2">
              {(
                [
                  { id: 'placas', name: 'Placas & Melaminas' },
                  { id: 'cantos', name: 'Cantos PVC' },
                  { id: 'herrajes', name: 'Herrajes & Guías' },
                  { id: 'insumos', name: 'Tornillos & Insumos' },
                ] as { id: CloudInventoryCat; name: string }[]
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowCategoriesModal(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-bright text-left"
                >
                  <span className="font-body-md text-on-surface font-medium">{cat.name}</span>
                  <span className="text-label-md text-primary font-semibold">
                    {items.filter((i) => i.cat === cat.id).length} ítems
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create New Item / Material */}
      {showNewItemModal && (
        <div
          className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowNewItemModal(false)}
        >
          <form
            onSubmit={handleSaveNewItem}
            className="w-full max-w-md bg-surface-container-high rounded-t-3xl sm:rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_box</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  Agregar Objeto / Material al Taller
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
                  Nombre del Objeto / Material
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-11 px-4 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                  placeholder="Ej: Placa Roble Americano 18mm / Bisagra Cazoleta 35mm"
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
                    onChange={(e) => setNewCat(e.target.value as CloudInventoryCat)}
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                  >
                    <option value="placas">Placas &amp; Melaminas</option>
                    <option value="cantos">Cantos PVC</option>
                    <option value="herrajes">Herrajes &amp; Guías</option>
                    <option value="insumos">Tornillos &amp; Insumos</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Unidad de Medida
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                  >
                    <option value="un">Unidades (un)</option>
                    <option value="m">Metros (m)</option>
                    <option value="pares">Pares (pares)</option>
                    <option value="cajas">Cajas (cajas)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Marca / Especificación
                  </label>
                  <input
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                    placeholder="• Faplac 2.75x1.83m"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Espesor / Medida Corta
                  </label>
                  <input
                    value={newCornerTag}
                    onChange={(e) => setNewCornerTag(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                    placeholder="18mm / 45cm"
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Precio Ref.
                  </label>
                  <input
                    value={newPriceLabel}
                    onChange={(e) => setNewPriceLabel(e.target.value)}
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                    placeholder="$42.000 / un"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Stock Inicial
                  </label>
                  <input
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none font-mono"
                    type="number"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Mínimo Sugerido
                  </label>
                  <input
                    value={newMin}
                    onChange={(e) => setNewMin(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none font-mono"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-13 py-3 rounded-full bg-primary text-on-primary font-headline-md text-headline-md font-semibold mt-2 active:scale-98 transition-transform"
            >
              Guardar en Inventario
            </button>
          </form>
        </div>
      )}

      {/* Modal 3: Edit Existing Item / Material */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 bg-surface-dim/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setEditingItem(null)}
        >
          <form
            onSubmit={handleSaveEditItem}
            className="w-full max-w-md bg-surface-container-high rounded-t-3xl sm:rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  Editar Objeto de Inventario
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                  Nombre del Objeto / Material
                </label>
                <input
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full h-11 px-4 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Categoría
                  </label>
                  <select
                    value={editingItem.cat}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        cat: e.target.value as CloudInventoryCat,
                      })
                    }
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                  >
                    <option value="placas">Placas &amp; Melaminas</option>
                    <option value="cantos">Cantos PVC</option>
                    <option value="herrajes">Herrajes &amp; Guías</option>
                    <option value="insumos">Tornillos &amp; Insumos</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Unidad de Medida
                  </label>
                  <input
                    value={editingItem.unit}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, unit: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Marca / Especificación
                  </label>
                  <input
                    value={editingItem.specLabel}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, specLabel: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Espesor / Medida Corta
                  </label>
                  <input
                    value={editingItem.cornerTag}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, cornerTag: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Precio Ref.
                  </label>
                  <input
                    value={editingItem.priceLabel}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, priceLabel: e.target.value })
                    }
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Stock Actual
                  </label>
                  <input
                    value={editingItem.stock}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        stock: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none font-mono"
                    type="number"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                    Mínimo Sugerido
                  </label>
                  <input
                    value={editingItem.minSuggested}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        minSuggested: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full h-11 px-3 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none font-mono"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDeleteItem(editingItem)}
                className="px-4 h-12 rounded-full bg-error-container text-on-error-container font-label-md font-semibold flex items-center justify-center gap-1 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Eliminar</span>
              </button>
              <button
                type="submit"
                className="flex-1 h-12 rounded-full bg-primary text-on-primary font-label-md font-semibold flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
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
