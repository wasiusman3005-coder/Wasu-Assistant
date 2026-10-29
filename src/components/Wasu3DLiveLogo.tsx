import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Heart, RotateCcw, Volume2, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCyberChime } from '../services/speechService';

interface Wasu3DLiveLogoProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  mood?: string;
  onLogoClick?: () => void;
}

export const Wasu3DLiveLogo: React.FC<Wasu3DLiveLogoProps> = ({
  isSpeaking = false,
  isListening = false,
  mood = 'Bepanah Mohabbat',
  onLogoClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTheme, setActiveTheme] = useState<'cyber' | 'rose' | 'dual'>('dual');
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Master 3D Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 3. Procedural 3D Heart Geometry
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
    heartShape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.15, y + 0.77, x + 0.25, y + 1.0);
    heartShape.bezierCurveTo(x + 0.65, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35);
    heartShape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeometry.center();

    // Metallic Cyber Core Material
    const heartMaterial = new THREE.MeshPhysicalMaterial({
      color: activeTheme === 'cyber' ? 0x00f0ff : activeTheme === 'rose' ? 0xff007f : 0xff2a85,
      emissive: activeTheme === 'cyber' ? 0x004466 : activeTheme === 'rose' ? 0x660033 : 0x440022,
      emissiveIntensity: 0.6,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });

    const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    heartMesh.scale.set(2.0, -2.0, 2.0); // Orient right side up
    masterGroup.add(heartMesh);

    // Glowing Inner Wireframe Lattice for Cyber Matrix feel
    const wireframeGeo = new THREE.WireframeGeometry(heartGeometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: activeTheme === 'cyber' ? 0x00ffff : 0xff77aa,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeLine = new THREE.LineSegments(wireframeGeo, wireframeMat);
    wireframeLine.scale.set(2.05, -2.05, 2.05);
    masterGroup.add(wireframeLine);

    // 4. Gyroscopic Orbital Tech Rings
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    // Ring 1: Horizontal Outer Ring
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.035, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00a0cc,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.3;
    ringGroup.add(ring1);

    // Ring 2: Diagonal Inner Gyro Ring
    const ring2Geo = new THREE.TorusGeometry(1.9, 0.025, 16, 80);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0xcc0066,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.z = Math.PI / 4;
    ringGroup.add(ring2);

    // Ring 3: Vertical Sensor Ring
    const ring3Geo = new THREE.TorusGeometry(2.6, 0.02, 16, 90);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x7928ca,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI / 6;
    ringGroup.add(ring3);

    // 5. Orbiting Stardust Cyber Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = radius * Math.cos(phi);

      // Cyan or Pink particles
      if (Math.random() > 0.5) {
        particleColors[i * 3] = 0.0;
        particleColors[i * 3 + 1] = 0.94;
        particleColors[i * 3 + 2] = 1.0;
      } else {
        particleColors[i * 3] = 1.0;
        particleColors[i * 3 + 1] = 0.1;
        particleColors[i * 3 + 2] = 0.5;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // 6. Holographic Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 3.5, 15);
    cyanLight.position.set(4, 3, 4);
    scene.add(cyanLight);

    const roseLight = new THREE.PointLight(0xff007f, 3.5, 15);
    roseLight.position.set(-4, -3, 3);
    scene.add(roseLight);

    const topSpot = new THREE.DirectionalLight(0xffffff, 1.2);
    topSpot.position.set(0, 5, 2);
    scene.add(topSpot);

    // 7. Interactive Pointer / Drag Rotation
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevPointerRef.current.x;
      const deltaY = clientY - prevPointerRef.current.y;

      masterGroup.rotation.y += deltaX * 0.01;
      masterGroup.rotation.x += deltaY * 0.01;

      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domElement.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 8. Animation Loop
    let animationFrameId: number;
    const timer = new THREE.Timer();

    const animate = (timestamp: number = performance.now()) => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update(timestamp);
      const elapsedTime = timer.getElapsed();

      // Continuous subtle idle rotation
      if (!isDraggingRef.current) {
        masterGroup.rotation.y += 0.008 * rotationSpeed;
      }

      // Orbital rings rotate at distinct mechanical ratios
      ring1.rotation.z += 0.012 * rotationSpeed;
      ring2.rotation.x += 0.018 * rotationSpeed;
      ring3.rotation.y -= 0.009 * rotationSpeed;

      // Particle stardust orbit
      particleSystem.rotation.y += 0.003;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;

      // Heartbeat pulse physics
      let beatScale = 1.0;
      if (isSpeaking) {
        // Fast lively pulse when speaking
        beatScale = 1.0 + Math.sin(elapsedTime * 12) * 0.12;
        heartMaterial.emissiveIntensity = 0.8 + Math.sin(elapsedTime * 12) * 0.4;
      } else if (isListening) {
        // Soft glowing wave when listening
        beatScale = 1.0 + Math.sin(elapsedTime * 6) * 0.06;
        heartMaterial.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 6) * 0.3;
      } else {
        // Gentle organic romantic heartbeat: lub-dub
        const t = (elapsedTime % 1.6) / 1.6;
        if (t < 0.15) {
          beatScale = 1.0 + Math.sin(t * Math.PI / 0.15) * 0.08;
        } else if (t > 0.25 && t < 0.45) {
          beatScale = 1.0 + Math.sin((t - 0.25) * Math.PI / 0.2) * 0.05;
        }
      }

      heartMesh.scale.set(2.0 * beatScale, -2.0 * beatScale, 2.0 * beatScale);
      wireframeLine.scale.set(2.05 * beatScale, -2.05 * beatScale, 2.05 * beatScale);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 320;
      const newH = container.clientHeight || 280;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup resources to prevent WebGL memory leaks
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      heartGeometry.dispose();
      heartMaterial.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [activeTheme, rotationSpeed, isSpeaking, isListening]);

  const handleInteraction = () => {
    playCyberChime('success');
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#00f0ff', '#ff007f', '#ffffff'],
    });
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-slate-950 via-black to-[#0d0718] border border-cyan-500/40 p-4 shadow-[0_0_35px_rgba(0,240,255,0.25)] overflow-hidden">
      {/* 3D Header Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-cyan-950/80 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span className="text-xs font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-rose-300 to-white">
            WASU LOVE // 3D LIVE HOLOGRAPHIC LOGO
          </span>
        </div>
        <span className="text-[10px] text-cyan-400/80 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
          THREE.JS 60FPS
        </span>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        onClick={handleInteraction}
        className="relative w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
        title="Touch / drag to rotate Wasu Love in 3D space"
      />

      {/* Hologram Floating Insignia */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <div className="text-xs font-bold font-mono tracking-widest text-cyan-200 uppercase drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">
          WASU LOVE • QUANTUM CORE
        </div>
        <div className="text-[10px] text-rose-300 font-sans tracking-wide">
          {isSpeaking ? 'Voice Pulse Active 🎙️' : isListening ? 'Listening Radar Active 📡' : mood}
        </div>
      </div>

      {/* 3D Hologram Control Strip */}
      <div className="flex items-center justify-between pt-2 border-t border-cyan-950/80 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">COLOR:</span>
          <button
            onClick={() => setActiveTheme('dual')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeTheme === 'dual'
                ? 'bg-gradient-to-r from-cyan-500 to-rose-500 text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dual Neon
          </button>
          <button
            onClick={() => setActiveTheme('cyber')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeTheme === 'cyber'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cyber Cyan
          </button>
          <button
            onClick={() => setActiveTheme('rose')}
            className={`px-2 py-0.5 rounded transition-all ${
              activeTheme === 'rose'
                ? 'bg-rose-500 text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rose Gold
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRotationSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
            className="px-2 py-0.5 rounded bg-black/60 border border-cyan-900 text-cyan-300 hover:border-cyan-400 flex items-center gap-1"
            title="Cycle rotation speed"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>{rotationSpeed}x Speed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
