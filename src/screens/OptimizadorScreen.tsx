import React, { useState } from 'react';

interface BoardOption {
  name: string;
  spec: string;
  image: string;
  grainNote: string;
}

const BOARD_OPTIONS: BoardOption[] = [
  {
    name: 'Carvalho Mezzo 18mm',
    spec: 'Faplac Texturado • 2750 × 1830 mm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2wP3mWnUoJi_J5zBbvCSbRIpxMp6RyeK6Mo7q6HPev0CDKCf1rjkwwBPsmteh0YCtbGeVlbNBVutGzqVlAtchNxwvQoWsY7IebNmTb8T2ON2QcY2S21eYlrXujhmJ_EpV7g6D4pBG3gyCwP8IYln1oNcRsv2OiixhlhuA9RiLUdYXHuzFrO9D-w_iUqf2SIPhMC68db9_YOMdbp71QxJE8DhsdEtWh7pBNdWoH_7UbU-x_MDxHw8sRw',
    grainNote: 'Veta Carvalho Mezzo',
  },
  {
    name: 'Blanco Puro 18mm',
    spec: 'Guillermina Mate • 2750 × 1830 mm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbJfWRGRZRXR_2KeD0RB06XQmSnbnlQZinziKIQXOjOA3MUNi8bJbevEXlcvA4wK4HDWE-gWnBlcBTNwIwmHSPEBYwyPeWAz50XqWwrVk_S6b21Uv0duJi-ynVzBdldRFvqhsypoUk9A6z3TWblh8m3LO2lQ8P-9-9E3ZfjQGy124IZpU-uhmwQs-L7VJtw94ElvcuRaNdv4IGNLmYyDgusxNQLy2UgfIVqGNvC1n3juoEjOQD6z-v7A',
    grainNote: 'Sin veta direccional',
  },
  {
    name: 'Roble Dakar 18mm',
    spec: 'Faplac Poro Profundo • 2750 × 1830 mm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCS4ZH1ozdXNYTx6M0HdWyhx6KSavd6M3pDhlOH-zW7OtMLQQm_jJlYOSGEksAzUXs-x-fKB7IzVJoYvOmM0cT1V4eKjgw5SEiA_UvVYWueD7YR1FlaTn6FnFcvB5UC0oeDBCCH-1I2Uf6xcZyfhyHc5HyBOwlUgRPypBhjkr0zqS6PLASZmZ6QO0bYwmir-vIlUVkwzL2rnpOLkudRQh8zrjLVEhm8JjeeKEwze8Zml2KPvPLSlYcTVw',
    grainNote: 'Veta Roble Dakar',
  },
];

