import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEffects } from "../services/soundEffects";

export interface QuantumThemeColor {
  name: string;
  hex: string;
  glow: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
  styleName: string;
}

export const QUANTUM_THEMES: QuantumThemeColor[] = [
  {
    name: "Tachyon Cyan",
    hex: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.7)",
    borderClass: "border-cyan-400/50 shadow-cyan-500/25",
    textClass: "text-cyan-400",
    badgeBg: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    styleName: "Tachyon Reactor Core",
  },
  {
    name: "Nebula Violet",
    hex: "#a855f7",
    glow: "rgba(168, 85, 247, 0.7)",
    borderClass: "border-purple-400/50 shadow-purple-500/25",
    textClass: "text-purple-400",
    badgeBg: "bg-purple-950/80 text-purple-300 border-purple-500/40",
    styleName: "4D Hypercube Tesseract",
  },
  {
    name: "Emerald Matrix",
    hex: "#10b981",
    glow: "rgba(16, 185, 129, 0.7)",
    borderClass: "border-emerald-400/50 shadow-emerald-500/25",
    textClass: "text-emerald-400",
    badgeBg: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    styleName: "Crystalline Icosahedron",
  },
  {
    name: "Solar Gold",
    hex: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.7)",
    borderClass: "border-amber-400/50 shadow-amber-500/25",
    textClass: "text-amber-400",
    badgeBg: "bg-amber-950/80 text-amber-300 border-amber-500/40",
    styleName: "Neural Synapse Node",
  },
  {
    name: "Supernova Rose",
    hex: "#f43f5e",
    glow: "rgba(244, 63, 94, 0.7)",
    borderClass: "border-rose-400/50 shadow-rose-500/25",
    textClass: "text-rose-400",
    badgeBg: "bg-rose-950/80 text-rose-300 border-rose-500/40",
    styleName: "Tachyon Helix Vortex",
  },
  {
    name: "Electric Sapphire",
    hex: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.7)",
    borderClass: "border-blue-400/50 shadow-blue-500/25",
    textClass: "text-blue-400",
    badgeBg: "bg-blue-950/80 text-blue-300 border-blue-500/40",
    styleName: "Singularity Accelerator",
  },
];

interface AutoMorphingQuantumLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onThemeUpdate?: (theme: QuantumThemeColor) => void;
  showCaption?: boolean;
}

