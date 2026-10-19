import React, { useEffect, useMemo, useState } from 'react';
import { useWorkshopCloud } from '../context/WorkshopCloudContext';

interface BoardOption {
  name: string;
  spec: string;
  lengthMm: number;
  widthMm: number;
  image: string;
  grainNote: string;
}

export interface CutItem {
  id: string;
  name: string;
  lengthMm: number;
  widthMm: number;
  quantity: number;
  edgeSpec: string;
  respectGrain: boolean;
}

interface PlacedPiece {
  instanceIndex: number;
  cutId: string;
  name: string;
  lengthMm: number;
  widthMm: number;
  edgeSpec: string;
  xMm: number;
  yMm: number;
  isPrimary: boolean;
}

interface FreeRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const BOARD_OPTIONS: BoardOption[] = [
  {
    name: 'Carvalho Mezzo 18mm',
    spec: 'Faplac Texturado • 2750 × 1830 mm',
    lengthMm: 2750,
    widthMm: 1830,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2wP3mWnUoJi_J5zBbvCSbRIpxMp6RyeK6Mo7q6HPev0CDKCf1rjkwwBPsmteh0YCtbGeVlbNBVutGzqVlAtchNxwvQoWsY7IebNmTb8T2ON2QcY2S21eYlrXujhmJ_EpV7g6D4pBG3gyCwP8IYln1oNcRsv2OiixhlhuA9RiLUdYXHuzFrO9D-w_iUqf2SIPhMC68db9_YOMdbp71QxJE8DhsdEtWh7pBNdWoH_7UbU-x_MDxHw8sRw',
    grainNote: 'Veta Carvalho Mezzo',
  },
  {
    name: 'Blanco Puro 18mm',
    spec: 'Guillermina Mate • 2750 × 1830 mm',
    lengthMm: 2750,
    widthMm: 1830,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbJfWRGRZRXR_2KeD0RB06XQmSnbnlQZinziKIQXOjOA3MUNi8bJbevEXlcvA4wK4HDWE-gWnBlcBTNwIwmHSPEBYwyPeWAz50XqWwrVk_S6b21Uv0duJi-ynVzBdldRFvqhsypoUk9A6z3TWblh8m3LO2lQ8P-9-9E3ZfjQGy124IZpU-uhmwQs-L7VJtw94ElvcuRaNdv4IGNLmYyDgusxNQLy2UgfIVqGNvC1n3juoEjOQD6z-v7A',
    grainNote: 'Sin veta direccional',
  },
  {
    name: 'Roble Dakar 18mm',
    spec: 'Faplac Poro Profundo • 2750 × 1830 mm',
    lengthMm: 2750,
    widthMm: 1830,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCS4ZH1ozdXNYTx6M0HdWyhx6KSavd6M3pDhlOH-zW7OtMLQQm_jJlYOSGEksAzUXs-x-fKB7IzVJoYvOmM0cT1V4eKjgw5SEiA_UvVYWueD7YR1FlaTn6FnFcvB5UC0oeDBCCH-1I2Uf6xcZyfhyHc5HyBOwlUgRPypBhjkr0zqS6PLASZmZ6QO0bYwmir-vIlUVkwzL2rnpOLkudRQh8zrjLVEhm8JjeeKEwze8Zml2KPvPLSlYcTVw',
    grainNote: 'Veta Roble Dakar',
  },
];

const INITIAL_CUTS: CutItem[] = [
  {
    id: 'cut-1',
    name: 'Tapa Mesa Principal',
    lengthMm: 1200,
    widthMm: 600,
    quantity: 1,
    edgeSpec: 'Cantos 4L (2mm)',
    respectGrain: true,
  },
  {
    id: 'cut-2',
    name: 'Laterales de Módulo',
    lengthMm: 720,
    widthMm: 450,
    quantity: 2,
    edgeSpec: 'Cantos 2L Frontal',
    respectGrain: true,
  },
  {
    id: 'cut-3',
    name: 'Estantes Regulables',
    lengthMm: 560,
    widthMm: 420,
    quantity: 3,
    edgeSpec: 'Canto 1L',
    respectGrain: true,
  },
  {
    id: 'cut-4',
    name: 'Frentes de Cajón Soft',
    lengthMm: 400,
    widthMm: 180,
    quantity: 4,
    edgeSpec: 'Cantos 4L (Veta Continua)',
    respectGrain: true,
  },
  {
    id: 'cut-5',
    name: 'Zócalo & Fondos Auxiliares',
    lengthMm: 320,
    widthMm: 260,
    quantity: 4,
    edgeSpec: 'Canto 1L Frontal',
    respectGrain: false,
  },
];

