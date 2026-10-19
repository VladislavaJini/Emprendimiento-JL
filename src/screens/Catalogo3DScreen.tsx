import React, { useEffect, useState } from 'react';

interface WoodTexture {
  id: string;
  shortName: string;
  fullName: string;
  tintHex: string;
  swatchUrl: string;
}

const WOOD_TEXTURES: WoodTexture[] = [
  {
    id: 'Carvalho',
    shortName: 'Carvalho',
    fullName: 'Carvalho Mezzo',
    tintHex: '#9d744a',
    swatchUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCOrrwdtIaFbTEq_JMNYUvq5OwizmFJGSfMaGoeR9E3Gq5kY5C5uazJ6RaLhl0irFCSx2xZ6pDr_i1sr3zigdPGIl_pwdVrVJpFGCx8pteIIl_DkHmmegoa_D6PeH4fGgF5RcuCG9jScQ4XIv7LX9KmZzmmF7KfIT4IofaSD1-TfLURVBnMvK-uZl4qkelnJap-FhF_6NDrgocvdh94ac4cbuNobQI-gqCXoHIBonMFF0P2fHdnScp3fA',
  },
  {
    id: 'Báltico',
    shortName: 'Báltico',
    fullName: 'Báltico',
    tintHex: '#7d6f60',
    swatchUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_zNW0lOuR_6_Zo33D0t4uzcm9-ry9ngmd5Wd3asnYLuBmZN589xNLbzS1p7p1y3CrHULEgBK7EvENTfbd9WdD0HpCNKagQhQnGmIbA8IUzEv9TK532WZGwG8BCOIVAeXZXUtVTNBVxlgEZ9Z50netu0mRzbZAhjZlGQ1C2DUyv9Tx4QQlRNPzlEl1A05P_jh9pkOqpHl9_HJjz1JW-Coq588_CwSQuZ8BMorPUlgR2aaeuLzoGZumKQ',
  },
  {
    id: 'Gaudí',
    shortName: 'Gaudí',
    fullName: 'Gaudí',
    tintHex: '#b88958',
    swatchUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD1o0R5sk4ufIqoHMlKZ2xFXok1AocT7Wyzoxt1hQBF1YdSDbJMnj0yrK24V63tp8qpdSmGx50kyRyv33gm-kyapoXfeROD40FYVVP-2MzxwlMS_TKovT9TkxOhHgDqJxyfgbLy__hed_zBY_tl8sawZA1Kp24-HlJWsMHdpQ3dTtnLWhoLuSjX-vMZ1EOQfB6hFVJbjAPCX5C13WtIF85ZnWP9ZuWLkhmx-gL_uvpCQwnr8AYshBVSdQ',
  },
  {
    id: 'Helsinki',
    shortName: 'Helsinki',
    fullName: 'Helsinki',
    tintHex: '#c5b59e',
    swatchUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDHqqLfeJ9r0VId3yqLxofaQ-00dzE4N0b4clJaDlfM0EvgFu1NMogp3gF-AQ2pZFTI3OCTGWo93q2gU88FvA8XCziALG6HLgc7h13iEs9_K_jFPIeSQgqXhZkIztjrz5Pm9dmI9fLMJ0J-LkEXT8NvF2Asnde1A5Rzh3GQlQRu9boocT2qcY5if0irNqYv4TachqFsMcjTvZ225nnAbW7_vJe28NAVPMpk2FbXFZvKePR7LU1KsWSF5g',
  },
  {
    id: 'Kiri',
    shortName: 'Kiri',
    fullName: 'Kiri',
    tintHex: '#d3a36d',
    swatchUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKQTSXJ9XOTrKvVD3JxSLebvQsrfi6OZnUdiBirVq1BfZuJyXj8pCssjp0HLP-C6gOl-R49HyoLwPOanbJlVKl3hdloaCHQPTAfFjX7T9d8A-oTVQA_sKKNYj6cBDVjJjPCeR6OI1dG-cz9sfmBzf-s0N6hgSTv56eG5VDNN1Eh7Pd-Zwl5CkOGBszDc7TOf2b4wIAIezTLNUpiA9vZ5gAUw2DbHV0l37FYSE2NKvYu6DlDCnRMq_rGg',
  },
  {
    id: 'Teka',
    shortName: 'Teka Árt.',
    fullName: 'Teka Ártico',
    tintHex: '#a9a195',
    swatchUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC1mxh4SywvuliAbsEDtUoPpKZaFr7dbY7SD_NAf3jft-IAoIqosSAOKBh6XFJDVys98Cp5_KPk6RKEsteVwyFRF0lnFGXjvs2GQMQuq3q_e2iOoKvvVPhB7TZ6hsaTzwiZG6b0_ZmNWathSwYUd9usvbufqIAP1lS6cLdtPqCZVwja11aFipqb5sJ3rEssUr76P7_1wi6YS93P33bxGwnE5ygyKnxs2F8w2Mf_d8uGuKJKBgZq0BqfjA',
  },
];

