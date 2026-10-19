import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useWorkshopCloud } from '../context/WorkshopCloudContext';
import { ScreenId } from '../types';
import {
  generateFurnitureGlbUrl,
  getInitialWoodTextures,
  WoodTextureAsset,
} from '../utils/glbViewerAssets';

interface CatalogModel {
  id: string;
  presetId: 'mesita' | 'secador' | 'ratona' | 'escritorio' | 'placard';
  shortTitle: string;
  fullName: string;
  glbFileName: string;
  customGlbUrl?: string;
  specsText: string;
  dimensions: string;
  costInsumos: string;
  pvp: string;
  pngPreviewUrl: string | null;
}

const INITIAL_CATALOG_MODELS: CatalogModel[] = [
  {
    id: 'secador',
    presetId: 'secador',
    shortTitle: 'Nórdica c/ Secador',
    fullName: 'Mesa de Noche c/ Secador',
    glbFileName: 'Mesita_Secador_blanco.glb',
    specsText: '50×58×38 cm • 1 Cajón + Hueco',
    dimensions: '50x58x38',
    costInsumos: '$35.200',
    pvp: '$92.000',
    pngPreviewUrl: null,
  },
  {
    id: 'ratona',
    presetId: 'ratona',
    shortTitle: 'Mesa Ratona Petiribí',
    fullName: 'Mesa Ratona Petiribí Maciza',
    glbFileName: 'Mesa_Ratona_Petiribi.glb',
    specsText: '90×45×50 cm • Maciza 2 Pulg.',
    dimensions: '90x45x50',
    costInsumos: '$54.000',
    pvp: '$140.000',
    pngPreviewUrl: null,
  },
  {
    id: 'escritorio',
    presetId: 'escritorio',
    shortTitle: 'Escritorio Industrial',
    fullName: 'Escritorio Nórdico Industrial',
    glbFileName: 'Escritorio_Industrial.glb',
    specsText: '120×75×60 cm • Cajonera triple',
    dimensions: '120x75x60',
    costInsumos: '$88.500',
    pvp: '$230.000',
    pngPreviewUrl: null,
  },
  {
    id: 'placard',
    presetId: 'placard',
    shortTitle: 'Placard 2 Puertas',
    fullName: 'Placard 2 Puertas Corredizas',
    glbFileName: 'Placard_2P_Corredizo.glb',
    specsText: '160×220×60 cm • Riel Ducasse',
    dimensions: '160x220x60',
    costInsumos: '$124.000',
    pvp: '$320.000',
    pngPreviewUrl: null,
  },
];

const STORAGE_KEY_CATALOG_PNGS = 'taller_os_catalog_pngs_v1';

interface Catalogo3DScreenProps {
  onNavigate?: (screen: ScreenId) => void;
}