function computeGuillotineLayout(
  cuts: CutItem[],
  boardLength: number,
  boardWidth: number,
  kerfMm: number
) {
  // Expand cuts into individual pieces sorted by area descending
  const expanded: {
    cutId: string;
    name: string;
    lengthMm: number;
    widthMm: number;
    edgeSpec: string;
    isPrimary: boolean;
  }[] = [];

  cuts.forEach((c, cIdx) => {
    for (let i = 0; i < c.quantity; i++) {
      expanded.push({
        cutId: c.id,
        name: c.quantity > 1 ? `${c.name} (${i + 1})` : c.name,
        lengthMm: c.lengthMm,
        widthMm: c.widthMm,
        edgeSpec: c.edgeSpec,
        isPrimary: cIdx < 2,
      });
    }
  });

  expanded.sort((a, b) => b.lengthMm * b.widthMm - a.lengthMm * a.widthMm);

  const freeRects: FreeRect[] = [{ x: 0, y: 0, w: boardLength, h: boardWidth }];
  const placed: PlacedPiece[] = [];
  let unplacedCount = 0;

  expanded.forEach((piece, idx) => {
    // Find best free rectangle (Best Short Side Fit)
    let bestRectIndex = -1;
    let bestShortSide = Infinity;

    for (let i = 0; i < freeRects.length; i++) {
      const r = freeRects[i];
      if (piece.lengthMm <= r.w && piece.widthMm <= r.h) {
        const leftoverHoriz = r.w - piece.lengthMm;
        const leftoverVert = r.h - piece.widthMm;
        const shortSide = Math.min(leftoverHoriz, leftoverVert);
        if (shortSide < bestShortSide) {
          bestShortSide = shortSide;
          bestRectIndex = i;
        }
      }
    }

    if (bestRectIndex !== -1) {
      const rect = freeRects[bestRectIndex];
      placed.push({
        instanceIndex: idx + 1,
        cutId: piece.cutId,
        name: piece.name,
        lengthMm: piece.lengthMm,
        widthMm: piece.widthMm,
        edgeSpec: piece.edgeSpec,
        xMm: rect.x,
        yMm: rect.y,
        isPrimary: piece.isPrimary,
      });

      // Split rect using Guillotine cut + saw kerf
      freeRects.splice(bestRectIndex, 1);
      const rightW = rect.w - piece.lengthMm - kerfMm;
      const bottomH = rect.h - piece.widthMm - kerfMm;

      // Split along the longer axis to maximize usable stock offcuts
      if (rightW * rect.h > bottomH * rect.w) {
        if (rightW > 20) {
          freeRects.push({
            x: rect.x + piece.lengthMm + kerfMm,
            y: rect.y,
            w: rightW,
            h: rect.h,
          });
        }
        if (bottomH > 20) {
          freeRects.push({
            x: rect.x,
            y: rect.y + piece.widthMm + kerfMm,
            w: piece.lengthMm,
            h: bottomH,
          });
        }
      } else {
        if (bottomH > 20) {
          freeRects.push({
            x: rect.x,
            y: rect.y + piece.widthMm + kerfMm,
            w: rect.w,
            h: bottomH,
          });
        }
        if (rightW > 20) {
          freeRects.push({
            x: rect.x + piece.lengthMm + kerfMm,
            y: rect.y,
            w: rightW,
            h: piece.widthMm,
          });
        }
      }
    } else {
      unplacedCount++;
    }
  });

  // Sort remaining free rectangles by area descending to identify usable offcuts (> 0.20 m²)
  const sortedFree = [...freeRects].sort((a, b) => b.w * b.h - a.w * a.h);
  const usableOffcuts = sortedFree.filter((r) => (r.w * r.h) / 1_000_000 >= 0.2);
  const scrapRects = sortedFree.filter((r) => (r.w * r.h) / 1_000_000 < 0.2 && r.w * r.h >= 25000);

  const totalBoardAreaMm2 = boardLength * boardWidth;
  const usedAreaMm2 = placed.reduce((acc, p) => acc + p.lengthMm * p.widthMm, 0);
  const wasteAreaMm2 = Math.max(0, totalBoardAreaMm2 - usedAreaMm2);
  const yieldPercent =
    totalBoardAreaMm2 > 0 ? Math.min(100, (usedAreaMm2 / totalBoardAreaMm2) * 100) : 0;

  return {
    placed,
    totalRequested: expanded.length,
    unplacedCount,
    usableOffcuts,
    scrapRects,
    usedAreaMm2,
    wasteAreaMm2,
    yieldPercent,
  };
}

