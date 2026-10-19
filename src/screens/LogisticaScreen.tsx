import React, { useState } from 'react';

interface DestinationOption {
  id: string;
  label: string;
  name: string;
  distanceKm: number;
  timeText: string;
  pinLabel: string;
}

const DESTINATIONS: DestinationOption[] = [
  {
    id: 'ramos',
    label: 'Av. de Mayo 850, Ramos Mejía (8.4 km)',
    name: 'Av. de Mayo 850, Ramos Mejía',
    distanceKm: 8.4,
    timeText: '22 min (Tránsito fluido)',
    pinLabel: 'Arq. Rossi (#PED-1084)',
  },
  {
    id: 'castelar',
    label: 'Castelar Norte (6.2 km)',
    name: 'Castelar Norte',
    distanceKm: 6.2,
    timeText: '18 min',
    pinLabel: 'Lucas Benítez (#PED-1088)',
  },
  {
    id: 'caballito',
    label: 'Caballito, CABA (16.5 km)',
    name: 'Caballito, CABA',
    distanceKm: 16.5,
    timeText: '40 min (Por Autopista)',
    pinLabel: 'Caballito CABA',
  },
  {
    id: 'nordelta',
    label: 'Nordelta, Tigre (42.0 km)',
    name: 'Nordelta, Tigre',
    distanceKm: 42.0,
    timeText: '68 min (Acceso Norte)',
    pinLabel: 'Nordelta Tigre',
  },
  {
    id: 'luzuriaga',
    label: 'Radio Local Luzuriaga (1.2 km)',
    name: 'Radio Local Villa Luzuriaga',
    distanceKm: 1.2,
    timeText: '5 min',
    pinLabel: 'Arq. Peña (#PED-1091)',
  },
];

