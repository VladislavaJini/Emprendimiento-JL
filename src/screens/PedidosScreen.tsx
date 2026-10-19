import React, { useState } from 'react';

type OrderStatus = 'en-proceso' | 'terminado' | 'embalado' | 'entregado';

interface OrderItem {
  id: string;
  code: string;
  badgeText: string;
  badgeImminent?: boolean;
  badgeDelivered?: boolean;
  client: string;
  city: string;
  distance: string;
  distanceHighlight?: boolean;
  image: string;
  furnitureIcon: string;
  furnitureTitle: string;
  deliveryLabel: string;
  deliveryUrgent?: boolean;
  specNote: string;
  status: OrderStatus;
  balanceAmount?: string;
  totalAmount?: string;
  paidBadge?: string;
  paidFullAmount?: string;
  whatsappPhone: string;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: '1084',
    code: '#PED-1084',
    badgeText: 'Entrega Inminente',
    badgeImminent: true,
    client: 'Estudio Arq. Rossi',
    city: 'Ramos Mejía',
    distance: '3.8 km',
    distanceHighlight: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCjQmwmgkFl29OALAWWAgN0t9Ma0ke6bIn1UTCuHhx_qc38iba-gQnqNCf1JfBgfFyAhUFZejCJlIfkPa4Bki4nOH2Gxe6Zi8uqTpAUAQHAo4kZ0v3eG1SAKcMRqcksAEgQ3BZ_EzG1zAX1qEpTbYNaGHTjlypW76xYVdZZTkJpqzrMgxsgJo2r17Rn1rZzVmOcQQRM3o2_SZBLnDjRac7MitnHtTTqVfy4mAgtkAOwIQ2NHAxVhGxbg',
    furnitureIcon: 'bed',
    furnitureTitle: 'Mesa de Noche Nórdica x2 + Cómoda 4C',
    deliveryLabel: 'Mañana 10:30 hs',
    deliveryUrgent: true,
    specNote: 'Paraiso natural + laca poliuretánica',
    status: 'embalado',
    balanceAmount: '$85.000',
    totalAmount: '$180.000',
    paidBadge: 'Pendiente 50%',
    whatsappPhone: '5491112345678',
  },
  {
    id: '1088',
    code: '#PED-1088',
    badgeText: 'En Corte & Lijado',
    client: 'Lucas Benítez',
    city: 'Castelar',
    distance: '6.2 km',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCK4ThREqV3F7_mAIcaqlTgigTXNv-QzHmYzLgq6qvThSYS0ed_FSCrJuu4tUVlJQD5UftZoabBxs9Cle97ccvMwu0nGcBvKghdJA9xlH1ItsEiKpRzLnunnVpJ1SgbtJT2m3a7vgBBnj6USBCMT7JhUh_N49Kqmo_0Omlt4CAjCwo6VQc3k0MlHiZh9yMzh8km8Nhp9ouwBDXlGukuBSzGOP2RY0bOmrULmWQf4hr4Mq_sQ-kc9e6ZSg',
    furnitureIcon: 'table_restaurant',
    furnitureTitle: 'Mesa Ratona Petiribí Maciza',
    deliveryLabel: 'Entrega: 28 de Marzo',
    specNote: 'Espesor 2 pulgadas',
    status: 'en-proceso',
    balanceAmount: '$70.000',
    totalAmount: '$140.000',
    paidBadge: '50% Señado',
    whatsappPhone: '5491122223333',
  },
  {
    id: '1091',
    code: '#PED-1091',
    badgeText: 'Estructura Metálica',
    client: 'Arq. Mariana Peña',
    city: 'Villa Luzuriaga',
    distance: 'Local (1.2 km)',
    distanceHighlight: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9SkKcB8u7I1gjAwyszvyOvDuMA0d9q5_mEOmlt5xPfUhjRGSM8fLPoggtnQ8omQDTNSaVI2kwPa4L8QOju4D3F3UL2CIUjLNYiW75XobWTsE9tALMLfYngyCvRplPm7ESgqu5eDD7TantbcxxXjDInUAvQKVTHC_pWAytnsFy5t2GFzzSLsUzjRcfQLD11kD5qCXYCjTBDyma_fyazgylwrRKnBQfgpPGJM99zcxjvOmq8MCnGIljhQ',
    furnitureIcon: 'desk',
    furnitureTitle: 'Escritorio Nórdico Industrial c/ Cajonera',
    deliveryLabel: 'Entrega: 05 de Abril',
    specNote: 'Melamina 18mm Guatambú',
    status: 'en-proceso',
    balanceAmount: '$115.000',
    totalAmount: '$230.000',
    paidBadge: '50% Anticipo',
    whatsappPhone: '5491144445555',
  },
  {
    id: '1079',
    code: '#PED-1079',
    badgeText: 'Entregado & Saldado',
    badgeDelivered: true,
    client: 'Silvia Gómez',
    city: 'Haedo',
    distance: '4.1 km',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBhNjqMj-MmvO8GzhQqs6r1RtR_edrFGTIgd2p67NBtrKCPWTDZpjPJsHUmcoy9HVblvNRJffpZ99JeJF7ablD_gKT9JnQgPzUIzxE_bCxOt1-k8kT0bPwT8fzIYgEjky1RHfYROXt0AZS_VUnHYTJmQvWfxZ-g0ln4MFYe_ENeOzOCTCwniYH1aPvrq7dUVj8J2k4RveJjOkjE3nAy5iRSUgDeLV1mVRIZx5UOIEk_WhslsvO_ODDKQ',
    furnitureIcon: 'shelves',
    furnitureTitle: 'Placard 2 Puertas Corredizas',
    deliveryLabel: 'Entregado el 24 de Marzo',
    specNote: 'Rieles Ducasse aluminio',
    status: 'entregado',
    paidFullAmount: '$320.000 ARS',
    whatsappPhone: '5491155556666',
  },
];

