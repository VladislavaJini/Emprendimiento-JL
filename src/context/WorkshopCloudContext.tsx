import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  signInWithGooglePopup,
  signOutFromCloud,
} from '../firebase';

export interface CloudCutItem {
  id: string;
  name: string;
  lengthMm: number;
  widthMm: number;
  quantity: number;
  edgeSpec: string;
  respectGrain: boolean;
}

export type CloudOrderStatus = 'en-proceso' | 'terminado' | 'embalado' | 'entregado';

export interface CloudOrderItem {
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
  status: CloudOrderStatus;
  balanceAmount?: string;
  totalAmount?: string;
  paidBadge?: string;
  paidFullAmount?: string;
  whatsappPhone: string;
}

export type CloudInventoryCat = 'placas' | 'cantos' | 'herrajes' | 'insumos';

export interface CloudInventoryItem {
  id: string;
  cat: CloudInventoryCat;
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

export interface CloudCashMovement {
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

export interface CloudCatalogMeta {
  modelId: string;
  shortTitle: string;
  fullName: string;
  glbFileName: string;
  specsText: string;
  dimensions: string;
  costInsumos: string;
  pvp: string;
  pngPreviewUrl: string;
}

export const DEFAULT_CUTS: CloudCutItem[] = [
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

export const DEFAULT_ORDERS: CloudOrderItem[] = [
  {
    id: '1084',
    code: '#PED-1084',
    badgeText: 'Entrega Inminente',
    badgeImminent: true,
    badgeDelivered: false,
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
    paidFullAmount: '',
    whatsappPhone: '5491112345678',
  },
  {
    id: '1088',
    code: '#PED-1088',
    badgeText: 'En Corte & Lijado',
    badgeImminent: false,
    badgeDelivered: false,
    client: 'Lucas Benítez',
    city: 'Castelar',
    distance: '6.2 km',
    distanceHighlight: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCK4ThREqV3F7_mAIcaqlTgigTXNv-QzHmYzLgq6qvThSYS0ed_FSCrJuu4tUVlJQD5UftZoabBxs9Cle97ccvMwu0nGcBvKghdJA9xlH1ItsEiKpRzLnunnVpJ1SgbtJT2m3a7vgBBnj6USBCMT7JhUh_N49Kqmo_0Omlt4CAjCwo6VQc3k0MlHiZh9yMzh8km8Nhp9ouwBDXlGukuBSzGOP2RY0bOmrULmWQf4hr4Mq_sQ-kc9e6ZSg',
    furnitureIcon: 'table_restaurant',
    furnitureTitle: 'Mesa Ratona Petiribí Maciza',
    deliveryLabel: 'Entrega: 28 de Marzo',
    deliveryUrgent: false,
    specNote: 'Espesor 2 pulgadas',
    status: 'en-proceso',
    balanceAmount: '$70.000',
    totalAmount: '$140.000',
    paidBadge: '50% Señado',
    paidFullAmount: '',
    whatsappPhone: '5491122223333',
  },
  {
    id: '1091',
    code: '#PED-1091',
    badgeText: 'Estructura Metálica',
    badgeImminent: false,
    badgeDelivered: false,
    client: 'Arq. Mariana Peña',
    city: 'Villa Luzuriaga',
    distance: 'Local (1.2 km)',
    distanceHighlight: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9SkKcB8u7I1gjAwyszvyOvDuMA0d9q5_mEOmlt5xPfUhjRGSM8fLPoggtnQ8omQDTNSaVI2kwPa4L8QOju4D3F3UL2CIUjLNYiW75XobWTsE9tALMLfYngyCvRplPm7ESgqu5eDD7TantbcxxXjDInUAvQKVTHC_pWAytnsFy5t2GFzzSLsUzjRcfQLD11kD5qCXYCjTBDyma_fyazgylwrRKnBQfgpPGJM99zcxjvOmq8MCnGIljhQ',
    furnitureIcon: 'desk',
    furnitureTitle: 'Escritorio Nórdico Industrial c/ Cajonera',
    deliveryLabel: 'Entrega: 05 de Abril',
    deliveryUrgent: false,
    specNote: 'Melamina 18mm Guatambú',
    status: 'en-proceso',
    balanceAmount: '$115.000',
    totalAmount: '$230.000',
    paidBadge: '50% Anticipo',
    paidFullAmount: '',
    whatsappPhone: '5491144445555',
  },
  {
    id: '1079',
    code: '#PED-1079',
    badgeText: 'Entregado & Saldado',
    badgeImminent: false,
    badgeDelivered: true,
    client: 'Silvia Gómez',
    city: 'Haedo',
    distance: '4.1 km',
    distanceHighlight: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBhNjqMj-MmvO8GzhQqs6r1RtR_edrFGTIgd2p67NBtrKCPWTDZpjPJsHUmcoy9HVblvNRJffpZ99JeJF7ablD_gKT9JnQgPzUIzxE_bCxOt1-k8kT0bPwT8fzIYgEjky1RHfYROXt0AZS_VUnHYTJmQvWfxZ-g0ln4MFYe_ENeOzOCTCwniYH1aPvrq7dUVj8J2k4RveJjOkjE3nAy5iRSUgDeLV1mVRIZx5UOIEk_WhslsvO_ODDKQ',
    furnitureIcon: 'shelves',
    furnitureTitle: 'Placard 2 Puertas Corredizas',
    deliveryLabel: 'Entregado el 24 de Marzo',
    deliveryUrgent: false,
    specNote: 'Rieles Ducasse aluminio',
    status: 'entregado',
    balanceAmount: '$0',
    totalAmount: '$320.000',
    paidBadge: '100% Saldado',
    paidFullAmount: '$320.000 ARS',
    whatsappPhone: '5491155556666',
  },
];

export const DEFAULT_INVENTORY: CloudInventoryItem[] = [
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
    urgentButtonLabel: '',
    urgentButtonIcon: '',
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
    urgentButtonLabel: '',
    urgentButtonIcon: '',
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
    urgentButtonLabel: '',
    urgentButtonIcon: '',
  },
];

export const DEFAULT_MOVEMENTS: CloudCashMovement[] = [
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

function sanitizeDocId(uid: string, rawId: string): string {
  const cleanUid = uid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60);
  const cleanId = rawId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60) || 'item';
  return `${cleanUid}_${cleanId}`;
}

function extractLocalId(uid: string, docId: string): string {
  const prefix = `${uid.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60)}_`;
  return docId.startsWith(prefix) ? docId.slice(prefix.length) : docId;
}

interface WorkshopCloudContextValue {
  user: User | null;
  authReady: boolean;
  isCloudConnected: boolean;
  syncStatusText: string;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  cuts: CloudCutItem[];
  orders: CloudOrderItem[];
  inventory: CloudInventoryItem[];
  movements: CloudCashMovement[];
  catalogPngMap: Record<string, string>;
  upsertCut: (cut: CloudCutItem) => Promise<void>;
  removeCut: (cutId: string) => Promise<void>;
  clearAllCuts: () => Promise<void>;
  restoreDefaultCuts: () => Promise<void>;
  createOrder: (order: CloudOrderItem) => Promise<void>;
  updateOrder: (order: CloudOrderItem) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: CloudOrderStatus) => Promise<void>;
  createInventoryItem: (item: CloudInventoryItem) => Promise<void>;
  updateInventoryItem: (item: CloudInventoryItem) => Promise<void>;
  deleteInventoryItem: (itemId: string) => Promise<void>;
  updateInventoryStock: (itemId: string, nextStock: number, nextStatus: CloudInventoryItem['statusType']) => Promise<void>;
  createCashMovement: (movement: CloudCashMovement) => Promise<void>;
  saveCatalogPng: (meta: CloudCatalogMeta) => Promise<void>;
}