interface CatalogModel {
  id: string;
  shortTitle: string;
  fullName: string;
  glbFile: string;
  specsText: string;
  dimensions: string;
  pvp: string;
  image: string;
}

const CATALOG_MODELS: CatalogModel[] = [
  {
    id: 'secador',
    shortTitle: 'Nórdica c/ Secador',
    fullName: 'Mesa de Noche c/ Secador',
    glbFile: 'Mesita_Secador_blanco.glb',
    specsText: '50×58×38 cm • 1 Cajón + Hueco',
    dimensions: '50x58x38',
    pvp: '$92.000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCq-AS9_RwuIYP0HLP3graxs8ffssvg2xRjnBg44key1q3j2qAsBQSy_rEtb0fgcV8ErSzJD2cHv0r7WABPzuXkE_Yyrf8v8cnVnsnfBMfn2hv1UegYuZBBopXd8gN5J8DEFFt3mhpmRuENYSZQhq0IISaGQOOiqgHWXEKUDCirdjhaQ3UyQTu8noRGq7uOM1YUf5QE-eq_aB-DExw2wzuYk3NVxT2TaxcWah9ENMxBw9KXo6V8GUyXcA',
  },
  {
    id: 'ratona',
    shortTitle: 'Mesa Ratona Petiribí',
    fullName: 'Mesa Ratona Petiribí Maciza',
    glbFile: 'Mesa_Ratona_Petiribi.glb',
    specsText: '90×45×50 cm • Maciza 2 Pulg.',
    dimensions: '90x45x50',
    pvp: '$140.000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWcRjd8jZ6-wvLOM6VJ0D-YxNxnlSoq2mYyadn9IddSZp1jNV-N89SW-tLwcosIl2wSOiRe6p8JtK9SBK-2QrbtmO1b-db2EnNd9d4nSSPIkM27nj3uDwOdq_cQyiVzekBKTS9MQcK8bohteuTgi5k7rLhYVY3TV_7ht1QCV_eWy15ze2Q0eoVGs3wzBlui8oEYMhBv16pVZKYtgnGz410MDyo67KhBnFXE7uXuOT8Wz-zSfDOOBRtPA',
  },
  {
    id: 'escritorio',
    shortTitle: 'Escritorio Industrial',
    fullName: 'Escritorio Nórdico Industrial',
    glbFile: 'Escritorio_Industrial.glb',
    specsText: '120×75×60 cm • Cajonera triple',
    dimensions: '120x75x60',
    pvp: '$230.000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtmxU_CpjWmKwrUUemm2Mkx6i694Ho-Hdb9pA59E1XjPSNDa2_2ZMtnMNMoTP3PEV7ujn911ZbzGS-ZCY0pRr19lpUckRzVw2inTWOQQTmrC1PYPUwUnoYXNooiiWQK81JDNou72U2qnV_-cZDwxnDpk7d1GmG0FkKhS4--fypAnW_sl2NZ_zDLAqmDxOvt4ldoQ26T6_2a2GYhS0nSP47IqoGnF0VXM4NB3j1i2PX3B_brsersuPsBg',
  },
  {
    id: 'placard',
    shortTitle: 'Placard 2 Puertas',
    fullName: 'Placard 2 Puertas Corredizas',
    glbFile: 'Placard_2P_Corredizo.glb',
    specsText: '160×220×60 cm • Riel Ducasse',
    dimensions: '160x220x60',
    pvp: '$320.000',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAa8RJ3dTP6-A8oZSpc6o32TjqEzfUFQvl8rL-Qh5yyPq1FESv345xLd7QZa1BuMkJU7dAkQhaf0m-_MoOM2uGtvBI1kAFjXItdg9Iw1-7J790X_rXUMTtoKOQTtIsImfvOLLaWornFUiNv_9WPf8WWjwYVpvamqBJFL_ZIVrKNlc3nQXil2jAs0PaoEZTpkslQ9wLeZH_LSfQG6ov0LIOqAntqJmAww3GHp_x8cadcpW_eoRvFYhYO-Q',
  },
];

