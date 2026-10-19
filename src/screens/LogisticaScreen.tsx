import React, { useState } from 'react';

const FIXED_ORIGIN_DISPLAY = 'Taller J&L • Garibaldi y Triunvirato';
const FIXED_ORIGIN_SUB = 'Villa Luzuriaga, La Matanza';
const FIXED_ORIGIN_GMAPS = 'Garibaldi y Triunvirato, Villa Luzuriaga, La Matanza, Buenos Aires';

export const LogisticaScreen: React.FC = () => {
  const [destinationAddress, setDestinationAddress] = useState('Av. de Mayo 850, Ramos Mejía');
  const [distanceKm, setDistanceKm] = useState<number>(8.4);
  const [ratePerKm, setRatePerKm] = useState(1200);
  const [zoneRates, setZoneRates] = useState({ z1: 12000, z2: 18500, z3: 26000 });
  const [copiedState, setCopiedState] = useState(false);
  const [fuelUpdated, setFuelUpdated] = useState(false);

  const baseFee = 8000;
  const safeDistance = Math.max(0, Number(distanceKm) || 0);
  const totalCost = Math.round(baseFee + safeDistance * ratePerKm);

  const cleanDestination = destinationAddress.trim() || 'Ramos Mejía, Buenos Aires';
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    FIXED_ORIGIN_GMAPS
  )}&destination=${encodeURIComponent(cleanDestination)}&travelmode=driving`;

  const buildOrderGmapsUrl = (targetPlace: string) =>
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      FIXED_ORIGIN_GMAPS
    )}&destination=${encodeURIComponent(targetPlace + ', Buenos Aires')}&travelmode=driving`;

  const handleCopyQuote = () => {
    const textToCopy = `*Cotización de Flete Muebles J&L*\nOrigen: ${FIXED_ORIGIN_DISPLAY} (${FIXED_ORIGIN_SUB})\nDestino: ${cleanDestination} (${safeDistance.toFixed(
      1
    )} km)\nTarifa estimada: $${totalCost.toLocaleString(
      'es-AR'
    )} ARS (Base $8.000 + $${ratePerKm.toLocaleString('es-AR')}/km)\nRuta Google Maps: ${gmapsUrl}`;

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
              COTIZADOR ACTIVO • TARIFA $/KM DINÁMICA
            </span>
          </div>
          <span className="font-telemetry-unit text-telemetry-unit text-outline uppercase tracking-wider">
            Módulo Logística
          </span>
        </div>
        <div className="flex flex-col mt-1">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
            Logística &amp; Cotizador de Fletes
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[16px] text-tertiary">near_me</span>
            <span>
              Base Taller: Villa Luzuriaga (La Matanza) • Tarifas &amp; Envíos Activos
            </span>
          </p>
        </div>
      </section>

      {/* 2. Widget Calculadora de Flete & Ruteo Directo a Google Maps */}
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

        {/* Puntos Origen Fijo y Destino Manual */}
        <div className="flex flex-col gap-space-sm">
          {/* Origen Fijo Intacto */}
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

          {/* Ingreso Directo de Destino y Distancia para Ruta en Google Maps */}
          <div className="rounded-2xl bg-surface-container-high p-3 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-[11px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[15px] text-primary">
                  location_on
                </span>
                <span>Dirección o Localidad de Destino</span>
              </div>
              <span className="text-[10px] font-label-md text-secondary">
                Ruta directa en Google Maps
              </span>
            </div>

            <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl px-3 py-2.5 border border-outline-variant/20 focus-within:border-primary">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                place
              </span>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder="Ej: Av. de Mayo 850, Ramos Mejía / Caballito, CABA..."
                className="w-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-outline"
              />
              {destinationAddress && (
                <button
                  type="button"
                  onClick={() => setDestinationAddress('')}
                  aria-label="Limpiar destino"
                  className="text-on-surface-variant hover:text-on-surface flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Distancia Manual Estimada (km) para el cálculo de tarifa */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="font-label-md text-[11px] text-on-surface-variant">
                Distancia de ruta (km) p/ cálculo:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setDistanceKm((d) => Math.max(0.5, Number((d - 1).toFixed(1))))
                  }
                  className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-bold flex items-center justify-center active:scale-95"
                >
                  -
                </button>
                <div className="flex items-center bg-surface-container-lowest rounded-lg px-2.5 h-8 border border-outline-variant/20">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Math.max(0, Number(e.target.value)))}
                    className="w-14 bg-transparent text-center font-telemetry-num text-[14px] text-on-surface focus:outline-none"
                  />
                  <span className="text-[11px] text-on-surface-variant ml-1">km</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDistanceKm((d) => Number((d + 1).toFixed(1)))}
                  className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-bold flex items-center justify-center active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ajuste de Tarifa por Km y Base (Intacto) */}
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
                Distancia calculada
              </span>
              <span className="font-telemetry-num text-telemetry-num text-on-surface">
                {safeDistance.toFixed(1)} km
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-[11px] text-outline uppercase tracking-wider">
                Destino configurado
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant font-medium truncate">
                {cleanDestination}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary font-medium">
                Costo Total Sugerido
              </span>
              <span className="font-label-md text-[10px] text-outline">
                Base $8.000 + ({safeDistance.toFixed(1)} km × ${ratePerKm.toLocaleString('es-AR')})
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

        {/* Botón Directo a Google Maps con Ruta Predefinida + Copiar Cotización */}
        <div className="flex flex-col gap-2">
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-13 py-3 rounded-full bg-primary hover:bg-primary-fixed-dim text-on-primary font-body-lg font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(102,76,255,0.4)] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">directions</span>
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

      {/* 3. Envíos Programados de la Semana (Cola de Despachos) */}
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
              href={buildOrderGmapsUrl('Ramos Mejía')}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 rounded-full bg-primary-container hover:bg-primary-container/80 text-on-primary-container font-label-md text-label-md font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">directions</span>
              <span>Maps ↗</span>
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
          <div className="flex items-center justify-between px-1 pt-0.5">
            <span className="text-[11px] font-label-md text-outline">
              Flete pactado • Costo de envío a cargo del cliente
            </span>
            <a
              href={buildOrderGmapsUrl('Castelar')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-label-md text-primary font-semibold flex items-center gap-0.5 hover:underline"
            >
              <span>Ver ruta en Maps</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
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
            <div className="flex flex-col items-end gap-1">
              <span className="font-label-md text-label-md text-primary font-medium">05 Abril</span>
              <a
                href={buildOrderGmapsUrl('Villa Luzuriaga')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-label-md text-secondary flex items-center gap-0.5 hover:underline"
              >
                <span>Ruta Maps</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tabla de Tarifas Rápidas por Zona (GBA Oeste y CABA) - Intacta */}
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
