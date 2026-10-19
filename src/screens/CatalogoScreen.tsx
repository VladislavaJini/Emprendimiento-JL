import React, { useEffect, useState } from 'react';
import { ScreenId } from '../types';

export interface MainComponentItem {
  id: string;
  role: 'Piso' | 'Techo' | 'Lateral Izquierdo' | 'Lateral Derecho' | 'Divisor / Estante' | 'Fondo';
  name: string;
  dimensionsMm: string;
  material: string;
  quantity: number;
}

export interface HardwareItem {
  id: string;
  name: string;
  spec: string;
  unit: string;
  quantity: number;
}

export interface DrawerComponentItem {
  id: string;
  name: string;
  dimensionsMm: string;
  quantityPerDrawer: number;
  totalQuantity: number;
}

export interface DrawerHardwareItem {
  id: string;
  name: string;
  spec: string;
  unit: string;
  quantityPerDrawer: number;
  totalQuantity: number;
}

export interface CatalogFurnitureItem {
  id: string;
  name: string;
  mainComponents: MainComponentItem[];
  mainHardware: HardwareItem[];
  drawerCount: number;
  drawerComponents: DrawerComponentItem[];
  drawerHardware: DrawerHardwareItem[];
}

const STORAGE_KEY_CATALOG_SPEC = 'taller_os_catalog_structured_v1';

