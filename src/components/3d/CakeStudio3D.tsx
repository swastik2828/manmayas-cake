import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Rotate3d, 
  Sparkles, 
  Flame, 
  Scissors, 
  Leaf, 
  MessageCircle, 
  Volume2, 
  VolumeX,
  Layers,
  Palette,
  Eye,
  Camera,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChimeSound, playPopSound, playBlowSound, isAudioMuted, toggleAudioMute } from '../../utils/soundEffects';
import { INITIAL_SITE_SETTINGS } from '../../data/siteSettings';

interface CakeStudio3DProps {
  onOrderCustomCake: (specs: {
    flavor: string;
    weight: string;
    dietary: 'eggless' | 'regular' | 'pure_veg';
    frosting: string;
    message: string;
    estimatedPrice: number;
    toppings: string[];
    tiers: number;
  }) => void;
}

// Preset patisserie frosting palettes with sponge & jam colors for slice view
const FROSTING_PALETTES: Record<string, {
  name: string;
  cakeColor: number;
  dripColor: number;
  pipingColor: number;
  textColor: string;
  spongeColor: string;
  creamColor: string;
  jamColor: string;
  roughness: number;
  metalness: number;
}> = {
  'Belgian Dark Chocolate': {
    name: 'Belgian Dark Chocolate',
    cakeColor: 0x3d2319,
    dripColor: 0x22130d,
    pipingColor: 0xffe7a3,
    textColor: '#FFE7A3',
    spongeColor: '#3F2217',
    creamColor: '#F5EBE1',
    jamColor: '#20110A',
    roughness: 0.35,
    metalness: 0.12,
  },
  'Strawberry Blush Velvet': {
    name: 'Strawberry Blush Velvet',
    cakeColor: 0xfcbccb,
    dripColor: 0xc9365b,
    pipingColor: 0xffffff,
    textColor: '#C9365B',
    spongeColor: '#FDE4C8',
    creamColor: '#FFF8EE',
    jamColor: '#D92543',
    roughness: 0.45,
    metalness: 0.05,
  },
  'Madagascar Vanilla Cream': {
    name: 'Madagascar Vanilla Cream',
    cakeColor: 0xfff6ea,
    dripColor: 0xffe7a3,
    pipingColor: 0xc9365b,
    textColor: '#C9365B',
    spongeColor: '#FCE7C5',
    creamColor: '#FFFDF7',
    jamColor: '#D9365B',
    roughness: 0.4,
    metalness: 0.05,
  },
  'Roasted Pistachio Glow': {
    name: 'Roasted Pistachio Glow',
    cakeColor: 0xc1dcb0,
    dripColor: 0x7fa867,
    pipingColor: 0xffffff,
    textColor: '#3A5A27',
    spongeColor: '#D6E5C3',
    creamColor: '#FFF9ED',
    jamColor: '#6B8E4E',
    roughness: 0.4,
    metalness: 0.08,
  },
  'Royal Red Velvet': {
    name: 'Royal Red Velvet',
    cakeColor: 0x8a1b2e,
    dripColor: 0x5a0d1b,
    pipingColor: 0xfffdfa,
    textColor: '#FFF9F2',
    spongeColor: '#80182A',
    creamColor: '#FFFDF9',
    jamColor: '#4A0814',
    roughness: 0.5,
    metalness: 0.05,
  },
  'Kesar Mango Delight': {
    name: 'Kesar Mango Delight',
    cakeColor: 0xfcc34b,
    dripColor: 0xe69a19,
    pipingColor: 0xffffff,
    textColor: '#422800',
    spongeColor: '#FDE4B0',
    creamColor: '#FFFBEA',
    jamColor: '#E68A00',
    roughness: 0.35,
    metalness: 0.1,
  },
};

