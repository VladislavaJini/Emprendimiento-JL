import React, { useRef, useState } from 'react';

interface CashMovement {
  id: string;
  type: 'ingreso' | 'egreso';
  title: string;
  subtitle: string;
  amountFormatted: string;
  entity: string;
  paymentMethod: 'efectivo' | 'mp' | 'factura';
  paymentLabel: string;
  timestamp: string;
}

const INITIAL_MOVEMENTS: CashMovement[] = [
  {
    id: '1',
    type: 'ingreso',
    title: '50% Anticipo Pedido #1091',
    subtitle: 'Escritorio Nórdico Paraíso laqueado',
    amountFormatted: '+$115.000',
    entity: 'Arq. Mariana Peña',
    paymentMethod: 'mp',
    paymentLabel: 'MP Bancario',
    timestamp: 'Hoy, 16:40 hs',
  },
  {
    id: '2',
    type: 'egreso',
    title: 'Compra 1x Placa Carvalho Mezzo 18mm',
    subtitle: 'Materia prima para alacena #1089',
    amountFormatted: '-$48.200',
    entity: 'Distribuidora Morón',
    paymentMethod: 'factura',
    paymentLabel: 'Factura A',
    timestamp: 'Hoy, 14:15 hs',
  },
  {
    id: '3',
    type: 'ingreso',
    title: 'Seña Mesa Ratona Petiribí #1088',
    subtitle: 'Pago físico recibido en taller',
    amountFormatted: '+$70.000',
    entity: 'Lucas Benítez',
    paymentMethod: 'efectivo',
    paymentLabel: 'Efectivo Taller',
    timestamp: 'Hoy, 11:30 hs',
  },
  {
    id: '4',
    type: 'egreso',
    title: 'Caja Tornillos Soberbios 7x50mm',
    subtitle: '500 unidades para ensambles',
    amountFormatted: '-$18.500',
    entity: 'Bulonera Luzuriaga',
    paymentMethod: 'efectivo',
    paymentLabel: 'Efectivo Taller',
    timestamp: 'Ayer, 18:20 hs',
  },
  {
    id: '5',
    type: 'ingreso',
    title: 'Saldo Final Entrega #1084',
    subtitle: 'Vestidor Melamina Seda Giorno',
    amountFormatted: '+$85.000',
    entity: 'Estudio Arq. Rossi',
    paymentMethod: 'mp',
    paymentLabel: 'Transferencia MP',
    timestamp: 'Ayer, 12:00 hs',
  },
];