export const Catalogo3DScreen: React.FC<Catalogo3DScreenProps> = ({ onNavigate }) => {
  const { catalogPngMap, saveCatalogPng } = useWorkshopCloud();
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const glbInputRef = useRef<HTMLInputElement | null>(null);
  const pngTextureInputRef = useRef<HTMLInputElement | null>(null);

  const [woodTextures, setWoodTextures] = useState<WoodTextureAsset[]>(() =>
    getInitialWoodTextures()
  );
  const [selectedTexture, setSelectedTexture] = useState<WoodTextureAsset>(
    () => getInitialWoodTextures()[0]
  );
  const [baseColor, setBaseColor] = useState<'white' | 'black'>('white');
  const [camView, setCamView] = useState<'auto' | 'front' | 'iso' | 'top'>('iso');

  const [modelName, setModelName] = useState('Mesita Nórdica V1');
  const [modelFile, setModelFile] = useState('Mesita_blanca.glb');
  const [dimensions, setDimensions] = useState('45x55x38');
  const [costInsumos, setCostInsumos] = useState('$32.400');
  const [pvpPrice, setPvpPrice] = useState('$85.000');

  const [activePreset, setActivePreset] = useState<
    'mesita' | 'secador' | 'ratona' | 'escritorio' | 'placard'
  >('mesita');
  const [activeGlbUrl, setActiveGlbUrl] = useState<string | null>(null);
  const [meshNames, setMeshNames] = useState<string[]>([]);
  const [drawerMeshTarget, setDrawerMeshTarget] = useState<string>('auto');
  const [isLoadingGlb, setIsLoadingGlb] = useState<boolean>(true);

  const [catalogModels, setCatalogModels] = useState<CatalogModel[]>(() =>
    INITIAL_CATALOG_MODELS.map((m) => ({
      ...m,
      pngPreviewUrl: catalogPngMap[m.id] || null,
    }))
  );

  useEffect(() => {
    setCatalogModels((prev) =>
      prev.map((m) => ({
        ...m,
        pngPreviewUrl: catalogPngMap[m.id] ?? m.pngPreviewUrl,
      }))
    );
  }, [catalogPngMap]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Refs for Three.js scene objects so material/camera updates don't recreate the WebGL context
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const loadedModelRef = useRef<THREE.Object3D | null>(null);
  const camTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(2.1, 1.65, 2.35));
  const autoRotateRef = useRef<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Generate binary .glb URL when preset changes (unless user uploaded a custom .glb)
  useEffect(() => {
    let active = true;
    let generatedUrl: string | null = null;

    generateFurnitureGlbUrl(activePreset)
      .then((url) => {
        if (!active) {
          URL.revokeObjectURL(url);
          return;
        }
        generatedUrl = url;
        setActiveGlbUrl(url);
      })
      .catch((err) => {
        console.error('Error generating GLB:', err);
      });

    return () => {
      active = false;
      if (generatedUrl) {
        URL.revokeObjectURL(generatedUrl);
      }
    };
  }, [activePreset]);

  // Apply Base Color & PNG Wood Grain Texture to the loaded .glb model meshes
  const applyMaterialsToGlb = () => {
    const root = loadedModelRef.current;
    const renderer = rendererRef.current;
    if (!root || !renderer) return;

    const texLoader = new THREE.TextureLoader();
    texLoader.load(selectedTexture.pngDataUrl, (loadedTex) => {
      loadedTex.colorSpace = THREE.SRGBColorSpace;
      loadedTex.wrapS = THREE.RepeatWrapping;
      loadedTex.wrapT = THREE.RepeatWrapping;
      loadedTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      loadedTex.flipY = false;
      loadedTex.needsUpdate = true;

      const baseHex = baseColor === 'white' ? 0xf4f3f7 : 0x181820;

      root.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;
        const nameLower = (mesh.name || '').toLowerCase();
        const matNameLower = (
          Array.isArray(mesh.material)
            ? mesh.material[0]?.name || ''
            : mesh.material?.name || ''
        ).toLowerCase();

        const isExplicitDrawerTarget =
          drawerMeshTarget !== 'auto' && mesh.name === drawerMeshTarget;
        const isAutoDrawerTarget =
          drawerMeshTarget === 'auto' &&
          (nameLower.includes('tapa') ||
            nameLower.includes('cajon') ||
            nameLower.includes('frente') ||
            nameLower.includes('drawer') ||
            nameLower.includes('front') ||
            nameLower.includes('puerta') ||
            matNameLower.includes('tapa') ||
            matNameLower.includes('cajon'));

        if (isExplicitDrawerTarget || isAutoDrawerTarget) {
          mesh.material = new THREE.MeshStandardMaterial({
            name: `PNG_${selectedTexture.fileName}`,
            map: loadedTex,
            color: 0xffffff,
            roughness: 0.52,
            metalness: 0.06,
          });
        } else if (
          nameLower.includes('estructura') ||
          nameLower.includes('base') ||
          nameLower.includes('cuerpo') ||
          nameLower.includes('lateral') ||
          nameLower.includes('piso') ||
          nameLower.includes('estante') ||
          matNameLower.includes('estructura')
        ) {
          mesh.material = new THREE.MeshStandardMaterial({
            name: 'Material_Estructura_Base',
            color: baseHex,
            roughness: baseColor === 'white' ? 0.42 : 0.35,
            metalness: 0.08,
          });
        }
      });
    });
  };

  // Initialize Three.js WebGL Viewport once
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(2.1, 1.65, 2.35);
    cameraRef.current = camera;

    const isHeadless =
      navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xe5e0ef, 0x1c1a25, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ed, 1.6);
    keyLight.position.set(3.5, 5.5, 4.0);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc7bfff, 0.75);
    rimLight.position.set(-3.5, 2.5, -3.0);
    scene.add(rimLight);

    // Subtle Floor Grid & Contact Shadow Plane
    const gridHelper = new THREE.GridHelper(6, 16, 0x664cff, 0x35333f);
    gridHelper.position.y = 0;
    (gridHelper.material as THREE.Material).opacity = 0.28;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.ShadowMaterial({ opacity: 0.38 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.68, 0);
    controls.minDistance = 1.2;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controlsRef.current = controls;

    const clock = new THREE.Clock();
    let reqId = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (autoRotateRef.current && loadedModelRef.current) {
        loadedModelRef.current.rotation.y += delta * 0.85;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Load .GLB model via GLTFLoader whenever activeGlbUrl changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !activeGlbUrl) return;

    setIsLoadingGlb(true);
    const loader = new GLTFLoader();

    loader.load(
      activeGlbUrl,
      (gltf) => {
        if (loadedModelRef.current) {
          scene.remove(loadedModelRef.current);
        }

        const model = gltf.scene;
        const foundMeshes: string[] = [];

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            m.receiveShadow = true;
            if (m.name) foundMeshes.push(m.name);
          }
        });

        // Normalize scale & center on workshop floor (y = 0)
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetScale = 1.45 / maxDim;

        model.scale.setScalar(targetScale);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        model.position.x += -scaledCenter.x;
        model.position.z += -scaledCenter.z;
        model.position.y += -scaledBox.min.y + 0.01;

        scene.add(model);
        loadedModelRef.current = model;
        setMeshNames(foundMeshes);
        setIsLoadingGlb(false);
        applyMaterialsToGlb();
      },
      undefined,
      (err) => {
        console.error('Error loading GLB file:', err);
        setIsLoadingGlb(false);
        showToast('Error al parsear el archivo .GLB');
      }
    );
  }, [activeGlbUrl]);

  // Re-apply materials whenever baseColor, selectedTexture, or drawerMeshTarget changes
  useEffect(() => {
    applyMaterialsToGlb();
  }, [baseColor, selectedTexture, drawerMeshTarget]);

  // Update Camera View Mode
  const handleSelectCameraView = (view: 'auto' | 'front' | 'iso' | 'top') => {
    setCamView(view);
    autoRotateRef.current = view === 'auto';

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (loadedModelRef.current && view !== 'auto') {
      loadedModelRef.current.rotation.y = 0;
    }

    if (view === 'front') {
      camera.position.set(0, 0.85, 2.75);
      controls.target.set(0, 0.68, 0);
      showToast('Cámara: Vista Frontal 0°');
    } else if (view === 'iso') {
      camera.position.set(2.1, 1.65, 2.35);
      controls.target.set(0, 0.68, 0);
      showToast('Cámara: Isométrica 30°');
    } else if (view === 'top') {
      camera.position.set(0, 3.2, 0.45);
      controls.target.set(0, 0.5, 0);
      showToast('Cámara: Vista de Planta');
    } else if (view === 'auto') {
      showToast('Rotación orbital 360° activada');
    }
    controls.update();
  };

  // Handler: Upload custom .GLB file exported from Blender
  const handleUploadGlbFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      showToast('Selecciona un archivo 3D en formato .glb exportado de Blender');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setModelFile(file.name);
    setModelName(file.name.replace(/\.(glb|gltf)$/i, '').replace(/_/g, ' '));
    setDrawerMeshTarget('auto');
    setActiveGlbUrl(objectUrl);
    showToast(`Modelo Blender cargado: ${file.name}`);
    e.target.value = '';
  };

  // Handler: Upload custom .PNG Wood Grain Texture for Drawer Fronts
  const handleUploadWoodPng = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png') && !file.name.toLowerCase().endsWith('.png')) {
      showToast('Por favor selecciona una textura en formato .PNG');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const cleanName = file.name.replace(/\.png$/i, '');
      const newTex: WoodTextureAsset = {
        id: `custom-${Date.now()}`,
        shortName: cleanName.slice(0, 10),
        fullName: cleanName,
        fileName: file.name,
        baseHex: '#9d744a',
        grainHex: '#6e4c2a',
        pngDataUrl: dataUrl,
      };
      setWoodTextures((prev) => [newTex, ...prev]);
      setSelectedTexture(newTex);
      showToast(`Textura de veta .PNG aplicada: ${file.name}`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handler: Upload custom .PNG Image for a Catalog Model ("Otros Modelos")
  const handleUploadCatalogModelPng = (
    modelId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png') && !file.name.toLowerCase().endsWith('.png')) {
      showToast('La imagen del catálogo debe estar en formato .PNG');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const targetModel = catalogModels.find((m) => m.id === modelId);
      setCatalogModels((prev) =>
        prev.map((m) => (m.id === modelId ? { ...m, pngPreviewUrl: dataUrl } : m))
      );
      if (targetModel) {
        saveCatalogPng({
          modelId: targetModel.id,
          shortTitle: targetModel.shortTitle,
          fullName: targetModel.fullName,
          glbFileName: targetModel.glbFileName,
          specsText: targetModel.specsText,
          dimensions: targetModel.dimensions,
          costInsumos: targetModel.costInsumos,
          pvp: targetModel.pvp,
          pngPreviewUrl: dataUrl,
        });
      }
      showToast(`Imagen .PNG asignada al modelo en catálogo`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handler: Upload custom .GLB for a Catalog Card
  const handleUploadCatalogModelGlb = (
    modelId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setCatalogModels((prev) =>
      prev.map((m) =>
        m.id === modelId
          ? { ...m, glbFileName: file.name, customGlbUrl: blobUrl }
          : m
      )
    );
    showToast(`Archivo ${file.name} vinculado al modelo del catálogo`);
    e.target.value = '';
  };

  const handleLoadCatalogModel = (m: CatalogModel) => {
    setModelName(m.fullName);
    setModelFile(m.glbFileName);
    setDimensions(m.dimensions);
    setCostInsumos(m.costInsumos);
    setPvpPrice(m.pvp);
    setDrawerMeshTarget('auto');
    if (m.customGlbUrl) {
      setActiveGlbUrl(m.customGlbUrl);
    } else {
      setActivePreset(m.presetId);
    }
    showToast(`Cargado en visor WebGL: ${m.glbFileName}`);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 gap-space-lg">
      {/* Sección Header Contextual: Ventana Independiente Modelo 3D */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
              Modelo 3D
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
              WEBGL .GLB ACTIVO
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('catalogo')}
                className="flex items-center gap-1.5 text-secondary hover:bg-surface-bright font-label-md text-label-md bg-surface-container-high px-3 py-1.5 rounded-full transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">list_alt</span>
                <span>Ir a Catálogo</span>
              </button>
            )}

            {/* Direct Blender .GLB File Upload Trigger */}
            <input
              ref={glbInputRef}
              type="file"
              accept=".glb,.gltf"
              onChange={handleUploadGlbFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => glbInputRef.current?.click()}
              className="flex items-center gap-1.5 text-primary hover:text-on-primary hover:bg-primary font-label-md text-label-md bg-surface-container-high px-3 py-1.5 rounded-full transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Cargar .GLB (Blender)</span>
            </button>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Visor tridimensional WebGL (.glb) independiente y mapeo de texturas de vetas (.png)
          en tapas de cajón.
        </p>
      </div>

      {/* Contenedor Maestro: Visor 3D Interactivo Three.js */}
      <div className="relative w-full rounded-3xl bg-surface-container-low overflow-hidden shadow-2xl flex flex-col">
        {/* Top Bar Overlay del Canvas */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-md text-label-md pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="font-semibold text-primary">GLTFLoader</span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface-variant truncate max-w-[160px]">
              {modelFile}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => glbInputRef.current?.click()}
              className="px-2.5 h-9 rounded-full bg-surface-container-lowest/90 text-on-surface flex items-center gap-1 hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-90 text-[11px] font-label-md"
              title="Importar modelo .glb exportado desde Blender"
            >
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              <span>Importar .GLB</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCameraView('iso')}
              className="w-9 h-9 rounded-full bg-surface-container-lowest/90 text-on-surface flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all"
              title="Resetear Vista"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Dedicated Three.js WebGL Canvas Mount */}
        <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-surface-container-lowest via-surface-container to-surface-container-low overflow-hidden select-none">
          <div
            ref={canvasMountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />

          {isLoadingGlb && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/60 pointer-events-none">
              <div className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface text-label-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>Cargando geometría .GLB...</span>
              </div>
            </div>
          )}

          {/* Tag de Modelo Flotante */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-surface-container-high/95 flex items-center gap-2 shadow-lg pointer-events-none whitespace-nowrap">
            <span className="font-title-sm text-label-md font-bold text-on-surface">
              {modelName}
            </span>
            <span className="text-outline-variant font-label-md">•</span>
            <span className="font-label-md text-primary font-mono">{modelFile}</span>
          </div>

          {/* Barra de Herramientas de Cámara / Órbita */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 bg-surface-container-lowest/90 rounded-full shadow-lg">
            <button
              type="button"
              onClick={() =>
                handleSelectCameraView(camView === 'auto' ? 'iso' : 'auto')
              }
              className={`px-2.5 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all active:scale-95 ${
                camView === 'auto'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-tertiary">360</span>
              <span>Auto</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCameraView('front')}
              className={`px-2.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                camView === 'front'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Frente
            </button>
            <button
              type="button"
              onClick={() => handleSelectCameraView('iso')}
              className={`px-2.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                camView === 'iso'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Iso
            </button>
            <button
              type="button"
              onClick={() => handleSelectCameraView('top')}
              className={`px-2.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                camView === 'top'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              Planta
            </button>
          </div>
        </div>

        {/* Panel de Configuración Paramétrica de Materiales (.GLB) y Vetas (.PNG) */}
        <div className="p-space-md flex flex-col gap-space-md bg-surface-container-low">
          {/* 1. Color de Base / Cuerpo del Mueble */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  palette
                </span>
                <span>Estructura Base (Cuerpo &amp; Laterales)</span>
              </label>
              <span className="font-label-md text-[11px] text-on-surface-variant">
                {baseColor === 'white' ? 'Blanco Semi-Mate' : 'Negro Grafito Profundo'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBaseColor('white');
                  if (modelFile === 'Mesita_negra.glb') setModelFile('Mesita_blanca.glb');
                  showToast('Base cambiada a Blanco Semi-Mate');
                }}
                className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all ${
                  baseColor === 'white'
                    ? 'bg-surface-container-high ring-1 ring-primary'
                    : 'bg-surface-container'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#f4f3f7] flex items-center justify-center shadow-md shrink-0">
                  {baseColor === 'white' && (
                    <span className="material-symbols-outlined text-[16px] text-surface-container-lowest">
                      check
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                    Blanco Puro
                  </span>
                  <span className="font-label-md text-[11px] text-on-surface-variant truncate">
                    Esmalte Semi-mate
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBaseColor('black');
                  if (modelFile === 'Mesita_blanca.glb') setModelFile('Mesita_negra.glb');
                  showToast('Base cambiada a Negro Grafito');
                }}
                className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all ${
                  baseColor === 'black'
                    ? 'bg-surface-container-high ring-1 ring-primary'
                    : 'bg-surface-container'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#181820] flex items-center justify-center shadow-md shrink-0">
                  {baseColor === 'black' && (
                    <span className="material-symbols-outlined text-[16px] text-surface-tint">
                      check
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-label-md text-label-md text-on-surface-variant font-bold truncate">
                    Negro Grafito
                  </span>
                  <span className="font-label-md text-[11px] text-on-surface-variant truncate">
                    Profundo 18mm
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Texturizado Inteligente de Vetas (.PNG) para Tapa de Cajón */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  texture
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Veta de Tapa de Cajón (Texturas .PNG)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-label-md text-[11px] text-tertiary font-mono">
                  {selectedTexture.fileName}
                </span>
                <input
                  ref={pngTextureInputRef}
                  type="file"
                  accept=".png,image/png"
                  onChange={handleUploadWoodPng}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => pngTextureInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary font-label-md text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px]">add_photo_alternate</span>
                  <span>+ Subir .PNG</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="font-label-md text-[11px] text-on-surface-variant leading-relaxed">
                La textura en formato <strong>.png</strong> se proyecta sobre la malla de tapa
                de cajón del modelo <strong>.glb</strong>.
              </p>

              {meshNames.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-on-surface-variant">Malla Tapa:</span>
                  <select
                    value={drawerMeshTarget}
                    onChange={(e) => setDrawerMeshTarget(e.target.value)}
                    className="bg-surface-container-high text-on-surface rounded-lg px-2 py-1 text-[11px] font-mono outline-none"
                  >
                    <option value="auto">Auto (Tapa_Cajon / Frente)</option>
                    {meshNames.map((mName) => (
                      <option key={mName} value={mName}>
                        {mName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Rail Horizontal Scrolleable de Muestras de Textura (.PNG) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {woodTextures.map((tex) => {
                const isSelected = selectedTexture.id === tex.id;
                return (
                  <button
                    key={tex.id}
                    type="button"
                    onClick={() => {
                      setSelectedTexture(tex);
                      showToast(`Textura aplicada: ${tex.fileName}`);
                    }}
                    className={`shrink-0 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl transition-all active:scale-95 group ${
                      isSelected
                        ? 'bg-surface-container-high ring-1 ring-primary'
                        : 'bg-surface-container hover:bg-surface-container-high'
                    }`}
                  >
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden relative shadow-md bg-cover bg-center"
                      style={{ backgroundImage: `url('${tex.pngDataUrl}')` }}
                    >
                      <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-[8px] font-mono text-white">
                        .PNG
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-primary font-bold">
                            check_circle
                          </span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-label-md text-[11px] truncate max-w-[70px] ${
                        isSelected
                          ? 'font-semibold text-primary'
                          : 'text-on-surface-variant group-hover:text-on-surface'
                      }`}
                    >
                      {tex.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Telemetría & Especificaciones del Modelo (Sin Mano de Obra) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
        <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-label-md text-label-md">Cotas Generales</span>
            <span className="material-symbols-outlined text-[18px] text-primary">straighten</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                {dimensions}
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">cm</span>
            </div>
            <p className="font-label-md text-[11px] text-on-surface-variant mt-0.5">
              Ancho × Alto × Prof.
            </p>
          </div>
        </div>

        <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-label-md text-label-md">Costo Insumos</span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              shopping_cart_checkout
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                {costInsumos}
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant">ARS</span>
            </div>
            <p className="font-label-md text-[11px] text-on-surface-variant mt-0.5">
              Base actualizada hoy
            </p>
          </div>
        </div>

        <div className="p-space-md rounded-2xl bg-secondary-container/40 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-primary mb-1">
            <span className="font-label-md text-label-md font-semibold">PVP Sugerido</span>
            <span className="material-symbols-outlined text-[18px] text-primary">sell</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-md text-headline-md text-on-secondary-container font-bold">
                {pvpPrice}
              </span>
              <span className="font-label-md text-[10px] text-on-secondary-container">ARS</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="font-label-md text-[10px] text-primary font-semibold">
                Margen neto: 61.8%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Despiece Automático & Escandallo BOM (Bill of Materials) */}
      <div className="flex flex-col gap-space-sm p-space-md rounded-3xl bg-surface-container-low shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">
              format_list_numbered
            </span>
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
              Desglose de Insumos (BOM)
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-[11px]">
            6 ítems sincronizados
          </span>
        </div>

        <p className="font-body-md text-[13px] text-on-surface-variant">
          Insumos descontables en inventario al ordenar tirada de producción para este modelo.
        </p>

        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  dashboard
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Placa Melamina 18mm {baseColor === 'white' ? 'Blanco' : 'Negro Grafito'}
                </span>
                <span className="font-label-md text-[11px] text-on-surface-variant">
                  Cuerpo, piso y tapa superior
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="font-title-sm text-label-md text-on-surface font-bold">
                0.42 m²
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant font-mono">
                1 un.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-tertiary-container/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  texture
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Frente {selectedTexture.fullName} 18mm ({selectedTexture.fileName})
                </span>
                <span className="font-label-md text-[11px] text-on-surface-variant">
                  Tapa de cajón frontal
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="font-title-sm text-label-md text-on-surface font-bold">
                0.08 m²
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant font-mono">
                1 un.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  linear_scale
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Cantos PVC 22mm x 0.45mm
                </span>
                <span className="font-label-md text-[11px] text-on-surface-variant">
                  Sellado perimetral con pistola calor
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="font-title-sm text-label-md text-on-surface font-bold">4.8 m</span>
              <span className="font-label-md text-[10px] text-on-surface-variant font-mono">
                Bobina
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Correderas Telescópicas 35cm
                </span>
                <span className="font-label-md text-[11px] text-on-surface-variant">
                  Ducasse Cierre Suave ZN
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="font-title-sm text-label-md text-on-surface font-bold">
                1 Par
              </span>
              <span className="font-label-md text-[10px] text-on-surface-variant font-mono">
                Kit
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  hardware
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Tornillos Soberbios 7x50mm
                </span>
                <span className="font-label-md text-[11px] text-on-surface-variant">
                  Allen + tapitas embellecedoras
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="font-title-sm text-label-md text-on-surface font-bold">16 un.</span>
              <span className="font-label-md text-[10px] text-on-surface-variant font-mono">
                Bolsa
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  foundation
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Regatones Cónicos Paraíso
                </span>
                <span className="font-label-md text-[11px] text-on-surface-variant">
                  Lustrados con laca poliuretánica
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="font-title-sm text-label-md text-on-surface font-bold">4 un.</span>
              <span className="font-label-md text-[10px] text-on-surface-variant font-mono">
                Set
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción Operativa de Taller */}
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() =>
            showToast('¡Lanzado a Taller! Insumos descontados de inventario.')
          }
          className="w-full h-14 rounded-full bg-primary-container text-on-primary-container hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 font-body-lg font-bold shadow-[0_8px_24px_rgba(102,76,255,0.35)]"
        >
          <span className="material-symbols-outlined text-[22px]">
            precision_manufacturing
          </span>
          <span>Lanzar a Producción en Taller</span>
        </button>

        <button
          type="button"
          onClick={() => showToast('Abriendo editor paramétrico de escandallo...')}
          className="w-full h-12 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-bright active:scale-98 transition-all flex items-center justify-center gap-2 font-label-md text-label-md font-semibold"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">edit_note</span>
          <span>Editar Escandallo / Materiales (+/-)</span>
        </button>
      </div>

      {/* Galería Horizontal de Modelos 3D Predefinidos (.GLB y Portada .PNG) */}
      <div className="flex flex-col gap-space-sm pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">view_in_ar</span>
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
              Presets 3D Disponibles (.GLB)
            </h2>
          </div>
          <span className="font-label-md text-[12px] text-primary font-medium">
            Portada .PNG personalizada
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 snap-x">
          {catalogModels.map((m) => (
            <div
              key={m.id}
              className="snap-start shrink-0 w-64 p-3 rounded-3xl bg-surface-container-low flex flex-col justify-between gap-3 shadow-md"
            >
              {/* Custom .PNG Upload Area per Catalog Model */}
              <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-surface-container flex flex-col items-center justify-center border border-outline-variant/30">
                {m.pngPreviewUrl ? (
                  <>
                    <img
                      className="w-full h-full object-cover"
                      alt={m.shortTitle}
                      src={m.pngPreviewUrl}
                    />
                    <label
                      title="Cambiar imagen .PNG del modelo"
                      className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 hover:bg-primary text-on-surface hover:text-on-primary font-label-md text-[10px] font-semibold flex items-center gap-1 cursor-pointer shadow-md transition-colors"
                    >
                      <span className="material-symbols-outlined text-[13px]">upload</span>
                      <span>Cambiar .PNG</span>
                      <input
                        type="file"
                        accept=".png,image/png"
                        onChange={(e) => handleUploadCatalogModelPng(m.id, e)}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-3 text-center cursor-pointer hover:bg-surface-container-high/60 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">
                        add_photo_alternate
                      </span>
                    </div>
                    <span className="font-label-md text-[11px] font-semibold text-primary">
                      Cargar Imagen .PNG
                    </span>
                    <span className="text-[10px] text-on-surface-variant">
                      Subir portada .png del modelo
                    </span>
                    <input
                      type="file"
                      accept=".png,image/png"
                      onChange={(e) => handleUploadCatalogModelPng(m.id, e)}
                      className="hidden"
                    />
                  </label>
                )}

                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/85 text-on-surface font-label-md text-[10px] font-mono">
                  {m.glbFileName}
                </span>
              </div>

              <div className="flex flex-col">
                <h3 className="font-label-md text-label-md text-on-surface font-bold truncate">
                  {m.shortTitle}
                </h3>
                <span className="font-label-md text-[11px] text-on-surface-variant">
                  {m.specsText}
                </span>
                <span className="font-title-sm text-label-md text-primary font-bold mt-1">
                  {m.pvp} ARS
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleLoadCatalogModel(m)}
                  className="flex-1 h-10 rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-all active:scale-95 flex items-center justify-center gap-1.5 font-label-md text-label-md font-semibold"
                >
                  <span className="material-symbols-outlined text-[17px]">view_in_ar</span>
                  <span>Cargar .GLB</span>
                </button>

                <label
                  title="Vincular archivo .GLB exportado de Blender a este modelo"
                  className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-primary flex items-center justify-center cursor-pointer transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[17px]">upload_file</span>
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    onChange={(e) => handleUploadCatalogModelGlb(m.id, e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-container text-on-primary-container shadow-2xl font-label-md text-label-md font-semibold">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