export const PedidosScreen: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [activeFilter, setActiveFilter] = useState<'todos' | OrderStatus>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<OrderItem | null>(null);

  // New Order Form State
  const [newClient, setNewClient] = useState('');
  const [newCity, setNewCity] = useState('Ramos Mejía');
  const [newPhone, setNewPhone] = useState('');
  const [newFurniture, setNewFurniture] = useState('');
  const [newDateIn, setNewDateIn] = useState('2025-03-24');
  const [newDateOut, setNewDateOut] = useState('2025-04-05');
  const [newTotal, setNewTotal] = useState('');
  const [newDeposit, setNewDeposit] = useState('');
  const [newBalance, setNewBalance] = useState('');

  const showToast = (msg: string, icon = 'check_circle') => {
    setToast({ msg, icon });
    setTimeout(() => {
      setToast((prev) => (prev?.msg === msg ? null : prev));
    }, 2800);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(
      `Pedido #${orderId} actualizado a "${newStatus.replace('-', ' ').toUpperCase()}"`,
      'sync'
    );
  };

  const handleCreateOrder = () => {
    if (!newClient.trim() || !newFurniture.trim()) {
      showToast('Completa el cliente y mueble para dar de alta', 'info');
      return;
    }
    const nextNum = 1092 + orders.length;
    const totalVal = newTotal.trim() || '$190.000';
    const balanceVal = newBalance.trim() || '$95.000';
    const created: OrderItem = {
      id: String(nextNum),
      code: `#PED-${nextNum}`,
      badgeText: 'Recién Ingresado',
      client: newClient.trim(),
      city: newCity,
      distance: '4.5 km',
      image: INITIAL_ORDERS[0].image,
      furnitureIcon: 'chair',
      furnitureTitle: newFurniture.trim(),
      deliveryLabel: `Entrega: ${newDateOut}`,
      specNote: 'Ingreso directo a cola de taller',
      status: 'en-proceso',
      balanceAmount: balanceVal.startsWith('$') ? balanceVal : `$${balanceVal}`,
      totalAmount: totalVal.startsWith('$') ? totalVal : `$${totalVal}`,
      paidBadge: '50% Señado',
      whatsappPhone: newPhone.replace(/\D/g, '') || '5491112345678',
    };
    setOrders([created, ...orders]);
    setNewClient('');
    setNewFurniture('');
    setNewTotal('');
    setNewDeposit('');
    setNewBalance('');
    setIsFormOpen(false);
    showToast(`Pedido ${created.code} ingresado a cola de taller`, 'assignment_turned_in');
  };

  const handleExportClosing = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('Cierre Marzo 2025 exportado (.CSV descargado)', 'download_done');
    }, 900);
  };

  const filteredOrders = orders.filter(
    (o) => activeFilter === 'todos' || o.status === activeFilter
  );

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 gap-space-lg">
      {/* Interactive Highlight Banner / Telemetry Summary */}
      <section className="flex flex-col bg-surface-container-low rounded-3xl p-space-md shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">
              point_of_sale
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Flujo Comercial • Zona Oeste
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-tertiary bg-surface-container-high px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span> 1 Inminente
          </span>
        </div>

        <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
          <div className="bg-surface-container/70 rounded-2xl p-space-sm flex flex-col justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">
              Cobrado este mes
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">
                $1.840K
              </span>
              <span className="font-telemetry-unit text-telemetry-unit text-secondary">ARS</span>
            </div>
          </div>
          <div className="bg-surface-container/70 rounded-2xl p-space-sm flex flex-col justify-between">
            <span className="font-label-md text-label-md text-on-surface-variant">
              Saldos por percibir
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry-num text-telemetry-num text-tertiary font-bold">
                $620K
              </span>
              <span className="font-telemetry-unit text-telemetry-unit text-on-surface-variant">
                ARS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Registro Integral de Pedido (Expandable Card) */}
      <section className="bg-surface-container rounded-3xl p-space-md shadow-md flex flex-col transition-all">
        <div
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">post_add</span>
            </div>
            <div>
              <h2 className="font-title-sm text-title-sm text-on-surface">
                Registro Integral de Pedido
              </h2>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Ingreso a cola de producción &amp; despacho
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Desplegar formulario de alta"
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary transition-all active:scale-95 shrink-0"
          >
            <span
              className="material-symbols-outlined text-[20px] transition-transform duration-200"
              style={{ transform: isFormOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              expand_more
            </span>
          </button>
        </div>

        {/* Collapsible Form Body */}
        {isFormOpen && (
          <div className="flex flex-col gap-space-md pt-space-md">
            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">person</span>{' '}
                Cliente / Razón Social
              </label>
              <div className="bg-surface-container-high rounded-2xl px-space-md py-3 flex items-center gap-space-sm">
                <input
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline outline-none"
                  placeholder="Ej: Arq. Valenzuela / Mariana Gómez"
                  type="text"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    pin_drop
                  </span>{' '}
                  Localidad
                </label>
                <div className="bg-surface-container-high rounded-2xl px-space-sm py-2.5">
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-transparent font-body-md text-body-md text-on-surface outline-none"
                  >
                    <option className="bg-surface-container-high text-on-surface" value="Ramos Mejía">
                      Ramos Mejía
                    </option>
                    <option
                      className="bg-surface-container-high text-on-surface"
                      value="Villa Luzuriaga"
                    >
                      Villa Luzuriaga
                    </option>
                    <option className="bg-surface-container-high text-on-surface" value="Morón">
                      Morón
                    </option>
                    <option className="bg-surface-container-high text-on-surface" value="San Justo">
                      San Justo
                    </option>
                    <option className="bg-surface-container-high text-on-surface" value="Castelar">
                      Castelar
                    </option>
                    <option className="bg-surface-container-high text-on-surface" value="Haedo">
                      Haedo
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">call</span>{' '}
                  Teléfono Celular
                </label>
                <div className="bg-surface-container-high rounded-2xl px-space-md py-2.5">
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline outline-none"
                    placeholder="11-xxxx-xxxx"
                    type="tel"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-primary">chair</span>{' '}
                Mueble del Catálogo / Modelo
              </label>
              <div className="bg-surface-container-high rounded-2xl px-space-md py-3 flex items-center justify-between">
                <input
                  value={newFurniture}
                  onChange={(e) => setNewFurniture(e.target.value)}
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline outline-none"
                  placeholder="Ej: Mesa Ratona Petiribí 120x60"
                  type="text"
                />
                <span className="material-symbols-outlined text-outline text-[18px]">
                  straighten
                </span>
              </div>
            </div>

            {/* Fechas Críticas para el Algoritmo */}
            <div className="grid grid-cols-2 gap-space-sm bg-surface-container-lowest/60 p-space-sm rounded-2xl">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">
                    event_available
                  </span>{' '}
                  Recepción
                </span>
                <input
                  value={newDateIn}
                  onChange={(e) => setNewDateIn(e.target.value)}
                  className="bg-surface-container-high px-2.5 py-1.5 rounded-xl font-body-md text-body-md text-on-surface outline-none"
                  type="date"
                />
              </div>
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-[11px] text-tertiary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>{' '}
                  Entrega Algoritmo
                </span>
                <input
                  value={newDateOut}
                  onChange={(e) => setNewDateOut(e.target.value)}
                  className="bg-surface-container-high px-2.5 py-1.5 rounded-xl font-body-md text-body-md text-on-surface outline-none"
                  type="date"
                />
              </div>
            </div>

            {/* Finanzas: Total, Anticipo, Saldo */}
            <div className="grid grid-cols-3 gap-space-xs">
              <div className="flex flex-col bg-surface-container-high p-2.5 rounded-2xl">
                <span className="font-label-md text-[10px] text-on-surface-variant uppercase">
                  Total Pactado
                </span>
                <input
                  value={newTotal}
                  onChange={(e) => setNewTotal(e.target.value)}
                  className="bg-transparent font-telemetry-num text-[16px] text-on-surface outline-none mt-1"
                  placeholder="$0"
                  type="text"
                />
              </div>
              <div className="flex flex-col bg-surface-container-high p-2.5 rounded-2xl">
                <span className="font-label-md text-[10px] text-on-secondary-container uppercase">
                  Seña / Anticipo
                </span>
                <input
                  value={newDeposit}
                  onChange={(e) => setNewDeposit(e.target.value)}
                  className="bg-transparent font-telemetry-num text-[16px] text-secondary outline-none mt-1"
                  placeholder="$0"
                  type="text"
                />
              </div>
              <div className="flex flex-col bg-surface-container-high p-2.5 rounded-2xl">
                <span className="font-label-md text-[10px] text-tertiary uppercase">Saldo</span>
                <input
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  className="bg-transparent font-telemetry-num text-[16px] text-tertiary outline-none mt-1"
                  placeholder="$0"
                  type="text"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateOrder}
              className="w-full h-12 bg-primary-container text-on-primary-container font-semibold rounded-full flex items-center justify-center gap-space-xs active:scale-98 transition-transform shadow-[0_4px_16px_rgba(102,76,255,0.3)] mt-space-xs"
            >
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              <span>Dar de Alta en Taller</span>
            </button>
          </div>
        )}
      </section>

      {/* Section 2: Orders Status Tabs / Filters (Horizontal Rail) */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            Cola de Pedidos
          </span>
          <span className="font-label-md text-label-md text-secondary">12 Activas</span>
        </div>

        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-1 px-1">
          {(
            [
              { id: 'todos', label: 'Todos (12)' },
              { id: 'en-proceso', label: 'En Proceso (5)' },
              { id: 'terminado', label: 'Terminado (3)' },
              { id: 'embalado', label: 'Embalado (2)' },
              { id: 'entregado', label: 'Entregado (2)' },
            ] as { id: 'todos' | OrderStatus; label: string }[]
          ).map((pill) => {
            const isSelected = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveFilter(pill.id)}
                className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-primary text-on-primary font-semibold shadow-sm'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Real Orders Cards List */}
      <section className="flex flex-col gap-space-md">
        {filteredOrders.map((order) => (
          <article
            key={order.id}
            className={`bg-surface-container-low rounded-3xl p-space-md shadow-md flex flex-col gap-space-md relative overflow-hidden ${
              order.status === 'entregado' ? 'opacity-95' : ''
            }`}
          >
            {order.badgeImminent && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary via-primary to-transparent"></div>
            )}

            {/* Header row */}
            <div className={`flex items-start justify-between gap-space-sm ${order.badgeImminent ? 'pt-1' : ''}`}>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-space-xs">
                  <span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">
                    {order.code}
                  </span>
                  {order.badgeImminent ? (
                    <span className="bg-tertiary-container/30 text-tertiary font-label-md text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                      {order.badgeText}
                    </span>
                  ) : order.badgeDelivered ? (
                    <span className="bg-surface-container-high text-on-surface-variant font-label-md text-[11px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[14px]">
                        check_circle
                      </span>
                      {order.badgeText}
                    </span>
                  ) : (
                    <span className="bg-surface-container-high text-secondary font-label-md text-[11px] px-2 py-0.5 rounded-full font-medium">
                      {order.badgeText}
                    </span>
                  )}
                </div>

                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate mt-0.5">
                  {order.client}
                </span>

                <div className="flex items-center gap-1 text-on-surface-variant text-[12px] mt-0.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">
                    location_on
                  </span>
                  <span>{order.city}</span>
                  <span className="text-outline">•</span>
                  <span
                    className={
                      order.distanceHighlight
                        ? 'text-secondary font-medium'
                        : 'text-on-surface-variant'
                    }
                  >
                    {order.distance}
                  </span>
                </div>
              </div>

              {/* Visual item thumbnail */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-container-highest shrink-0 shadow-inner">
                <img
                  className="w-full h-full object-cover"
                  alt={order.furnitureTitle}
                  referrerPolicy="no-referrer"
                  src={order.image}
                />
              </div>
            </div>

            {/* Furniture Specs Details */}
            <div className="bg-surface-container/70 rounded-2xl p-space-sm flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="material-symbols-outlined text-[17px] text-secondary">
                  {order.furnitureIcon}
                </span>
                <span className="font-body-md text-body-md font-medium">
                  {order.furnitureTitle}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px] text-on-surface-variant pt-1 gap-2">
                {order.deliveryUrgent ? (
                  <span className="flex items-center gap-1 text-tertiary font-medium">
                    <span className="material-symbols-outlined text-[15px]">alarm</span>
                    {order.deliveryLabel}
                  </span>
                ) : order.badgeDelivered ? (
                  <span className="text-on-surface-variant">{order.deliveryLabel}</span>
                ) : (
                  <span className="flex items-center gap-1 text-on-surface">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      event
                    </span>
                    {order.deliveryLabel}
                  </span>
                )}
                <span className="text-outline text-right">{order.specNote}</span>
              </div>
            </div>

            {/* Interactive Status Selector Pillbox */}
            <div className="flex flex-col gap-1.5">
              <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wide">
                Fase de Producción
              </span>
              <div className="grid grid-cols-4 gap-1 p-1 bg-surface-container-lowest/80 rounded-full">
                {(
                  [
                    { id: 'en-proceso', label: 'En proc.' },
                    { id: 'terminado', label: 'Terminado' },
                    { id: 'embalado', label: 'Embalado' },
                    { id: 'entregado', label: 'Entregado' },
                  ] as { id: OrderStatus; label: string }[]
                ).map((st) => {
                  const isCurrent = order.status === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleStatusChange(order.id, st.id)}
                      className={`py-1.5 rounded-full text-[11px] font-label-md text-center transition-all ${
                        isCurrent
                          ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial Balance Progress & Quick Actions */}
            {order.paidFullAmount ? (
              <div className="flex items-center justify-between bg-surface-container-high/60 px-3 py-2.5 rounded-2xl text-[12px]">
                <div className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    verified
                  </span>
                  <span>
                    Cobrado: <strong>{order.paidFullAmount}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReceiptOrder(order);
                    showToast(`Generando comprobante digital ${order.code}...`, 'receipt_long');
                  }}
                  className="text-secondary font-medium hover:underline flex items-center gap-0.5"
                >
                  <span>Ver Recibo</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-on-surface-variant">Saldo:</span>
                    <span className="font-telemetry-num text-[14px] text-tertiary font-bold">
                      {order.balanceAmount}
                    </span>
                    <span className="text-outline text-[11px]">/ {order.totalAmount}</span>
                  </div>
                  <span className="bg-surface-container-high px-2 py-0.5 rounded-full text-[11px] font-medium text-secondary">
                    {order.paidBadge}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary-container rounded-full"
                    style={{ width: '50%' }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-space-xs pt-1">
                  <a
                    href={`https://wa.me/${order.whatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 rounded-full bg-surface-container-high flex items-center justify-center gap-1.5 text-on-surface hover:text-secondary active:scale-95 transition-all text-[13px] font-medium"
                  >
                    <span className="material-symbols-outlined text-[17px] text-secondary">
                      chat
                    </span>
                    <span>WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptOrder(order);
                      showToast(`Generando comprobante digital ${order.code}...`, 'receipt_long');
                    }}
                    className="h-10 rounded-full bg-surface-container-high flex items-center justify-center gap-1.5 text-on-surface hover:text-primary active:scale-95 transition-all text-[13px] font-medium"
                  >
                    <span className="material-symbols-outlined text-[17px] text-primary">
                      receipt
                    </span>
                    <span>Comprobante</span>
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>

      {/* Section 4: Monthly Closing & Export Utility */}
      <section className="bg-surface-container rounded-3xl p-space-md shadow-md flex flex-col gap-space-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-title-sm text-title-sm text-on-surface">
                Historial &amp; Cierre de Mes
              </h3>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Período Fiscal • Marzo 2025
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-[11px]">
            En curso
          </span>
        </div>

        {/* Monthly Summary Bento Grid */}
        <div className="grid grid-cols-2 gap-space-sm">
          <div className="bg-surface-container-high/80 rounded-2xl p-space-sm flex flex-col">
            <span className="font-label-md text-[11px] text-on-surface-variant uppercase">
              Facturado Acumulado
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">
                $2.460.000
              </span>
            </div>
            <span className="text-[11px] text-secondary mt-1 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">trending_up</span> +18% vs Feb
            </span>
          </div>

          <div className="bg-surface-container-high/80 rounded-2xl p-space-sm flex flex-col">
            <span className="font-label-md text-[11px] text-on-surface-variant uppercase">
              Muebles Entregados
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-telemetry-num text-telemetry-num text-on-surface font-bold">
                14
              </span>
              <span className="font-telemetry-unit text-telemetry-unit text-outline">
                UNIDADES
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1">100% a tiempo</span>
          </div>
        </div>

        {/* Export Action Button */}
        <button
          type="button"
          onClick={handleExportClosing}
          className="w-full h-12 rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-semibold flex items-center justify-center gap-space-xs active:scale-98 transition-all shadow-sm"
        >
          {isExporting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin text-secondary">
                progress_activity
              </span>
              <span>Generando Balance...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px] text-secondary">
                download_for_offline
              </span>
              <span>Exportar Cierre Mensual (.txt / CSV)</span>
            </>
          )}
        </button>
      </section>

      {/* Receipt Preview Modal */}
      {receiptOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReceiptOrder(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-surface-container-high p-5 shadow-2xl border border-outline-variant/30 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                <span className="font-title-sm text-title-sm font-bold text-on-surface">
                  Comprobante {receiptOrder.code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReceiptOrder(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container flex flex-col gap-2 text-body-md">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Cliente:</span>
                <span className="font-semibold text-on-surface">{receiptOrder.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Localidad:</span>
                <span className="text-on-surface">{receiptOrder.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Detalle:</span>
                <span className="text-on-surface text-right max-w-[180px] truncate">
                  {receiptOrder.furnitureTitle}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-outline-variant/20">
                <span className="text-on-surface-variant">Estado:</span>
                <span className="font-bold text-primary uppercase">{receiptOrder.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Importe / Saldo:</span>
                <span className="font-bold text-tertiary">
                  {receiptOrder.paidFullAmount ||
                    `${receiptOrder.balanceAmount} / ${receiptOrder.totalAmount}`}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                showToast(`Comprobante ${receiptOrder.code} descargado en PDF`, 'check_circle');
                setReceiptOrder(null);
              }}
              className="w-full h-11 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Compartir / Descargar PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-11/12 max-w-sm bg-surface-container-highest/95 backdrop-blur-xl text-on-surface px-4 py-3 rounded-full shadow-2xl flex items-center justify-between pointer-events-none z-50">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[20px]">
              {toast.icon}
            </span>
            <span className="font-body-md text-[13px] truncate">{toast.msg}</span>
          </div>
          <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold shrink-0 ml-2">
            Muebles J&amp;L
          </span>
        </div>
      )}
    </div>
  );
};