export const Catalogo3DScreen: React.FC = () => {
  const [baseColor, setBaseColor] = useState<'white' | 'black'>('white');
  const [selectedTexture, setSelectedTexture] = useState<WoodTexture>(WOOD_TEXTURES[0]);
  const [camView, setCamView] = useState<'auto' | 'front' | 'iso' | 'top'>('iso');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [modelName, setModelName] = useState('Mesita Nórdica V1');
  const [modelFile, setModelFile] = useState('Mesita_blanca.glb');
  const [dimensions, setDimensions] = useState('45x55x38');
  const [pvpPrice, setPvpPrice] = useState('$85.000');
  const [slidesCount, setSlidesCount] = useState(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  useEffect(() => {
    if (camView !== 'auto') return;
    const interval = setInterval(() => {
      setRotationAngle((a) => (a + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [camView]);

  const getMeshTransform = () => {
    if (camView === 'auto') {
      return `rotateY(${rotationAngle}deg)`;
    }
    if (camView === 'front') {
      return 'rotateY(0deg) rotateX(0deg)';
    }
    if (camView === 'top') {
      return 'rotateX(48deg) scale(0.95)';
    }
    return 'rotateY(0deg) rotateX(0deg)';
  };

  const handleLoadModel = (m: CatalogModel) => {
    setModelName(m.fullName);
    setModelFile(m.glbFile);
    setDimensions(m.dimensions);
    setPvpPrice(m.pvp);
    showToast(`Modelo cargado: ${m.glbFile}`);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin pb-6 gap-space-lg">
      {/* Sección Header Contextual */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
              Catálogo &amp; Visor 3D
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-surface-tint animate-ping"></span>
              WEBGL ACTIVO
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md bg-surface-container-high/80 px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[16px] text-primary">view_in_ar</span>
            <span>Three.js v158</span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Previsualización tridimensional táctil y despiece paramétrico de insumos por modelo.
        </p>
      </div>

      {/* Contenedor Maestro: Visor 3D Interactivo */}
      <div className="relative w-full rounded-3xl bg-surface-container-low overflow-hidden shadow-2xl flex flex-col">
        {/* Top Bar Overlay del Canvas */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-md text-label-md pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="font-semibold text-primary">60 FPS</span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface-variant">Órbita 360° táctil</span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={() => showToast('Iniciando sesión WebXR / Visor AR...')}
              className="w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-90"
              title="Ver en Realidad Aumentada / Pantalla Completa"
            >
              <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCamView('iso');
                setRotationAngle(0);
                showToast('Cámara restablecida');
              }}
              className="w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface flex items-center justify-center hover:bg-surface-container-high active:scale-90 transition-all"
              title="Resetear Vista"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Simulación Canvas 3D WebGL con Iluminación de Estudio y Grilla */}
        <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-surface-container-lowest via-surface-container to-surface-container-low flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none">
          {/* Luces ambientales de estudio */}
          <div className="absolute -top-10 -left-10 w-60 h-60 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-tertiary-container/15 blur-3xl pointer-events-none"></div>

          {/* Grilla de Suelo de Perspectiva 3D SVG */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                height="32"
                id="grid-pattern"
                patternUnits="userSpaceOnUse"
                width="32"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="#928ea2"
                  strokeDasharray="2,2"
                  strokeWidth="0.75"
                />
              </pattern>
              <radialGradient cx="50%" cy="60%" id="fade-radial" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <mask id="grid-mask">
                <rect fill="url(#fade-radial)" height="100%" width="100%" />
              </mask>
            </defs>
            <rect
              fill="url(#grid-pattern)"
              height="100%"
              mask="url(#grid-mask)"
              width="100%"
            />
            <ellipse
              cx="50%"
              cy="75%"
              fill="#000000"
              filter="blur(10px)"
              opacity="0.6"
              rx="110"
              ry="24"
            />
          </svg>

          {/* Representación visual fotorrealista del Mueble 3D con texturizado reactivo */}
          <div
            className="relative z-10 flex flex-col items-center transition-transform duration-300"
            style={{ transform: getMeshTransform() }}
          >
            <div className="relative w-56 h-60 flex items-center justify-center">
              <img
                className="w-full h-full object-contain transition-all duration-300"
                alt={modelName}
                referrerPolicy="no-referrer"
                style={{
                  filter:
                    baseColor === 'white'
                      ? 'drop-shadow(0 18px 24px rgba(0,0,0,0.65)) brightness(1)'
                      : 'drop-shadow(0 18px 24px rgba(0,0,0,0.85)) brightness(0.42) contrast(1.2)',
                }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB53bF4-cJ84ldMBYz0hNtJ9O5eG1UvLbRxWwxrmCovxMB_ImQn5UZX4SCDWZF1FHjfyWHpol7ln_xXIItpHUl78vi5tzPiOu3qG4U9YoBl8-cXq9g07goptHboESYAJ2hJg3S7v8on270xmjZFiFFt4uim4O3Lqe0uPP_3yRB_9I-SclV1qIKbOate2VVjkUpmyJW1HSZTa1CYz3D-WaPLjQGZBRL5GHBkw3Cgo6rDtbx6DXBMQk-jbw"
              />
              {/* Placa de Veta Frontal Texturizada Inteligente */}
              <div
                className="absolute w-36 h-14 rounded-sm shadow-md transition-all duration-300 flex items-center justify-center"
                style={{
                  top: '36%',
                  left: '24%',
                  backgroundImage: `url('${selectedTexture.swatchUrl}')`,
                  backgroundColor: selectedTexture.tintHex,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="w-8 h-1 rounded-full bg-surface-container-lowest/80 shadow-inner"></div>
              </div>
            </div>

            {/* Tag de Modelo Flotante con Telemetría */}
            <div className="mt-1 px-3 py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md flex items-center gap-2 shadow-lg">
              <span className="font-title-sm text-label-md font-bold text-on-surface">
                {modelName}
              </span>
              <span className="text-outline-variant font-label-md">•</span>
              <span className="font-label-md text-primary">{modelFile}</span>
            </div>
          </div>

          {/* Barra de Herramientas de Cámara / Órbita */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 bg-surface-container-lowest/85 backdrop-blur-xl rounded-full shadow-lg">
            <button
              type="button"
              onClick={() => {
                const next = camView === 'auto' ? 'iso' : 'auto';
                setCamView(next);
                showToast(
                  next === 'auto' ? 'Rotación automática iniciada' : 'Rotación pausada'
                );
              }}
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
              onClick={() => {
                setCamView('front');
                showToast('Cámara: Frontal 0°');
              }}
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
              onClick={() => {
                setCamView('iso');
                showToast('Cámara: Isométrica 30°');
              }}
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
              onClick={() => {
                setCamView('top');
                showToast('Cámara: Vista de Planta (Superior)');
              }}
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

        {/* Panel de Configuración Paramétrica de Materiales y Vetas */}
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
                  setModelFile('Mesita_blanca.glb');
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
                  setModelFile('Mesita_negra.glb');
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

          {/* 2. Texturizado Inteligente de Vetas para Frente de Cajón */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  texture
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  Veta Inteligente (Tapa de Cajón)
                </span>
              </div>
              <span className="font-label-md text-[11px] text-tertiary font-medium">
                {selectedTexture.fullName}
              </span>
            </div>
            <p className="font-label-md text-[11px] text-on-surface-variant leading-relaxed">
              La textura seleccionada se proyecta exclusivamente en el frente de apertura
              respetando cantos perimetrales.
            </p>

            {/* Rail Horizontal Scrolleable de Muestras de Textura */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {WOOD_TEXTURES.map((tex) => {
                const isSelected = selectedTexture.id === tex.id;
                return (
                  <button
                    key={tex.id}
                    type="button"
                    onClick={() => {
                      setSelectedTexture(tex);
                      showToast(`Veta actualizada: ${tex.fullName}`);
                    }}
                    className={`shrink-0 flex flex-col items-center gap-1.5 p-1.5 rounded-2xl transition-all active:scale-95 group ${
                      isSelected
                        ? 'bg-surface-container-high ring-1 ring-primary'
                        : 'bg-surface-container hover:bg-surface-container-high'
                    }`}
                  >
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden relative shadow-md bg-cover bg-center"
                      style={{ backgroundImage: `url('${tex.swatchUrl}')` }}
                    >
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

      {/* Telemetría & Especificaciones del Modelo (Bento Grid) */}
      <div className="grid grid-cols-2 gap-space-sm">
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
            <span className="font-label-md text-label-md">Mano de Obra</span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">schedule</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                4.5
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant">hs</span>
            </div>
            <p className="font-label-md text-[11px] text-on-surface-variant mt-0.5">
              Armado + Lustre final
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
                $32.400
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
                  Frente {selectedTexture.fullName} 18mm
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
                {slidesCount} Par
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

      {/* CRUD Interactivo Rápido de Insumos (Stepper Touch para Taller) */}
      <div className="flex flex-col gap-3 p-space-md rounded-3xl bg-surface-container-low shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">
              add_shopping_cart
            </span>
            <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
              Ajuste Rápido de Stock Asociado
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-[11px]">
            Táctil
          </span>
        </div>

        <p className="font-body-md text-[13px] text-on-surface-variant">
          Ajusta cantidades asignadas de Correderas Telescópicas Ducasse para la próxima orden
          sin teclear:
        </p>

        {/* Caliper / Contador Táctil Ergonómico */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Correderas Telescópicas 35cm
            </span>
            <span className="font-label-md text-[11px] text-primary font-mono">
              {slidesCount === 1
                ? 'Costo: $5.800 ARS / par'
                : `Subtotal: $${(slidesCount * 5800).toLocaleString('es-AR')} ARS`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-[28px] font-bold text-on-surface font-mono">
              {slidesCount}
            </span>
            <span className="font-label-md text-label-md text-on-surface-variant">pares</span>
          </div>
        </div>

        {/* Bloque de Teclas Rápidas Táctiles */}
        <div className="grid grid-cols-5 gap-1.5">
          <button
            type="button"
            onClick={() => setSlidesCount((c) => Math.max(1, c - 5))}
            className="h-11 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface active:scale-95 font-label-md text-label-md font-bold transition-all flex items-center justify-center"
          >
            -5
          </button>
          <button
            type="button"
            onClick={() => setSlidesCount((c) => Math.max(1, c - 1))}
            className="h-11 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface active:scale-95 font-label-md text-label-md font-bold transition-all flex items-center justify-center"
          >
            -1
          </button>
          <button
            type="button"
            onClick={() => setSlidesCount(1)}
            className="h-11 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 font-label-md text-[11px] font-medium transition-all flex items-center justify-center"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setSlidesCount((c) => c + 1)}
            className="h-11 rounded-xl bg-primary-container/60 hover:bg-primary-container text-on-primary-container active:scale-95 font-label-md text-label-md font-bold transition-all flex items-center justify-center"
          >
            +1
          </button>
          <button
            type="button"
            onClick={() => setSlidesCount((c) => c + 5)}
            className="h-11 rounded-xl bg-primary-container text-on-primary-container active:scale-95 font-label-md text-label-md font-bold transition-all flex items-center justify-center"
          >
            +5
          </button>
        </div>
      </div>

      {/* Galería Horizontal de Modelos del Catálogo (Muebles J&L) */}
      <div className="flex flex-col gap-space-sm pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">shelves</span>
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
              Otros Modelos en Catálogo
            </h2>
          </div>
          <span className="font-label-md text-[12px] text-primary font-medium">
            4 modelos listos
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 snap-x">
          {CATALOG_MODELS.map((m) => (
            <div
              key={m.id}
              className="snap-start shrink-0 w-64 p-3 rounded-3xl bg-surface-container-low flex flex-col justify-between gap-3 shadow-md"
            >
              <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  alt={m.shortTitle}
                  referrerPolicy="no-referrer"
                  src={m.image}
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-md text-[10px] font-mono">
                  GLB Ready
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
              <button
                type="button"
                onClick={() => handleLoadModel(m)}
                className="w-full h-10 rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-all active:scale-95 flex items-center justify-center gap-1.5 font-label-md text-label-md font-semibold"
              >
                <span className="material-symbols-outlined text-[17px]">view_in_ar</span>
                <span>Cargar en 3D</span>
              </button>
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