const WorkshopCloudContext = createContext<WorkshopCloudContextValue | null>(null);

export const WorkshopCloudProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [syncStatusText, setSyncStatusText] = useState('Modo Local • Inicia sesión para Nube');

  const [cuts, setCuts] = useState<CloudCutItem[]>(DEFAULT_CUTS);
  const [orders, setOrders] = useState<CloudOrderItem[]>(DEFAULT_ORDERS);
  const [inventory, setInventory] = useState<CloudInventoryItem[]>(DEFAULT_INVENTORY);
  const [movements, setMovements] = useState<CloudCashMovement[]>(DEFAULT_MOVEMENTS);
  const [catalogPngMap, setCatalogPngMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('taller_os_catalog_pngs_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Track if user intentionally emptied the board so we don't re-seed defaults on empty snapshot
  const intentionallyClearedCutsRef = useRef(false);
  const seededCollectionsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (currentUser && currentUser.emailVerified) {
        setSyncStatusText('Sincronizado con Firebase Firestore');
      } else if (currentUser && !currentUser.emailVerified) {
        setSyncStatusText('Email no verificado en Firebase');
      } else {
        setSyncStatusText('Modo Local • Conectar Firebase');
      }
    });
    return () => unsubAuth();
  }, []);

  // Attach real-time Firestore listeners only when authReady && user && user.emailVerified
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      return;
    }

    const uid = user.uid;

    // 1. Cuts Listener
    const cutsQuery = query(collection(db, 'cuts'), where('ownerId', '==', uid));
    const unsubCuts = onSnapshot(
      cutsQuery,
      (snapshot) => {
        if (
          snapshot.empty &&
          !seededCollectionsRef.current[`cuts_${uid}`] &&
          !intentionallyClearedCutsRef.current
        ) {
          seededCollectionsRef.current[`cuts_${uid}`] = true;
          DEFAULT_CUTS.forEach((c) => {
            const docId = sanitizeDocId(uid, c.id);
            setDoc(doc(db, 'cuts', docId), {
              ownerId: uid,
              name: c.name.slice(0, 120),
              lengthMm: Math.min(5000, Math.max(10, Number(c.lengthMm))),
              widthMm: Math.min(5000, Math.max(10, Number(c.widthMm))),
              quantity: Math.min(500, Math.max(1, Number(c.quantity))),
              edgeSpec: c.edgeSpec.slice(0, 80),
              respectGrain: Boolean(c.respectGrain),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }).catch((err) => handleFirestoreError(err, OperationType.WRITE, `cuts/${docId}`));
          });
          return;
        }
        seededCollectionsRef.current[`cuts_${uid}`] = true;
        const loaded: CloudCutItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: extractLocalId(uid, d.id),
            name: String(data.name || 'Pieza'),
            lengthMm: Number(data.lengthMm || 100),
            widthMm: Number(data.widthMm || 100),
            quantity: Number(data.quantity || 1),
            edgeSpec: String(data.edgeSpec || 'Sin canto'),
            respectGrain: Boolean(data.respectGrain),
          };
        });
        loaded.sort((a, b) => a.id.localeCompare(b.id));
        setCuts(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'cuts');
      }
    );

    // 2. Orders Listener
    const ordersQuery = query(collection(db, 'orders'), where('ownerId', '==', uid));
    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        if (snapshot.empty && !seededCollectionsRef.current[`orders_${uid}`]) {
          seededCollectionsRef.current[`orders_${uid}`] = true;
          DEFAULT_ORDERS.forEach((o) => {
            const docId = sanitizeDocId(uid, o.id);
            setDoc(doc(db, 'orders', docId), {
              ownerId: uid,
              code: o.code.slice(0, 40),
              badgeText: (o.badgeText || '').slice(0, 60),
              badgeImminent: Boolean(o.badgeImminent),
              badgeDelivered: Boolean(o.badgeDelivered),
              client: o.client.slice(0, 120),
              city: (o.city || '').slice(0, 80),
              distance: (o.distance || '').slice(0, 40),
              distanceHighlight: Boolean(o.distanceHighlight),
              image: (o.image || '').slice(0, 1200),
              furnitureIcon: (o.furnitureIcon || 'chair').slice(0, 60),
              furnitureTitle: o.furnitureTitle.slice(0, 160),
              deliveryLabel: (o.deliveryLabel || '').slice(0, 80),
              deliveryUrgent: Boolean(o.deliveryUrgent),
              specNote: (o.specNote || '').slice(0, 160),
              status: o.status,
              balanceAmount: (o.balanceAmount || '$0').slice(0, 40),
              totalAmount: (o.totalAmount || '$0').slice(0, 40),
              paidBadge: (o.paidBadge || '').slice(0, 40),
              paidFullAmount: (o.paidFullAmount || '').slice(0, 40),
              whatsappPhone: (o.whatsappPhone || '').slice(0, 40),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }).catch((err) => handleFirestoreError(err, OperationType.WRITE, `orders/${docId}`));
          });
          return;
        }
        seededCollectionsRef.current[`orders_${uid}`] = true;
        const loaded: CloudOrderItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: extractLocalId(uid, d.id),
            code: String(data.code || '#PED'),
            badgeText: String(data.badgeText || ''),
            badgeImminent: Boolean(data.badgeImminent),
            badgeDelivered: Boolean(data.badgeDelivered),
            client: String(data.client || ''),
            city: String(data.city || ''),
            distance: String(data.distance || ''),
            distanceHighlight: Boolean(data.distanceHighlight),
            image: String(data.image || ''),
            furnitureIcon: String(data.furnitureIcon || 'chair'),
            furnitureTitle: String(data.furnitureTitle || ''),
            deliveryLabel: String(data.deliveryLabel || ''),
            deliveryUrgent: Boolean(data.deliveryUrgent),
            specNote: String(data.specNote || ''),
            status: (data.status as CloudOrderStatus) || 'en-proceso',
            balanceAmount: String(data.balanceAmount || ''),
            totalAmount: String(data.totalAmount || ''),
            paidBadge: String(data.paidBadge || ''),
            paidFullAmount: String(data.paidFullAmount || ''),
            whatsappPhone: String(data.whatsappPhone || ''),
          };
        });
        setOrders(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    // 3. Inventory Listener
    const invQuery = query(collection(db, 'inventory'), where('ownerId', '==', uid));
    const unsubInv = onSnapshot(
      invQuery,
      (snapshot) => {
        if (snapshot.empty && !seededCollectionsRef.current[`inventory_${uid}`]) {
          seededCollectionsRef.current[`inventory_${uid}`] = true;
          DEFAULT_INVENTORY.forEach((item) => {
            const docId = sanitizeDocId(uid, item.id);
            setDoc(doc(db, 'inventory', docId), {
              ownerId: uid,
              cat: item.cat,
              categoryLabel: item.categoryLabel.slice(0, 60),
              specLabel: item.specLabel.slice(0, 80),
              cornerTag: item.cornerTag.slice(0, 20),
              title: item.title.slice(0, 140),
              priceLabel: item.priceLabel.slice(0, 60),
              image: item.image.slice(0, 1200),
              stock: Math.min(1000000, Math.max(0, Number(item.stock))),
              minSuggested: Math.min(1000000, Math.max(0, Number(item.minSuggested))),
              unit: item.unit.slice(0, 30),
              statusType: item.statusType,
              urgentButtonLabel: (item.urgentButtonLabel || '').slice(0, 60),
              urgentButtonIcon: (item.urgentButtonIcon || '').slice(0, 40),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }).catch((err) => handleFirestoreError(err, OperationType.WRITE, `inventory/${docId}`));
          });
          return;
        }
        seededCollectionsRef.current[`inventory_${uid}`] = true;
        const loaded: CloudInventoryItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: extractLocalId(uid, d.id),
            cat: (data.cat as CloudInventoryCat) || 'placas',
            categoryLabel: String(data.categoryLabel || 'Placas'),
            specLabel: String(data.specLabel || ''),
            cornerTag: String(data.cornerTag || ''),
            title: String(data.title || ''),
            priceLabel: String(data.priceLabel || ''),
            image: String(data.image || ''),
            stock: Number(data.stock ?? 0),
            minSuggested: Number(data.minSuggested ?? 1),
            unit: String(data.unit || 'un'),
            statusType: (data.statusType as CloudInventoryItem['statusType']) || 'normal',
            urgentButtonLabel: data.urgentButtonLabel ? String(data.urgentButtonLabel) : undefined,
            urgentButtonIcon: data.urgentButtonIcon ? String(data.urgentButtonIcon) : undefined,
          };
        });
        loaded.sort((a, b) => a.id.localeCompare(b.id));
        setInventory(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inventory');
      }
    );

    // 4. Movements Listener
    const movQuery = query(collection(db, 'movements'), where('ownerId', '==', uid));
    const unsubMov = onSnapshot(
      movQuery,
      (snapshot) => {
        if (snapshot.empty && !seededCollectionsRef.current[`movements_${uid}`]) {
          seededCollectionsRef.current[`movements_${uid}`] = true;
          DEFAULT_MOVEMENTS.forEach((m) => {
            const docId = sanitizeDocId(uid, m.id);
            setDoc(doc(db, 'movements', docId), {
              ownerId: uid,
              type: m.type,
              title: m.title.slice(0, 160),
              subtitle: m.subtitle.slice(0, 160),
              amountFormatted: m.amountFormatted.slice(0, 40),
              entity: m.entity.slice(0, 120),
              paymentMethod: m.paymentMethod,
              paymentLabel: m.paymentLabel.slice(0, 60),
              timestamp: m.timestamp.slice(0, 60),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }).catch((err) => handleFirestoreError(err, OperationType.WRITE, `movements/${docId}`));
          });
          return;
        }
        seededCollectionsRef.current[`movements_${uid}`] = true;
        const loaded: CloudCashMovement[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: extractLocalId(uid, d.id),
            type: (data.type as 'ingreso' | 'egreso') || 'ingreso',
            title: String(data.title || ''),
            subtitle: String(data.subtitle || ''),
            amountFormatted: String(data.amountFormatted || ''),
            entity: String(data.entity || ''),
            paymentMethod: (data.paymentMethod as 'efectivo' | 'mp' | 'factura') || 'mp',
            paymentLabel: String(data.paymentLabel || ''),
            timestamp: String(data.timestamp || ''),
          };
        });
        setMovements(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'movements');
      }
    );

    // 5. CatalogMeta Listener
    const catMetaQuery = query(collection(db, 'catalogMeta'), where('ownerId', '==', uid));
    const unsubCatMeta = onSnapshot(
      catMetaQuery,
      (snapshot) => {
        const nextMap: Record<string, string> = {};
        snapshot.docs.forEach((d) => {
          const data = d.data();
          const mId = String(data.modelId || extractLocalId(uid, d.id));
          if (data.pngPreviewUrl) {
            nextMap[mId] = String(data.pngPreviewUrl);
          }
        });
        if (Object.keys(nextMap).length > 0) {
          setCatalogPngMap((prev) => ({ ...prev, ...nextMap }));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'catalogMeta');
      }
    );

    return () => {
      unsubCuts();
      unsubOrders();
      unsubInv();
      unsubMov();
      unsubCatMeta();
    };
  }, [authReady, user]);

  const signIn = async () => {
    await signInWithGooglePopup();
  };

  const logOut = async () => {
    await signOutFromCloud();
  };

  const isCloudConnected = Boolean(authReady && user && user.emailVerified);

  const upsertCut = async (cut: CloudCutItem) => {
    intentionallyClearedCutsRef.current = false;
    setCuts((prev) => {
      const exists = prev.some((c) => c.id === cut.id);
      return exists ? prev.map((c) => (c.id === cut.id ? cut : c)) : [...prev, cut];
    });

    if (!isCloudConnected || !user) return;
    const uid = user.uid;
    const docId = sanitizeDocId(uid, cut.id);
    const existsAlready = cuts.some((c) => c.id === cut.id);
    const path = `cuts/${docId}`;

    try {
      if (existsAlready) {
        await updateDoc(doc(db, 'cuts', docId), {
          name: cut.name.trim().slice(0, 120) || 'Pieza',
          lengthMm: Math.min(5000, Math.max(10, Math.round(cut.lengthMm))),
          widthMm: Math.min(5000, Math.max(10, Math.round(cut.widthMm))),
          quantity: Math.min(500, Math.max(1, Math.round(cut.quantity))),
          edgeSpec: (cut.edgeSpec || '').slice(0, 80),
          respectGrain: Boolean(cut.respectGrain),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'cuts', docId), {
          ownerId: uid,
          name: cut.name.trim().slice(0, 120) || 'Pieza',
          lengthMm: Math.min(5000, Math.max(10, Math.round(cut.lengthMm))),
          widthMm: Math.min(5000, Math.max(10, Math.round(cut.widthMm))),
          quantity: Math.min(500, Math.max(1, Math.round(cut.quantity))),
          edgeSpec: (cut.edgeSpec || '').slice(0, 80),
          respectGrain: Boolean(cut.respectGrain),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(
        error,
        existsAlready ? OperationType.UPDATE : OperationType.CREATE,
        path
      );
    }
  };

  const removeCut = async (cutId: string) => {
    const remaining = cuts.filter((c) => c.id !== cutId);
    if (remaining.length === 0) {
      intentionallyClearedCutsRef.current = true;
    }
    setCuts(remaining);

    if (!isCloudConnected || !user) return;
    const docId = sanitizeDocId(user.uid, cutId);
    const path = `cuts/${docId}`;
    try {
      await deleteDoc(doc(db, 'cuts', docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const clearAllCuts = async () => {
    intentionallyClearedCutsRef.current = true;
    const currentIds = cuts.map((c) => c.id);
    setCuts([]);

    if (!isCloudConnected || !user) return;
    const uid = user.uid;
    for (const id of currentIds) {
      const docId = sanitizeDocId(uid, id);
      try {
        await deleteDoc(doc(db, 'cuts', docId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `cuts/${docId}`);
      }
    }
  };

  const restoreDefaultCuts = async () => {
    intentionallyClearedCutsRef.current = false;
    const previousIds = cuts.map((c) => c.id);
    setCuts(DEFAULT_CUTS);

    if (!isCloudConnected || !user) return;
    const uid = user.uid;
    for (const oldId of previousIds) {
      const oldDocId = sanitizeDocId(uid, oldId);
      try {
        await deleteDoc(doc(db, 'cuts', oldDocId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `cuts/${oldDocId}`);
      }
    }
    for (const c of DEFAULT_CUTS) {
      const docId = sanitizeDocId(uid, c.id);
      try {
        await setDoc(doc(db, 'cuts', docId), {
          ownerId: uid,
          name: c.name.slice(0, 120),
          lengthMm: Math.min(5000, Math.max(10, c.lengthMm)),
          widthMm: Math.min(5000, Math.max(10, c.widthMm)),
          quantity: Math.min(500, Math.max(1, c.quantity)),
          edgeSpec: c.edgeSpec.slice(0, 80),
          respectGrain: Boolean(c.respectGrain),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `cuts/${docId}`);
      }
    }
  };

  const createOrder = async (order: CloudOrderItem) => {
    setOrders((prev) => [order, ...prev]);

    if (!isCloudConnected || !user) return;
    const uid = user.uid;
    const docId = sanitizeDocId(uid, order.id);
    const path = `orders/${docId}`;
    try {
      await setDoc(doc(db, 'orders', docId), {
        ownerId: uid,
        code: (order.code || '#PED').slice(0, 40),
        badgeText: (order.badgeText || '').slice(0, 60),
        badgeImminent: Boolean(order.badgeImminent),
        badgeDelivered: Boolean(order.badgeDelivered),
        client: (order.client || 'Cliente').slice(0, 120),
        city: (order.city || '').slice(0, 80),
        distance: (order.distance || '').slice(0, 40),
        distanceHighlight: Boolean(order.distanceHighlight),
        image: (order.image || '').slice(0, 1200),
        furnitureIcon: (order.furnitureIcon || 'chair').slice(0, 60),
        furnitureTitle: (order.furnitureTitle || 'Mueble').slice(0, 160),
        deliveryLabel: (order.deliveryLabel || '').slice(0, 80),
        deliveryUrgent: Boolean(order.deliveryUrgent),
        specNote: (order.specNote || '').slice(0, 160),
        status: order.status,
        balanceAmount: (order.balanceAmount || '$0').slice(0, 40),
        totalAmount: (order.totalAmount || '$0').slice(0, 40),
        paidBadge: (order.paidBadge || '').slice(0, 40),
        paidFullAmount: (order.paidFullAmount || '').slice(0, 40),
        whatsappPhone: (order.whatsappPhone || '').slice(0, 40),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateOrder = async (order: CloudOrderItem) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));

    if (!isCloudConnected || !user) return;
    const docId = sanitizeDocId(user.uid, order.id);
    const path = `orders/${docId}`;
    try {
      await updateDoc(doc(db, 'orders', docId), {
        code: (order.code || '#PED').slice(0, 40),
        badgeText: (order.badgeText || '').slice(0, 60),
        badgeImminent: Boolean(order.badgeImminent),
        badgeDelivered: Boolean(order.badgeDelivered),
        client: (order.client || 'Cliente').slice(0, 120),
        city: (order.city || '').slice(0, 80),
        distance: (order.distance || '').slice(0, 40),
        distanceHighlight: Boolean(order.distanceHighlight),
        image: (order.image || '').slice(0, 1200),
        furnitureIcon: (order.furnitureIcon || 'chair').slice(0, 60),
        furnitureTitle: (order.furnitureTitle || 'Mueble').slice(0, 160),
        deliveryLabel: (order.deliveryLabel || '').slice(0, 80),
        deliveryUrgent: Boolean(order.deliveryUrgent),
        specNote: (order.specNote || '').slice(0, 160),
        status: order.status,
        balanceAmount: (order.balanceAmount || '$0').slice(0, 40),
        totalAmount: (order.totalAmount || '$0').slice(0, 40),
        paidBadge: (order.paidBadge || '').slice(0, 40),
        paidFullAmount: (order.paidFullAmount || '').slice(0, 40),
        whatsappPhone: (order.whatsappPhone || '').slice(0, 40),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    if (!isCloudConnected || !user) return;
    const docId = sanitizeDocId(user.uid, orderId);
    const path = `orders/${docId}`;
    try {
      await deleteDoc(doc(db, 'orders', docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: CloudOrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              badgeDelivered: newStatus === 'entregado',
            }
          : o
      )
    );

    if (!isCloudConnected || !user) return;
    const docId = sanitizeDocId(user.uid, orderId);
    const path = `orders/${docId}`;
    try {
      await updateDoc(doc(db, 'orders', docId), {
        status: newStatus,
        badgeDelivered: newStatus === 'entregado',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const createInventoryItem = async (item: CloudInventoryItem) => {
    setInventory((prev) => [item, ...prev]);

    if (!isCloudConnected || !user) return;
    const uid = user.uid;
    const docId = sanitizeDocId(uid, item.id);
    const path = `inventory/${docId}`;
    try {
      await setDoc(doc(db, 'inventory', docId), {
        ownerId: uid,
        cat: item.cat,
        categoryLabel: (item.categoryLabel || 'Placas').slice(0, 60),
        specLabel: (item.specLabel || '').slice(0, 80),
        cornerTag: (item.cornerTag || '').slice(0, 20),
        title: (item.title || 'Material').slice(0, 140),
        priceLabel: (item.priceLabel || '').slice(0, 60),
        image: (item.image || '').slice(0, 1200),
        stock: Math.min(1000000, Math.max(0, Number(item.stock))),
        minSuggested: Math.min(1000000, Math.max(0, Number(item.minSuggested))),
        unit: (item.unit || 'un').slice(0, 30),
        statusType: item.statusType,
        urgentButtonLabel: (item.urgentButtonLabel || '').slice(0, 60),
        urgentButtonIcon: (item.urgentButtonIcon || '').slice(0, 40),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateInventoryItem = async (item: CloudInventoryItem) => {
    setInventory((prev) => prev.map((it) => (it.id === item.id ? item : it)));

    if (!isCloudConnected || !user) return;
    const docId = sanitizeDocId(user.uid, item.id);
    const path = `inventory/${docId}`;
    try {
      await updateDoc(doc(db, 'inventory', docId), {
        cat: item.cat,
        categoryLabel: (item.categoryLabel || 'Placas').slice(0, 60),
        specLabel: (item.specLabel || '').slice(0, 80),
        cornerTag: (item.cornerTag || '').slice(0, 20),
        title: (item.title || 'Material').slice(0, 140),
        priceLabel: (item.priceLabel || '').slice(0, 60),
        image: (item.image || '').slice(0, 1200),
        stock: Math.min(1000000, Math.max(0, Number(item.stock))),
        minSuggested: Math.min(1000000, Math.max(0, Number(item.minSuggested))),
        unit: (item.unit || 'un').slice(0, 30),
        statusType: item.statusType,
        urgentButtonLabel: (item.urgentButtonLabel || '').slice(0, 60),
        urgentButtonIcon: (item.urgentButtonIcon || '').slice(0, 40),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteInventoryItem = async (itemId: string) => {
    setInventory((prev) => prev.filter((it) => it.id !== itemId));

    if (!isCloudConnected || !user) return;
    const docId = sanitizeDocId(user.uid, itemId);
    const path = `inventory/${docId}`;
    try {
      await deleteDoc(doc(db, 'inventory', docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const updateInventoryStock = async (
    itemId: string,
    nextStock: number,
    nextStatus: CloudInventoryItem['statusType']
  ) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, stock: nextStock, statusType: nextStatus } : item
      )
    );

    if (!isCloudConnected || !user) return;
    const docId = sanitizeDocId(user.uid, itemId);
    const path = `inventory/${docId}`;
    try {
      await updateDoc(doc(db, 'inventory', docId), {
        stock: Math.min(1000000, Math.max(0, Number(nextStock))),
        statusType: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const createCashMovement = async (movement: CloudCashMovement) => {
    setMovements((prev) => [movement, ...prev]);

    if (!isCloudConnected || !user) return;
    const uid = user.uid;
    const docId = sanitizeDocId(uid, movement.id);
    const path = `movements/${docId}`;
    try {
      await setDoc(doc(db, 'movements', docId), {
        ownerId: uid,
        type: movement.type,
        title: (movement.title || 'Movimiento').slice(0, 160),
        subtitle: (movement.subtitle || '').slice(0, 160),
        amountFormatted: (movement.amountFormatted || '$0').slice(0, 40),
        entity: (movement.entity || '').slice(0, 120),
        paymentMethod: movement.paymentMethod,
        paymentLabel: (movement.paymentLabel || '').slice(0, 60),
        timestamp: (movement.timestamp || '').slice(0, 60),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const saveCatalogPng = async (meta: CloudCatalogMeta) => {
    const hadExistingInCloud = Boolean(catalogPngMap[meta.modelId]);
    setCatalogPngMap((prev) => {
      const next = { ...prev, [meta.modelId]: meta.pngPreviewUrl };
      try {
        localStorage.setItem('taller_os_catalog_pngs_v1', JSON.stringify(next));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });

    if (!isCloudConnected || !user) return;
    const uid = user.uid;
    const docId = sanitizeDocId(uid, meta.modelId);
    const path = `catalogMeta/${docId}`;
    const safePng = meta.pngPreviewUrl.slice(0, 800000);

    try {
      if (hadExistingInCloud) {
        await updateDoc(doc(db, 'catalogMeta', docId), {
          pngPreviewUrl: safePng,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(doc(db, 'catalogMeta', docId), {
          ownerId: uid,
          modelId: meta.modelId.slice(0, 60),
          shortTitle: meta.shortTitle.slice(0, 100),
          fullName: meta.fullName.slice(0, 140),
          glbFileName: meta.glbFileName.slice(0, 120),
          specsText: meta.specsText.slice(0, 120),
          dimensions: meta.dimensions.slice(0, 40),
          costInsumos: meta.costInsumos.slice(0, 40),
          pvp: meta.pvp.slice(0, 40),
          pngPreviewUrl: safePng,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(
        error,
        hadExistingInCloud ? OperationType.UPDATE : OperationType.CREATE,
        path
      );
    }
  };

  return (
    <WorkshopCloudContext.Provider
      value={{
        user,
        authReady,
        isCloudConnected,
        syncStatusText,
        signIn,
        logOut,
        cuts,
        orders,
        inventory,
        movements,
        catalogPngMap,
        upsertCut,
        removeCut,
        clearAllCuts,
        restoreDefaultCuts,
        createOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus,
        createInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        updateInventoryStock,
        createCashMovement,
        saveCatalogPng,
      }}
    >
      {children}
    </WorkshopCloudContext.Provider>
  );
};

export function useWorkshopCloud(): WorkshopCloudContextValue {
  const ctx = useContext(WorkshopCloudContext);
  if (!ctx) {
    throw new Error('useWorkshopCloud must be used within WorkshopCloudProvider');
  }
  return ctx;
}