export const OptimizadorScreen: React.FC = () => {
  const {
    cuts,
    upsertCut,
    removeCut,
    clearAllCuts,
    restoreDefaultCuts,
    createInventoryItem,
    isCloudConnected,
  } = useWorkshopCloud();
  const [boardIndex, setBoardIndex] = useState(0);
  const [boardPrice, setBoardPrice] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('taller_os_board_price_v1');
      if (saved) return Math.max(1, Number(saved));
    } catch {
      // ignore
    }
    return 104000;
  });
  const [kerfMm, setKerfMm] = useState<number>(3.2);
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [isVerticalGrain, setIsVerticalGrain] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showSawGuides, setShowSawGuides] = useState(false);
  const [selectedCutId, setSelectedCutId] = useState<string | null>('cut-1');
  const [retazoStocked, setRetazoStocked] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'qr' | 'gcode' | null>(null);

  // New Cut Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCutName, setNewCutName] = useState('');
  const [newCutLength, setNewCutLength] = useState('800');
  const [newCutWidth, setNewCutWidth] = useState('450');
  const [newCutQty, setNewCutQty] = useState('1');
  const [newCutEdge, setNewCutEdge] = useState('Cantos 4L (2mm)');
  const [newCutGrain, setNewCutGrain] = useState(true);

  const currentBoard = BOARD_OPTIONS[boardIndex];

  useEffect(() => {
    try {
      localStorage.setItem('taller_os_board_price_v1', String(boardPrice));
    } catch {
      // ignore quota error
    }
  }, [boardPrice]);

  // Area and m² price calculations based on whole board price
  const boardAreaM2 = (currentBoard.lengthMm * currentBoard.widthMm) / 1_000_000;
  const pricePerM2 = boardAreaM2 > 0 ? boardPrice / boardAreaM2 : 0;

  const computeCutPrice = (lengthMm: number, widthMm: number) => {
    const areaM2 = (lengthMm * widthMm) / 1_000_000;
    return Math.round(areaM2 * pricePerM2);
  };

  const totalCutsValue = useMemo(() => {
    return cuts.reduce((acc, c) => {
      const unitVal = computeCutPrice(c.lengthMm, c.widthMm);
      return acc + unitVal * c.quantity;
    }, 0);
  }, [cuts, pricePerM2]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const handleSaveAllCutsToInventory = () => {
    if (cuts.length === 0) {
      triggerToast('No hay cortes asignados para guardar en el inventario');
      return;
    }
    let totalPieces = 0;
    cuts.forEach((c) => {
      const unitVal = computeCutPrice(c.lengthMm, c.widthMm);
      const cutArea = ((c.lengthMm * c.widthMm) / 1_000_000).toFixed(2);
      createInventoryItem({
        id: `corte-${Date.now()}-${c.id}`,
        cat: 'placas',
        categoryLabel: 'Corte de Placa',
        specLabel: `• ${c.lengthMm} × ${c.widthMm} mm (${cutArea} m²) • ${currentBoard.name}`,
        cornerTag: `${c.lengthMm}×${c.widthMm}`,
        title: c.name,
        priceLabel: `$${unitVal.toLocaleString('es-AR')} / unidad`,
        image: currentBoard.image,
        stock: c.quantity,
        minSuggested: 1,
        unit: 'un',
        statusType: 'optimo',
        urgentButtonLabel: 'Corte de Placa',
        urgentButtonIcon: 'content_cut',
      });
      totalPieces += c.quantity;
    });
    triggerToast(
      `¡${cuts.length} cortes (${totalPieces} piezas) guardados en Inventario con sus precios!`
    );
  };

  const handleSaveSingleCutToInventory = (c: CutItem) => {
    const unitVal = computeCutPrice(c.lengthMm, c.widthMm);
    const cutArea = ((c.lengthMm * c.widthMm) / 1_000_000).toFixed(2);
    createInventoryItem({
      id: `corte-${Date.now()}-${c.id}`,
      cat: 'placas',
      categoryLabel: 'Corte de Placa',
      specLabel: `• ${c.lengthMm} × ${c.widthMm} mm (${cutArea} m²) • ${currentBoard.name}`,
      cornerTag: `${c.lengthMm}×${c.widthMm}`,
      title: c.name,
      priceLabel: `$${unitVal.toLocaleString('es-AR')} / unidad`,
      image: currentBoard.image,
      stock: c.quantity,
      minSuggested: 1,
      unit: 'un',
      statusType: 'optimo',
      urgentButtonLabel: 'Corte de Placa',
      urgentButtonIcon: 'content_cut',
    });
    triggerToast(
      `"${c.name}" guardado en Inventario ($${unitVal.toLocaleString('es-AR')} • ${c.lengthMm}×${c.widthMm} mm)`
    );
  };

  // Real-time 2D Guillotine Layout Calculation
  const layout = useMemo(
    () =>
      computeGuillotineLayout(
        cuts,
        currentBoard.lengthMm,
        currentBoard.widthMm,
        kerfMm
      ),
    [cuts, currentBoard.lengthMm, currentBoard.widthMm, kerfMm]
  );

  // SVG Ring Dashoffset (circumference = 2 * pi * 40 = 251.32)
  const circumference = 251.32;
  const calculatedOffset =
    circumference - (layout.yieldPercent / 100) * circumference;

  const handleRecompute = () => {
    setIsRecomputing(true);
    setTimeout(() => {
      setIsRecomputing(false);
      triggerToast(
        cuts.length === 0
          ? 'Placa limpia lista • Agrega cortes para optimizar'
          : `Algoritmo Guillotina ejecutado • Rendimiento ${layout.yieldPercent.toFixed(1)}%`
      );
    }, 280);
  };

  const handleStartBlankOrder = () => {
    clearAllCuts();
    setSelectedCutId(null);
    setRetazoStocked(false);
    setShowAddForm(true);
    triggerToast(
      isCloudConnected
        ? 'Nueva orden iniciada en Nube Firebase • Placa entera virgen'
        : 'Nueva orden iniciada • Placa entera virgen (2750 × 1830 mm)'
    );
  };

  const handleRestoreDemoOrder = () => {
    restoreDefaultCuts();
    setSelectedCutId('cut-1');
    setShowAddForm(false);
    triggerToast('Orden de ejemplo cargada (14 piezas)');
  };

  const handleAddCut = (e: React.FormEvent) => {
    e.preventDefault();
    const l = Math.min(currentBoard.lengthMm, Math.max(50, Number(newCutLength) || 600));
    const w = Math.min(currentBoard.widthMm, Math.max(50, Number(newCutWidth) || 400));
    const q = Math.min(30, Math.max(1, Number(newCutQty) || 1));
    const name = (newCutName.trim() || `Pieza Personalizada #${cuts.length + 1}`).slice(0, 120);

    const newItem: CutItem = {
      id: `cut-${Date.now()}`,
      name,
      lengthMm: l,
      widthMm: w,
      quantity: q,
      edgeSpec: newCutEdge.slice(0, 80),
      respectGrain: newCutGrain,
    };

    upsertCut(newItem);
    setSelectedCutId(newItem.id);
    setNewCutName('');
    triggerToast(`Corte agregado: ${name} (${l}×${w} mm ×${q})`);
  };

  const handleRemoveCut = (id: string, name: string) => {
    removeCut(id);
    if (selectedCutId === id) {
      setSelectedCutId(null);
    }
    triggerToast(`Corte eliminado: ${name}`);
  };

  const handleUpdateCutQty = (id: string, delta: number) => {
    const target = cuts.find((c) => c.id === id);
    if (!target) return;
    const nextQty = target.quantity + delta;
    if (nextQty <= 0) {
      removeCut(id);
    } else {
      upsertCut({ ...target, quantity: Math.min(500, nextQty) });
    }
  };

  const handleSwapBoard = () => {
    const nextIdx = (boardIndex + 1) % BOARD_OPTIONS.length;
    setBoardIndex(nextIdx);
    triggerToast(`Placa cambiada a ${BOARD_OPTIONS[nextIdx].name}`);
  };

  const handleCycleKerf = () => {
    const nextKerf = kerfMm === 3.2 ? 2.8 : kerfMm === 2.8 ? 4.0 : 3.2;
    setKerfMm(nextKerf);
    triggerToast(`Espesor de sierra ajustado a ${nextKerf.toFixed(1)} mm`);
  };

  const primaryOffcut = layout.usableOffcuts[0] || null;
  const primaryScrap = layout.scrapRects[0] || null;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 gap-space-md">
      {/* Panel Config & Spec Selector */}
      <section className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-3xl shadow-sm">
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <div className="flex items-center gap-space-xs">
            <span
              className="material-symbols-outlined text-primary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              tune
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Configuración de Placa
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleStartBlankOrder}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/40 hover:bg-tertiary-container text-tertiary hover:text-on-tertiary-container text-label-md font-semibold active:scale-95 transition-all"
              title="Cargar placa entera virgen sin cortes"
            >
              <span className="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Iniciar Nueva Orden (Placa Limpia)</span>
            </button>

            <button
              type="button"
              onClick={handleCycleKerf}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface text-label-md font-label-md active:scale-95 transition-transform"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3d07d9]"></span>
              <span>
                Sierra: <strong className="text-primary font-bold">{kerfMm.toFixed(1)} mm</strong>
              </span>
            </button>
          </div>
        </div>

        {/* Active Board Card */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container gap-space-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
              <img
                className="w-full h-full object-cover"
                alt={currentBoard.name}
                referrerPolicy="no-referrer"
                src={currentBoard.image}
              />
              <div className="absolute inset-0 bg-[#3d07d9]/10 mix-blend-overlay"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate leading-tight">
                {currentBoard.name}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant truncate">
                {currentBoard.spec}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSwapBoard}
            aria-label="Cambiar placa activa"
            className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center shrink-0 transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined text-[19px]">swap_horiz</span>
          </button>
        </div>

        {/* Board Price & m² Rate Config */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-surface-container gap-2.5 border border-primary/20 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-container/40 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Precio de Placa Entera
              </span>
              <span className="text-[12px] text-on-surface font-medium">
                {currentBoard.lengthMm} × {currentBoard.widthMm} mm ({boardAreaM2.toFixed(2)} m²)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-xl border border-outline-variant/30 focus-within:border-primary">
              <span className="text-primary font-bold text-[14px]">$</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={boardPrice}
                onChange={(e) => setBoardPrice(Math.max(0, Number(e.target.value)))}
                aria-label="Precio de la placa"
                className="w-24 bg-transparent font-telemetry-num text-[15px] font-bold text-on-surface focus:outline-none"
              />
              <span className="text-[11px] text-on-surface-variant font-mono">ARS</span>
            </div>

            <div className="flex flex-col items-end px-2.5 py-1 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20">
              <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-semibold">
                Valor por m²
              </span>
              <span className="text-[12px] font-bold text-tertiary font-telemetry-num">
                ${Math.round(pricePerM2).toLocaleString('es-AR')}/m²
              </span>
            </div>
          </div>
        </div>

        {/* Optimization Trigger Button */}
        <button
          type="button"
          onClick={handleRecompute}
          className={`w-full h-13 py-3.5 px-space-md rounded-full bg-[#3d07d9] text-[#b3abff] font-headline-md text-body-lg font-bold flex items-center justify-center gap-2 shadow-[0_8px_24px_-4px_rgba(217,119,6,0.4)] active:scale-[0.98] transition-all ${
            isRecomputing ? 'scale-95 opacity-90' : ''
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            precision_manufacturing
          </span>
          <span>Ejecutar Algoritmo Guillotina</span>
        </button>
      </section>

      {/* Material Yield Metric & Bento Telemetry */}
      <section className="bg-surface-container-low p-space-md rounded-3xl shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
            <h2 className="font-title-sm text-title-sm text-on-surface font-semibold">
              Rendimiento de Hoja
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-md text-label-md font-semibold">
            {cuts.length === 0
              ? 'Placa Virgen (100% Libre)'
              : layout.yieldPercent >= 75
              ? 'Nivel Óptimo'
              : 'En Configuración'}
          </span>
        </div>

        <div className="flex items-center gap-space-md">
          {/* Gauge SVG */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-surface-container"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeWidth="9"
              />
              <circle
                className="text-[#3d07d9] transition-all duration-500 ease-out"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.32"
                strokeDashoffset={isRecomputing ? 251.32 : calculatedOffset}
                strokeLinecap="round"
                strokeWidth="9"
              />
              {cuts.length > 0 && (
                <circle
                  className="text-tertiary"
                  cx="50"
                  cy="50"
                  fill="none"
                  opacity="0.8"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray="251.32"
                  strokeDashoffset="242.0"
                  strokeWidth="9"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface tracking-tight">
                {layout.yieldPercent.toFixed(1)}
                <span className="text-title-sm font-normal text-primary">%</span>
              </span>
              <span className="font-telemetry-unit text-telemetry-unit uppercase tracking-widest text-on-surface-variant -mt-1">
                Yield Total
              </span>
            </div>
          </div>

          {/* Quick Telemetry Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs flex-1">
            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                Área Útil
              </span>
              <span className="font-telemetry-num text-telemetry-num text-primary font-bold mt-0.5">
                {(layout.usedAreaMm2 / 1_000_000).toFixed(2)}{' '}
                <span className="text-label-md text-on-surface-variant font-normal">m²</span>
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant leading-tight">
                {layout.usedAreaMm2.toLocaleString('es-AR')} mm²
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                Valor Cortes
              </span>
              <span className="font-telemetry-num text-telemetry-num text-tertiary font-bold mt-0.5">
                ${totalCutsValue.toLocaleString('es-AR')}{' '}
                <span className="text-label-md text-on-surface-variant font-normal">ARS</span>
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant leading-tight">
                Placa: ${boardPrice.toLocaleString('es-AR')}
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                {cuts.length === 0 ? 'Disponible' : 'Desperdicio'}
              </span>
              <span
                className={`font-telemetry-num text-telemetry-num font-bold mt-0.5 ${
                  cuts.length === 0 ? 'text-on-surface' : 'text-error'
                }`}
              >
                {(layout.wasteAreaMm2 / 1_000_000).toFixed(2)}{' '}
                <span className="text-label-md text-on-surface-variant font-normal">m²</span>
              </span>
              <span
                className={`font-label-md text-[10px] font-medium leading-tight ${
                  cuts.length === 0 ? 'text-on-surface-variant' : 'text-error'
                }`}
              >
                {(100 - layout.yieldPercent).toFixed(1)}% del panel
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                Cortes
              </span>
              <span className="font-telemetry-num text-telemetry-num text-on-surface font-bold mt-0.5">
                {layout.placed.length}{' '}
                <span className="text-label-md text-on-surface-variant font-normal">uds.</span>
              </span>
              <span className="font-label-md text-[10px] text-tertiary font-medium leading-tight">
                {layout.totalRequested === 0
                  ? 'Placa sin cortes'
                  : layout.unplacedCount === 0
                  ? '100% ubicados'
                  : `${layout.unplacedCount} exceden placa`}
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                Sobrantes
              </span>
              <span className="font-telemetry-num text-telemetry-num text-tertiary font-bold mt-0.5">
                {cuts.length === 0 ? 0 : layout.usableOffcuts.length}{' '}
                <span className="text-label-md text-on-surface-variant font-normal">retazos</span>
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant font-normal leading-tight">
                &gt;0.2m² aptos stock
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Blueprint Canvas Container */}
      <section className="bg-surface-container-low p-space-md rounded-3xl shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">architecture</span>
            <h2 className="font-title-sm text-title-sm text-on-surface font-semibold">
              Simulador HiDPI CAD
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsVerticalGrain(!isVerticalGrain);
                triggerToast(
                  !isVerticalGrain
                    ? 'Dirección de veta cambiada a Vertical ↕'
                    : 'Dirección de veta cambiada a Horizontal ↔'
                );
              }}
              className="px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md flex items-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">sync_alt</span>
              <span>{isVerticalGrain ? 'Veta: Vert ↕' : 'Veta: Horiz ↔'}</span>
            </button>
          </div>
        </div>

        {/* Dimensions Context Bar */}
        <div className="flex items-center justify-between px-1 text-on-surface-variant font-label-md text-label-md">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">width</span>
            Largo: {currentBoard.lengthMm} mm
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">height</span>
            Ancho: {currentBoard.widthMm} mm
          </span>
        </div>

        {/* CAD Visualizer Frame */}
        <div className="relative w-full rounded-2xl bg-surface-container-lowest p-2 shadow-inner overflow-hidden select-none">
          {/* Top ruler */}
          <div className="w-full flex items-center justify-between px-2 mb-1.5 text-primary text-[10px] font-label-md">
            <div className="h-1.5 w-1.5 border-l border-t border-primary/50"></div>
            <div className="flex-1 flex items-center justify-center gap-2">
              <div className="h-[1px] flex-1 bg-primary/30"></div>
              <span className="font-bold tracking-wider">{currentBoard.lengthMm} mm</span>
              <div className="h-[1px] flex-1 bg-primary/30"></div>
            </div>
            <div className="h-1.5 w-1.5 border-r border-t border-primary/50"></div>
          </div>

          {/* Blueprint Sheet (2750x1830 ratio) */}
          <div
            className="relative w-full aspect-[16/10.6] rounded-xl bg-surface-container-high overflow-hidden shadow-md transition-transform duration-300"
            style={{ transform: `scale(${zoomScale})` }}
          >
            {/* Texture Backdrop */}
            <div
              className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none"
              style={{
                backgroundImage: isVerticalGrain
                  ? 'repeating-linear-gradient(0deg, rgba(255,183,125,0.08) 0px, rgba(255,183,125,0.08) 2px, transparent 2px, transparent 18px), radial-gradient(circle at 40% 30%, rgba(217,119,6,0.15), transparent 70%)'
                  : 'repeating-linear-gradient(90deg, rgba(255,183,125,0.06) 0px, rgba(255,183,125,0.06) 2px, transparent 2px, transparent 18px), radial-gradient(circle at 40% 30%, rgba(217,119,6,0.15), transparent 70%)',
              }}
            />

            {/* Virgin Board Empty State */}
            {cuts.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest/70 flex items-center justify-center text-primary mb-2">
                  <span className="material-symbols-outlined text-[24px]">crop_free</span>
                </div>
                <span className="font-title-sm text-body-lg font-bold text-on-surface">
                  Placa Entera Virgen ({currentBoard.lengthMm} × {currentBoard.widthMm} mm)
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant mt-0.5 max-w-xs">
                  Sin cortes asignados. Ingresa medidas manualmente debajo para ubicar las piezas en
                  el plano.
                </span>
              </div>
            ) : (
              <>
                {/* Dynamically Placed Pieces */}
                {layout.placed.map((piece) => {
                  const leftPct = (piece.xMm / currentBoard.lengthMm) * 100;
                  const topPct = (piece.yMm / currentBoard.widthMm) * 100;
                  const widthPct = (piece.lengthMm / currentBoard.lengthMm) * 100;
                  const heightPct = (piece.widthMm / currentBoard.widthMm) * 100;
                  const isSelected = selectedCutId === piece.cutId;
                  const isCompact = widthPct < 16 || heightPct < 14;

                  return (
                    <div
                      key={`${piece.cutId}-${piece.instanceIndex}`}
                      onClick={() => setSelectedCutId(piece.cutId)}
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        width: `${widthPct}%`,
                        height: `${heightPct}%`,
                      }}
                      className="absolute p-0.5 transition-all duration-300"
                    >
                      <div
                        className={`w-full h-full rounded-lg transition-colors flex flex-col justify-between p-1 cursor-pointer relative overflow-hidden ${
                          piece.isPrimary
                            ? 'bg-[#3d07d9]/25 hover:bg-[#3d07d9]/40'
                            : 'bg-surface-container-highest hover:bg-[#3d07d9]/30'
                        } ${isSelected ? 'ring-1 ring-primary' : 'border border-white/10'} ${
                          showSawGuides ? 'outline-1 outline-dashed outline-tertiary/70' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-0.5">
                          <span
                            className={`rounded-full font-label-md font-bold flex items-center justify-center shrink-0 ${
                              isCompact ? 'w-3.5 h-3.5 text-[8px]' : 'w-5 h-5 text-[10px]'
                            } ${
                              piece.isPrimary
                                ? 'bg-[#3d07d9] text-[#b3abff]'
                                : 'bg-surface-variant text-on-surface'
                            }`}
                          >
                            #{piece.instanceIndex}
                          </span>
                          {showLabels && !isCompact && (
                            <span className="text-[9px] font-mono text-primary font-semibold truncate">
                              {piece.lengthMm}×{piece.widthMm}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-1 min-w-0">
                          <span
                            className={`font-label-md truncate ${
                              isCompact ? 'text-[8px]' : 'text-[10px] font-semibold'
                            } ${piece.isPrimary ? 'text-primary' : 'text-on-surface'}`}
                          >
                            {piece.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Usable Offcuts (>0.2m2) */}
                {layout.usableOffcuts.slice(0, 2).map((offcut, idx) => {
                  const leftPct = (offcut.x / currentBoard.lengthMm) * 100;
                  const topPct = (offcut.y / currentBoard.widthMm) * 100;
                  const widthPct = (offcut.w / currentBoard.lengthMm) * 100;
                  const heightPct = (offcut.h / currentBoard.widthMm) * 100;
                  const areaM2 = ((offcut.w * offcut.h) / 1_000_000).toFixed(2);

                  return (
                    <div
                      key={`offcut-${idx}`}
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        width: `${widthPct}%`,
                        height: `${heightPct}%`,
                      }}
                      className="absolute p-0.5 pointer-events-none"
                    >
                      <div className="w-full h-full rounded-lg bg-[#881e00]/20 border border-tertiary-fixed-dim/30 flex flex-col justify-between p-1.5 shadow-inner overflow-hidden">
                        <div className="flex items-center justify-between gap-1">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-tertiary/20 text-tertiary font-label-md text-[8px] font-bold truncate">
                            RETAZO {String.fromCharCode(65 + idx)} • STOCK
                          </span>
                          <span className="font-label-md text-[8px] text-tertiary font-semibold shrink-0">
                            {areaM2} m²
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-[10px] font-bold text-on-surface truncate">
                            {Math.round(offcut.w)} × {Math.round(offcut.h)} mm
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Bottom Height indicator */}
          <div className="w-full flex items-center justify-between px-2 mt-1.5 text-on-surface-variant text-[10px] font-label-md">
            <span>
              Grosor Veta:{' '}
              {isVerticalGrain
                ? `Paralelo al lado de ${currentBoard.widthMm} mm`
                : `Paralelo al lado de ${currentBoard.lengthMm} mm`}
            </span>
            <span className="text-tertiary font-medium">
              {layout.placed.length}/{layout.totalRequested} Cortes Asignados
            </span>
          </div>
        </div>

        {/* Simulator Control Dock */}
        <div className="flex items-center justify-between gap-space-xs pt-1 flex-wrap">
          <div className="flex items-center gap-1 bg-surface-container rounded-full p-1">
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.min(1.3, +(s + 0.1).toFixed(2)))}
              aria-label="Acercar plano"
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:text-primary active:scale-90"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_in</span>
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(1)}
              className="px-2.5 h-8 rounded-full text-label-md font-label-md text-on-surface hover:text-primary active:scale-95"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))}
              aria-label="Alejar plano"
              className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:text-primary active:scale-90"
            >
              <span className="material-symbols-outlined text-[18px]">zoom_out</span>
            </button>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => {
                setShowLabels(!showLabels);
                triggerToast(
                  !showLabels ? 'Cotaciones de piezas activadas' : 'Cotaciones de piezas ocultas'
                );
              }}
              className={`h-9 px-3.5 rounded-full font-label-md text-label-md font-medium flex items-center gap-1.5 active:scale-95 transition-all ${
                showLabels
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  showLabels ? 'text-on-primary' : 'text-primary'
                }`}
              >
                label
              </span>
              <span>Ver Etiquetas</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSawGuides(!showSawGuides);
                triggerToast(
                  !showSawGuides
                    ? `Guías de corte (${kerfMm.toFixed(1)}mm) visibles`
                    : 'Guías de corte ocultas'
                );
              }}
              className={`h-9 px-3.5 rounded-full font-label-md text-label-md font-medium flex items-center gap-1.5 active:scale-95 transition-all ${
                showSawGuides
                  ? 'bg-tertiary-container text-on-tertiary-container'
                  : 'bg-surface-container-high text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary">
                content_cut
              </span>
              <span>Guías Sierra</span>
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Breakdown: Assigned Cut List with Dynamic Add/Remove */}
      <div className="flex flex-col gap-space-md">
        <section className="bg-surface-container-low p-space-md rounded-3xl shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-space-xs">
              <span
                className="material-symbols-outlined text-primary text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                format_list_bulleted
              </span>
              <h2 className="font-title-sm text-title-sm text-on-surface font-semibold">
                Lista de Cortes Asignados
              </h2>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium">
                {cuts.length} Tipos • {layout.totalRequested} Piezas
              </span>
              <button
                type="button"
                onClick={handleSaveAllCutsToInventory}
                disabled={cuts.length === 0}
                className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:pointer-events-none"
                title="Guardar todos los cortes en Inventario con sus medidas y precios"
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span>Guardar en Inventario</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center gap-1 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showAddForm ? 'expand_less' : 'add'}
                </span>
                <span>{showAddForm ? 'Cerrar' : '+ Agregar Corte'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Form to Add a New Cut */}
          {showAddForm && (
            <form
              onSubmit={handleAddCut}
              className="p-3.5 rounded-2xl bg-surface-container border border-primary/30 flex flex-col gap-3 my-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">
                  Nuevo Corte a Medida
                </span>
                {cuts.length === 0 && (
                  <button
                    type="button"
                    onClick={handleRestoreDemoOrder}
                    className="text-[11px] text-secondary underline hover:text-on-surface"
                  >
                    Cargar orden de ejemplo
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant font-medium">
                    Nombre / Identificador de Pieza
                  </label>
                  <input
                    type="text"
                    value={newCutName}
                    onChange={(e) => setNewCutName(e.target.value)}
                    placeholder="Ej: Puerta Alacena / Estante"
                    className="h-10 px-3 rounded-xl bg-surface-container-high text-on-surface text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant font-medium">
                    Tapacantos
                  </label>
                  <select
                    value={newCutEdge}
                    onChange={(e) => setNewCutEdge(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-surface-container-high text-on-surface text-body-md focus:outline-none"
                  >
                    <option value="Cantos 4L (2mm)">Cantos 4L (2mm)</option>
                    <option value="Cantos 2L Frontal">Cantos 2L Frontal</option>
                    <option value="Canto 1L">Canto 1L</option>
                    <option value="Sin canto">Sin canto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant font-medium">
                    Largo (mm)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={currentBoard.lengthMm}
                    value={newCutLength}
                    onChange={(e) => setNewCutLength(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-surface-container-high text-on-surface font-mono text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant font-medium">
                    Ancho (mm)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={currentBoard.widthMm}
                    value={newCutWidth}
                    onChange={(e) => setNewCutWidth(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-surface-container-high text-on-surface font-mono text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-on-surface-variant font-medium">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newCutQty}
                    onChange={(e) => setNewCutQty(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-surface-container-high text-on-surface font-mono text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-label-md text-on-surface-variant">
                  <input
                    type="checkbox"
                    checked={newCutGrain}
                    onChange={(e) => setNewCutGrain(e.target.checked)}
                    className="rounded accent-primary"
                  />
                  <span>Respetar sentido de veta</span>
                </label>

                <button
                  type="submit"
                  className="h-10 px-5 rounded-full bg-primary text-on-primary font-label-md font-semibold flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Insertar en Placa</span>
                </button>
              </div>
            </form>
          )}

          {/* Cuts List */}
          {cuts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-surface-container flex flex-col items-center justify-center text-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[28px]">
                carpenter
              </span>
              <span className="font-title-sm text-body-lg text-on-surface font-semibold">
                Orden de Corte en Blanco
              </span>
              <p className="text-label-md text-on-surface-variant max-w-sm">
                La placa está 100% libre. Usa el formulario superior para ingresar cada corte
                manualmente o restaura los cortes de demostración.
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md font-semibold"
                >
                  + Ingresar Primer Corte
                </button>
                <button
                  type="button"
                  onClick={handleRestoreDemoOrder}
                  className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md"
                >
                  Restaurar Demo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {cuts.map((cut, index) => {
                const isSelected = selectedCutId === cut.id;
                const cutAreaM2 = (cut.lengthMm * cut.widthMm) / 1_000_000;
                const unitPrice = computeCutPrice(cut.lengthMm, cut.widthMm);
                const subtotalPrice = unitPrice * cut.quantity;

                return (
                  <div
                    key={cut.id}
                    onClick={() => setSelectedCutId(cut.id)}
                    className={`p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer ${
                      isSelected ? 'ring-1 ring-primary/40' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full font-label-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                          index === 0
                            ? 'bg-[#3d07d9] text-[#b3abff]'
                            : 'bg-surface-container-high text-on-surface'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-title-sm text-body-lg text-on-surface font-semibold truncate leading-tight">
                            {cut.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary-container/40 text-primary font-label-md text-[11px] font-bold">
                            ${unitPrice.toLocaleString('es-AR')} / un.
                          </span>
                          {cut.quantity > 1 && (
                            <span className="text-[11px] text-on-surface-variant font-mono">
                              (${subtotalPrice.toLocaleString('es-AR')} total)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span
                            className={`font-label-md text-label-md font-bold ${
                              index === 0 ? 'text-primary' : 'text-on-surface'
                            }`}
                          >
                            {cut.lengthMm} × {cut.widthMm} mm
                          </span>
                          <span className="text-on-surface-variant font-label-md text-[11px]">
                            • {cutAreaM2.toFixed(2)} m²
                          </span>
                          <span className="text-on-surface-variant font-label-md text-[10px]">
                            • {cut.edgeSpec}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center gap-1 bg-surface-container-high rounded-full p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateCutQty(cut.id, -1)}
                          aria-label="Disminuir cantidad"
                          className="w-6 h-6 rounded-full hover:bg-surface-bright text-on-surface-variant hover:text-on-surface flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="px-1.5 font-label-md text-[11px] font-bold text-on-surface">
                          ×{cut.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCutQty(cut.id, 1)}
                          aria-label="Aumentar cantidad"
                          className="w-6 h-6 rounded-full hover:bg-surface-bright text-on-surface-variant hover:text-on-surface flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </div>

                      {cut.respectGrain && (
                        <span
                          className="material-symbols-outlined text-tertiary text-[18px]"
                          title="Veta respetada"
                        >
                          waves
                        </span>
                      )}

                      {/* Quick Save Single Cut to Inventory Button */}
                      <button
                        type="button"
                        onClick={() => handleSaveSingleCutToInventory(cut)}
                        title="Guardar este corte en Inventario con su precio y medidas"
                        className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-secondary flex items-center justify-center transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                      </button>

                      {/* Delete Cut Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveCut(cut.id, cut.name)}
                        aria-label={`Eliminar corte ${cut.name}`}
                        className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-error-container text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
                        title="Eliminar corte"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Block 2: Sobrantes y Retazos Estimados */}
        <section className="bg-surface-container-low p-space-md rounded-3xl shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-tertiary text-[20px]">recycling</span>
              <h2 className="font-title-sm text-title-sm text-on-surface font-semibold">
                Sobrantes y Retazos Estimados
              </h2>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">
              {(layout.wasteAreaMm2 / 1_000_000).toFixed(2)} m² Restante Total
            </span>
          </div>

          <div className="grid grid-cols-1 gap-space-xs">
            {/* Retazo A: Reutilizable */}
            {primaryOffcut ? (
              <div className="p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#881e00]/30 text-tertiary flex items-center justify-center shrink-0 font-bold text-title-sm">
                    A
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-sm text-body-lg text-on-surface font-semibold truncate leading-tight">
                        Retazo Apto Stock
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-tertiary/20 text-tertiary font-label-md text-[9px] font-bold">
                        ALMACENAR
                      </span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant mt-0.5">
                      {Math.round(primaryOffcut.w)} × {Math.round(primaryOffcut.h)} mm •{' '}
                      {((primaryOffcut.w * primaryOffcut.h) / 1_000_000).toFixed(2)} m² (
                      {currentBoard.grainNote})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRetazoStocked(true);
                    triggerToast(
                      `Retazo A (${Math.round(primaryOffcut.w)}×${Math.round(
                        primaryOffcut.h
                      )}mm) ingresado a stock`
                    );
                  }}
                  className={`px-3 h-8 rounded-full text-label-md font-label-md font-medium shrink-0 flex items-center gap-1 active:scale-95 transition-all ${
                    retazoStocked
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-primary hover:text-on-primary hover:bg-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {retazoStocked ? 'check' : 'inventory'}
                  </span>
                  <span>{retazoStocked ? 'En Stock' : 'Alta Stock'}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-surface-container text-on-surface-variant text-label-md">
                Sin retazos mayores a 0.20 m² disponibles.
              </div>
            )}

            {/* Retazo B: Scrap / Descarte */}
            {primaryScrap && (
              <div className="p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-space-sm opacity-80">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-error-container/20 text-error flex items-center justify-center shrink-0 font-bold text-title-sm">
                    B
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-sm text-body-lg text-on-surface font-semibold truncate leading-tight">
                        Descarte Directo (Scrap)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-error-container text-error font-label-md text-[9px] font-bold">
                        MERMA
                      </span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface-variant mt-0.5">
                      {Math.round(primaryScrap.w)} × {Math.round(primaryScrap.h)} mm •{' '}
                      {((primaryScrap.w * primaryScrap.h) / 1_000_000).toFixed(2)} m² (Menor a
                      umbral útil)
                    </span>
                  </div>
                </div>
                <span className="text-on-surface-variant font-label-md text-[11px] shrink-0">
                  Reciclaje Taller
                </span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Primary Workshop Output Actions */}
      <section className="mt-space-xs flex flex-col gap-space-xs">
        <button
          type="button"
          onClick={() => triggerToast('Plano de Corte CAD (.PDF) generado y descargado')}
          className="w-full h-14 rounded-full bg-surface-container-high text-on-surface font-headline-md text-body-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-surface-variant active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">picture_as_pdf</span>
          <span>Exportar Plano de Corte CAD (.PDF)</span>
        </button>

        <div className="grid grid-cols-2 gap-space-xs">
          <button
            type="button"
            onClick={() => setActiveModal('qr')}
            className="h-12 rounded-full bg-surface-container text-on-surface hover:text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Imprimir QR Piezas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('gcode')}
            className="h-12 rounded-full bg-surface-container text-on-surface hover:text-tertiary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">terminal</span>
            <span>Código G-Code CNC</span>
          </button>
        </div>
      </section>

      {/* Modal: QR Labels or G-Code Preview */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface-container-high p-5 shadow-2xl border border-outline-variant/30 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  {activeModal === 'qr' ? 'qr_code_2' : 'terminal'}
                </span>
                <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
                  {activeModal === 'qr'
                    ? `Etiquetas Zebra QR (${layout.placed.length} Piezas)`
                    : 'Programa G-Code CNC (Guillotina)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {activeModal === 'qr' ? (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {layout.placed.length === 0 ? (
                  <p className="col-span-2 text-center text-on-surface-variant py-4">
                    No hay piezas ubicadas en la placa.
                  </p>
                ) : (
                  layout.placed.map((p) => (
                    <div
                      key={p.instanceIndex}
                      className="p-3 rounded-2xl bg-surface-container flex flex-col gap-1 border border-outline-variant/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-label-md font-bold text-primary">
                          #{p.instanceIndex}
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-on-surface">
                          qr_code_2
                        </span>
                      </div>
                      <span className="text-[12px] font-semibold text-on-surface truncate">
                        {p.name}
                      </span>
                      <span className="text-[11px] font-mono text-on-surface-variant">
                        {p.lengthMm}×{p.widthMm}mm • {p.edgeSpec}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <pre className="p-3 rounded-2xl bg-surface-container-lowest text-[11px] font-mono text-primary overflow-x-auto leading-relaxed max-h-64">
                {`; MUEBLES J&L - VILLA LUZURIAGA
; PLACA: ${currentBoard.name.toUpperCase()} (${currentBoard.lengthMm}x${currentBoard.widthMm}x18)
; SIERRA KERF: ${kerfMm.toFixed(1)} MM
G21 G90 G40
M03 S18000
${layout.placed
  .slice(0, 8)
  .map(
    (p) =>
      `G00 X${p.xMm.toFixed(1)} Y${p.yMm.toFixed(1)} Z15.0\nG01 Z-18.5 F1200\nG01 X${(
        p.xMm + p.lengthMm
      ).toFixed(1)} Y${(p.yMm + p.widthMm).toFixed(1)} F4200 ; #${p.instanceIndex} ${p.name}`
  )
  .join('\n')}
M05
M30`}
              </pre>
            )}

            <button
              type="button"
              onClick={() => {
                triggerToast(
                  activeModal === 'qr'
                    ? `Cola de ${layout.placed.length} etiquetas enviada a impresora térmica`
                    : 'Archivo .NC exportado para seccionadora CNC'
                );
                setActiveModal(null);
              }}
              className="w-full h-11 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">
                {activeModal === 'qr' ? 'print' : 'download'}
              </span>
              <span>
                {activeModal === 'qr' ? 'Enviar a Impresora Zebra' : 'Descargar Programa .NC'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-surface-container-highest/95 backdrop-blur-xl text-on-surface shadow-2xl flex items-center gap-2 pointer-events-none">
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          <span className="text-[13px] font-medium whitespace-nowrap">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