export const AutoMorphingQuantumLogo: React.FC<AutoMorphingQuantumLogoProps> = ({
  size = "md",
  className = "",
  onThemeUpdate,
  showCaption = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  const dimensions =
    size === "sm"
      ? { w: 46, h: 46 }
      : size === "lg"
      ? { w: 90, h: 90 }
      : { w: 58, h: 58 };

  // Cycle automatically every 4.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % QUANTUM_THEMES.length);
    }, 4800);

    return () => clearInterval(timer);
  }, []);

  // Notify parent cleanly after render whenever currentIndex changes
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    onThemeUpdate?.(QUANTUM_THEMES[currentIndex]);
  }, [currentIndex, onThemeUpdate]);

  // Three.js high-definition UHD canvas with automatic geometry morphing & color transitions
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = dimensions.w;
    const height = dimensions.h;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5)); // Ultra HD clarity
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Core Mesh (Glow Singularity)
    const coreGeo = new THREE.SphereGeometry(0.42, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(QUANTUM_THEMES[0].hex),
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // 2. Style Groups
    // Style 0: Orbital Rings (Reactor)
    const reactorGroup = new THREE.Group();
    const ring1Geo = new THREE.TorusGeometry(1.05, 0.035, 12, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(QUANTUM_THEMES[0].hex),
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    reactorGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.25, 0.035, 12, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(QUANTUM_THEMES[0].hex),
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    reactorGroup.add(ring2);
    rootGroup.add(reactorGroup);

    // Style 1: Icosahedron Wireframe
    const icoGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const icoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(QUANTUM_THEMES[0].hex),
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    rootGroup.add(icoMesh);

    // Style 2: Hypercube Tesseract (Nested Boxes)
    const tesseractGroup = new THREE.Group();
    const outerBoxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(QUANTUM_THEMES[0].hex),
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const outerBox = new THREE.Mesh(outerBoxGeo, boxMat);
    tesseractGroup.add(outerBox);

    const innerBoxGeo = new THREE.BoxGeometry(0.65, 0.65, 0.65);
    const innerBoxMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(QUANTUM_THEMES[0].hex),
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const innerBox = new THREE.Mesh(innerBoxGeo, innerBoxMat);
    tesseractGroup.add(innerBox);
    rootGroup.add(tesseractGroup);

    // Style 3: Particle Halo
    const partCount = 48;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      const theta = (i / partCount) * Math.PI * 2;
      partPos[i * 3] = Math.cos(theta) * 1.3;
      partPos[i * 3 + 1] = Math.sin(theta) * 1.3;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.08,
      color: new THREE.Color(QUANTUM_THEMES[0].hex),
      transparent: true,
      opacity: 0.85,
    });
    const haloPoints = new THREE.Points(partGeo, partMat);
    rootGroup.add(haloPoints);

    const clock = new THREE.Clock();
    let currentColor = new THREE.Color(QUANTUM_THEMES[0].hex);
    let targetColor = new THREE.Color(QUANTUM_THEMES[0].hex);

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      const activeIdx = currentIndexRef.current;
      targetColor.set(QUANTUM_THEMES[activeIdx].hex);
      currentColor.lerp(targetColor, 0.04);

      // Apply interpolated color
      coreMat.color.copy(currentColor);
      ring1Mat.color.copy(currentColor);
      ring2Mat.color.copy(currentColor);
      icoMat.color.copy(currentColor);
      boxMat.color.copy(currentColor);
      innerBoxMat.color.copy(currentColor);
      partMat.color.copy(currentColor);

      // Morph visibility based on active style index
      const styleSlot = activeIdx % 3;
      if (styleSlot === 0) {
        // Reactor Core Active
        ring1Mat.opacity = THREE.MathUtils.lerp(ring1Mat.opacity, 0.85, 0.06);
        ring2Mat.opacity = THREE.MathUtils.lerp(ring2Mat.opacity, 0.7, 0.06);
        icoMat.opacity = THREE.MathUtils.lerp(icoMat.opacity, 0.0, 0.06);
        boxMat.opacity = THREE.MathUtils.lerp(boxMat.opacity, 0.0, 0.06);
        innerBoxMat.opacity = THREE.MathUtils.lerp(innerBoxMat.opacity, 0.0, 0.06);
      } else if (styleSlot === 1) {
        // Icosahedron Active
        ring1Mat.opacity = THREE.MathUtils.lerp(ring1Mat.opacity, 0.0, 0.06);
        ring2Mat.opacity = THREE.MathUtils.lerp(ring2Mat.opacity, 0.0, 0.06);
        icoMat.opacity = THREE.MathUtils.lerp(icoMat.opacity, 0.9, 0.06);
        boxMat.opacity = THREE.MathUtils.lerp(boxMat.opacity, 0.0, 0.06);
        innerBoxMat.opacity = THREE.MathUtils.lerp(innerBoxMat.opacity, 0.0, 0.06);
      } else {
        // Tesseract Active
        ring1Mat.opacity = THREE.MathUtils.lerp(ring1Mat.opacity, 0.0, 0.06);
        ring2Mat.opacity = THREE.MathUtils.lerp(ring2Mat.opacity, 0.0, 0.06);
        icoMat.opacity = THREE.MathUtils.lerp(icoMat.opacity, 0.0, 0.06);
        boxMat.opacity = THREE.MathUtils.lerp(boxMat.opacity, 0.85, 0.06);
        innerBoxMat.opacity = THREE.MathUtils.lerp(innerBoxMat.opacity, 0.95, 0.06);
      }

      // Continuous Fluid Rotations
      rootGroup.rotation.y = time * 0.6;
      rootGroup.rotation.x = Math.sin(time * 0.4) * 0.25;

      ring1.rotation.z += 0.03;
      ring2.rotation.x += 0.025;

      icoMesh.rotation.x = time * 0.8;
      icoMesh.rotation.y = time * 0.5;

      outerBox.rotation.x = time * 0.4;
      outerBox.rotation.y = time * 0.6;
      innerBox.rotation.x = -time * 0.8;
      innerBox.rotation.y = -time * 0.5;

      haloPoints.rotation.z = -time * 0.3;

      // Pulse
      const pulse = 1.0 + Math.sin(time * 3.0) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      outerBoxGeo.dispose();
      innerBoxGeo.dispose();
      boxMat.dispose();
      innerBoxMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [dimensions.w, dimensions.h]);

  const activeTheme = QUANTUM_THEMES[currentIndex];

  const handleManualCycle = () => {
    soundEffects.playClick();
    setCurrentIndex((prev) => (prev + 1) % QUANTUM_THEMES.length);
  };

  return (
    <div
      onClick={handleManualCycle}
      className={`relative inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      title={`Auto-Morphing Quantum Logo: ${activeTheme.name} • ${activeTheme.styleName} (Click to switch)`}
    >
      {/* Three.js UHD Canvas Container */}
      <div
        className="relative rounded-2xl p-1 flex items-center justify-center transition-all duration-700 bg-slate-950/80 border"
        style={{
          borderColor: activeTheme.hex,
          boxShadow: `0 0 16px ${activeTheme.glow}`,
          width: dimensions.w + 10,
          height: dimensions.h + 10,
        }}
      >
        <div ref={mountRef} style={{ width: dimensions.w, height: dimensions.h }} />

        {/* Live Active Pulsing Indicator */}
        <span
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
          style={{ backgroundColor: activeTheme.hex }}
        ></span>
        <span
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: activeTheme.hex }}
        ></span>
      </div>

      {/* Optional Caption */}
      {showCaption && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className="font-orbitron font-extrabold text-sm tracking-wider transition-colors duration-700"
              style={{ color: activeTheme.hex }}
            >
              Q-NEXUS
            </span>
            <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">
              UHD 4K
            </span>
          </div>
          <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1 transition-all duration-500">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTheme.hex }}></span>
            <span className="truncate max-w-[140px]">{activeTheme.styleName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