export const FinanzasScreen: React.FC = () => {
  const formRef = useRef<HTMLElement | null>(null);
  const [highlightForm, setHighlightForm] = useState(false);
  const [entryType, setEntryType] = useState<'ingreso' | 'egreso'>('ingreso');
  const [payMethod, setPayMethod] = useState<'efectivo' | 'mp'>('mp');
  const [concept, setConcept] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [clientInput, setClientInput] = useState('');
  const [movements, setMovements] = useState<CashMovement[]>(INITIAL_MOVEMENTS);
  const [filterMode, setFilterMode] = useState<
    'todos' | 'ingreso' | 'egreso' | 'efectivo' | 'mp'
  >('todos');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightForm(true);
    setTimeout(() => setHighlightForm(false), 1200);
  };

  const handleConfirmMovement = () => {
    if (!concept.trim()) {
      showToast('Ingresa el concepto del movimiento');
      return;
    }
    const rawNum = Number(amountInput.replace(/\D/g, '')) || 85000;
    const formatted = `${entryType === 'ingreso' ? '+' : '-'}$${rawNum.toLocaleString('es-AR')}`;
    const newMov: CashMovement = {
      id: String(Date.now()),
      type: entryType,
      title: concept.trim(),
      subtitle:
        entryType === 'ingreso' ? 'Cobro registrado en caja' : 'Gasto operativo de taller',
      amountFormatted: formatted,
      entity: clientInput.trim() || 'Operación Taller J&L',
      paymentMethod: payMethod,
      paymentLabel: payMethod === 'efectivo' ? 'Efectivo Taller' : 'MP Bancario',
      timestamp: 'Ahora mismo',
    };
    setMovements([newMov, ...movements]);
    setConcept('');
    setAmountInput('');
    setClientInput('');
    showToast(`Movimiento registrado (${formatted} ARS)`);
  };

  const filteredMovements = movements.filter((m) => {
    if (filterMode === 'todos') return true;
    if (filterMode === 'ingreso' || filterMode === 'egreso') return m.type === filterMode;
    if (filterMode === 'efectivo') return m.paymentMethod === 'efectivo';
    if (filterMode === 'mp') return m.paymentMethod === 'mp';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 space-y-space-lg">
      {/* Header Context & Live Taller Telemetry */}
      <section className="flex flex-col gap-space-xs mt-2">
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0 shadow-sm text-primary">
              <span className="material-symbols-outlined text-[22px]">
                account_balance_wallet
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight truncate">
                Finanzas &amp; Caja de Taller
              </h1>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Muebles J&amp;L • Villa Luzuriaga
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-[11px] font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span>CAJA ABIERTA • TIEMPO REAL</span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Control de ingresos por ventas, señas de clientes, compras de placas e insumos,
          efectivo y transferencias bancarias.
        </p>
      </section>

      {/* Hero Balance Card: Estado General de Caja */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-container-high p-space-lg shadow-xl">
        <div className="flex flex-col gap-space-md relative z-10">
          {/* Top Subhead & Opening Base */}
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-medium">
              Saldo Neto Total en Caja
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-md text-label-md">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +356.1% vs apertura
            </span>
          </div>

          {/* Main Sum ARS */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold text-on-surface tracking-tight">
                $684.200
              </span>
              <span className="font-label-md text-label-md text-primary font-bold tracking-wider">
                ARS
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[15px] text-outline">history</span>
              <span>
                Fondo de apertura inicial:{' '}
                <strong className="text-on-surface">$150.000 ARS</strong>
              </span>
            </div>
          </div>

          {/* Breakdown Split Cards */}
          <div className="grid grid-cols-2 gap-space-sm pt-2">
            <div className="rounded-2xl bg-surface-container p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  payments
                </span>
                <span className="font-label-md text-[11px] uppercase tracking-wide truncate">
                  Efectivo en Taller
                </span>
              </div>
              <span className="font-title-sm text-title-sm font-bold text-on-surface">
                $182.500
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant">
                Caja chica de mano
              </span>
            </div>

            <div className="rounded-2xl bg-surface-container p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  account_balance
                </span>
                <span className="font-label-md text-[11px] uppercase tracking-wide truncate">
                  Bancos &amp; MP
                </span>
              </div>
              <span className="font-title-sm text-title-sm font-bold text-on-surface">
                $501.700
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant">
                Disponibilidad digital
              </span>
            </div>
          </div>

          {/* Workshop CTA Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm pt-2">
            <button
              type="button"
              onClick={handleScrollToForm}
              className="h-12 px-6 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-container/20 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>+ Registrar Movimiento</span>
            </button>
            <button
              type="button"
              onClick={() =>
                showToast('Arqueo de caja verificado • Sin diferencias ($684.200 ARS)')
              }
              className="h-12 px-5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md font-medium flex items-center justify-center gap-2 hover:bg-surface-bright active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-outline">
                lock_clock
              </span>
              <span>Apertura / Cierre de Caja</span>
            </button>
          </div>
        </div>
      </section>

      {/* Summary Metrics Bar (Ingresos vs Egresos del Mes) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
        <div className="rounded-2xl bg-surface-container p-space-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md">Ingresos del Mes</span>
            <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-primary">
              +$1.420.000
            </span>
            <span className="font-label-md text-[11px] text-on-surface-variant mt-0.5">
              Ventas muebles &amp; señas
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container p-space-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md">Egresos &amp; Insumos</span>
            <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-tertiary">
              -$735.800
            </span>
            <span className="font-label-md text-[11px] text-on-surface-variant mt-0.5">
              Placas, fletes, luz, tornillos
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container p-space-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md">Margen Operativo</span>
            <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px]">percent</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              48.2%
            </span>
            <span className="font-label-md text-[11px] text-on-surface-variant mt-0.5">
              Rentabilidad neta del taller
            </span>
          </div>
        </div>
      </section>

      {/* Quick Entry Interactive Form Drawer / Card */}
      <section
        ref={formRef}
        className={`rounded-3xl bg-surface-container p-space-lg flex flex-col gap-space-md shadow-md transition-all ${
          highlightForm ? 'ring-2 ring-primary' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
            <h2 className="font-title-sm text-title-sm text-on-surface font-semibold">
              Registro Rápido de Movimiento
            </h2>
          </div>
          <span className="font-label-md text-[11px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
            Luzuriaga #1096
          </span>
        </div>

        {/* Segmented Type Selector */}
        <div className="grid grid-cols-2 p-1 rounded-full bg-surface-container-lowest gap-1">
          <button
            type="button"
            onClick={() => setEntryType('ingreso')}
            className={`h-10 rounded-full font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all ${
              entryType === 'ingreso'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'bg-transparent text-on-surface-variant hover:text-on-surface font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Ingreso (Venta/Seña)</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryType('egreso')}
            className={`h-10 rounded-full font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all ${
              entryType === 'egreso'
                ? 'bg-tertiary-container text-on-tertiary-container font-semibold shadow-sm'
                : 'bg-transparent text-on-surface-variant hover:text-on-surface font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">remove_circle_outline</span>
            <span>- Egreso (Gasto/Insumo)</span>
          </button>
        </div>

        {/* Input Form Fields */}
        <div className="flex flex-col gap-space-sm pt-1">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Concepto de Carpintería
            </label>
            <div className="h-12 px-3.5 rounded-2xl bg-surface-container-high flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary">
              <span className="material-symbols-outlined text-[18px] text-outline">
                description
              </span>
              <input
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full bg-transparent text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none"
                placeholder="Ej. Seña 50% Bajo Mesada #1095 o Tornillos Soberbios"
                type="text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {/* Medio de Pago */}
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                Medio de Pago
              </label>
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-surface-container-high gap-1">
                <button
                  type="button"
                  onClick={() => setPayMethod('efectivo')}
                  className={`h-10 rounded-xl font-label-md text-[11px] flex items-center justify-center gap-1 transition-all ${
                    payMethod === 'efectivo'
                      ? 'bg-surface-container-highest text-primary font-semibold'
                      : 'bg-surface-container text-on-surface font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px] text-tertiary">
                    payments
                  </span>
                  <span>Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('mp')}
                  className={`h-10 rounded-xl font-label-md text-[11px] flex items-center justify-center gap-1 transition-all ${
                    payMethod === 'mp'
                      ? 'bg-surface-container-highest text-primary font-semibold'
                      : 'bg-surface-container text-on-surface font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">credit_card</span>
                  <span>MP / Banco</span>
                </button>
              </div>
            </div>

            {/* Monto */}
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                Monto en Pesos
              </label>
              <div className="h-12 px-3.5 rounded-2xl bg-surface-container-high flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary">
                <span className="font-label-md text-label-md font-bold text-primary">$</span>
                <input
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-transparent text-on-surface font-headline-md text-headline-md font-bold placeholder:text-outline focus:outline-none"
                  placeholder="85.000"
                  type="number"
                />
                <span className="font-label-md text-[11px] text-on-surface-variant uppercase">
                  ARS
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
              Cliente, Arquitecto o Proveedor
            </label>
            <div className="h-12 px-3.5 rounded-2xl bg-surface-container-high flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary">
              <span className="material-symbols-outlined text-[18px] text-outline">
                person_pin
              </span>
              <input
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                className="w-full bg-transparent text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none"
                placeholder="Ej. Distribuidora Morón / Estudio Rossi / Arq. Peña"
                type="text"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleConfirmMovement}
          className="h-12 w-full rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[20px]">check</span>
          <span>Confirmar Movimiento en Caja</span>
        </button>
      </section>

      {/* Filter & Tab Navigation Pills */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-title-sm text-title-sm font-semibold text-on-surface">
            Historial de Movimientos
          </h2>
          <span className="font-label-md text-label-md text-on-surface-variant">
            24 registros este mes
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setFilterMode('todos')}
            className={`px-4 h-9 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              filterMode === 'todos'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todos (24)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('ingreso')}
            className={`px-4 h-9 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              filterMode === 'ingreso'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Ingresos (16)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('egreso')}
            className={`px-4 h-9 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              filterMode === 'egreso'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Egresos (8)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('efectivo')}
            className={`px-3.5 h-9 rounded-full font-label-md text-[11px] whitespace-nowrap flex items-center gap-1 transition-all ${
              filterMode === 'efectivo'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-tertiary">payments</span>
            <span>Solo Efectivo</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('mp')}
            className={`px-3.5 h-9 rounded-full font-label-md text-[11px] whitespace-nowrap flex items-center gap-1 transition-all ${
              filterMode === 'mp'
                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-primary">
              account_balance
            </span>
            <span>Solo MercadoPago</span>
          </button>
        </div>
      </section>

      {/* Timeline / Feed de Movimientos Recientes */}
      <section className="flex flex-col gap-space-sm">
        {filteredMovements.map((m) => (
          <div
            key={m.id}
            className="rounded-3xl bg-surface-container p-space-md flex flex-col gap-space-xs shadow-sm hover:bg-surface-bright/70 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-9 h-9 rounded-2xl bg-surface-container-highest flex items-center justify-center shrink-0 ${
                    m.type === 'ingreso' ? 'text-primary' : 'text-tertiary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {m.type === 'ingreso' ? 'south_west' : 'north_east'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-md text-body-md font-semibold text-on-surface truncate">
                    {m.title}
                  </span>
                  <span className="font-label-md text-[11px] text-on-surface-variant truncate">
                    {m.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span
                  className={`font-title-sm text-title-sm font-bold ${
                    m.type === 'ingreso' ? 'text-primary' : 'text-tertiary'
                  }`}
                >
                  {m.amountFormatted}
                </span>
                <span className="font-label-md text-[10px] text-on-surface-variant">ARS</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant font-label-md text-[11px] pt-1">
              <div className="flex items-center gap-2 truncate">
                <span className="text-on-surface font-medium truncate">{m.entity}</span>
                {m.paymentMethod === 'factura' ? (
                  <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-[10px] font-semibold text-on-surface-variant">
                    {m.paymentLabel}
                  </span>
                ) : (
                  <>
                    <span>•</span>
                    <span
                      className={`inline-flex items-center gap-1 ${
                        m.paymentMethod === 'mp' ? 'text-primary' : 'text-tertiary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px]">
                        {m.paymentMethod === 'mp' ? 'credit_card' : 'payments'}
                      </span>
                      <span>{m.paymentLabel}</span>
                    </span>
                  </>
                )}
              </div>
              <span className="shrink-0 text-outline">{m.timestamp}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Financial Analytics: Resumen de Gastos por Categoría */}
      <section className="rounded-3xl bg-surface-container p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="font-title-sm text-title-sm font-bold text-on-surface">
              Distribución de Gastos
            </h2>
            <span className="font-label-md text-[11px] text-on-surface-variant">
              Dónde se invirtió el dinero este mes
            </span>
          </div>
          <span className="font-label-md text-label-md font-bold text-tertiary">
            $735.800 Total
          </span>
        </div>

        <div className="flex flex-col gap-space-md pt-1">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-body-md font-medium">
              <span className="flex items-center gap-2 text-on-surface">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                Melaminas y Maderas Macizas
              </span>
              <div className="flex items-center gap-2">
                <span className="text-on-surface font-semibold">$382.600</span>
                <span className="text-primary font-bold text-[12px]">52%</span>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: '52%' }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-body-md font-medium">
              <span className="flex items-center gap-2 text-on-surface">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
                Cantos PVC, Correderas y Bisagras
              </span>
              <div className="flex items-center gap-2">
                <span className="text-on-surface font-semibold">$176.600</span>
                <span className="text-secondary font-bold text-[12px]">24%</span>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-secondary" style={{ width: '24%' }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-body-md font-medium">
              <span className="flex items-center gap-2 text-on-surface">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0"></span>
                Servicios, Fresas, Lijas &amp; Luz Taller
              </span>
              <div className="flex items-center gap-2">
                <span className="text-on-surface font-semibold">$103.000</span>
                <span className="text-tertiary font-bold text-[12px]">14%</span>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-tertiary" style={{ width: '14%' }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-body-md font-medium">
              <span className="flex items-center gap-2 text-on-surface">
                <span className="w-2.5 h-2.5 rounded-full bg-outline shrink-0"></span>
                Fletes, Combustible &amp; Entregas
              </span>
              <div className="flex items-center gap-2">
                <span className="text-on-surface font-semibold">$73.600</span>
                <span className="text-outline font-bold text-[12px]">10%</span>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-outline" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Export & Report Footer Card */}
      <section className="rounded-3xl bg-surface-container-high p-space-lg flex flex-col gap-space-sm mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-title-sm text-title-sm font-bold text-on-surface">
              Libro de Caja &amp; Conciliación
            </h3>
            <span className="font-label-md text-label-md text-on-surface-variant">
              Reportes contables listos para exportar
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
          <button
            type="button"
            onClick={() => showToast('Planilla Excel / CSV de Caja exportada')}
            className="h-11 px-4 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface font-label-md text-label-md font-medium flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[17px] text-primary">
              table_view
            </span>
            <span>Exportar Planilla Excel / CSV</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Resumen Contable (.PDF) descargado')}
            className="h-11 px-4 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface font-label-md text-label-md font-medium flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[17px] text-tertiary">
              picture_as_pdf
            </span>
            <span>Descargar Resumen (.PDF)</span>
          </button>
        </div>
      </section>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-surface-bright text-on-surface font-label-md text-label-md shadow-2xl flex items-center gap-2 pointer-events-none z-50">
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
