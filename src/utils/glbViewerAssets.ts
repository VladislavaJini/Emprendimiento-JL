import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

export interface WoodTextureAsset {
  id: string;
  shortName: string;
  fullName: string;
  fileName: string;
  baseHex: string;
  grainHex: string;
  pngDataUrl: string;
}

/**
 * Generates a high-resolution procedural wood grain PNG data URL
 * so that all built-in wood grain swatches are real .png images.
 */
export function createWoodGrainPngDataUrl(
  baseHex: string,
  grainHex: string,
  knotHex: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Base wood fill
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle horizontal wood fibers and organic streaks
  ctx.strokeStyle = grainHex;
  for (let i = 0; i < 220; i++) {
    const y = (i / 220) * 512;
    ctx.globalAlpha = 0.12 + (Math.sin(i * 0.7) * 0.08 + 0.08);
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) {
      const wave = Math.sin(x * 0.015 + i * 0.25) * 6 + Math.cos(x * 0.04 - i) * 2;
      ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  // Fine pore lines
  ctx.strokeStyle = knotHex;
  ctx.globalAlpha = 0.18;
  for (let p = 0; p < 90; p++) {
    const px = (p * 73) % 480;
    const py = (p * 41) % 500;
    const len = 18 + (p % 35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + len, py + (p % 3) - 1);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  return canvas.toDataURL('image/png');
}

export function getInitialWoodTextures(): WoodTextureAsset[] {
  return [
    {
      id: 'Carvalho',
      shortName: 'Carvalho',
      fullName: 'Carvalho Mezzo',
      fileName: 'Carvalho_Mezzo.png',
      baseHex: '#9d744a',
      grainHex: '#6e4c2a',
      pngDataUrl: createWoodGrainPngDataUrl('#9d744a', '#6e4c2a', '#4b3118'),
    },
    {
      id: 'Báltico',
      shortName: 'Báltico',
      fullName: 'Báltico',
      fileName: 'Baltico.png',
      baseHex: '#7d6f60',
      grainHex: '#564b3f',
      pngDataUrl: createWoodGrainPngDataUrl('#7d6f60', '#564b3f', '#3c342b'),
    },
    {
      id: 'Gaudí',
      shortName: 'Gaudí',
      fullName: 'Gaudí',
      fileName: 'Gaudi.png',
      baseHex: '#b88958',
      grainHex: '#8a5f36',
      pngDataUrl: createWoodGrainPngDataUrl('#b88958', '#8a5f36', '#5e3d1e'),
    },
    {
      id: 'Helsinki',
      shortName: 'Helsinki',
      fullName: 'Helsinki',
      fileName: 'Helsinki.png',
      baseHex: '#c5b59e',
      grainHex: '#9e8d76',
      pngDataUrl: createWoodGrainPngDataUrl('#c5b59e', '#9e8d76', '#7d6e58'),
    },
    {
      id: 'Kiri',
      shortName: 'Kiri',
      fullName: 'Kiri',
      fileName: 'Kiri.png',
      baseHex: '#d3a36d',
      grainHex: '#a67642',
      pngDataUrl: createWoodGrainPngDataUrl('#d3a36d', '#a67642', '#7a5228'),
    },
    {
      id: 'Teka',
      shortName: 'Teka Árt.',
      fullName: 'Teka Ártico',
      fileName: 'Teka_Artico.png',
      baseHex: '#a9a195',
      grainHex: '#7c756b',
      pngDataUrl: createWoodGrainPngDataUrl('#a9a195', '#7c756b', '#575149'),
    },
  ];
}

/**
 * Builds a multi-part 3D furniture scene matching the requested preset and exports it
 * as a genuine binary .glb Blob URL so GLTFLoader loads real .glb files.
 * Mesh names follow Blender conventions:
 * - "Estructura_Base" -> receives base color (Blanco Puro / Negro Grafito)
 * - "Tapa_Cajon" -> receives the .png wood grain texture
 * - "Patas_Paraiso" / "Herraje_Tirador" -> accent meshes
 */
export async function generateFurnitureGlbUrl(
  presetId: 'mesita' | 'secador' | 'ratona' | 'escritorio' | 'placard'
): Promise<string> {
  const group = new THREE.Group();
  group.name = `MueblesJL_${presetId}`;

  const baseMat = new THREE.MeshStandardMaterial({
    name: 'Material_Estructura',
    color: 0xf4f3f7,
    roughness: 0.45,
    metalness: 0.05,
  });

  const drawerMat = new THREE.MeshStandardMaterial({
    name: 'Material_Tapa_Cajon',
    color: 0xffffff,
    roughness: 0.55,
    metalness: 0.05,
  });

  const legsMat = new THREE.MeshStandardMaterial({
    name: 'Material_Paraiso',
    color: 0xc89d6c,
    roughness: 0.5,
    metalness: 0.05,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    name: 'Material_Herraje',
    color: 0x1e1e26,
    roughness: 0.3,
    metalness: 0.85,
  });

  if (presetId === 'mesita' || presetId === 'secador') {
    const width = presetId === 'secador' ? 1.15 : 1.0;
    const height = 0.85;
    const depth = 0.82;
    const legH = 0.52;

    // Main cabinet box (composed of panels)
    const topPanel = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.045, depth),
      baseMat
    );
    topPanel.name = 'Estructura_Base_Tapa';
    topPanel.position.set(0, legH + height - 0.022, 0);
    group.add(topPanel);

    const bottomPanel = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.045, depth),
      baseMat
    );
    bottomPanel.name = 'Estructura_Base_Piso';
    bottomPanel.position.set(0, legH + 0.022, 0);
    group.add(bottomPanel);

    const leftPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, height, depth),
      baseMat
    );
    leftPanel.name = 'Estructura_Base_LatIzq';
    leftPanel.position.set(-width / 2 + 0.022, legH + height / 2, 0);
    group.add(leftPanel);

    const rightPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, height, depth),
      baseMat
    );
    rightPanel.name = 'Estructura_Base_LatDer';
    rightPanel.position.set(width / 2 - 0.022, legH + height / 2, 0);
    group.add(rightPanel);

    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.04, height - 0.04, 0.03),
      baseMat
    );
    backPanel.name = 'Estructura_Base_Fondo';
    backPanel.position.set(0, legH + height / 2, -depth / 2 + 0.02);
    group.add(backPanel);

    const shelfPanel = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.08, 0.04, depth - 0.04),
      baseMat
    );
    shelfPanel.name = 'Estructura_Base_Estante';
    shelfPanel.position.set(0, legH + height * 0.45, 0);
    group.add(shelfPanel);

    // Drawer Front Plate (Tapa_Cajon) -> receives .png wood grain texture
    const drawerW = presetId === 'secador' ? width * 0.68 : width - 0.1;
    const drawerX = presetId === 'secador' ? -width * 0.12 : 0;
    const drawerFront = new THREE.Mesh(
      new THREE.BoxGeometry(drawerW, height * 0.42, 0.045),
      drawerMat
    );
    drawerFront.name = 'Tapa_Cajon_Frente';
    drawerFront.position.set(drawerX, legH + height * 0.72, depth / 2 + 0.005);
    group.add(drawerFront);

    // Handle on drawer front
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.025, 0.03),
      metalMat
    );
    handle.name = 'Herraje_Tirador';
    handle.position.set(drawerX, legH + height * 0.82, depth / 2 + 0.035);
    group.add(handle);

    // 4 Tapered Nordic Paraiso Legs
    const legOffsets = [
      [-width / 2 + 0.1, -depth / 2 + 0.1, -0.12],
      [width / 2 - 0.1, -depth / 2 + 0.1, 0.12],
      [-width / 2 + 0.1, depth / 2 - 0.1, -0.12],
      [width / 2 - 0.1, depth / 2 - 0.1, 0.12],
    ];
    legOffsets.forEach(([lx, lz, tilt], idx) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.022, legH, 16),
        legsMat
      );
      leg.name = `Patas_Paraiso_${idx + 1}`;
      leg.position.set(lx, legH / 2, lz);
      leg.rotation.z = tilt;
      group.add(leg);
    });
  } else if (presetId === 'ratona') {
    // Mesa Ratona Petiribí
    const topBoard = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.07, 0.95),
      drawerMat
    );
    topBoard.name = 'Tapa_Cajon_Principal';
    topBoard.position.set(0, 0.65, 0);
    group.add(topBoard);

    const lowerShelf = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.04, 0.75),
      baseMat
    );
    lowerShelf.name = 'Estructura_Base_Estante';
    lowerShelf.position.set(0, 0.25, 0);
    group.add(lowerShelf);

    [
      [-0.65, -0.35],
      [0.65, -0.35],
      [-0.65, 0.35],
      [0.65, 0.35],
    ].forEach(([lx, lz], idx) => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.03, 0.64, 16),
        legsMat
      );
      leg.name = `Patas_Paraiso_${idx + 1}`;
      leg.position.set(lx, 0.32, lz);
      group.add(leg);
    });
  } else if (presetId === 'escritorio') {
    // Escritorio Industrial con Cajonera
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.85, 0.05, 0.9),
      baseMat
    );
    deskTop.name = 'Estructura_Base_Escritorio';
    deskTop.position.set(0, 1.05, 0);
    group.add(deskTop);

    // Side drawer unit
    const cabinet = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.65, 0.84),
      baseMat
    );
    cabinet.name = 'Estructura_Base_Cajonera';
    cabinet.position.set(0.58, 0.7, 0);
    group.add(cabinet);

    // 3 Drawer fronts with wood grain
    [0.88, 0.7, 0.52].forEach((yPos, idx) => {
      const df = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.15, 0.03),
        drawerMat
      );
      df.name = `Tapa_Cajon_${idx + 1}`;
      df.position.set(0.58, yPos, 0.435);
      group.add(df);
    });

    // Iron frame legs
    [
      [-0.85, -0.4],
      [-0.85, 0.4],
      [0.85, -0.4],
      [0.85, 0.4],
    ].forEach(([lx, lz], idx) => {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 1.05, 0.05),
        metalMat
      );
      leg.name = `Herraje_Hierro_${idx + 1}`;
      leg.position.set(lx, 0.525, lz);
      group.add(leg);
    });
  } else {
    // Placard 2 Puertas Corredizas
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.85, 0.75),
      baseMat
    );
    frame.name = 'Estructura_Base_Placard';
    frame.position.set(0, 0.95, 0);
    group.add(frame);

    const doorLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 1.74, 0.035),
      drawerMat
    );
    doorLeft.name = 'Tapa_Cajon_PuertaIzq';
    doorLeft.position.set(-0.34, 0.95, 0.39);
    group.add(doorLeft);

    const doorRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 1.74, 0.035),
      drawerMat
    );
    doorRight.name = 'Tapa_Cajon_PuertaDer';
    doorRight.position.set(0.34, 0.95, 0.365);
    group.add(doorRight);
  }

  const exporter = new GLTFExporter();
  return new Promise<string>((resolve, reject) => {
    exporter.parse(
      group,
      (result) => {
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: 'model/gltf-binary' });
          resolve(URL.createObjectURL(blob));
        } else {
          const jsonStr = JSON.stringify(result);
          const blob = new Blob([jsonStr], { type: 'model/gltf+json' });
          resolve(URL.createObjectURL(blob));
        }
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}