const INITIAL_FURNITURE_CATALOG: CatalogFurnitureItem[] = [
  {
    id: 'mesita-nordica-v1',
    name: 'Mesita de Noche Nórdica V1',
    mainComponents: [
      {
        id: 'mc-1',
        role: 'Piso',
        name: 'Piso Inferior Estructural',
        dimensionsMm: '450 × 380 × 18 mm',
        material: 'Melamina Blanco Puro 18mm',
        quantity: 1,
      },
      {
        id: 'mc-2',
        role: 'Techo',
        name: 'Techo / Tapa Superior',
        dimensionsMm: '450 × 380 × 18 mm',
        material: 'Melamina Blanco Puro 18mm',
        quantity: 1,
      },
      {
        id: 'mc-3',
        role: 'Lateral Izquierdo',
        name: 'Lateral Izquierdo',
        dimensionsMm: '550 × 380 × 18 mm',
        material: 'Melamina Blanco Puro 18mm',
        quantity: 1,
      },
      {
        id: 'mc-4',
        role: 'Lateral Derecho',
        name: 'Lateral Derecho',
        dimensionsMm: '550 × 380 × 18 mm',
        material: 'Melamina Blanco Puro 18mm',
        quantity: 1,
      },
    ],
    mainHardware: [
      {
        id: 'mh-1',
        name: 'Tornillos Soberbios 7×50mm',
        spec: 'Allen Zincado ensamble estructural',
        unit: 'un',
        quantity: 8,
      },
      {
        id: 'mh-2',
        name: 'Tarugos de Madera 8×40mm',
        spec: 'Haya estriada p/ escuadrado',
        unit: 'un',
        quantity: 8,
      },
      {
        id: 'mh-3',
        name: 'Patas Cónicas Nórdicas Paraíso',
        spec: 'Macizas 15cm c/ platina inclinada',
        unit: 'un',
        quantity: 4,
      },
      {
        id: 'mh-4',
        name: 'Tapatornillos Autoadhesivos 13mm',
        spec: 'PVC Blanco Puro',
        unit: 'un',
        quantity: 8,
      },
    ],
    drawerCount: 1,
    drawerComponents: [
      {
        id: 'dc-1',
        name: 'Tapa / Frente de Cajón',
        dimensionsMm: '414 × 180 × 18 mm',
        quantityPerDrawer: 1,
        totalQuantity: 1,
      },
      {
        id: 'dc-2',
        name: 'Laterales de Cajón',
        dimensionsMm: '350 × 130 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 2,
      },
      {
        id: 'dc-3',
        name: 'Contrafrente y Trasera de Cajón',
        dimensionsMm: '360 × 130 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 2,
      },
      {
        id: 'dc-4',
        name: 'Fondo de Cajón Fibroplus',
        dimensionsMm: '386 × 346 × 3 mm',
        quantityPerDrawer: 1,
        totalQuantity: 1,
      },
    ],
    drawerHardware: [
      {
        id: 'dh-1',
        name: 'Correderas Telescópicas 35cm',
        spec: 'Ducasse H45 Cierre Suave',
        unit: 'pares',
        quantityPerDrawer: 1,
        totalQuantity: 1,
      },
      {
        id: 'dh-2',
        name: 'Tirador / Perilla Aluminio Anodizado',
        spec: '32mm c/ tornillo M4',
        unit: 'un',
        quantityPerDrawer: 1,
        totalQuantity: 1,
      },
      {
        id: 'dh-3',
        name: 'Tornillos Fix 3.5×16mm',
        spec: 'Fijación de correderas y frente',
        unit: 'un',
        quantityPerDrawer: 12,
        totalQuantity: 12,
      },
    ],
  },
  {
    id: 'mesita-secador',
    name: 'Mesa de Noche c/ Hueco Secador',
    mainComponents: [
      {
        id: 'mc-201',
        role: 'Piso',
        name: 'Piso Base Inferior',
        dimensionsMm: '500 × 380 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-202',
        role: 'Techo',
        name: 'Techo / Tapa Superior',
        dimensionsMm: '500 × 380 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-203',
        role: 'Lateral Izquierdo',
        name: 'Lateral Izquierdo',
        dimensionsMm: '580 × 380 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-204',
        role: 'Lateral Derecho',
        name: 'Lateral Derecho',
        dimensionsMm: '580 × 380 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-205',
        role: 'Divisor / Estante',
        name: 'Estante Divisor Porta Secador',
        dimensionsMm: '464 × 360 × 18 mm',
        material: 'Melamina 18mm c/ pasacable',
        quantity: 1,
      },
    ],
    mainHardware: [
      {
        id: 'mh-201',
        name: 'Tornillos Soberbios 7×50mm',
        spec: 'Allen Zincado',
        unit: 'un',
        quantity: 12,
      },
      {
        id: 'mh-202',
        name: 'Buje Metálico Porta Secador 75mm',
        spec: 'Acero inoxidable térmico',
        unit: 'un',
        quantity: 1,
      },
      {
        id: 'mh-203',
        name: 'Regatones Niveladores Antideslizantes',
        spec: 'Base PVC 25mm',
        unit: 'un',
        quantity: 4,
      },
    ],
    drawerCount: 1,
    drawerComponents: [
      {
        id: 'dc-201',
        name: 'Tapa / Frente de Cajón',
        dimensionsMm: '464 × 200 × 18 mm',
        quantityPerDrawer: 1,
        totalQuantity: 1,
      },
      {
        id: 'dc-202',
        name: 'Laterales de Cajón',
        dimensionsMm: '350 × 140 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 2,
      },
      {
        id: 'dc-203',
        name: 'Contrafrente y Trasera',
        dimensionsMm: '410 × 140 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 2,
      },
    ],
    drawerHardware: [
      {
        id: 'dh-201',
        name: 'Correderas Telescópicas 35cm',
        spec: 'Cierre Suave H45',
        unit: 'pares',
        quantityPerDrawer: 1,
        totalQuantity: 1,
      },
      {
        id: 'dh-202',
        name: 'Tirador Perfil J Aluminio',
        spec: 'Largo 150mm',
        unit: 'un',
        quantityPerDrawer: 1,
        totalQuantity: 1,
      },
      {
        id: 'dh-203',
        name: 'Tornillos Fix 3.5×16mm',
        spec: 'Zincados p/ correderas',
        unit: 'un',
        quantityPerDrawer: 12,
        totalQuantity: 12,
      },
    ],
  },
  {
    id: 'escritorio-industrial',
    name: 'Escritorio Nórdico Industrial c/ Cajonera',
    mainComponents: [
      {
        id: 'mc-301',
        role: 'Techo',
        name: 'Techo / Tapa Principal Escritorio',
        dimensionsMm: '1200 × 600 × 18 mm',
        material: 'Carvalho Mezzo 18mm (Canto 2mm)',
        quantity: 1,
      },
      {
        id: 'mc-302',
        role: 'Piso',
        name: 'Piso Inferior de Módulo Cajonera',
        dimensionsMm: '420 × 560 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-303',
        role: 'Lateral Izquierdo',
        name: 'Lateral Izquierdo Estructural',
        dimensionsMm: '732 × 560 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-304',
        role: 'Lateral Derecho',
        name: 'Lateral Derecho de Cajonera',
        dimensionsMm: '732 × 560 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
    ],
    mainHardware: [
      {
        id: 'mh-301',
        name: 'Minifix + Pernos Dobles',
        spec: 'Fijación oculta de tapa superior',
        unit: 'un',
        quantity: 8,
      },
      {
        id: 'mh-302',
        name: 'Tornillos Soberbios 7×50mm',
        spec: 'Armado de cajonera y faldón',
        unit: 'un',
        quantity: 16,
      },
      {
        id: 'mh-303',
        name: 'Patas Niveladoras Regulables M8',
        spec: 'Con inserto metálico',
        unit: 'un',
        quantity: 4,
      },
    ],
    drawerCount: 3,
    drawerComponents: [
      {
        id: 'dc-301',
        name: 'Tapa / Frente de Cajón',
        dimensionsMm: '384 × 190 × 18 mm',
        quantityPerDrawer: 1,
        totalQuantity: 3,
      },
      {
        id: 'dc-302',
        name: 'Laterales de Cajón',
        dimensionsMm: '450 × 140 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 6,
      },
      {
        id: 'dc-303',
        name: 'Contrafrente y Trasera de Cajón',
        dimensionsMm: '330 × 140 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 6,
      },
      {
        id: 'dc-304',
        name: 'Fondo de Cajón Fibroplus 3mm',
        dimensionsMm: '446 × 356 × 3 mm',
        quantityPerDrawer: 1,
        totalQuantity: 3,
      },
    ],
    drawerHardware: [
      {
        id: 'dh-301',
        name: 'Correderas Telescópicas 45cm',
        spec: 'Ducasse H45 Cierre Suave',
        unit: 'pares',
        quantityPerDrawer: 1,
        totalQuantity: 3,
      },
      {
        id: 'dh-302',
        name: 'Tiradores Barral Negro Mate 128mm',
        spec: 'Aluminio negro c/ tornillos M4',
        unit: 'un',
        quantityPerDrawer: 1,
        totalQuantity: 3,
      },
      {
        id: 'dh-303',
        name: 'Tornillos Fix 3.5×16mm',
        spec: 'Fijación correderas y frentes',
        unit: 'un',
        quantityPerDrawer: 12,
        totalQuantity: 36,
      },
    ],
  },
  {
    id: 'comoda-4c-nordica',
    name: 'Cómoda Nórdica 4 Cajones',
    mainComponents: [
      {
        id: 'mc-401',
        role: 'Piso',
        name: 'Piso Inferior',
        dimensionsMm: '800 × 450 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-402',
        role: 'Techo',
        name: 'Techo / Tapa Superior',
        dimensionsMm: '800 × 450 × 18 mm',
        material: 'Carvalho Mezzo 18mm',
        quantity: 1,
      },
      {
        id: 'mc-403',
        role: 'Lateral Izquierdo',
        name: 'Lateral Izquierdo',
        dimensionsMm: '900 × 450 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-404',
        role: 'Lateral Derecho',
        name: 'Lateral Derecho',
        dimensionsMm: '900 × 450 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
    ],
    mainHardware: [
      {
        id: 'mh-401',
        name: 'Tornillos Soberbios 7×50mm',
        spec: 'Allen Zincado',
        unit: 'un',
        quantity: 16,
      },
      {
        id: 'mh-402',
        name: 'Tarugos de Madera 8×40mm',
        spec: 'Guía de ensamble',
        unit: 'un',
        quantity: 12,
      },
      {
        id: 'mh-403',
        name: 'Escuadras de Fijación Anti-Vuelco',
        spec: 'Acero galvanizado L',
        unit: 'un',
        quantity: 2,
      },
    ],
    drawerCount: 4,
    drawerComponents: [
      {
        id: 'dc-401',
        name: 'Tapa / Frente de Cajón (Veta Continua)',
        dimensionsMm: '764 × 200 × 18 mm',
        quantityPerDrawer: 1,
        totalQuantity: 4,
      },
      {
        id: 'dc-402',
        name: 'Laterales de Cajón',
        dimensionsMm: '400 × 150 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 8,
      },
      {
        id: 'dc-403',
        name: 'Contrafrente y Trasera de Cajón',
        dimensionsMm: '710 × 150 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 8,
      },
      {
        id: 'dc-404',
        name: 'Fondo de Cajón Fibroplus 3mm',
        dimensionsMm: '736 × 396 × 3 mm',
        quantityPerDrawer: 1,
        totalQuantity: 4,
      },
    ],
    drawerHardware: [
      {
        id: 'dh-401',
        name: 'Correderas Telescópicas 40cm',
        spec: 'Ducasse H45 Cierre Suave',
        unit: 'pares',
        quantityPerDrawer: 1,
        totalQuantity: 4,
      },
      {
        id: 'dh-402',
        name: 'Tiradores Dobles / Cubetas Embutidas',
        spec: '2 tiradores por frente ancho',
        unit: 'un',
        quantityPerDrawer: 2,
        totalQuantity: 8,
      },
      {
        id: 'dh-403',
        name: 'Tornillos Fix 3.5×16mm',
        spec: 'Fijación de guías y frentes',
        unit: 'un',
        quantityPerDrawer: 14,
        totalQuantity: 56,
      },
    ],
  },
  {
    id: 'placard-2p-corredizas',
    name: 'Placard 2 Puertas Corredizas + Cajonera Interna',
    mainComponents: [
      {
        id: 'mc-501',
        role: 'Piso',
        name: 'Piso Principal de Placard',
        dimensionsMm: '1600 × 600 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-502',
        role: 'Techo',
        name: 'Techo Superior de Placard',
        dimensionsMm: '1600 × 600 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-503',
        role: 'Lateral Izquierdo',
        name: 'Lateral Izquierdo Completo',
        dimensionsMm: '2200 × 600 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-504',
        role: 'Lateral Derecho',
        name: 'Lateral Derecho Completo',
        dimensionsMm: '2200 × 600 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 1,
      },
      {
        id: 'mc-505',
        role: 'Divisor / Estante',
        name: 'Divisor Central Vertical + Estantes',
        dimensionsMm: '2164 × 500 × 18 mm',
        material: 'Melamina 18mm',
        quantity: 5,
      },
    ],
    mainHardware: [
      {
        id: 'mh-501',
        name: 'Kit Rieles Aluminio Ducasse 2 Puertas',
        spec: 'Guía superior + inferior 1.60m + 4 carros',
        unit: 'kit',
        quantity: 1,
      },
      {
        id: 'mh-502',
        name: 'Perfiles Manijón Lateral de Aluminio',
        spec: 'Tira 2.20m anodizado natural',
        unit: 'un',
        quantity: 4,
      },
      {
        id: 'mh-503',
        name: 'Barral Oval Cromado + 4 Soportes',
        spec: 'Colgado de perchas',
        unit: 'un',
        quantity: 2,
      },
      {
        id: 'mh-504',
        name: 'Tornillos Soberbios 7×50mm',
        spec: 'Armado estructural general',
        unit: 'un',
        quantity: 32,
      },
    ],
    drawerCount: 2,
    drawerComponents: [
      {
        id: 'dc-501',
        name: 'Tapa / Frente de Cajón Interno',
        dimensionsMm: '740 × 180 × 18 mm',
        quantityPerDrawer: 1,
        totalQuantity: 2,
      },
      {
        id: 'dc-502',
        name: 'Laterales de Cajón Interno',
        dimensionsMm: '450 × 140 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 4,
      },
      {
        id: 'dc-503',
        name: 'Contrafrente y Trasera de Cajón',
        dimensionsMm: '690 × 140 × 15 mm',
        quantityPerDrawer: 2,
        totalQuantity: 4,
      },
    ],
    drawerHardware: [
      {
        id: 'dh-501',
        name: 'Correderas Telescópicas 45cm',
        spec: 'Ducasse H45',
        unit: 'pares',
        quantityPerDrawer: 1,
        totalQuantity: 2,
      },
      {
        id: 'dh-502',
        name: 'Tirador Cubeta Embutido',
        spec: 'Para cajón interno detrás de puerta corrediza',
        unit: 'un',
        quantityPerDrawer: 1,
        totalQuantity: 2,
      },
      {
        id: 'dh-503',
        name: 'Tornillos Fix 3.5×16mm',
        spec: 'Fijación correderas',
        unit: 'un',
        quantityPerDrawer: 12,
        totalQuantity: 24,
      },
    ],
  },
];

interface CatalogoScreenProps {
  onNavigate?: (screen: ScreenId) => void;
}

export const CatalogoScreen: React.FC<CatalogoScreenProps> = ({ onNavigate }) => {
  const [furnitureList, setFurnitureList] = useState<CatalogFurnitureItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATALOG_SPEC);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_FURNITURE_CATALOG;
  });

  const [expandedId, setExpandedId] = useState<string | null>('mesita-nordica-v1');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Add New Furniture Modal State
  const [showNewFurnitureModal, setShowNewFurnitureModal] = useState(false);
  const [newFurnitureName, setNewFurnitureName] = useState('');
  const [newFurnitureDrawers, setNewFurnitureDrawers] = useState(1);

  // Add New Hardware Inline State
  const [newHwName, setNewHwName] = useState('');
  const [newHwUnit, setNewHwUnit] = useState('un');
  const [newHwQty, setNewHwQty] = useState(4);

  // Add New Drawer Hardware Inline State
  const [newDrawerHwName, setNewDrawerHwName] = useState('');
  const [newDrawerHwUnit, setNewDrawerHwUnit] = useState('un');
  const [newDrawerHwQty, setNewDrawerHwQty] = useState(2);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATALOG_SPEC, JSON.stringify(furnitureList));
    } catch {
      // ignore quota errors
    }
  }, [furnitureList]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  // Update Main Structural Component Quantity or Dimensions
  const handleUpdateMainComponentQty = (
    furnitureId: string,
    compId: string,
    nextQty: number
  ) => {
    const safeQty = Math.max(1, nextQty);
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? {
              ...f,
              mainComponents: f.mainComponents.map((c) =>
                c.id === compId ? { ...c, quantity: safeQty } : c
              ),
            }
          : f
      )
    );
  };

  const handleUpdateMainComponentDims = (
    furnitureId: string,
    compId: string,
    dims: string
  ) => {
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? {
              ...f,
              mainComponents: f.mainComponents.map((c) =>
                c.id === compId ? { ...c, dimensionsMm: dims } : c
              ),
            }
          : f
      )
    );
  };

  // Update Main Hardware Quantity Directly
  const handleUpdateMainHardwareQty = (
    furnitureId: string,
    hwId: string,
    nextQty: number
  ) => {
    const safeQty = Math.max(0, nextQty);
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? {
              ...f,
              mainHardware: f.mainHardware.map((h) =>
                h.id === hwId ? { ...h, quantity: safeQty } : h
              ),
            }
          : f
      )
    );
  };

  const handleAddMainHardware = (furnitureId: string) => {
    if (!newHwName.trim()) {
      showToast('Ingresa el nombre del herraje');
      return;
    }
    const newItem: HardwareItem = {
      id: `mh-${Date.now()}`,
      name: newHwName.trim(),
      spec: 'Herraje estructural asignado',
      unit: newHwUnit,
      quantity: Math.max(1, Number(newHwQty) || 1),
    };
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? { ...f, mainHardware: [...f.mainHardware, newItem] }
          : f
      )
    );
    setNewHwName('');
    showToast(`Herraje "${newItem.name}" agregado`);
  };

  const handleRemoveMainHardware = (furnitureId: string, hwId: string) => {
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? { ...f, mainHardware: f.mainHardware.filter((h) => h.id !== hwId) }
          : f
      )
    );
    showToast('Herraje quitado del mueble');
  };

  // Update Drawer Count (1 or more) and proportionally update drawer components & hardware totals
  const handleSelectDrawerCount = (furnitureId: string, nextCount: number) => {
    const safeCount = Math.max(1, Math.min(12, nextCount));
    setFurnitureList((prev) =>
      prev.map((f) => {
        if (f.id !== furnitureId) return f;
        return {
          ...f,
          drawerCount: safeCount,
          drawerComponents: f.drawerComponents.map((dc) => ({
            ...dc,
            totalQuantity: dc.quantityPerDrawer * safeCount,
          })),
          drawerHardware: f.drawerHardware.map((dh) => ({
            ...dh,
            totalQuantity: dh.quantityPerDrawer * safeCount,
          })),
        };
      })
    );
    showToast(`Configurado a ${safeCount} cajón${safeCount === 1 ? '' : 'es'} (cantidades actualizadas)`);
  };

  // Update Drawer Component Quantity or Dimensions
  const handleUpdateDrawerCompTotal = (
    furnitureId: string,
    compId: string,
    nextTotal: number
  ) => {
    const safeTotal = Math.max(0, nextTotal);
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? {
              ...f,
              drawerComponents: f.drawerComponents.map((dc) =>
                dc.id === compId ? { ...dc, totalQuantity: safeTotal } : dc
              ),
            }
          : f
      )
    );
  };

  const handleUpdateDrawerCompDims = (
    furnitureId: string,
    compId: string,
    dims: string
  ) => {
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? {
              ...f,
              drawerComponents: f.drawerComponents.map((dc) =>
                dc.id === compId ? { ...dc, dimensionsMm: dims } : dc
              ),
            }
          : f
      )
    );
  };

  // Update Drawer Hardware Quantity Directly
  const handleUpdateDrawerHardwareTotal = (
    furnitureId: string,
    dhId: string,
    nextTotal: number
  ) => {
    const safeTotal = Math.max(0, nextTotal);
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? {
              ...f,
              drawerHardware: f.drawerHardware.map((dh) =>
                dh.id === dhId ? { ...dh, totalQuantity: safeTotal } : dh
              ),
            }
          : f
      )
    );
  };

  const handleAddDrawerHardware = (furnitureId: string, drawerCount: number) => {
    if (!newDrawerHwName.trim()) {
      showToast('Ingresa el nombre del herraje de cajón');
      return;
    }
    const total = Math.max(1, Number(newDrawerHwQty) || 1);
    const perDrawer = Math.max(1, Math.round(total / Math.max(1, drawerCount)));
    const created: DrawerHardwareItem = {
      id: `dh-${Date.now()}`,
      name: newDrawerHwName.trim(),
      spec: 'Herraje p/ cajones',
      unit: newDrawerHwUnit,
      quantityPerDrawer: perDrawer,
      totalQuantity: total,
    };
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? { ...f, drawerHardware: [...f.drawerHardware, created] }
          : f
      )
    );
    setNewDrawerHwName('');
    showToast(`Herraje de cajón "${created.name}" agregado`);
  };

  const handleRemoveDrawerHardware = (furnitureId: string, dhId: string) => {
    setFurnitureList((prev) =>
      prev.map((f) =>
        f.id === furnitureId
          ? { ...f, drawerHardware: f.drawerHardware.filter((dh) => dh.id !== dhId) }
          : f
      )
    );
    showToast('Herraje de cajón eliminado');
  };

  const handleCreateNewFurniture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFurnitureName.trim()) {
      showToast('Ingresa el nombre del mueble');
      return;
    }
    const dCount = Math.max(1, Number(newFurnitureDrawers) || 1);
    const created: CatalogFurnitureItem = {
      id: `mueble-${Date.now()}`,
      name: newFurnitureName.trim(),
      mainComponents: [
        {
          id: `mc-${Date.now()}-1`,
          role: 'Piso',
          name: 'Piso Inferior',
          dimensionsMm: '600 × 400 × 18 mm',
          material: 'Melamina 18mm',
          quantity: 1,
        },
        {
          id: `mc-${Date.now()}-2`,
          role: 'Techo',
          name: 'Techo / Tapa Superior',
          dimensionsMm: '600 × 400 × 18 mm',
          material: 'Melamina 18mm',
          quantity: 1,
        },
        {
          id: `mc-${Date.now()}-3`,
          role: 'Lateral Izquierdo',
          name: 'Lateral Izquierdo',
          dimensionsMm: '750 × 400 × 18 mm',
          material: 'Melamina 18mm',
          quantity: 1,
        },
        {
          id: `mc-${Date.now()}-4`,
          role: 'Lateral Derecho',
          name: 'Lateral Derecho',
          dimensionsMm: '750 × 400 × 18 mm',
          material: 'Melamina 18mm',
          quantity: 1,
        },
      ],
      mainHardware: [
        {
          id: `mh-${Date.now()}-1`,
          name: 'Tornillos Soberbios 7×50mm',
          spec: 'Ensamble de estructura',
          unit: 'un',
          quantity: 12,
        },
        {
          id: `mh-${Date.now()}-2`,
          name: 'Tarugos de Madera 8mm',
          spec: 'Escuadrado',
          unit: 'un',
          quantity: 8,
        },
      ],
      drawerCount: dCount,
      drawerComponents: [
        {
          id: `dc-${Date.now()}-1`,
          name: 'Tapa / Frente de Cajón',
          dimensionsMm: '564 × 180 × 18 mm',
          quantityPerDrawer: 1,
          totalQuantity: dCount,
        },
        {
          id: `dc-${Date.now()}-2`,
          name: 'Laterales de Cajón',
          dimensionsMm: '350 × 140 × 15 mm',
          quantityPerDrawer: 2,
          totalQuantity: dCount * 2,
        },
        {
          id: `dc-${Date.now()}-3`,
          name: 'Contrafrente y Trasera',
          dimensionsMm: '510 × 140 × 15 mm',
          quantityPerDrawer: 2,
          totalQuantity: dCount * 2,
        },
      ],
      drawerHardware: [
        {
          id: `dh-${Date.now()}-1`,
          name: 'Correderas Telescópicas H45',
          spec: 'Ducasse Cierre Suave',
          unit: 'pares',
          quantityPerDrawer: 1,
          totalQuantity: dCount,
        },
        {
          id: `dh-${Date.now()}-2`,
          name: 'Tiradores / Manijas',
          spec: 'Aluminio anodizado',
          unit: 'un',
          quantityPerDrawer: 1,
          totalQuantity: dCount,
        },
        {
          id: `dh-${Date.now()}-3`,
          name: 'Tornillos Fix 3.5×16mm',
          spec: 'Fijación de correderas',
          unit: 'un',
          quantityPerDrawer: 12,
          totalQuantity: dCount * 12,
        },
      ],
    };

    setFurnitureList((prev) => [created, ...prev]);
    setExpandedId(created.id);
    setNewFurnitureName('');
    setShowNewFurnitureModal(false);
    showToast(`Mueble "${created.name}" agregado al catálogo`);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 gap-space-md">
      {/* Top Window Switcher: Catálogo vs Modelo 3D */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex flex-col">
          <span className="font-label-md text-[11px] uppercase tracking-widest text-primary font-semibold">
            Ingeniería de Producto • Muebles J&amp;L
          </span>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-on-surface">
            Catálogo de Muebles
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('catalogo-3d')}
              className="h-10 px-3.5 rounded-full bg-surface-container-high hover:bg-surface-bright text-secondary font-label-md font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
              <span>Ir a Modelo 3D</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowNewFurnitureModal(true)}
            className="h-10 px-3.5 rounded-full bg-primary text-on-primary font-label-md font-semibold flex items-center gap-1 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Nuevo Mueble</span>
          </button>
        </div>
      </div>

      <p className="font-body-md text-body-md text-on-surface-variant">
        Selecciona un mueble de la lista para desplegar sus componentes principales (piso,
        techo y laterales), editar la cantidad de herrajes y configurar su apartado de
        cajones.
      </p>

      {/* Lista de Muebles (Muestra únicamente los nombres en estado cerrado) */}
      <section className="flex flex-col gap-space-sm">
        {furnitureList.map((furniture) => {
          const isOpen = expandedId === furniture.id;
          return (
            <div
              key={furniture.id}
              className={`rounded-3xl transition-all overflow-hidden border ${
                isOpen
                  ? 'bg-surface-container border-primary/40 shadow-xl'
                  : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/15 shadow-sm'
              }`}
            >
              {/* Cabecera del Mueble: Únicamente el Nombre del Mueble */}
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : furniture.id)}
                className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">chair</span>
                  </div>
                  <span className="font-title-sm text-title-sm font-bold text-on-surface truncate">
                    {furniture.name}
                  </span>
                </div>

                <span
                  className="material-symbols-outlined text-[22px] text-on-surface-variant transition-transform duration-200 shrink-0"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  expand_more
                </span>
              </button>

              {/* Desplegable Detallado al Seleccionar el Mueble */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 flex flex-col gap-space-md border-t border-outline-variant/20">
                  {/* 1. Componentes Principales (Piso, Techo y Laterales) */}
                  <div className="flex flex-col gap-2.5 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[19px]">
                          layers
                        </span>
                        <h2 className="font-title-sm text-title-sm font-bold text-on-surface">
                          1. Componentes Principales (Piso, Techo y Laterales)
                        </h2>
                      </div>
                      <span className="text-[11px] font-label-md text-on-surface-variant">
                        Estructura de Placa
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {furniture.mainComponents.map((comp) => (
                        <div
                          key={comp.id}
                          className="p-3 rounded-2xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                        >
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-primary-container/30 text-primary-fixed font-label-md text-[10px] font-bold uppercase tracking-wider">
                                {comp.role}
                              </span>
                              <span className="font-body-md font-semibold text-on-surface truncate">
                                {comp.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-on-surface-variant mt-0.5">
                              {comp.material}
                            </span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                            <input
                              type="text"
                              value={comp.dimensionsMm}
                              onChange={(e) =>
                                handleUpdateMainComponentDims(
                                  furniture.id,
                                  comp.id,
                                  e.target.value
                                )
                              }
                              title="Medida de la pieza (editable)"
                              className="w-36 h-8 px-2.5 rounded-lg bg-surface-container-highest text-on-surface font-mono text-[12px] text-center focus:outline-none border border-outline-variant/20 focus:border-primary"
                            />

                            <div className="flex items-center gap-1 bg-surface-container-high rounded-full p-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateMainComponentQty(
                                    furniture.id,
                                    comp.id,
                                    comp.quantity - 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface flex items-center justify-center active:scale-90"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  remove
                                </span>
                              </button>
                              <span className="w-7 text-center font-telemetry-num text-[13px] font-bold text-on-surface">
                                {comp.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateMainComponentQty(
                                    furniture.id,
                                    comp.id,
                                    comp.quantity + 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface flex items-center justify-center active:scale-90"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  add
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Herrajes Correspondientes del Mueble (Edición directa de cantidades) */}
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-outline-variant/15">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[19px]">
                          hardware
                        </span>
                        <h2 className="font-title-sm text-title-sm font-bold text-on-surface">
                          2. Herrajes Estructurales (Edición de Cantidades)
                        </h2>
                      </div>
                      <span className="text-[11px] font-label-md text-secondary">
                        Editable en vivo
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {furniture.mainHardware.map((hw) => (
                        <div
                          key={hw.id}
                          className="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-body-md font-semibold text-on-surface truncate">
                              {hw.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant truncate">
                              {hw.spec}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center gap-1 bg-surface-container-high rounded-full p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateMainHardwareQty(
                                    furniture.id,
                                    hw.id,
                                    hw.quantity - 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface flex items-center justify-center active:scale-90"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  remove
                                </span>
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={hw.quantity}
                                onChange={(e) =>
                                  handleUpdateMainHardwareQty(
                                    furniture.id,
                                    hw.id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-12 bg-transparent text-center font-telemetry-num text-[14px] font-bold text-primary focus:outline-none"
                              />
                              <span className="text-[11px] text-on-surface-variant pr-1">
                                {hw.unit}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateMainHardwareQty(
                                    furniture.id,
                                    hw.id,
                                    hw.quantity + 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface flex items-center justify-center active:scale-90"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  add
                                </span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveMainHardware(furniture.id, hw.id)}
                              title="Quitar herraje"
                              className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Agregar nuevo herraje al mueble */}
                      <div className="p-2.5 rounded-2xl bg-surface-container-lowest/70 flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={newHwName}
                          onChange={(e) => setNewHwName(e.target.value)}
                          placeholder="+ Agregar herraje (ej: Bisagra Cazoleta 35mm)..."
                          className="flex-1 min-w-[160px] h-9 px-3 rounded-xl bg-surface-container text-on-surface text-body-md focus:outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          value={newHwQty}
                          onChange={(e) => setNewHwQty(Number(e.target.value))}
                          className="w-16 h-9 px-2 rounded-xl bg-surface-container text-center font-mono text-on-surface focus:outline-none"
                        />
                        <select
                          value={newHwUnit}
                          onChange={(e) => setNewHwUnit(e.target.value)}
                          className="h-9 px-2 rounded-xl bg-surface-container text-on-surface text-[12px] focus:outline-none"
                        >
                          <option value="un">un</option>
                          <option value="pares">pares</option>
                          <option value="kit">kit</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleAddMainHardware(furniture.id)}
                          className="h-9 px-3.5 rounded-xl bg-secondary text-on-secondary font-label-md font-semibold active:scale-95"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. Apartado Específico de Cajones (1 o más cajones + componentes + herrajes) */}
                  <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/20 bg-surface-container-low/70 p-4 rounded-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">
                          inventory_2
                        </span>
                        <div className="flex flex-col">
                          <h2 className="font-title-sm text-title-sm font-bold text-on-surface">
                            3. Apartado de Cajones &amp; Herrajes de Cajón
                          </h2>
                          <span className="text-[11px] text-on-surface-variant">
                            Selecciona la cantidad de cajones (1 o más) y edita sus componentes y herrajes
                          </span>
                        </div>
                      </div>

                      {/* Selector rápido de cantidad de cajones (1, 2, 3, 4, 5, 6 o +/-) */}
                      <div className="flex items-center gap-1.5 bg-surface-container-highest px-2.5 py-1.5 rounded-2xl shrink-0">
                        <span className="text-[11px] font-label-md text-on-surface-variant mr-1">
                          Cajones:
                        </span>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleSelectDrawerCount(furniture.id, num)}
                            className={`w-7 h-7 rounded-lg font-telemetry-num text-[13px] font-bold transition-all ${
                              furniture.drawerCount === num
                                ? 'bg-tertiary text-on-tertiary shadow-sm'
                                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectDrawerCount(furniture.id, furniture.drawerCount + 1)
                          }
                          title="Sumar otro cajón"
                          className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-bright text-primary font-bold text-[13px] flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Sub-bloque A: Componentes de Madera de los Cajones */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <span className="font-label-md text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                        Piezas y Componentes de Cajón (Total para {furniture.drawerCount}{' '}
                        {furniture.drawerCount === 1 ? 'cajón' : 'cajones'})
                      </span>
                      {furniture.drawerComponents.map((dc) => (
                        <div
                          key={dc.id}
                          className="p-2.5 rounded-xl bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-body-md font-medium text-on-surface truncate">
                              {dc.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant">
                              Base: {dc.quantityPerDrawer} pza/cajón
                            </span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                            <input
                              type="text"
                              value={dc.dimensionsMm}
                              onChange={(e) =>
                                handleUpdateDrawerCompDims(
                                  furniture.id,
                                  dc.id,
                                  e.target.value
                                )
                              }
                              className="w-36 h-8 px-2 rounded-lg bg-surface-container-highest text-on-surface font-mono text-[12px] text-center focus:outline-none"
                            />
                            <div className="flex items-center gap-1 bg-surface-container-high rounded-full p-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateDrawerCompTotal(
                                    furniture.id,
                                    dc.id,
                                    dc.totalQuantity - 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface flex items-center justify-center"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  remove
                                </span>
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={dc.totalQuantity}
                                onChange={(e) =>
                                  handleUpdateDrawerCompTotal(
                                    furniture.id,
                                    dc.id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-10 bg-transparent text-center font-telemetry-num text-[13px] font-bold text-on-surface focus:outline-none"
                              />
                              <span className="text-[10px] text-on-surface-variant pr-1">
                                pzas
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateDrawerCompTotal(
                                    furniture.id,
                                    dc.id,
                                    dc.totalQuantity + 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface flex items-center justify-center"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  add
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sub-bloque B: Herrajes de Cajones (Correderas, Tiradores, Tornillos) */}
                    <div className="flex flex-col gap-1.5 pt-2">
                      <span className="font-label-md text-[11px] uppercase tracking-wider text-tertiary font-semibold">
                        Herrajes de Cajones (Correderas, Tiradores y Fijaciones)
                      </span>

                      {furniture.drawerHardware.map((dh) => (
                        <div
                          key={dh.id}
                          className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-body-md font-semibold text-on-surface truncate">
                              {dh.name}
                            </span>
                            <span className="text-[11px] text-on-surface-variant truncate">
                              {dh.spec} ({dh.quantityPerDrawer} {dh.unit}/cajón)
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center gap-1 bg-surface-container-high rounded-full p-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateDrawerHardwareTotal(
                                    furniture.id,
                                    dh.id,
                                    dh.totalQuantity - 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface flex items-center justify-center active:scale-90"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  remove
                                </span>
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={dh.totalQuantity}
                                onChange={(e) =>
                                  handleUpdateDrawerHardwareTotal(
                                    furniture.id,
                                    dh.id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-12 bg-transparent text-center font-telemetry-num text-[14px] font-bold text-tertiary focus:outline-none"
                              />
                              <span className="text-[11px] text-on-surface-variant pr-1">
                                {dh.unit}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateDrawerHardwareTotal(
                                    furniture.id,
                                    dh.id,
                                    dh.totalQuantity + 1
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface flex items-center justify-center active:scale-90"
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  add
                                </span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveDrawerHardware(furniture.id, dh.id)
                              }
                              title="Quitar herraje de cajón"
                              className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-on-surface-variant flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Agregar nuevo herraje de cajón */}
                      <div className="p-2 rounded-xl bg-surface-container-lowest/70 flex flex-wrap items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={newDrawerHwName}
                          onChange={(e) => setNewDrawerHwName(e.target.value)}
                          placeholder="+ Herraje de cajón (ej: Cerradura tambor / Tirador)..."
                          className="flex-1 min-w-[160px] h-9 px-3 rounded-lg bg-surface-container text-on-surface text-body-md focus:outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          value={newDrawerHwQty}
                          onChange={(e) => setNewDrawerHwQty(Number(e.target.value))}
                          className="w-16 h-9 px-2 rounded-lg bg-surface-container text-center font-mono text-on-surface focus:outline-none"
                        />
                        <select
                          value={newDrawerHwUnit}
                          onChange={(e) => setNewDrawerHwUnit(e.target.value)}
                          className="h-9 px-2 rounded-lg bg-surface-container text-on-surface text-[12px] focus:outline-none"
                        >
                          <option value="un">un</option>
                          <option value="pares">pares</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            handleAddDrawerHardware(furniture.id, furniture.drawerCount)
                          }
                          className="h-9 px-3.5 rounded-lg bg-tertiary text-on-tertiary font-label-md font-semibold active:scale-95"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Modal: Crear Nuevo Mueble en el Catálogo */}
      {showNewFurnitureModal && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowNewFurnitureModal(false)}
        >
          <form
            onSubmit={handleCreateNewFurniture}
            className="w-full max-w-md rounded-3xl bg-surface-container-high p-5 shadow-2xl border border-outline-variant/30 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_Home_work</span>
                <span className="font-title-sm text-title-sm font-bold text-on-surface">
                  Agregar Mueble al Catálogo
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowNewFurnitureModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                Nombre del Mueble
              </label>
              <input
                type="text"
                value={newFurnitureName}
                onChange={(e) => setNewFurnitureName(e.target.value)}
                placeholder="Ej: Rack TV Nórdico 180cm / Vajillero 2P"
                className="w-full h-11 px-3.5 rounded-2xl bg-surface-container text-on-surface text-body-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
                Cantidad Inicial de Cajones (1 o más)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={newFurnitureDrawers}
                onChange={(e) => setNewFurnitureDrawers(Math.max(1, Number(e.target.value)))}
                className="w-full h-11 px-3.5 rounded-2xl bg-surface-container text-on-surface font-mono text-body-md focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-full bg-primary text-on-primary font-label-md font-bold mt-1 active:scale-95"
            >
              Crear Mueble con Piso, Techo, Laterales y Cajones
            </button>
          </form>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-surface-container-highest text-on-surface font-label-md text-label-md shadow-2xl flex items-center gap-2 pointer-events-none z-50">
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