export const OptimizadorScreen: React.FC = () => {
  const [boardIndex, setBoardIndex] = useState(0);
  const [kerfMm, setKerfMm] = useState<number>(3.2);
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [ringOffset, setRingOffset] = useState(29.15);
  const [isVerticalGrain, setIsVerticalGrain] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [showLabels, setShowLabels] = useState(false);
  const [showSawGuides, setShowSawGuides] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(1);
  const [retazoStocked, setRetazoStocked] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'qr' | 'gcode' | null>(null);

  const currentBoard = BOARD_OPTIONS[boardIndex];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const handleRecompute = () => {
    setIsRecomputing(true);
    setRingOffset(251.32);
    setTimeout(() => {
      setIsRecomputing(false);
      setRingOffset(29.15);
      triggerToast(`Algoritmo Guillotina ejecutado • Rendimiento 88.4% (${currentBoard.name})`);
    }, 320);
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

  const handleExportPdf = () => {
    triggerToast('Plano de Corte CAD (.PDF) generado y descargado');
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 gap-space-md">
      {/* Panel Config & Spec Selector */}
      <section className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-3xl shadow-sm">
        <div className="flex items-center justify-between gap-space-sm">
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
          <button
            type="button"
            onClick={handleCycleKerf}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface text-label-md font-label-md active:scale-95 transition-transform"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3d07d9] animate-pulse"></span>
            <span>
              Sierra: <strong className="text-primary font-bold">{kerfMm.toFixed(1)} mm</strong>
            </span>
          </button>
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
            Nivel Óptimo
          </span>
        </div>

        <div className="flex items-center gap-space-md">
          {/* Gauge SVG */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                className="text-surface-container"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeWidth="9"
              />
              {/* Progress ring: 88.4% of 251.32 = 222.16 */}
              <circle
                className="text-[#3d07d9] transition-all duration-700 ease-out"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.32"
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                strokeWidth="9"
              />
              {/* Secondary Kerf Scrap ring */}
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
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface tracking-tight">
                88.4<span className="text-title-sm font-normal text-primary">%</span>
              </span>
              <span className="font-telemetry-unit text-telemetry-unit uppercase tracking-widest text-on-surface-variant -mt-1">
                Yield Total
              </span>
            </div>
          </div>

          {/* Quick Telemetry Pillars */}
          <div className="grid grid-cols-2 gap-space-xs flex-1">
            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                Área Útil
              </span>
              <span className="font-telemetry-num text-telemetry-num text-primary font-bold mt-0.5">
                4.45{' '}
                <span className="text-label-md text-on-surface-variant font-normal">m²</span>
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant leading-tight">
                4,451,200 mm²
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                Desperdicio
              </span>
              <span className="font-telemetry-num text-telemetry-num text-error font-bold mt-0.5">
                0.58{' '}
                <span className="text-label-md text-on-surface-variant font-normal">m²</span>
              </span>
              <span className="font-label-md text-[10px] text-error font-medium leading-tight">
                11.6% del panel
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                Cortes
              </span>
              <span className="font-telemetry-num text-telemetry-num text-on-surface font-bold mt-0.5">
                14{' '}
                <span className="text-label-md text-on-surface-variant font-normal">uds.</span>
              </span>
              <span className="font-label-md text-[10px] text-tertiary font-medium leading-tight">
                100% ubicados
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded-2xl flex flex-col">
              <span className="font-telemetry-unit text-telemetry-unit uppercase text-on-surface-variant font-medium">
                Sobrantes
              </span>
              <span className="font-telemetry-num text-telemetry-num text-tertiary font-bold mt-0.5">
                2{' '}
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
            Largo: 2750 mm
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">height</span>
            Ancho: 1830 mm
          </span>
        </div>

        {/* CAD Visualizer Frame */}
        <div className="relative w-full rounded-2xl bg-surface-container-lowest p-2 shadow-inner overflow-hidden select-none">
          {/* Architectural Dimension Overlays: Top ruler */}
          <div className="w-full flex items-center justify-between px-2 mb-1.5 text-primary text-[10px] font-label-md">
            <div className="h-1.5 w-1.5 border-l border-t border-primary/50"></div>
            <div className="flex-1 flex items-center justify-center gap-2">
              <div className="h-[1px] flex-1 bg-primary/30"></div>
              <span className="font-bold tracking-wider">2750 mm</span>
              <div className="h-[1px] flex-1 bg-primary/30"></div>
            </div>
            <div className="h-1.5 w-1.5 border-r border-t border-primary/50"></div>
          </div>

          {/* Blueprint Sheet (Simulating 2750x1830 ratio ~ 1.503:1) */}
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

            {/* Saw Kerf Guides Overlay when active */}
            {showSawGuides && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute top-[32.7%] left-0 w-[43.6%] border-t-2 border-dashed border-tertiary/80" />
                <div className="absolute top-0 left-[43.6%] h-full border-l-2 border-dashed border-tertiary/80" />
                <div className="absolute top-0 left-[58.1%] h-full border-l-2 border-dashed border-tertiary/80" />
                <div className="absolute top-[68%] right-0 w-[41.9%] border-t-2 border-dashed border-error/80" />
              </div>
            )}

            {/* Piece 1: Tapa Mesa (1200x600) */}
            <div
              onClick={() => setSelectedPiece(1)}
              className="absolute top-0 left-0 w-[43.6%] h-[32.7%] p-1"
            >
              <div
                className={`w-full h-full rounded-xl bg-[#3d07d9]/25 hover:bg-[#3d07d9]/40 transition-colors flex flex-col justify-between p-1.5 cursor-pointer shadow-sm relative ${
                  selectedPiece === 1 ? 'ring-1 ring-primary/60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-[#3d07d9] text-[#b3abff] font-label-md text-[10px] font-bold flex items-center justify-center">
                    #1
                  </span>
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    crop_free
                  </span>
                </div>
                {showLabels && (
                  <span className="text-[9px] font-mono text-on-surface/90">1200×600</span>
                )}
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="font-label-md text-[10px] text-primary truncate font-bold">
                    Tapa Mesa
                  </span>
                </div>
              </div>
            </div>

            {/* Piece 2: Lateral Izquierdo (720x450) */}
            <div
              onClick={() => setSelectedPiece(2)}
              className="absolute top-[32.7%] left-0 w-[26.1%] h-[24.5%] p-1"
            >
              <div
                className={`w-full h-full rounded-xl bg-[#3d07d9]/20 hover:bg-[#3d07d9]/35 transition-colors flex flex-col justify-between p-1.5 cursor-pointer relative ${
                  selectedPiece === 2 ? 'ring-1 ring-primary/60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-[#3d07d9] text-[#b3abff] font-label-md text-[10px] font-bold flex items-center justify-center">
                    #2
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                </div>
                {showLabels && (
                  <span className="text-[8px] font-mono text-on-surface/80">720×450</span>
                )}
                <span className="font-label-md text-[10px] text-on-surface truncate">
                  Lateral Izq
                </span>
              </div>
            </div>

            {/* Piece 3: Lateral Derecho (720x450) */}
            <div
              onClick={() => setSelectedPiece(3)}
              className="absolute top-[57.2%] left-0 w-[26.1%] h-[24.5%] p-1"
            >
              <div
                className={`w-full h-full rounded-xl bg-[#3d07d9]/20 hover:bg-[#3d07d9]/35 transition-colors flex flex-col justify-between p-1.5 cursor-pointer relative ${
                  selectedPiece === 3 ? 'ring-1 ring-primary/60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-[#3d07d9] text-[#b3abff] font-label-md text-[10px] font-bold flex items-center justify-center">
                    #3
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                </div>
                {showLabels && (
                  <span className="text-[8px] font-mono text-on-surface/80">720×450</span>
                )}
                <span className="font-label-md text-[10px] text-on-surface truncate">
                  Lateral Der
                </span>
              </div>
            </div>

            {/* Piece 4, 5, 6: Estantes (560x420 each) */}
            <div
              onClick={() => setSelectedPiece(4)}
              className="absolute top-[32.7%] left-[26.1%] w-[20.3%] h-[22.9%] p-1"
            >
              <div className="w-full h-full rounded-xl bg-surface-container-highest hover:bg-[#3d07d9]/30 transition-colors flex flex-col justify-between p-1 cursor-pointer">
                <span className="w-4 h-4 rounded-full bg-surface-variant text-on-surface font-label-md text-[9px] font-bold flex items-center justify-center">
                  #4
                </span>
                {showLabels && <span className="text-[8px] font-mono">560×420</span>}
                <span className="font-label-md text-[9px] text-on-surface truncate">Est. 1</span>
              </div>
            </div>
            <div
              onClick={() => setSelectedPiece(5)}
              className="absolute top-[55.6%] left-[26.1%] w-[20.3%] h-[22.9%] p-1"
            >
              <div className="w-full h-full rounded-xl bg-surface-container-highest hover:bg-[#3d07d9]/30 transition-colors flex flex-col justify-between p-1 cursor-pointer">
                <span className="w-4 h-4 rounded-full bg-surface-variant text-on-surface font-label-md text-[9px] font-bold flex items-center justify-center">
                  #5
                </span>
                {showLabels && <span className="text-[8px] font-mono">560×420</span>}
                <span className="font-label-md text-[9px] text-on-surface truncate">Est. 2</span>
              </div>
            </div>
            <div
              onClick={() => setSelectedPiece(6)}
              className="absolute top-[78.5%] left-[26.1%] w-[20.3%] h-[21.5%] p-1"
            >
              <div className="w-full h-full rounded-xl bg-surface-container-highest hover:bg-[#3d07d9]/30 transition-colors flex flex-col justify-between p-1 cursor-pointer">
                <span className="w-4 h-4 rounded-full bg-surface-variant text-on-surface font-label-md text-[9px] font-bold flex items-center justify-center">
                  #6
                </span>
                {showLabels && <span className="text-[8px] font-mono">560×420</span>}
                <span className="font-label-md text-[9px] text-on-surface truncate">Est. 3</span>
              </div>
            </div>

            {/* Piece 7, 8, 9, 10: Drawer Fronts Column (400x180) */}
            <div className="absolute top-0 left-[43.6%] w-[14.5%] h-[40.0%] p-1 flex flex-col gap-0.5">
              {['A', 'B', 'C', 'D'].map((letter, idx) => (
                <div
                  key={letter}
                  onClick={() => setSelectedPiece(7 + idx)}
                  className="flex-1 rounded-lg bg-surface-variant/90 p-1 flex items-center justify-between cursor-pointer hover:bg-[#3d07d9]/30"
                >
                  <span className="font-label-md text-[8px] text-primary">#{7 + idx}</span>
                  <span className="font-label-md text-[8px] text-on-surface">Caj. {letter}</span>
                </div>
              ))}
            </div>

            {/* Piece 11, 12, 13, 14: Minor Parts Cluster */}
            <div className="absolute top-[40.0%] left-[46.4%] w-[11.7%] h-[60.0%] p-1 flex flex-col gap-1">
              {[
                { num: 11, name: 'Zócalo' },
                { num: 12, name: 'Fondo A' },
                { num: 13, name: 'Fondo B' },
                { num: 14, name: 'Listón' },
              ].map((part) => (
                <div
                  key={part.num}
                  onClick={() => setSelectedPiece(part.num)}
                  className="flex-1 rounded-lg bg-surface-variant p-1 flex flex-col justify-center items-center cursor-pointer hover:bg-[#3d07d9]/30"
                >
                  <span className="font-label-md text-[8px] text-on-surface-variant">
                    #{part.num}
                  </span>
                  <span className="font-label-md text-[7px] text-on-surface">{part.name}</span>
                </div>
              ))}
            </div>

            {/* REUTILIZABLE 1 (Retazo A: 1350x410) */}
            <div className="absolute top-0 right-0 w-[41.9%] h-[68%] p-1">
              <div className="w-full h-full rounded-xl bg-[#881e00]/20 border border-tertiary-fixed-dim/30 flex flex-col justify-between p-2 shadow-inner">
                <div className="flex items-center justify-between gap-1">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-tertiary/20 text-tertiary font-label-md text-[9px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                    RETAZO A • APTO STOCK
                  </span>
                  <span className="font-label-md text-[9px] text-tertiary font-semibold">
                    0.55 m²
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-[11px] font-bold text-on-surface">
                    1350 × 410 mm
                  </span>
                  <span className="font-label-md text-[9px] text-on-surface-variant">
                    Reingresa a depósito
                  </span>
                </div>
              </div>
            </div>

            {/* SCRAP (Retazo B & Residual Kerf Band: lower right) */}
            <div className="absolute bottom-0 right-0 w-[41.9%] h-[32%] p-1">
              <div className="w-full h-full rounded-xl bg-error-container/25 flex flex-col justify-between p-2 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded-full bg-error-container text-error font-label-md text-[9px] font-bold uppercase">
                    Scrap / Merma
                  </span>
                  <span className="font-label-md text-[9px] text-error font-semibold">0.03 m²</span>
                </div>
                <span className="font-label-md text-[10px] text-on-surface-variant truncate">
                  820 × 190 mm (No recuperable)
                </span>
              </div>
            </div>

            {/* Bottom Left Scrap stripe */}
            <div className="absolute bottom-0 left-0 w-[26.1%] h-[18.3%] p-1">
              <div className="w-full h-full rounded-xl bg-error-container/20 flex items-center justify-center">
                <span className="font-label-md text-[8px] text-error uppercase font-medium">
                  Sobrante Menor
                </span>
              </div>
            </div>
          </div>

          {/* Architectural Dimension Overlays: Bottom Height indicator */}
          <div className="w-full flex items-center justify-between px-2 mt-1.5 text-on-surface-variant text-[10px] font-label-md">
            <span>
              Grosor Veta:{' '}
              {isVerticalGrain ? 'Paralelo al lado de 1830 mm' : 'Paralelo al lado de 2750 mm'}
            </span>
            <span className="text-tertiary font-medium">14/14 Cortes Asignados</span>
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

      {/* Detailed Breakdown: Two Inspectable Blocks */}
      <div className="flex flex-col gap-space-md">
        {/* Block 1: Assigned Cut List */}
        <section className="bg-surface-container-low p-space-md rounded-3xl shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
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
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md font-medium">
              10 Tipos • 14 Piezas
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {/* Item 1: Tapa Mesa */}
            <div
              onClick={() => setSelectedPiece(1)}
              className={`p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer ${
                selectedPiece === 1 ? 'ring-1 ring-primary/40' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#3d07d9] text-[#b3abff] font-label-md text-[11px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-sm text-body-lg text-on-surface font-semibold truncate leading-tight">
                    Tapa Mesa Principal
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      1200 × 600 mm
                    </span>
                    <span className="text-on-surface-variant font-label-md text-[10px]">
                      • Cantos 4L (2mm)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-primary">
                    straighten
                  </span>
                  ×1
                </span>
                <span
                  className="material-symbols-outlined text-tertiary text-[18px]"
                  title="Veta respetada"
                >
                  waves
                </span>
              </div>
            </div>

            {/* Item 2: Laterales */}
            <div
              onClick={() => setSelectedPiece(2)}
              className={`p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer ${
                selectedPiece === 2 ? 'ring-1 ring-primary/40' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface font-label-md text-[11px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-sm text-body-lg text-on-surface font-semibold truncate leading-tight">
                    Laterales de Módulo
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      720 × 450 mm
                    </span>
                    <span className="text-on-surface-variant font-label-md text-[10px]">
                      • Cantos 2L Frontal
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-primary">
                    straighten
                  </span>
                  ×2
                </span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">waves</span>
              </div>
            </div>

            {/* Item 3: Estantes */}
            <div
              onClick={() => setSelectedPiece(4)}
              className={`p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer ${
                selectedPiece === 4 ? 'ring-1 ring-primary/40' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface font-label-md text-[11px] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-sm text-body-lg text-on-surface font-semibold truncate leading-tight">
                    Estantes Regulables
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      560 × 420 mm
                    </span>
                    <span className="text-on-surface-variant font-label-md text-[10px]">
                      • Canto 1L
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-primary">
                    straighten
                  </span>
                  ×3
                </span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">waves</span>
              </div>
            </div>

            {/* Item 4: Frentes de Cajón */}
            <div
              onClick={() => setSelectedPiece(7)}
              className={`p-3 rounded-2xl bg-surface-container flex items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer ${
                selectedPiece === 7 ? 'ring-1 ring-primary/40' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface font-label-md text-[11px] font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="font-title-sm text-body-lg text-on-surface font-semibold truncate leading-tight">
                    Frentes de Cajón Soft
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      400 × 180 mm
                    </span>
                    <span className="text-on-surface-variant font-label-md text-[10px]">
                      • Cantos 4L (Veta Continua)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-primary">
                    straighten
                  </span>
                  ×4
                </span>
                <span className="material-symbols-outlined text-tertiary text-[18px]">waves</span>
              </div>
            </div>
          </div>
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
              0.58 m² Merma Total
            </span>
          </div>

          <div className="grid grid-cols-1 gap-space-xs">
            {/* Retazo A: Reutilizable */}
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
                    1350 × 410 mm • 0.55 m² ({currentBoard.grainNote})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRetazoStocked(true);
                  triggerToast('Retazo A (1350×410mm) ingresado a stock de recortes');
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

            {/* Retazo B: Scrap / Descarte */}
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
                    820 × 190 mm • 0.03 m² (Menor a umbral útil)
                  </span>
                </div>
              </div>
              <span className="text-on-surface-variant font-label-md text-[11px] shrink-0">
                Reciclaje Taller
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Primary Workshop Output Actions */}
      <section className="mt-space-xs flex flex-col gap-space-xs">
        <button
          type="button"
          onClick={handleExportPdf}
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
                    ? 'Etiquetas Zebra QR (14 Piezas)'
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
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '#1', name: 'Tapa Mesa Principal', dim: '1200×600mm', edge: '4L 2mm' },
                  { id: '#2', name: 'Lateral Módulo Izq', dim: '720×450mm', edge: '2L Frontal' },
                  { id: '#3', name: 'Lateral Módulo Der', dim: '720×450mm', edge: '2L Frontal' },
                  { id: '#4', name: 'Estante Regulable 1', dim: '560×420mm', edge: '1L Frontal' },
                ].map((label) => (
                  <div
                    key={label.id}
                    className="p-3 rounded-2xl bg-surface-container flex flex-col gap-1 border border-outline-variant/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-label-md font-bold text-primary">{label.id}</span>
                      <span className="material-symbols-outlined text-[18px] text-on-surface">
                        qr_code_2
                      </span>
                    </div>
                    <span className="text-[12px] font-semibold text-on-surface truncate">
                      {label.name}
                    </span>
                    <span className="text-[11px] font-mono text-on-surface-variant">
                      {label.dim} • {label.edge}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="p-3 rounded-2xl bg-surface-container-lowest text-[11px] font-mono text-primary overflow-x-auto leading-relaxed">
                {`; MUEBLES J&L - VILLA LUZURIAGA
; PLACA: ${currentBoard.name.toUpperCase()} (2750x1830x18)
; SIERRA KERF: ${kerfMm.toFixed(1)} MM
G21 G90 G40
M03 S18000
G00 X0.000 Y1226.800 Z15.000
G01 Z-18.500 F1200
G01 X1200.000 Y1226.800 F4200 ; CORTE #1 TAPA MESA
G00 Z15.000
G00 X720.000 Y0.000
G01 Z-18.500 F1200
G01 X720.000 Y1223.600 F4200 ; CORTES #2 #3 LATERALES
M05
M30`}
              </pre>
            )}

            <button
              type="button"
              onClick={() => {
                triggerToast(
                  activeModal === 'qr'
                    ? 'Cola de 14 etiquetas enviada a impresora térmica'
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