export const LogisticaScreen: React.FC = () => {
  const [selectedDestId, setSelectedDestId] = useState('ramos');
  const [ratePerKm, setRatePerKm] = useState(1200);
  const [zoneRates, setZoneRates] = useState({ z1: 12000, z2: 18500, z3: 26000 });
  const [copiedState, setCopiedState] = useState(false);
  const [fuelUpdated, setFuelUpdated] = useState(false);

  const baseFee = 8000;
  const currentDest =
    DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];
  const totalCost = Math.round(baseFee + currentDest.distanceKm * ratePerKm);

  const gmapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(
    'Villa Luzuriaga, Garibaldi y Triunvirato, Buenos Aires'
  )}/${encodeURIComponent(currentDest.name + ', Buenos Aires')}`;

  const handleCopyQuote = () => {
    const textToCopy = `*Cotización de Flete Muebles J&L*\nOrigen: Taller Villa Luzuriaga\nDestino: ${
      currentDest.name
    } (${currentDest.distanceKm.toFixed(1)} km)\nTarifa estimada: $${totalCost.toLocaleString(
      'es-AR'
    )} ARS\nTiempo aproximado de viaje: ${currentDest.timeText}`;

    navigator.clipboard?.writeText(textToCopy).catch(() => {});
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2400);
  };

  const handleFuelAdjustment = () => {
    setRatePerKm((r) => Math.round(r * 1.05));
    setZoneRates((z) => ({
      z1: Math.round(z.z1 * 1.05),
      z2: Math.round(z.z2 * 1.05),
      z3: Math.round(z.z3 * 1.05),
    }));
    setFuelUpdated(true);
    setTimeout(() => setFuelUpdated(false), 1400);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 gap-space-lg">
      {/* 1. Header / Título de la pantalla */}
      <section className="flex flex-col gap-space-xs mt-2">
        <div className="flex items-center justify-between gap-space-sm">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/60 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-label-md text-label-md text-primary font-semibold tracking-wide">
              GPS ACTIVO • TARIFA $/KM DINÁMICA
            </span>
          </div>
          <span className="font-telemetry-unit text-telemetry-unit text-outline uppercase tracking-wider">
            Módulo Logística
          </span>
        </div>
        <div className="flex flex-col mt-1">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
            Logística &amp; Fletes GPS
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">near_me</span>
            <span>
              Base Taller: Villa Luzuriaga (La Matanza) • Tarifas &amp; Envíos Activos
            </span>
          </p>
        </div>
      </section>

      {/* 2. Widget Calculadora de Flete & Ruteo en Tiempo Real */}
      <section className="rounded-3xl bg-surface-container/85 backdrop-blur-xl p-space-md shadow-xl flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-container/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">calculate</span>
            </div>
            <span className="font-title-sm text-title-sm text-on-surface">
              Cotizador de Envíos
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-bright font-label-md text-label-md text-on-surface-variant">
            F-100 &amp; Furgón
          </span>
        </div>

        {/* Puntos Origen y Destino */}
        <div className="flex flex-col gap-space-sm">
          {/* Origen Fijo */}
          <div className="rounded-2xl bg-surface-container-low p-3 flex items-start gap-3">
            <div className="mt-0.5 w-6 h-6 rounded-full bg-tertiary-container/60 flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[14px]">warehouse</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">
                Punto de Origen (Fijo)
              </span>
              <span className="font-body-md text-body-md text-on-surface font-medium truncate">
                Taller J&amp;L • Garibaldi y Triunvirato
              </span>
              <span className="font-label-md text-label-md text-outline">
                Villa Luzuriaga, La Matanza
              </span>
            </div>
          </div>

          {/* Selector Destino */}
          <div className="rounded-2xl bg-surface-container-high p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-[11px] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-primary">
                location_on
              </span>
              <span>Seleccionar Destino (GBA / CABA)</span>
            </div>
            <div className="relative">
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-xl px-3 py-2.5 appearance-none focus:outline-none pr-8"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-[18px] text-on-surface-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Ajuste de Tarifa por Km y Base */}
        <div className="rounded-2xl bg-surface-container-low p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">
              Tarifa Dinámica $/km
            </span>
            <span className="font-label-md text-label-md text-primary font-semibold">
              Base Fija F-100: $8.000
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setRatePerKm((r) => Math.max(400, r - 100))}
              className="w-12 h-11 rounded-xl bg-surface-container-high hover:bg-surface-bright active:scale-95 text-on-surface flex items-center justify-center font-bold text-lg"
            >
              -
            </button>
            <div className="flex-1 rounded-xl bg-surface-container-lowest h-11 flex items-center justify-center px-3">
              <span className="font-telemetry-num text-telemetry-num text-primary tracking-tight">
                ${ratePerKm.toLocaleString('es-AR')}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant ml-1">
                ARS / km
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRatePerKm((r) => r + 100)}
              className="w-12 h-11 rounded-xl bg-surface-container-high hover:bg-surface-bright active:scale-95 text-on-surface flex items-center justify-center font-bold text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Resumen Automático */}
        <div className="rounded-2xl bg-surface-container-lowest p-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] text-outline uppercase tracking-wider">
                Distancia estimada
              </span>
              <span className="font-telemetry-num text-telemetry-num text-on-surface">
                {currentDest.distanceKm.toFixed(1)} km
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] text-outline uppercase tracking-wider">
                Tiempo en tránsito
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant font-medium">
                {currentDest.timeText}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary font-medium">
                Costo Total Sugerido
              </span>
              <span className="font-label-md text-[10px] text-outline">
                Base $8.000 + (km × $/km)
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">
                ${totalCost.toLocaleString('es-AR')}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">ARS</span>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-col gap-2">
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-13 py-3 rounded-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-body-lg font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(102,76,255,0.4)] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span>Abrir Ruta en Google Maps ↗</span>
          </a>

          <button
            type="button"
            onClick={handleCopyQuote}
            className="w-full h-11 rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[17px] text-primary">
              content_copy
            </span>
            <span>
              {copiedState
                ? '¡Copiado al portapapeles!'
                : 'Copiar Detalles p/ Enviar al Cliente / Fletero'}
            </span>
          </button>
        </div>
      </section>

      {/* 3. Simulación de Mapa Interactivo Cartográfico Dark Mode */}
      <section className="rounded-3xl bg-surface-container-low p-space-sm flex flex-col gap-3 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">map</span>
            <span className="font-title-sm text-title-sm text-on-surface">
              Telemetría de Ruta GBA
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-md text-[11px] text-on-surface-variant">
            Capa Tránsito en Vivo
          </span>
        </div>

        <div className="relative w-full h-56 rounded-2xl bg-surface-container-lowest overflow-hidden flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full text-surface-container-high"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                height="48"
                id="grid-roads"
                patternUnits="userSpaceOnUse"
                width="48"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                />
              </pattern>
              <linearGradient id="route-gradient" x1="0%" x2="100%" y1="100%" y2="0%">
                <stop offset="0%" stopColor="#be4424" />
                <stop offset="50%" stopColor="#c7bfff" />
                <stop offset="100%" stopColor="#664cff" />
              </linearGradient>
            </defs>
            <rect fill="none" height="100%" width="100%" />
            <rect fill="url(#grid-roads)" height="100%" width="100%" />
            <path
              d="M -20 180 Q 140 140 380 70"
              fill="none"
              stroke="#2a2934"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path d="M 60 230 L 260 -10" fill="none" stroke="#2a2934" strokeWidth="4" />
            <path d="M 120 230 L 320 -10" fill="none" stroke="#2a2934" strokeWidth="3" />
            <path d="M 10 70 L 400 120" fill="none" stroke="#2a2934" strokeWidth="4" />
            <path
              className="animate-pulse"
              d="M 70 170 C 110 160 150 110 220 95 S 310 70 330 45"
              fill="none"
              stroke="url(#route-gradient)"
              strokeDasharray="6,3"
              strokeLinecap="round"
              strokeWidth="4.5"
            />
          </svg>

          {/* Pin Origen: Taller Villa Luzuriaga */}
          <div className="absolute left-14 bottom-10 flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-full bg-surface-container-high text-[10px] font-label-md text-tertiary-fixed shadow-md mb-1 whitespace-nowrap">
              Taller J&amp;L
            </div>
            <div className="w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary shadow-[0_0_12px_rgba(190,68,36,0.8)]">
              <span className="material-symbols-outlined text-[13px]">
                home_repair_service
              </span>
            </div>
          </div>

          {/* Pin Destino */}
          <div className="absolute right-12 top-6 flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-full bg-primary-container text-[10px] font-label-md text-on-primary-container shadow-md mb-1 whitespace-nowrap">
              {currentDest.pinLabel}
            </div>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_0_15px_rgba(102,76,255,0.9)] animate-bounce">
              <span className="material-symbols-outlined text-[14px]">flag</span>
            </div>
          </div>

          {/* Badge de Alerta de Tránsito superpuesto */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-surface-container-high/90 backdrop-blur-md flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="font-label-md text-[10px] text-on-surface">
              Sin peajes en tramo • Zona carga habilitada
            </span>
          </div>
        </div>
      </section>

      {/* 4. Envíos Programados de la Semana (Cola de Despachos) */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">
              local_shipping
            </span>
            <h2 className="font-title-sm text-title-sm text-on-surface">
              Cola de Despachos Semanales
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md">
            3 pendientes
          </span>
        </div>

        {/* Pedido 1: Inminente */}
        <div className="rounded-3xl bg-surface-container/90 p-space-md shadow-lg flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-md text-[10px] font-semibold">
                  INMINENTE
                </span>
                <span className="font-label-md text-[11px] text-outline">#PED-1084</span>
              </div>
              <span className="font-body-lg text-body-lg font-bold text-on-surface mt-1">
                Estudio Arq. Rossi
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">
                  pin_drop
                </span>
                Ramos Mejía (3.8 km del taller)
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-surface-bright text-primary font-label-md text-[11px] font-semibold whitespace-nowrap">
              Listo p/ Cargar
            </div>
          </div>

          <div className="rounded-2xl bg-surface-container-low p-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-on-surface-variant font-body-md text-body-md">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-outline">chair</span>
                Mueble: Mesa de Noche Nórdica x2 + Cómoda 4C
              </span>
            </div>
            <div className="flex items-center justify-between font-label-md text-label-md text-on-surface">
              <span className="text-on-surface-variant">
                Fletero: <strong className="text-on-surface">Roberto (Furgón Master)</strong>
              </span>
              <span className="text-tertiary">Mañana 10:30 hs</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href="tel:+5491100000000"
              className="h-10 rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">call</span>
              <span>Llamar</span>
            </a>
            <a
              href="https://wa.me/5491100000000?text=Hola%20Roberto,%20te%20escribo%20del%20taller%20J%26L%20por%20el%20flete%20#PED-1084"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
              <span>WhatsApp</span>
            </a>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 rounded-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-label-md text-label-md font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">navigation</span>
              <span>GPS</span>
            </a>
          </div>
        </div>

        {/* Pedido 2: En Producción */}
        <div className="rounded-3xl bg-surface-container/70 p-space-md shadow-md flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-surface-bright text-on-surface-variant font-label-md text-[10px]">
                  PROGRAMADO
                </span>
                <span className="font-label-md text-[11px] text-outline">#PED-1088</span>
              </div>
              <span className="font-body-lg text-body-lg font-bold text-on-surface mt-1">
                Lucas Benítez
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-outline">
                  pin_drop
                </span>
                Castelar (6.2 km)
              </span>
            </div>
            <div className="px-2 py-1 rounded-full bg-surface-container-high text-tertiary font-label-md text-[10px]">
              En Producción (Viernes 28)
            </div>
          </div>
          <div className="flex items-center justify-between text-body-md text-on-surface-variant px-1">
            <span>Mesa Ratona Petiribí Maciza</span>
            <span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">
              $15.440 ARS
            </span>
          </div>
          <div className="text-[11px] font-label-md text-outline px-1">
            Flete pactado • Costo de envío a cargo del cliente
          </div>
        </div>

        {/* Pedido 3: Local Luzuriaga */}
        <div className="rounded-3xl bg-surface-container/70 p-space-md shadow-md flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-surface-bright text-on-surface-variant font-label-md text-[10px]">
                  FLETE CORTO
                </span>
                <span className="font-label-md text-[11px] text-outline">#PED-1091</span>
              </div>
              <span className="font-body-lg text-body-lg font-bold text-on-surface mt-1">
                Arq. Mariana Peña
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                Villa Luzuriaga (1.2 km de base)
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-medium">05 Abril</span>
          </div>
        </div>
      </section>

      {/* 5. Tabla de Tarifas Rápidas por Zona (GBA Oeste y CABA) */}
      <section className="rounded-3xl bg-surface-container-low p-space-md shadow-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              local_offer
            </span>
            <h3 className="font-title-sm text-title-sm text-on-surface">
              Tarifas Planas por Radio
            </h3>
          </div>
          <span className="font-label-md text-[11px] text-outline">GBA Oeste &amp; CABA</span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="rounded-2xl bg-surface-container p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-md text-body-md font-semibold text-on-surface">
                Zona 1: Inmediata (&lt; 5 km)
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                San Justo / Ramos Mejía / Haedo
              </span>
            </div>
            <span className="font-telemetry-num text-telemetry-num text-primary font-bold">
              ${zoneRates.z1.toLocaleString('es-AR')}
            </span>
          </div>

          <div className="rounded-2xl bg-surface-container p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-md text-body-md font-semibold text-on-surface">
                Zona 2: Media (5 a 12 km)
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Morón / Castelar / Ituzaingó
              </span>
            </div>
            <span className="font-telemetry-num text-telemetry-num text-primary font-bold">
              ${zoneRates.z2.toLocaleString('es-AR')}
            </span>
          </div>

          <div className="rounded-2xl bg-surface-container p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-body-md text-body-md font-semibold text-on-surface">
                Zona 3: CABA Oeste (&gt; 12 km)
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Liniers, Flores, Caballito
              </span>
            </div>
            <span className="font-telemetry-num text-telemetry-num text-primary font-bold">
              ${zoneRates.z3.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleFuelAdjustment}
          className={`mt-1 w-full h-11 rounded-full bg-surface-container-high hover:bg-surface-bright font-label-md text-label-md flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
            fuelUpdated ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[17px] text-tertiary">sync</span>
          <span>
            {fuelUpdated
              ? '¡Tarifas actualizadas +5%!'
              : 'Ajuste por Combustible (+5% Sugerido)'}
          </span>
        </button>
      </section>
    </div>
  );
};