export const CakeStudio3D: React.FC<CakeStudio3DProps> = ({ onOrderCustomCake }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Customizer state
  const [tiers, setTiers] = useState<number>(2);
  const [frostingTheme, setFrostingTheme] = useState<string>('Strawberry Blush Velvet');
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['feathers', 'strawberries', 'gold_leaf']);
  const [dietary, setDietary] = useState<'eggless' | 'regular' | 'pure_veg'>('eggless');
  const [message, setMessage] = useState<string>('Happy Birthday!');
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [candleActive, setCandleActive] = useState<boolean>(true);
  const [isCandleBlown, setIsCandleBlown] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(isAudioMuted());
  const [cameraPresetView, setCameraPresetView] = useState<'orbit' | 'slice' | 'front' | 'top'>('orbit');

  // Indicative pricing
  const tierWeights: Record<number, { label: string; basePrice: number }> = {
    1: { label: '1.0 kg (6–8 guests)', basePrice: 750 },
    2: { label: '2.0 kg (15–18 guests)', basePrice: 1550 },
    3: { label: '3-Tier 3.5 kg (30+ guests)', basePrice: 2850 },
  };

  const toppingPrice = selectedToppings.length * 75;
  const currentPricing = tierWeights[tiers] || tierWeights[2];
  const totalPrice = currentPricing.basePrice + toppingPrice;

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const sliceGroupRef = useRef<THREE.Group | null>(null);
  const sliceTargetPosRef = useRef<number>(0);
  const flameMeshRef = useRef<THREE.Mesh | null>(null);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isVisibleRef = useRef<boolean>(true);

  // Rock-Solid Spherical Orbit Coordinates (Prevents Gimbal Lock / NaN Permanently!)
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 8.5,
    theta: 0.5,
    phi: 1.15,
  });

  const targetSphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 8.5,
    theta: 0.5,
    phi: 1.15,
  });

  const cakeCenterRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.35, 0));

  // Helper: Constructs mathematically exact radial cut wall BufferGeometry
  // Vertices match CylinderGeometry exactly at center (0, y, 0) and perimeter (ox, y, oz)
  const createRadialWallGeometry = useCallback((radius: number, height: number, angle: number, outward: boolean) => {
    const geo = new THREE.BufferGeometry();
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const ox = radius * sinA;
    const oz = radius * cosA;
    const halfH = height / 2;

    // 4 vertices defining the rectangular cross-section plane:
    // 0: Center bottom (0, -halfH, 0)
    // 1: Center top (0, halfH, 0)
    // 2: Outer bottom (ox, -halfH, oz)
    // 3: Outer top (ox, halfH, oz)
    const positions = new Float32Array([
      0, -halfH, 0,
      0, halfH, 0,
      ox, -halfH, oz,
      ox, halfH, oz,
    ]);

    // Texture coordinates:
    // U = 0 at cake core center, U = 1 at outer perimeter crust
    // V = 0 at bottom, V = 1 at top
    const uvs = new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 1,
    ]);

    const indices = outward
      ? [0, 1, 2, 2, 1, 3]
      : [0, 2, 1, 1, 2, 3];

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Helper: Generates realistic multi-layer sponge & cream cross-section texture
  const createCrossSectionTexture = useCallback((theme: typeof FROSTING_PALETTES[string]) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Fill base sponge background with rich crumb tone
    ctx.fillStyle = theme.spongeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Realistic porous sponge crumb texture with aerated baking pockets
    for (let i = 0; i < 4500; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      const r = Math.random() * 2.8;
      ctx.fillStyle = Math.random() > 0.45 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. 3 Rich Chantilly Cream Layers + Glossy Compote / Ganache Core Ribbons
    const creamPositions = [280, 540, 800];
    creamPositions.forEach(y => {
      // Cream filling band
      ctx.fillStyle = theme.creamColor;
      ctx.fillRect(0, y - 32, canvas.width, 64);

      // Compote / Ganache swirl center
      ctx.fillStyle = theme.jamColor;
      ctx.fillRect(0, y - 10, canvas.width, 20);

      // Gloss sheen line on compote
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(0, y - 6, canvas.width, 4);

      // Subtle shadow under cream
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, y + 32, canvas.width, 8);
    });

    // 4. Top Frosting Layer (thick buttercream icing)
    ctx.fillStyle = `#${theme.cakeColor.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, canvas.width, 44);

    // 5. Outer Crust & Drip Glaze on the right border (U = 1 is outer crust)
    ctx.fillStyle = `#${theme.cakeColor.toString(16).padStart(6, '0')}`;
    ctx.fillRect(canvas.width - 48, 0, 48, canvas.height);

    ctx.fillStyle = `#${theme.dripColor.toString(16).padStart(6, '0')}`;
    ctx.fillRect(canvas.width - 64, 0, 64, 60);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Helper: Inscription ribbon banner texture
  const createTextTexture = useCallback((text: string, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ribbon banner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.beginPath();
    ctx.roundRect(30, 30, canvas.width - 60, canvas.height - 60, 36);
    ctx.fill();
    ctx.strokeStyle = '#F5A5B8';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Gold inner line
    ctx.strokeStyle = '#FCD872';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(42, 42, canvas.width - 84, canvas.height - 84, 28);
    ctx.stroke();

    // Inscription text
    ctx.font = 'bold 52px "Playfair Display", "Georgia", cursive, serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text ? `“${text}”` : '“Sweet Celebrations”', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Normalizes target angle to the shortest rotation path from current angle
  const normalizeAngle = (target: number, current: number) => {
    const twoPi = Math.PI * 2;
    const diff = (target - (current % twoPi) + Math.PI * 3) % twoPi - Math.PI;
    return current + diff;
  };

  // Safe Camera Preset Switcher (Shortest arc & singularity-free)
  const setCameraPreset = (view: 'orbit' | 'slice' | 'front' | 'top') => {
    playPopSound();
    setCameraPresetView(view);
    const curTheta = sphericalRef.current.theta;

    if (view === 'slice') {
      setIsCutaway(true);
      targetSphericalRef.current = {
        radius: 7.0,
        theta: normalizeAngle(0.55, curTheta),
        phi: 1.15,
      };
      setAutoRotate(false);
    } else if (view === 'front') {
      setIsCutaway(false);
      targetSphericalRef.current = {
        radius: 7.5,
        theta: normalizeAngle(0.0, curTheta),
        phi: 1.30,
      };
      setAutoRotate(false);
    } else if (view === 'top') {
      setIsCutaway(false);
      // Safe top-down view: phi = 0.35 (~20 degrees from vertical), NEVER 0 to prevent Gimbal lock
      targetSphericalRef.current = {
        radius: 8.0,
        theta: normalizeAngle(curTheta, curTheta),
        phi: 0.35,
      };
      setAutoRotate(false);
    } else {
      setIsCutaway(false);
      targetSphericalRef.current = {
        radius: 8.5,
        theta: curTheta,
        phi: 1.15,
      };
      setAutoRotate(true);
    }
  };

  // Zoom control
  const handleZoom = (delta: number) => {
    playPopSound();
    targetSphericalRef.current.radius = Math.max(
      4.5,
      Math.min(12.5, targetSphericalRef.current.radius + delta)
    );
  };

  // Initialize Three.js WebGL Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Initial position from spherical
    const s = sphericalRef.current;
    camera.position.set(
      s.radius * Math.sin(s.phi) * Math.sin(s.theta),
      cakeCenterRef.current.y + s.radius * Math.cos(s.phi),
      s.radius * Math.sin(s.phi) * Math.cos(s.theta)
    );
    camera.lookAt(cakeCenterRef.current);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting - Warm patisserie lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffe6d6, 1.3);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xffeedd, 0.8, 12);
    warmFill.position.set(0, 0.2, 3);
    scene.add(warmFill);

    // Warm slice inspection spotlight directly highlighting the cake interior & compote
    const sliceSpotlight = new THREE.SpotLight(0xfff5e6, 3.2, 14, Math.PI / 3, 0.5);
    sliceSpotlight.position.set(2.5, 4.2, 5.0);
    sliceSpotlight.target.position.set(0, 1.2, 0.5);
    scene.add(sliceSpotlight);
    scene.add(sliceSpotlight.target);

    const interiorFill = new THREE.PointLight(0xffecd2, 1.8, 8);
    interiorFill.position.set(0, 1.5, 1.2);
    scene.add(interiorFill);

    // 5. Ceramic Cake Stand Base
    const standGroup = new THREE.Group();
    const standMat = new THREE.MeshStandardMaterial({
      color: 0xfcf8f2,
      roughness: 0.2,
      metalness: 0.1,
    });

    const platterGeo = new THREE.CylinderGeometry(2.85, 2.75, 0.2, 54);
    const platter = new THREE.Mesh(platterGeo, standMat);
    platter.position.y = -0.1;
    platter.receiveShadow = true;
    standGroup.add(platter);

    const goldRimGeo = new THREE.TorusGeometry(2.82, 0.045, 16, 64);
    goldRimGeo.rotateX(Math.PI / 2);
    const goldRimMat = new THREE.MeshStandardMaterial({ color: 0xdeb03d, roughness: 0.18, metalness: 0.85 });
    const goldRim = new THREE.Mesh(goldRimGeo, goldRimMat);
    goldRim.position.y = -0.04;
    standGroup.add(goldRim);

    const pillarGeo = new THREE.CylinderGeometry(0.55, 0.85, 0.85, 36);
    const pillar = new THREE.Mesh(pillarGeo, standMat);
    pillar.position.y = -0.62;
    standGroup.add(pillar);

    const baseGeo = new THREE.CylinderGeometry(1.65, 1.85, 0.16, 40);
    const standBase = new THREE.Mesh(baseGeo, standMat);
    standBase.position.y = -1.1;
    standGroup.add(standBase);

    scene.add(standGroup);

    // 6. Root Cake Group & Separate Pulled-Out Slice Group
    const cakeGroup = new THREE.Group();
    cakeGroupRef.current = cakeGroup;
    scene.add(cakeGroup);

    const sliceGroup = new THREE.Group();
    sliceGroupRef.current = sliceGroup;
    cakeGroup.add(sliceGroup);

    // 7. Spherical Mouse & Touch Orbit Controls (Smooth & 100% Singularity-Free)
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetSphericalRef.current.theta -= deltaX * 0.009;
      // Clamp phi strictly between 0.25 (top view) and 1.50 (ground view)
      targetSphericalRef.current.phi = Math.max(
        0.25,
        Math.min(1.50, targetSphericalRef.current.phi - deltaY * 0.008)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      targetSphericalRef.current.theta -= deltaX * 0.011;
      targetSphericalRef.current.phi = Math.max(
        0.25,
        Math.min(1.50, targetSphericalRef.current.phi - deltaY * 0.01)
      );

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetSphericalRef.current.radius = Math.max(
        4.5,
        Math.min(12.5, targetSphericalRef.current.radius + e.deltaY * 0.006)
      );
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 8. Visibility & Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(container);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return; // 0% GPU when out of view

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth auto-orbit rotation
      if (autoRotate && !isDraggingRef.current) {
        targetSphericalRef.current.theta += delta * 0.35;
      }

      // Smooth damping interpolation for camera coordinates
      const s = sphericalRef.current;
      const ts = targetSphericalRef.current;
      s.radius += (ts.radius - s.radius) * Math.min(1.0, delta * 5.0);
      s.phi += (ts.phi - s.phi) * Math.min(1.0, delta * 5.0);
      s.theta += (ts.theta - s.theta) * Math.min(1.0, delta * 5.0);

      // Strict boundary clamping preventing camera clipping or NaN
      s.radius = Math.max(4.0, Math.min(13.0, s.radius));
      s.phi = Math.max(0.20, Math.min(1.52, s.phi));

      // Safe spherical coordinate transformation (Immune to NaN / Euler Gimbal Lock!)
      const camX = s.radius * Math.sin(s.phi) * Math.sin(s.theta);
      const camY = cakeCenterRef.current.y + s.radius * Math.cos(s.phi);
      const camZ = s.radius * Math.sin(s.phi) * Math.cos(s.theta);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(cakeCenterRef.current);

      // Smooth animated slice pull out on golden server spatula
      if (sliceGroupRef.current) {
        const currentZ = sliceGroupRef.current.position.z;
        const targetZ = sliceTargetPosRef.current;
        sliceGroupRef.current.position.z += (targetZ - currentZ) * (delta * 6.5);

        // Control slice visibility: hide when fully retracted
        if (!isCutaway && Math.abs(sliceGroupRef.current.position.z) < 0.05) {
          sliceGroupRef.current.visible = false;
        } else {
          sliceGroupRef.current.visible = true;
        }
      }

      // Candle Flame flicker
      if (flameMeshRef.current && flameLightRef.current) {
        const flicker = 1 + Math.sin(time * 20) * 0.12 + Math.cos(time * 28) * 0.08;
        flameMeshRef.current.scale.set(flicker, flicker * (1 + Math.sin(time * 14) * 0.15), flicker);
        flameLightRef.current.intensity = 1.6 * flicker;
      }

      // Smoke rising animation
      if (smokeParticlesRef.current) {
        const pos = smokeParticlesRef.current.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          let y = pos.getY(i) + delta * 0.65;
          if (y > 3.2) y = 0;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [autoRotate]);

  // Update target slice position when isCutaway changes
  useEffect(() => {
    sliceTargetPosRef.current = isCutaway ? 1.65 : 0.0;
  }, [isCutaway]);

  // Rebuild 3D Cake Mesh whenever configurations change
  useEffect(() => {
    const cakeGroup = cakeGroupRef.current;
    if (!cakeGroup) return;

    // Clear old cake items EXCEPT sliceGroup
    const itemsToRemove = cakeGroup.children.filter(c => c !== sliceGroupRef.current);
    itemsToRemove.forEach(child => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      cakeGroup.remove(child);
    });

    const sliceGroup = sliceGroupRef.current;
    if (sliceGroup) {
      while (sliceGroup.children.length > 0) {
        const child = sliceGroup.children[0] as THREE.Mesh;
        if (child.geometry) child.geometry.dispose();
        sliceGroup.remove(child);
      }
    }

    const theme = FROSTING_PALETTES[frostingTheme] || FROSTING_PALETTES['Strawberry Blush Velvet'];

    // Materials - DoubleSide ensures solid 3D surfaces with zero transparent voids
    const cakeMat = new THREE.MeshStandardMaterial({
      color: theme.cakeColor,
      roughness: theme.roughness,
      metalness: theme.metalness,
      side: THREE.DoubleSide,
    });

    const dripMat = new THREE.MeshStandardMaterial({
      color: theme.dripColor,
      roughness: 0.22,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const pearlMat = new THREE.MeshStandardMaterial({
      color: theme.pipingColor,
      roughness: 0.3,
      metalness: 0.05,
    });

    // Cross section layered sponge & compote material
    const crossSectionTexture = createCrossSectionTexture(theme);
    const crossSectionMat = new THREE.MeshStandardMaterial({
      map: crossSectionTexture || undefined,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(0x321a10),
      emissiveIntensity: 0.28,
    });

    // Tier definitions
    const tierConfigs = [
      { radius: 2.2, height: 1.35, y: 0.68 }, // Bottom tier
      { radius: 1.5, height: 1.15, y: 1.93 }, // Middle tier
      { radius: 0.95, height: 0.95, y: 2.98 }, // Top tier
    ].slice(0, tiers);

    // Update center point for camera lookAt
    const topTierY = tierConfigs[tierConfigs.length - 1].y;
    cakeCenterRef.current.set(0, topTierY * 0.65, 0);

    // -------------------------------------------------------------
    // EXACT MATHEMATICAL SLICE GEOMETRY:
    // In Three.js CylinderGeometry: x = radius * sin(theta), z = radius * cos(theta).
    // Angle 0 is along +Z (front face).
    // Cut wedge is between -halfAngle and +halfAngle.
    // -------------------------------------------------------------
    const halfAngle = 0.38; // ~22 degrees on each side = 44 degree total slice
    const sweepAngle = Math.PI * 2 - halfAngle * 2;

    tierConfigs.forEach((cfg, idx) => {
      const isTopTier = idx === tierConfigs.length - 1;

      // 1. MAIN CAKE BODY
      // When isCutaway is ON: starts at +halfAngle, sweeps around to Math.PI*2 - halfAngle
      // When isCutaway is OFF: full 360 circle
      const thetaStart = isCutaway ? halfAngle : 0;
      const thetaLength = isCutaway ? sweepAngle : Math.PI * 2;

      const tierGeo = new THREE.CylinderGeometry(
        cfg.radius, 
        cfg.radius, 
        cfg.height, 
        48, 
        1, 
        false, 
        thetaStart, 
        thetaLength
      );
      const tierMesh = new THREE.Mesh(tierGeo, cakeMat);
      tierMesh.position.y = cfg.y;
      tierMesh.castShadow = true;
      tierMesh.receiveShadow = true;
      cakeGroup.add(tierMesh);

      // 2. WHEN CUTAWAY IS ON: ADD THE 2 SOLID MULTI-LAYER CROSS-SECTION WALLS
      // Mathematically aligned BufferGeometry matching cylinder vertices exactly
      if (isCutaway) {
        // Cut Wall 1 (at angle +halfAngle, inward normal facing -X)
        const wall1Geo = createRadialWallGeometry(cfg.radius, cfg.height, halfAngle, false);
        const wall1 = new THREE.Mesh(wall1Geo, crossSectionMat);
        wall1.position.set(0, cfg.y, 0);
        cakeGroup.add(wall1);

        // Cut Wall 2 (at angle -halfAngle, inward normal facing +X)
        const wall2Geo = createRadialWallGeometry(cfg.radius, cfg.height, -halfAngle, true);
        const wall2 = new THREE.Mesh(wall2Geo, crossSectionMat);
        wall2.position.set(0, cfg.y, 0);
        cakeGroup.add(wall2);
      }

      // 3. Frosting Pearls along the tier base
      const pearlCount = Math.floor(cfg.radius * 16);
      const pearlGeo = new THREE.SphereGeometry(0.085, 12, 12);
      for (let p = 0; p < pearlCount; p++) {
        const angle = (p / pearlCount) * Math.PI * 2;
        const normalizedAngle = angle > Math.PI ? angle - Math.PI * 2 : angle;
        if (isCutaway && Math.abs(normalizedAngle) < halfAngle) continue;
        const px = Math.sin(angle) * (cfg.radius + 0.02);
        const pz = Math.cos(angle) * (cfg.radius + 0.02);
        const pearl = new THREE.Mesh(pearlGeo, pearlMat);
        pearl.position.set(px, cfg.y - cfg.height / 2 + 0.06, pz);
        cakeGroup.add(pearl);
      }

      // 4. Handcrafted Frosting Rosettes on Top of Tier
      const rosetteCount = Math.floor(cfg.radius * 9);
      const rosetteGeo = new THREE.TorusGeometry(0.09, 0.04, 8, 16);
      rosetteGeo.rotateX(Math.PI / 2);
      for (let r = 0; r < rosetteCount; r++) {
        const angle = (r / rosetteCount) * Math.PI * 2;
        const normalizedAngle = angle > Math.PI ? angle - Math.PI * 2 : angle;
        if (isCutaway && Math.abs(normalizedAngle) < halfAngle) continue;
        const rx = Math.sin(angle) * (cfg.radius - 0.16);
        const rz = Math.cos(angle) * (cfg.radius - 0.16);
        const rosette = new THREE.Mesh(rosetteGeo, pearlMat);
        rosette.position.set(rx, cfg.y + cfg.height / 2 + 0.02, rz);
        cakeGroup.add(rosette);
      }

      // 5. Upper Drip Glaze
      const dripGeo = new THREE.CylinderGeometry(
        cfg.radius + 0.03, 
        cfg.radius + 0.02, 
        0.18, 
        36, 
        1, 
        false, 
        thetaStart, 
        thetaLength
      );
      const dripMesh = new THREE.Mesh(dripGeo, dripMat);
      dripMesh.position.y = cfg.y + cfg.height / 2 - 0.07;
      cakeGroup.add(dripMesh);

      // Droplets around drip
      const dripCount = Math.floor(cfg.radius * 6);
      for (let d = 0; d < dripCount; d++) {
        const angle = (d / dripCount) * Math.PI * 2 + (d % 2) * 0.2;
        const normalizedAngle = angle > Math.PI ? angle - Math.PI * 2 : angle;
        if (isCutaway && Math.abs(normalizedAngle) < halfAngle) continue;
        const dx = Math.sin(angle) * (cfg.radius + 0.03);
        const dz = Math.cos(angle) * (cfg.radius + 0.03);
        const dropHeight = 0.15 + (d % 3) * 0.12;
        const dropGeo = new THREE.CylinderGeometry(0.04, 0.02, dropHeight, 8);
        const drop = new THREE.Mesh(dropGeo, dripMat);
        drop.position.set(dx, cfg.y + cfg.height / 2 - 0.12 - dropHeight / 2, dz);
        cakeGroup.add(drop);
      }

      // 6. Confetti & Rainbow Pearls Topping if selected
      if (selectedToppings.includes('sprinkles')) {
        const sprinkleCount = Math.floor(cfg.radius * 18);
        const sprinkleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.08, 6);
        const sprinkleColors = [0xf5a5b8, 0xffe7a3, 0xb8d4a5, 0xffffff, 0xc9365b];

        for (let s = 0; s < sprinkleCount; s++) {
          const angle = Math.random() * Math.PI * 2;
          const normalizedAngle = angle > Math.PI ? angle - Math.PI * 2 : angle;
          if (isCutaway && Math.abs(normalizedAngle) < halfAngle) continue;
          const dist = Math.random() * (cfg.radius - 0.3);
          const sMat = new THREE.MeshStandardMaterial({
            color: sprinkleColors[s % sprinkleColors.length],
            roughness: 0.3,
          });
          const sprinkle = new THREE.Mesh(sprinkleGeo, sMat);
          sprinkle.position.set(
            Math.sin(angle) * dist,
            cfg.y + cfg.height / 2 + 0.015,
            Math.cos(angle) * dist
          );
          sprinkle.rotation.x = Math.PI / 2;
          sprinkle.rotation.z = Math.random() * Math.PI;
          cakeGroup.add(sprinkle);
        }
      }

      // 7. Message Ribbon Banner on Front of Middle or Bottom Tier
      if ((tiers === 1 && idx === 0) || (tiers >= 2 && idx === 0)) {
        const textTexture = createTextTexture(message, theme.textColor);
        if (textTexture) {
          // When cutaway is on, position the ribbon banner along the visible front-side curve (Math.PI * 0.32)
          // so both the message and the sliced interior are simultaneously visible!
          const ribbonStartAngle = isCutaway ? Math.PI * 0.32 : -Math.PI * 0.32;
          const bannerGeo = new THREE.CylinderGeometry(
            cfg.radius + 0.06,
            cfg.radius + 0.06,
            0.52,
            36,
            1,
            true,
            ribbonStartAngle,
            Math.PI * 0.64
          );
          const bannerMat = new THREE.MeshBasicMaterial({
            map: textTexture,
            transparent: true,
            side: THREE.DoubleSide,
          });
          const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
          bannerMesh.position.y = cfg.y;
          cakeGroup.add(bannerMesh);
        }
      }

      // 8. Top tier ornaments
      if (isTopTier) {
        const topY = cfg.y + cfg.height / 2;

        // Signature Golden Feather Wings
        if (selectedToppings.includes('feathers')) {
          const wingGroup = new THREE.Group();
          const goldWingMat = new THREE.MeshStandardMaterial({
            color: 0xf5c342,
            roughness: 0.22,
            metalness: 0.9,
          });

          // Left wing
          const leftWingGeo = new THREE.TorusGeometry(0.48, 0.045, 8, 28, Math.PI * 0.85);
          leftWingGeo.rotateZ(Math.PI * 0.2);
          const leftWing = new THREE.Mesh(leftWingGeo, goldWingMat);
          leftWing.position.set(-0.38, 0.38, 0);
          wingGroup.add(leftWing);

          for (let f = 0; f < 4; f++) {
            const plumeGeo = new THREE.CylinderGeometry(0.02, 0.055, 0.32 + f * 0.09, 8);
            plumeGeo.rotateZ(-Math.PI * 0.3 + f * 0.12);
            const plume = new THREE.Mesh(plumeGeo, goldWingMat);
            plume.position.set(-0.42 - f * 0.08, 0.32 + f * 0.12, 0);
            wingGroup.add(plume);
          }

          // Right wing mirror
          const rightWingGeo = new THREE.TorusGeometry(0.48, 0.045, 8, 28, Math.PI * 0.85);
          rightWingGeo.rotateZ(-Math.PI * 0.85);
          const rightWing = new THREE.Mesh(rightWingGeo, goldWingMat);
          rightWing.position.set(0.38, 0.38, 0);
          wingGroup.add(rightWing);

          for (let f = 0; f < 4; f++) {
            const plumeGeo = new THREE.CylinderGeometry(0.02, 0.055, 0.32 + f * 0.09, 8);
            plumeGeo.rotateZ(Math.PI * 0.3 - f * 0.12);
            const plume = new THREE.Mesh(plumeGeo, goldWingMat);
            plume.position.set(0.42 + f * 0.08, 0.32 + f * 0.12, 0);
            wingGroup.add(plume);
          }

          wingGroup.position.set(0, topY, 0);
          cakeGroup.add(wingGroup);
        }

        // Fresh Strawberries Toppings
        if (selectedToppings.includes('strawberries')) {
          const berryMat = new THREE.MeshStandardMaterial({ color: 0xd92543, roughness: 0.28 });
          const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f7823, roughness: 0.6 });
          const berryGeo = new THREE.ConeGeometry(0.13, 0.26, 12);
          const leafGeo = new THREE.CylinderGeometry(0.01, 0.065, 0.03, 5);

          const berryCoords = [
            { x: 0.35, z: -0.25 },
            { x: -0.32, z: -0.28 },
            { x: 0.0, z: -0.38 },
          ];

          berryCoords.forEach(pos => {
            const berry = new THREE.Mesh(berryGeo, berryMat);
            berry.position.set(pos.x, topY + 0.13, pos.z);
            berry.rotation.x = Math.PI;
            cakeGroup.add(berry);

            const calyx = new THREE.Mesh(leafGeo, leafMat);
            calyx.position.set(pos.x, topY + 0.26, pos.z);
            cakeGroup.add(calyx);
          });
        }

        // French Macarons
        if (selectedToppings.includes('macarons')) {
          const macaronColors = [0xfbbecb, 0xb8d4a5, 0xffe7a3];
          const macaronCoords = [
            { x: 0.44, z: -0.25, rot: 0.32 },
            { x: -0.42, z: -0.22, rot: -0.35 },
          ];

          macaronCoords.forEach((m, mIdx) => {
            const macGroup = new THREE.Group();
            const macMat = new THREE.MeshStandardMaterial({
              color: macaronColors[mIdx % macaronColors.length],
              roughness: 0.4,
            });
            const shellGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16);
            const shell1 = new THREE.Mesh(shellGeo, macMat);
            shell1.position.y = 0.04;
            macGroup.add(shell1);

            const creamGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.03, 16);
            const cream = new THREE.Mesh(creamGeo, pearlMat);
            macGroup.add(cream);

            const shell2 = new THREE.Mesh(shellGeo, macMat);
            shell2.position.y = -0.04;
            macGroup.add(shell2);

            macGroup.position.set(m.x, topY + 0.08, m.z);
            macGroup.rotation.z = m.rot;
            cakeGroup.add(macGroup);
          });
        }

        // Edible Gold Leaf Flakes
        if (selectedToppings.includes('gold_leaf')) {
          const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.15,
            metalness: 0.95,
            side: THREE.DoubleSide,
          });
          const flakeGeo = new THREE.PlaneGeometry(0.08, 0.06);

          for (let g = 0; g < 14; g++) {
            const angle = (g / 14) * Math.PI * 2;
            const r = cfg.radius * (0.4 + (g % 3) * 0.18);
            const flake = new THREE.Mesh(flakeGeo, goldMat);
            flake.position.set(Math.sin(angle) * r, topY + 0.015, Math.cos(angle) * r);
            flake.rotation.x = -Math.PI / 2;
            flake.rotation.z = angle + (g % 2) * 0.5;
            cakeGroup.add(flake);
          }
        }

        // Birthday Candle with 3D Flickering Flame
        if (candleActive) {
          const candleGroup = new THREE.Group();
          const candleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 16);
          const candleMat = new THREE.MeshStandardMaterial({
            color: 0xfffdfa,
            roughness: 0.3,
          });
          const candle = new THREE.Mesh(candleGeo, candleMat);
          candle.position.y = 0.32;
          candleGroup.add(candle);

          // Candle spiral stripes
          const stripeGeo = new THREE.TorusGeometry(0.042, 0.008, 8, 24);
          stripeGeo.rotateX(Math.PI / 2);
          const stripeMat = new THREE.MeshStandardMaterial({ color: 0xc9365b });
          for (let s = 0; s < 3; s++) {
            const stripe = new THREE.Mesh(stripeGeo, stripeMat);
            stripe.position.y = 0.15 + s * 0.16;
            candleGroup.add(stripe);
          }

          // Wick
          const wickGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 6);
          const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
          const wick = new THREE.Mesh(wickGeo, wickMat);
          wick.position.y = 0.68;
          candleGroup.add(wick);

          // Flame Teardrop Mesh
          if (!isCandleBlown) {
            const flameGeo = new THREE.ConeGeometry(0.06, 0.18, 12);
            const flameMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
            const flameMesh = new THREE.Mesh(flameGeo, flameMat);
            flameMesh.position.y = 0.8;
            candleGroup.add(flameMesh);
            flameMeshRef.current = flameMesh;

            const coreGeo = new THREE.ConeGeometry(0.03, 0.12, 10);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0xfff488 });
            const coreMesh = new THREE.Mesh(coreGeo, coreMat);
            coreMesh.position.y = 0.78;
            candleGroup.add(coreMesh);

            const flameLight = new THREE.PointLight(0xffaa33, 1.8, 4);
            flameLight.position.y = 0.85;
            candleGroup.add(flameLight);
            flameLightRef.current = flameLight;
          } else {
            const smokeCount = 18;
            const smokeGeo = new THREE.BufferGeometry();
            const smokePositions = new Float32Array(smokeCount * 3);
            for (let i = 0; i < smokeCount; i++) {
              smokePositions[i * 3] = (Math.random() - 0.5) * 0.12;
              smokePositions[i * 3 + 1] = 0.75 + Math.random() * 0.6;
              smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
            }
            smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
            const smokeMat = new THREE.PointsMaterial({
              color: 0xcccccc,
              size: 0.06,
              transparent: true,
              opacity: 0.5,
            });
            const smoke = new THREE.Points(smokeGeo, smokeMat);
            candleGroup.add(smoke);
            smokeParticlesRef.current = smoke;
          }

          candleGroup.position.set(0, topY, 0);
          cakeGroup.add(candleGroup);
        }
      }
    });

    // -------------------------------------------------------------
    // 9. THE PULLED-OUT CAKE SLICE ON GOLDEN PATISSERIE SERVER
    // When isCutaway is ON, this slice animates forward along +Z!
    // -------------------------------------------------------------
    if (sliceGroup) {
      if (isCutaway) {
        sliceGroup.visible = true;
        tierConfigs.forEach((cfg) => {
          // Individual wedge for this tier
          const wedgeGeo = new THREE.CylinderGeometry(
            cfg.radius,
            cfg.radius,
            cfg.height,
            16,
            1,
            false,
            -halfAngle,
            halfAngle * 2
          );
          const wedgeMesh = new THREE.Mesh(wedgeGeo, cakeMat);
          wedgeMesh.position.y = cfg.y;
          wedgeMesh.castShadow = true;
          sliceGroup.add(wedgeMesh);

          // Slice cut wall 1 (at angle +halfAngle, outward normal facing +X)
          const sWall1Geo = createRadialWallGeometry(cfg.radius, cfg.height, halfAngle, true);
          const sWall1 = new THREE.Mesh(sWall1Geo, crossSectionMat);
          sWall1.position.set(0, cfg.y, 0);
          sliceGroup.add(sWall1);

          // Slice cut wall 2 (at angle -halfAngle, outward normal facing -X)
          const sWall2Geo = createRadialWallGeometry(cfg.radius, cfg.height, -halfAngle, false);
          const sWall2 = new THREE.Mesh(sWall2Geo, crossSectionMat);
          sWall2.position.set(0, cfg.y, 0);
          sliceGroup.add(sWall2);

          // Drip on outer edge of slice
          const sDripGeo = new THREE.CylinderGeometry(
            cfg.radius + 0.03,
            cfg.radius + 0.02,
            0.18,
            12,
            1,
            false,
            -halfAngle,
            halfAngle * 2
          );
          const sDrip = new THREE.Mesh(sDripGeo, dripMat);
          sDrip.position.y = cfg.y + cfg.height / 2 - 0.07;
          sliceGroup.add(sDrip);
        });

        // Golden Patisserie Spatula / Cake Server under the pulled slice
        const spatulaMat = new THREE.MeshStandardMaterial({
          color: 0xdeb03d,
          roughness: 0.18,
          metalness: 0.9,
        });

        // Spatula blade
        const bladeGeo = new THREE.ConeGeometry(0.7, 2.6, 3);
        bladeGeo.rotateX(Math.PI / 2);
        bladeGeo.rotateZ(Math.PI);
        const blade = new THREE.Mesh(bladeGeo, spatulaMat);
        blade.position.set(0, 0.02, 1.2);
        blade.scale.set(1.4, 0.02, 1.0);
        sliceGroup.add(blade);

        // Spatula handle
        const handleGeo = new THREE.CylinderGeometry(0.05, 0.06, 1.6, 12);
        handleGeo.rotateX(Math.PI / 2);
        const handle = new THREE.Mesh(handleGeo, spatulaMat);
        handle.position.set(0, -0.05, 2.8);
        sliceGroup.add(handle);

        // Strawberry garnish on the pulled slice tip
        const topTierCfg = tierConfigs[tierConfigs.length - 1];
        const sliceBerryGeo = new THREE.ConeGeometry(0.12, 0.24, 10);
        const berryMat = new THREE.MeshStandardMaterial({ color: 0xd92543, roughness: 0.28 });
        const sliceBerry = new THREE.Mesh(sliceBerryGeo, berryMat);
        sliceBerry.position.set(0, topTierCfg.y + topTierCfg.height / 2 + 0.12, 0.5);
        sliceBerry.rotation.x = Math.PI;
        sliceGroup.add(sliceBerry);
      } else {
        sliceGroup.visible = false;
      }
    }

  }, [tiers, frostingTheme, selectedToppings, message, isCutaway, candleActive, isCandleBlown, createTextTexture, createCrossSectionTexture]);

  // Handle Blow Candle Interaction
  const handleBlowCandle = () => {
    if (isCandleBlown) {
      setIsCandleBlown(false);
      playPopSound();
    } else {
      setIsCandleBlown(true);
      playBlowSound();

      try {
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F5A5B8', '#C9365B', '#FFE7A3', '#B8D4A5', '#FFD700'],
        });
      } catch {
        // ignore
      }
    }
  };

  const toggleTopping = (topId: string) => {
    playPopSound();
    setSelectedToppings(prev => 
      prev.includes(topId) ? prev.filter(t => t !== topId) : [...prev, topId]
    );
  };

  const handleLaunchOrder = () => {
    playChimeSound();
    onOrderCustomCake({
      flavor: frostingTheme,
      weight: currentPricing.label,
      dietary,
      frosting: frostingTheme,
      message,
      estimatedPrice: totalPrice,
      toppings: selectedToppings,
      tiers,
    });
  };

  const handleWhatsAppSend = () => {
    playPopSound();
    const toppingText = selectedToppings.length > 0 ? selectedToppings.join(', ') : 'None';
    const text = encodeURIComponent(
      `Hello Manmaya's Cake Delights,\nI designed an interactive 3D cake on your website!\n\n` +
      `Design Details:\n` +
      `• Tiers: ${tiers} Tier (${currentPricing.label})\n` +
      `• Flavor & Frosting: ${frostingTheme}\n` +
      `• Dietary: ${dietary === 'eggless' ? '100% Eggless' : dietary === 'pure_veg' ? '100% Pure Veg Guaranteed' : 'Regular Sponge'}\n` +
      `• 3D Toppings: ${toppingText}\n` +
      `• Piped Inscription: "${message}"\n` +
      `• Estimated Quote: Approx ₹${totalPrice}\n\n` +
      `Please let me know availability and finalize my order. Thank you!`
    );
    window.open(`https://wa.me/${INITIAL_SITE_SETTINGS.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F2] to-[#FAF5EF] border-b border-[#F0E5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBE6EC] text-[#C9365B] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Cake Studio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#382722] tracking-tight">
            Sculpt your custom celebration cake in 3D
          </h2>
          <p className="text-sm sm:text-base text-[#664E46] mt-2">
            Rotate 360°, inspect multi-layered sponge interior slices, pipe personal inscriptions, and blow out the birthday candle.
          </p>
        </div>

        {/* 3D Studio Container */}
        <div className="bg-white rounded-3xl border border-[#F0E5D8] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left 3D Viewport Column */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#FFF9F2] via-[#FAF5EF] to-[#FFF2E2] p-4 sm:p-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#F0E5D8] relative select-none">
              
              {/* Top Viewport Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#8A7269] z-10">
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-[#F0E5D8] shadow-xs">
                  <Rotate3d className="w-4 h-4 text-[#C9365B]" />
                  <span>Drag to rotate 360°</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Zoom controls */}
                  <div className="flex items-center bg-white/95 border border-[#F0E5D8] rounded-xl overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => handleZoom(-1.5)}
                      className="p-1.5 hover:bg-[#FFF2E2] text-[#5A433B] transition-colors border-r border-[#F0E5D8]"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleZoom(1.5)}
                      className="p-1.5 hover:bg-[#FFF2E2] text-[#5A433B] transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sound mute toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = toggleAudioMute();
                      setMuted(next);
                    }}
                    className="p-2 rounded-xl bg-white/95 border border-[#F0E5D8] hover:border-[#C9365B] text-[#5A433B] transition-colors shadow-xs"
                    title={muted ? 'Unmute Patisserie Sounds' : 'Mute Sounds'}
                  >
                    {muted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#C9365B]" />}
                  </button>

                  {/* Auto rotate toggle */}
                  <button
                    type="button"
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                      autoRotate 
                        ? 'bg-[#C9365B] text-white border-[#C9365B]' 
                        : 'bg-white text-[#5A433B] border-[#F0E5D8]'
                    }`}
                  >
                    Auto Orbit
                  </button>
                </div>
              </div>

              {/* Three.js Canvas Mount */}
              <div 
                ref={mountRef} 
                className="w-full h-80 sm:h-96 my-2 cursor-grab active:cursor-grabbing flex items-center justify-center relative touch-none"
              />

              {/* Camera Angle Presets Toolbar */}
              <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-2xl border border-[#F0E5D8] shadow-xs flex items-center justify-around gap-1 z-10 mb-2">
                <button
                  type="button"
                  onClick={() => setCameraPreset('orbit')}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                    cameraPresetView === 'orbit' && !isCutaway
                      ? 'bg-[#C9365B] text-white'
                      : 'text-[#5A433B] hover:bg-[#FFF2E2]'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>360° Free</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraPreset('slice')}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                    isCutaway
                      ? 'bg-[#55853B] text-white'
                      : 'text-[#5A433B] hover:bg-[#FFF2E2]'
                  }`}
                >
                  <Scissors className="w-3 h-3" />
                  <span>Inspect Inside Slice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraPreset('front')}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                    cameraPresetView === 'front'
                      ? 'bg-[#C9365B] text-white'
                      : 'text-[#5A433B] hover:bg-[#FFF2E2]'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>Front Inscription</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCameraPreset('top')}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                    cameraPresetView === 'top'
                      ? 'bg-[#C9365B] text-white'
                      : 'text-[#5A433B] hover:bg-[#FFF2E2]'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Top View</span>
                </button>
              </div>

              {/* Viewport Floating Interactive Pill Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2 z-10 pt-1">
                {/* Candle Blow button */}
                <button
                  type="button"
                  onClick={handleBlowCandle}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                    isCandleBlown
                      ? 'bg-gray-100 border-gray-300 text-gray-600'
                      : 'bg-[#FFF2E2] border-[#FFE7A3] text-[#C9365B] hover:bg-[#FFE7A3]'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${isCandleBlown ? 'text-gray-400' : 'text-[#C9365B] animate-pulse'}`} />
                  <span>{isCandleBlown ? 'Relight Candle' : 'Blow Out Candle!'}</span>
                </button>

                {/* Slice Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setIsCutaway(!isCutaway);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                    isCutaway
                      ? 'bg-[#EFF7EA] border-[#B8D4A5] text-[#55853B]'
                      : 'bg-white border-[#F0E5D8] text-[#5A433B] hover:bg-[#FAF5EF]'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{isCutaway ? 'Close Slice Cut' : 'Pull Out Slice on Server'}</span>
                </button>
              </div>

              {/* Indicative Price & Verification Banner */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-[#F0E5D8] flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A7269]">
                    Indicative 3D Design Estimate
                  </div>
                  <div className="text-2xl font-extrabold text-[#C9365B]">
                    ₹{totalPrice} <span className="text-xs font-normal text-[#8A7269]">(Approx)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#55853B] bg-[#EFF7EA] px-2.5 py-1 rounded-lg">
                    <Leaf className="w-3 h-3" />
                    <span>{dietary === 'pure_veg' ? '100% Pure Veg' : dietary === 'eggless' ? '100% Eggless' : 'Regular'}</span>
                  </span>
                  <div className="text-[10px] text-[#8A7269] mt-0.5">Verified by baker before baking</div>
                </div>
              </div>

            </div>

            {/* Right Controls Column */}
            <div className="lg:col-span-6 p-6 sm:p-9 space-y-5">
              
              {/* 1. Tiers Selection */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C9365B]" />
                  <span>Number of Cake Tiers & Weight</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[1, 2, 3].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setTiers(t);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        tiers === t
                          ? 'bg-[#C9365B] text-white border-[#C9365B] shadow-md scale-[1.02]'
                          : 'bg-[#FFF9F2] text-[#382722] border-[#F0E5D8] hover:border-[#F5A5B8]'
                      }`}
                    >
                      <div className="font-serif font-extrabold text-base sm:text-lg">
                        {t} {t === 1 ? 'Tier' : 'Tiers'}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${tiers === t ? 'text-white/80' : 'text-[#8A7269]'}`}>
                        {tierWeights[t].label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Flavor & Frosting Palette */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#C9365B]" />
                  <span>Patisserie Flavor & Frosting Palette</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(FROSTING_PALETTES).map(paletteName => {
                    const isSelected = frostingTheme === paletteName;
                    const p = FROSTING_PALETTES[paletteName];
                    return (
                      <button
                        key={paletteName}
                        type="button"
                        onClick={() => {
                          playPopSound();
                          setFrostingTheme(paletteName);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#FFF2E2] border-[#C9365B] shadow-sm ring-2 ring-[#F5A5B8]/30'
                            : 'bg-white border-[#F0E5D8] hover:border-[#F5A5B8]'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs" 
                          style={{ backgroundColor: `#${p.cakeColor.toString(16).padStart(6, '0')}` }}
                        />
                        <span className="text-xs font-bold text-[#382722] truncate">{paletteName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. 3D Toppings & Handcrafted Accents */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-2">
                  Signature Toppings & Handcrafted Accents
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'feathers', label: 'Feather Wings', badge: 'Specialty' },
                    { id: 'strawberries', label: 'Fresh Berries', badge: '+₹75' },
                    { id: 'macarons', label: 'Macarons', badge: '+₹75' },
                    { id: 'gold_leaf', label: 'Gold Leaf', badge: '+₹75' },
                    { id: 'sprinkles', label: 'Pearl Sprinkles', badge: '+₹75' },
                  ].map(top => {
                    const isChecked = selectedToppings.includes(top.id);
                    return (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => toggleTopping(top.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#EFF7EA] border-[#55853B] text-[#55853B]'
                            : 'bg-white border-[#F0E5D8] text-[#5A433B]'
                        }`}
                      >
                        <span className="text-xs font-bold">{top.label}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isChecked ? 'bg-[#55853B] text-white' : 'bg-[#FFF9F2] text-[#8A7269]'
                        }`}>
                          {top.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Live Piped Message Inscription */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Piped Message On 3D Cake Tier</span>
                  <span className="text-[10px] text-[#8A7269] font-normal">Piped in cursive frosting</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Happy 25th Silver Jubilee"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F2] border border-[#F0E5D8] text-sm text-[#382722] font-medium focus:outline-none focus:ring-2 focus:ring-[#F5A5B8]"
                />
              </div>

              {/* 5. Dietary Choice */}
              <div>
                <label className="block text-xs font-bold text-[#382722] uppercase tracking-wider mb-2">
                  Dietary Guarantee
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setDietary('eggless');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      dietary === 'eggless'
                        ? 'bg-[#EFF7EA] border-[#55853B] text-[#55853B]'
                        : 'bg-white border-[#F0E5D8] text-[#5A433B]'
                    }`}
                  >
                    100% Eggless
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setDietary('pure_veg');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      dietary === 'pure_veg'
                        ? 'bg-[#EFF7EA] border-[#55853B] text-[#55853B]'
                        : 'bg-white border-[#F0E5D8] text-[#5A433B]'
                    }`}
                  >
                    Pure Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPopSound();
                      setDietary('regular');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      dietary === 'regular'
                        ? 'bg-[#FFF2E2] border-[#C9365B] text-[#C9365B]'
                        : 'bg-white border-[#F0E5D8] text-[#5A433B]'
                    }`}
                  >
                    Regular Sponge
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleLaunchOrder}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-[#C9365B] hover:bg-[#A92244] text-white font-bold text-sm shadow-md shadow-[#C9365B]/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFE7A3]" />
                  <span>Enquire This 3D Design</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp 3D Specs</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
