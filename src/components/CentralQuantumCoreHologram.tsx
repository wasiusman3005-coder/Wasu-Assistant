import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Sparkles,
  Zap,
  Play,
  Pause,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  Flame,
  Radio,
  Activity,
  Layers,
  Atom,
  Box,
  CircleDot,
  Compass,
  Cpu,
  Shield,
  Sun,
  X,
} from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { LanguageCode, VoiceGender, JarvisInterfaceThemeId } from "../types";
import { QUANTUM_FIELDS_DATA } from "../data/jarvisCatalog";

export interface QuantumCoreDesign {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export const QUANTUM_DESIGNS: QuantumCoreDesign[] = [
  {
    id: "tachyon_torus",
    name: "Tachyon Torus Reactor",
    category: "Singularity Core",
    description: "Interlocking cosmic toruses spinning on 3 axes around a plasma singularity",
    icon: "atom",
  },
  {
    id: "hypercube_tesseract",
    name: "4D Hypercube Tesseract",
    category: "Higher Dimension",
    description: "Nested 4D tumbling wireframe hypercube with luminous corner vertex nodes",
    icon: "box",
  },
  {
    id: "quantum_merkaba",
    name: "Sacred MerKaBa Star",
    category: "Sacred Geometry",
    description: "Interlocking dual counter-rotating tetrahedrons with radiant photon vertices",
    icon: "sparkles",
  },
  {
    id: "crystalline_icosahedron",
    name: "Crystalline Icosahedron",
    category: "Geodesic Diamond",
    description: "20-faced sacred geodesic lattice with pulsating quantum node vertices",
    icon: "layers",
  },
  {
    id: "bohr_orbital_atom",
    name: "Bohr Orbital Quark Core",
    category: "Atomic Matrix",
    description: "Triple elliptical electron probability clouds orbiting a quark nucleus",
    icon: "atom",
  },
  {
    id: "chronos_gyroscope",
    name: "Chronos Tachyon Gyroscope",
    category: "Temporal Engine",
    description: "Multi-axis quantum gimbal chronometer rings bending local time-space",
    icon: "compass",
  },
  {
    id: "neural_synapse_mesh",
    name: "Neural Synapse Lattice",
    category: "Cyber Constellation",
    description: "Holographic interconnected neural synapse star cluster with firing pulses",
    icon: "cpu",
  },
  {
    id: "tachyon_aegis_shield",
    name: "Tachyon Aegis Hexa-Core",
    category: "Defense Matrix",
    description: "Pulsing multi-layered cyber honeycomb energy shield with rotating rings",
    icon: "shield",
  },
  {
    id: "relativistic_pulsar",
    name: "Relativistic Pulsar Singularity",
    category: "Astrophysics",
    description: "Expanding and contracting photon accretion disk with relativistic beam jets",
    icon: "sun",
  },
  {
    id: "celestial_lotus_toroid",
    name: "Celestial Quantum Lotus",
    category: "Harmonic Field",
    description: "Multi-petal geometric mandala of resonant glowing tachyon energy arcs",
    icon: "circle-dot",
  },
];

export interface QuantumColorPalette {
  name: string;
  hex: string;
  secondaryHex: string;
  glow: string;
  cssGlowClass: string;
  borderClass: string;
  bgGlow: string;
}

export const QUANTUM_PALETTES: QuantumColorPalette[] = [
  {
    name: "Tachyon Cyan",
    hex: "#00f5ff",
    secondaryHex: "#0284c7",
    glow: "rgba(0, 245, 255, 0.9)",
    cssGlowClass: "shadow-[0_0_50px_rgba(0,245,255,0.85)]",
    borderClass: "border-cyan-400",
    bgGlow: "rgba(0, 245, 255, 0.25)",
  },
  {
    name: "Nebula Violet",
    hex: "#a855f7",
    secondaryHex: "#7e22ce",
    glow: "rgba(168, 85, 247, 0.9)",
    cssGlowClass: "shadow-[0_0_50px_rgba(168,85,247,0.85)]",
    borderClass: "border-purple-400",
    bgGlow: "rgba(168, 85, 247, 0.25)",
  },
  {
    name: "Emerald Matrix",
    hex: "#10b981",
    secondaryHex: "#047857",
    glow: "rgba(16, 185, 129, 0.9)",
    cssGlowClass: "shadow-[0_0_50px_rgba(16,185,129,0.85)]",
    borderClass: "border-emerald-400",
    bgGlow: "rgba(16, 185, 129, 0.25)",
  },
  {
    name: "Solar Flare Gold",
    hex: "#f59e0b",
    secondaryHex: "#d97706",
    glow: "rgba(245, 158, 11, 0.9)",
    cssGlowClass: "shadow-[0_0_50px_rgba(245,158,11,0.85)]",
    borderClass: "border-amber-400",
    bgGlow: "rgba(245, 158, 11, 0.25)",
  },
  {
    name: "Supernova Crimson",
    hex: "#f43f5e",
    secondaryHex: "#be123c",
    glow: "rgba(244, 63, 94, 0.9)",
    cssGlowClass: "shadow-[0_0_50px_rgba(244,63,94,0.85)]",
    borderClass: "border-rose-400",
    bgGlow: "rgba(244, 63, 94, 0.25)",
  },
  {
    name: "Electric Sapphire",
    hex: "#3b82f6",
    secondaryHex: "#1d4ed8",
    glow: "rgba(59, 130, 246, 0.9)",
    cssGlowClass: "shadow-[0_0_50px_rgba(59,130,246,0.85)]",
    borderClass: "border-blue-400",
    bgGlow: "rgba(59, 130, 246, 0.25)",
  },
  {
    name: "Hyperion Lime",
    hex: "#84cc16",
    secondaryHex: "#4d7c0f",
    glow: "rgba(132, 204, 22, 0.9)",
    cssGlowClass: "shadow-[0_0_50px_rgba(132,204,22,0.85)]",
    borderClass: "border-lime-400",
    bgGlow: "rgba(132, 204, 22, 0.25)",
  },
  {
    name: "Quantum Magenta",
    hex: "#ec4899",
    secondaryHex: "#be185d",
    glow: "rgba(236, 72, 153, 0.9)",
    cssGlowClass: "shadow-[0_0_50px_rgba(236,72,153,0.85)]",
    borderClass: "border-pink-400",
    bgGlow: "rgba(236, 72, 153, 0.25)",
  },
];

interface CentralQuantumCoreHologramProps {
  coherence: number;
  language: LanguageCode;
  voiceGender: VoiceGender;
  activeInterfaceTheme?: JarvisInterfaceThemeId;
  onColorChange?: (color: QuantumColorPalette) => void;
  onDesignChange?: (design: QuantumCoreDesign) => void;
  isOverdriveActive?: boolean;
  onToggleOverdrive?: () => void;
}

export const CentralQuantumCoreHologram: React.FC<CentralQuantumCoreHologramProps> = ({
  coherence,
  language,
  voiceGender,
  activeInterfaceTheme = "quantum_cockpit",
  onColorChange,
  onDesignChange,
  isOverdriveActive = false,
  onToggleOverdrive,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const matchedField =
    QUANTUM_FIELDS_DATA.find((f) => f.themeId === activeInterfaceTheme) ||
    QUANTUM_FIELDS_DATA[0];

  // Active indices
  const [currentDesignIdx, setCurrentDesignIdx] = useState(matchedField.designIndex);
  const [currentColorIdx, setCurrentColorIdx] = useState(matchedField.colorIndex);
  const [isAutoMorphing, setIsAutoMorphing] = useState(true);
  const [morphSpeedSec, setMorphSpeedSec] = useState<number>(4.2);

  // Exciting interaction states
  const [shockwaveActive, setShockwaveActive] = useState(false);
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [stressProgress, setStressProgress] = useState(0);
  const [stressAlertText, setStressAlertText] = useState("");
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [showControlsBar, setShowControlsBar] = useState(true);

  // References for Three.js animation loops
  const designIdxRef = useRef(matchedField.designIndex);
  const colorIdxRef = useRef(matchedField.colorIndex);
  const isOverdriveRef = useRef(isOverdriveActive);
  isOverdriveRef.current = isOverdriveActive;

  // Snap 3D Logo to match Quantum Field when theme changes
  useEffect(() => {
    const field = QUANTUM_FIELDS_DATA.find((f) => f.themeId === activeInterfaceTheme);
    if (field) {
      setCurrentDesignIdx(field.designIndex);
      setCurrentColorIdx(field.colorIndex);
    }
  }, [activeInterfaceTheme]);

  // Sync design & color changes cleanly after render (never inside state updaters)
  useEffect(() => {
    designIdxRef.current = currentDesignIdx;
    onDesignChange?.(QUANTUM_DESIGNS[currentDesignIdx]);
  }, [currentDesignIdx, onDesignChange]);

  useEffect(() => {
    colorIdxRef.current = currentColorIdx;
    onColorChange?.(QUANTUM_PALETTES[currentColorIdx]);
  }, [currentColorIdx, onColorChange]);

  const currentDesign = QUANTUM_DESIGNS[currentDesignIdx];
  const currentPalette = QUANTUM_PALETTES[currentColorIdx];

  // Continuous auto-morphing of Logo Designs AND Colors
  useEffect(() => {
    if (!isAutoMorphing) return;

    const interval = setInterval(() => {
      setCurrentDesignIdx((prevDesign) => (prevDesign + 1) % QUANTUM_DESIGNS.length);
      setCurrentColorIdx((prevColor) => (prevColor + 1) % QUANTUM_PALETTES.length);
      soundEffects.playResonanceChime(520 + (designIdxRef.current % 5) * 60);
    }, morphSpeedSec * 1000);

    return () => clearInterval(interval);
  }, [isAutoMorphing, morphSpeedSec]);

  // =========================================================================
  // THREE.JS HIGH DEFINITION SCENE FOR 10 QUANTUM DESIGNS
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 240;
    const height = 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.4;

    const isSoftwareGl = (() => {
      const gl = document.createElement("canvas").getContext("webgl2");
      if (!gl) return true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 3));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Common Singularity Core Sphere
    const coreSphereGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const coreSphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(currentPalette.hex),
      transparent: true,
      opacity: 0.9,
    });
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    masterGroup.add(coreSphere);

    // -------------------------------------------------------------
    // DESIGN 0: Tachyon Torus Reactor
    // -------------------------------------------------------------
    const d0Group = new THREE.Group();
    const torus0A = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.035, 12, 60),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0.85 })
    );
    torus0A.rotation.x = Math.PI / 3;
    const torus0B = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.03, 12, 60),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0.75 })
    );
    torus0B.rotation.y = Math.PI / 3;
    const torus0C = new THREE.Mesh(
      new THREE.TorusGeometry(1.38, 0.025, 12, 60),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0.6 })
    );
    torus0C.rotation.z = Math.PI / 4;
    d0Group.add(torus0A, torus0B, torus0C);
    masterGroup.add(d0Group);

    // -------------------------------------------------------------
    // DESIGN 1: 4D Hypercube Tesseract
    // -------------------------------------------------------------
    const d1Group = new THREE.Group();
    const outerBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.3, 1.3),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), wireframe: true, transparent: true, opacity: 0 })
    );
    const innerBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), wireframe: true, transparent: true, opacity: 0 })
    );
    d1Group.add(outerBox, innerBox);
    masterGroup.add(d1Group);

    // -------------------------------------------------------------
    // DESIGN 2: Sacred MerKaBa Star (Dual Tetrahedrons)
    // -------------------------------------------------------------
    const d2Group = new THREE.Group();
    const tet1 = new THREE.Mesh(
      new THREE.TetrahedronGeometry(1.15, 0),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), wireframe: true, transparent: true, opacity: 0 })
    );
    const tet2 = new THREE.Mesh(
      new THREE.TetrahedronGeometry(1.15, 0),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), wireframe: true, transparent: true, opacity: 0 })
    );
    tet2.rotation.z = Math.PI;
    tet2.rotation.y = Math.PI / 4;
    d2Group.add(tet1, tet2);
    masterGroup.add(d2Group);

    // -------------------------------------------------------------
    // DESIGN 3: Crystalline Icosahedron
    // -------------------------------------------------------------
    const d3Group = new THREE.Group();
    const icoMesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.1, 0),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), wireframe: true, transparent: true, opacity: 0 })
    );
    const icoInnerMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), wireframe: true, transparent: true, opacity: 0 })
    );
    d3Group.add(icoMesh, icoInnerMesh);
    masterGroup.add(d3Group);

    // -------------------------------------------------------------
    // DESIGN 4: Bohr Orbital Quark Atom
    // -------------------------------------------------------------
    const d4Group = new THREE.Group();
    const orbit1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.025, 8, 48),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0 })
    );
    orbit1.rotation.x = Math.PI / 3;
    const orbit2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.025, 8, 48),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0 })
    );
    orbit2.rotation.y = Math.PI / 3;
    const orbit3 = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.025, 8, 48),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0 })
    );
    orbit3.rotation.z = Math.PI / 2.5;
    d4Group.add(orbit1, orbit2, orbit3);
    masterGroup.add(d4Group);

    // -------------------------------------------------------------
    // DESIGN 5: Chronos Tachyon Gyroscope
    // -------------------------------------------------------------
    const d5Group = new THREE.Group();
    const gyro1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.04, 8, 40),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0 })
    );
    const gyro2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.04, 8, 40),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0 })
    );
    const gyro3 = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.04, 8, 40),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0 })
    );
    d5Group.add(gyro1, gyro2, gyro3);
    masterGroup.add(d5Group);

    // -------------------------------------------------------------
    // DESIGN 6: Neural Synapse Lattice (Particles & Constellations)
    // -------------------------------------------------------------
    const d6Group = new THREE.Group();
    const synapseCount = 64;
    const synapseGeo = new THREE.BufferGeometry();
    const synapsePos = new Float32Array(synapseCount * 3);
    for (let i = 0; i < synapseCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.8 + Math.random() * 0.6;
      synapsePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      synapsePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      synapsePos[i * 3 + 2] = r * Math.cos(phi);
    }
    synapseGeo.setAttribute("position", new THREE.BufferAttribute(synapsePos, 3));
    const synapseMat = new THREE.PointsMaterial({
      size: 0.09,
      color: new THREE.Color(currentPalette.hex),
      transparent: true,
      opacity: 0,
    });
    const synapsePoints = new THREE.Points(synapseGeo, synapseMat);
    d6Group.add(synapsePoints);
    masterGroup.add(d6Group);

    // -------------------------------------------------------------
    // DESIGN 7: Tachyon Aegis Hexa-Core Shield
    // -------------------------------------------------------------
    const d7Group = new THREE.Group();
    const hexCylinder1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 0.1, 6),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), wireframe: true, transparent: true, opacity: 0 })
    );
    const hexCylinder2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.15, 6),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), wireframe: true, transparent: true, opacity: 0 })
    );
    d7Group.add(hexCylinder1, hexCylinder2);
    masterGroup.add(d7Group);

    // -------------------------------------------------------------
    // DESIGN 8: Relativistic Pulsar Singularity
    // -------------------------------------------------------------
    const d8Group = new THREE.Group();
    const pulsarDisk = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 1.45, 32),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), side: THREE.DoubleSide, transparent: true, opacity: 0, wireframe: true })
    );
    pulsarDisk.rotation.x = Math.PI / 2;
    const jetBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.12, 2.4, 12),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0 })
    );
    d8Group.add(pulsarDisk, jetBeam);
    masterGroup.add(d8Group);

    // -------------------------------------------------------------
    // DESIGN 9: Celestial Quantum Lotus
    // -------------------------------------------------------------
    const d9Group = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const petal = new THREE.Mesh(
        new THREE.TorusGeometry(0.9, 0.02, 8, 24, Math.PI),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(currentPalette.hex), transparent: true, opacity: 0 })
      );
      petal.rotation.z = (i * Math.PI) / 3;
      d9Group.add(petal);
    }
    masterGroup.add(d9Group);

    // List of groups for quick opacity morphing
    const allDesignGroups = [
      d0Group,
      d1Group,
      d2Group,
      d3Group,
      d4Group,
      d5Group,
      d6Group,
      d7Group,
      d8Group,
      d9Group,
    ];

    // Background Particle Field for the Pedestal
    const haloCount = 60;
    const haloGeo = new THREE.BufferGeometry();
    const haloPos = new Float32Array(haloCount * 3);
    for (let i = 0; i < haloCount; i++) {
      const angle = (i / haloCount) * Math.PI * 2;
      const radius = 1.35 + (Math.random() - 0.5) * 0.4;
      haloPos[i * 3] = Math.cos(angle) * radius;
      haloPos[i * 3 + 1] = Math.sin(angle) * radius;
      haloPos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    haloGeo.setAttribute("position", new THREE.BufferAttribute(haloPos, 3));
    const haloMat = new THREE.PointsMaterial({
      size: 0.07,
      color: new THREE.Color(currentPalette.hex),
      transparent: true,
      opacity: 0.8,
    });
    const haloPoints = new THREE.Points(haloGeo, haloMat);
    masterGroup.add(haloPoints);

    // Animation Clock
    const clock = new THREE.Clock();
    const interpolatedColor = new THREE.Color(currentPalette.hex);
    const targetColor = new THREE.Color(currentPalette.hex);

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth color interpolation
      const activeColor = QUANTUM_PALETTES[colorIdxRef.current];
      targetColor.set(activeColor.hex);
      interpolatedColor.lerp(targetColor, 0.05);

      // Apply color to all materials
      coreSphereMat.color.copy(interpolatedColor);
      haloMat.color.copy(interpolatedColor);
      synapseMat.color.copy(interpolatedColor);

      allDesignGroups.forEach((group) => {
        group.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshBasicMaterial;
            mat.color.copy(interpolatedColor);
          }
        });
      });

      // Opacity morphing between 10 designs
      const activeDesignIdx = designIdxRef.current;
      allDesignGroups.forEach((group, idx) => {
        const isTarget = idx === activeDesignIdx;
        const targetOpacity = isTarget ? 0.88 : 0.0;
        group.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = child.material as THREE.MeshBasicMaterial;
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
          }
        });
      });
      synapseMat.opacity = THREE.MathUtils.lerp(synapseMat.opacity, activeDesignIdx === 6 ? 0.95 : 0.0, 0.08);

      // Speed boost multiplier if Overdrive is on
      const speedMultiplier = isOverdriveRef.current ? 3.4 : 1.0;

      // Group continuous spatial rotations
      masterGroup.rotation.y = time * 0.55 * speedMultiplier;
      masterGroup.rotation.x = Math.sin(time * 0.35 * speedMultiplier) * 0.22;

      // Specific design dynamic motions
      torus0A.rotation.z += 0.02 * speedMultiplier;
      torus0B.rotation.x += 0.025 * speedMultiplier;
      torus0C.rotation.y += 0.015 * speedMultiplier;

      outerBox.rotation.x = time * 0.4 * speedMultiplier;
      outerBox.rotation.y = time * 0.6 * speedMultiplier;
      innerBox.rotation.x = -time * 0.7 * speedMultiplier;
      innerBox.rotation.y = -time * 0.5 * speedMultiplier;

      tet1.rotation.y = time * 0.8 * speedMultiplier;
      tet2.rotation.y = -time * 0.8 * speedMultiplier;

      icoMesh.rotation.x = time * 0.5 * speedMultiplier;
      icoMesh.rotation.z = time * 0.4 * speedMultiplier;
      icoInnerMesh.rotation.y = -time * 0.9 * speedMultiplier;

      orbit1.rotation.z += 0.03 * speedMultiplier;
      orbit2.rotation.z -= 0.025 * speedMultiplier;
      orbit3.rotation.y += 0.035 * speedMultiplier;

      gyro1.rotation.x += 0.03 * speedMultiplier;
      gyro2.rotation.y += 0.04 * speedMultiplier;
      gyro3.rotation.z += 0.05 * speedMultiplier;

      hexCylinder1.rotation.y = time * 0.6 * speedMultiplier;
      hexCylinder2.rotation.y = -time * 0.9 * speedMultiplier;

      pulsarDisk.rotation.z = time * 1.5 * speedMultiplier;
      jetBeam.rotation.z = Math.sin(time * 3.0) * 0.05;

      d9Group.rotation.z = time * 0.3 * speedMultiplier;
      haloPoints.rotation.z = -time * 0.25 * speedMultiplier;

      // Pulse core sphere
      const pulseRate = isOverdriveRef.current ? 8.0 : 3.2;
      const pulseAmp = isOverdriveRef.current ? 0.16 : 0.08;
      const pulse = 1.0 + Math.sin(time * pulseRate) * pulseAmp;
      coreSphere.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      coreSphereGeo.dispose();
      coreSphereMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      synapseGeo.dispose();
      synapseMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // =========================================================================
  // INTERACTIVE HANDLERS (MAZE KA EXPERIENCE)
  // =========================================================================

  // 1. Kinetic Shockwave Discharge on Core Click
  const handleCoreClick = () => {
    soundEffects.playShockwave();
    setShockwaveActive(true);
    setTimeout(() => setShockwaveActive(false), 900);

    // Speak sci-fi acknowledgment in user's preferred language
    const msg =
      language === "pa"
        ? `Tachyon Reactor bilkul tezz ae Wasi paji! Coherence ${coherence.toFixed(2)}% ae.`
        : language === "en"
        ? `Quantum Reactor pulse released. Coherence ${coherence.toFixed(2)}%. Core design: ${currentDesign.name}.`
        : `Quantum Tachyon Reactor active hai. Coherence ${coherence.toFixed(2)}%. Sabhi data feeds synchronized hain.`;

    speechService.speak(msg, { lang: language, gender: voiceGender });
  };

  // 2. Manual Next / Prev Design
  const handleNextDesign = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playBeepConfirm();
    setCurrentDesignIdx((prev) => (prev + 1) % QUANTUM_DESIGNS.length);
  };

  const handlePrevDesign = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playBeepConfirm();
    setCurrentDesignIdx((prev) => (prev - 1 + QUANTUM_DESIGNS.length) % QUANTUM_DESIGNS.length);
  };

  // 3. Manual Next Color
  const handleNextColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playClick();
    setCurrentColorIdx((prev) => (prev + 1) % QUANTUM_PALETTES.length);
  };

  // 4. Overdrive Toggle
  const handleToggleOverdrive = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playQuantumWarp();
    onToggleOverdrive?.();
  };

  // 5. Stress Test Reactor Simulation (Thrilling interactive feature!)
  const handleRunStressTest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStressTesting) return;

    setIsStressTesting(true);
    setStressProgress(15);
    setStressAlertText("INITIATING TACHYON FLUX SURGE...");
    soundEffects.playAlert();

    const t1 = setTimeout(() => {
      setStressProgress(45);
      setStressAlertText("MAGNETIC CONFINEMENT 88% — FLUX OVERLOAD SIMULATION");
      soundEffects.playAlert();
    }, 1200);

    const t2 = setTimeout(() => {
      setStressProgress(78);
      setStressAlertText("CRYOGENIC NEUTRALIZER ENGAGED — COOLING CORE...");
      soundEffects.playScan();
    }, 2500);

    const t3 = setTimeout(() => {
      setStressProgress(100);
      setStressAlertText("STRESS TEST COMPLETE: 100% COHERENCE STABILIZED");
      soundEffects.playQuantumStartup();
      speechService.speak("Stress test passed with 100% quantum efficiency. Reactor is completely stable.", {
        lang: language,
        gender: voiceGender,
      });
      setTimeout(() => {
        setIsStressTesting(false);
        setStressProgress(0);
        setStressAlertText("");
      }, 2500);
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Visual Shockwave Expansion Ring on Core Click */}
      {shockwaveActive && (
        <div
          className="absolute z-30 pointer-events-none rounded-full animate-ping border-4"
          style={{
            borderColor: currentPalette.hex,
            width: "360px",
            height: "360px",
            boxShadow: `0 0 100px ${currentPalette.glow}`,
          }}
        />
      )}

      {/* ================================================================= */}
      {/* CIRCULAR PEDESTAL WITH LIVE CONCENTRIC RETICLES & THREE.JS LOGO */}
      {/* ================================================================= */}
      <div
        onClick={handleCoreClick}
        className="relative w-52 h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-[1.04]"
        title="Click to fire Kinetic Shockwave & Recalibrate Core"
      >
        {/* Outermost Glowing Ring with Dynamic Color & Shadow */}
        <div
          className="absolute inset-0 rounded-full border-2 transition-all duration-700 pedestal-pulse"
          style={{
            borderColor: `${currentPalette.hex}99`,
            boxShadow: `0 0 55px ${currentPalette.glow}`,
          }}
        />

        {/* Outer Dashed Segmented Reticle (Rotates smoothly) */}
        <div
          className="absolute inset-2 md:inset-3 rounded-full border-2 border-dashed transition-all duration-700"
          style={{
            borderColor: `${currentPalette.hex}80`,
            animation: isOverdriveActive ? "spin 3s linear infinite" : "spin 18s linear infinite",
          }}
        />

        {/* Inner Counter-Rotating Reticle with Quantum Tick Hash Marks */}
        <div
          className="absolute inset-6 md:inset-8 rounded-full border border-dotted transition-all duration-700"
          style={{
            borderColor: `${currentPalette.secondaryHex}99`,
            animation: isOverdriveActive ? "spin-reverse 2.2s linear infinite" : "spin-reverse 12s linear infinite",
          }}
        />

        {/* Central UHD Glass Sphere Housing Three.js Morphing Geometries */}
        <div
          className="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center backdrop-blur-xl border-2 transition-all duration-700 overflow-hidden"
          style={{
            background: `radial-gradient(circle at center, ${currentPalette.hex}25 0%, #030712f0 85%)`,
            borderColor: currentPalette.hex,
            boxShadow: `inset 0 0 35px ${currentPalette.glow}, 0 0 45px ${currentPalette.glow}`,
          }}
        >
          {/* Three.js Canvas Container */}
          <div ref={mountRef} className="w-[240px] h-[240px] absolute inset-0 flex items-center justify-center pointer-events-none scale-75 md:scale-90" />

          {/* Core HUD Overlay Information */}
          <div className="absolute bottom-2 z-10 flex flex-col items-center pointer-events-none">
            <span
              className="text-[9px] md:text-[10px] font-orbitron font-extrabold tracking-wider transition-colors duration-700"
              style={{ color: currentPalette.hex, textShadow: `0 0 10px ${currentPalette.hex}` }}
            >
              {currentDesign.name.toUpperCase()}
            </span>
            <div className="flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: currentPalette.hex }}
              />
              <span className="text-[8px] font-mono text-emerald-300 font-bold">
                {coherence.toFixed(2)}% Q-COHERENCE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Concentric Base Oval Rings on the Desk Surface (Reference Image Exact Match) */}
      <div className="relative -mt-6 md:-mt-8 flex flex-col items-center pointer-events-none">
        <div
          className="w-60 md:w-76 h-14 rounded-[100%] border-2 transition-all duration-700 flex items-center justify-center"
          style={{
            background: `linear-gradient(to top, ${currentPalette.hex}40, rgba(3, 7, 18, 0.4))`,
            borderColor: `${currentPalette.hex}80`,
            boxShadow: `0 0 70px ${currentPalette.glow}`,
          }}
        >
          <div
            className="w-44 md:w-56 h-8 rounded-[100%] border transition-all duration-700 flex items-center justify-center"
            style={{
              borderColor: currentPalette.hex,
              backgroundColor: `${currentPalette.hex}30`,
              boxShadow: `0 0 35px ${currentPalette.glow}`,
            }}
          >
            <span className="text-[8px] md:text-[9px] font-mono text-white font-bold tracking-widest uppercase">
              {currentPalette.name} • {currentDesign.category}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* INTERACTIVE CONTROLS BAR ("DASHBOARD MAZE KA BNA DO") */}
      {/* ================================================================= */}
      <div className="relative z-20 mt-3 flex flex-col items-center gap-2 pointer-events-auto">
        {/* Toggle mini control bar */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-700/80 px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg shadow-black/60">
          {/* Prev Design Button */}
          <button
            onClick={handlePrevDesign}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Previous Quantum Design"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Auto-Morph Play/Pause */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playClick();
              setIsAutoMorphing(!isAutoMorphing);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition cursor-pointer"
            style={{
              backgroundColor: isAutoMorphing ? `${currentPalette.hex}25` : "#1e293b",
              color: isAutoMorphing ? currentPalette.hex : "#94a3b8",
              border: `1px solid ${isAutoMorphing ? currentPalette.hex : "#334155"}`,
            }}
            title={isAutoMorphing ? "Continuous auto-morphing ACTIVE (Click to Pause)" : "Auto-morphing PAUSED (Click to Play)"}
          >
            {isAutoMorphing ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
            <span>{isAutoMorphing ? "AUTO-MORPHING" : "PAUSED"}</span>
          </button>

          {/* Next Design Button */}
          <button
            onClick={handleNextDesign}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Next Quantum Design"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3 bg-slate-700 mx-0.5" />

          {/* Color Switcher */}
          <button
            onClick={handleNextColor}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono hover:scale-105 transition cursor-pointer"
            style={{
              backgroundColor: `${currentPalette.hex}30`,
              color: currentPalette.hex,
              border: `1px solid ${currentPalette.hex}60`,
            }}
            title="Click to switch Quantum Color Theme manually"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentPalette.hex, boxShadow: `0 0 8px ${currentPalette.hex}` }}
            />
            <span className="hidden sm:inline font-bold">{currentPalette.name}</span>
          </button>

          <span className="w-px h-3 bg-slate-700 mx-0.5" />

          {/* OVERDRIVE ⚡ Warp Button */}
          <button
            onClick={handleToggleOverdrive}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-bold transition cursor-pointer ${
              isOverdriveActive
                ? "bg-gradient-to-r from-amber-500 to-rose-600 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.8)]"
                : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
            }`}
            title="Toggle Warp Speed Reactor Overdrive"
          >
            <Zap className={`w-3 h-3 ${isOverdriveActive ? "text-yellow-300 animate-bounce" : "text-slate-400"}`} />
            <span>{isOverdriveActive ? "OVERDRIVE ON ⚡" : "OVERDRIVE"}</span>
          </button>

          {/* 3D Inspect Modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.playBeepConfirm();
              setIsInspectModalOpen(true);
            }}
            className="p-1 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition cursor-pointer"
            title="Open 3D Exploded Hologram Inspection View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Reactor Stress Test Simulation */}
          <button
            onClick={handleRunStressTest}
            disabled={isStressTesting}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition cursor-pointer ${
              isStressTesting
                ? "bg-rose-950/80 text-rose-300 border border-rose-500 animate-pulse"
                : "bg-slate-900 text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-700"
            }`}
            title="Simulate Quantum Reactor Stress Test"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">{isStressTesting ? "TESTING..." : "STRESS TEST"}</span>
          </button>
        </div>

        {/* Live Stress Test Progress Banner (if active) */}
        {isStressTesting && (
          <div className="w-72 bg-slate-950/95 border border-rose-500/80 rounded-xl p-2 shadow-2xl shadow-rose-950 flex flex-col gap-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 animate-bounce" />
                <span>{stressAlertText}</span>
              </span>
              <span className="text-amber-400 font-bold">{stressProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${stressProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 3D FULL INSPECT & EXPLODED VIEW MODAL */}
      {/* ================================================================= */}
      {isInspectModalOpen && (
        <div
          onClick={() => setIsInspectModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#030712] border-2 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
            style={{
              borderColor: currentPalette.hex,
              boxShadow: `0 0 60px ${currentPalette.glow}`,
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: currentPalette.hex }} />
                <div>
                  <h3 className="text-lg font-orbitron font-extrabold text-white">
                    QUANTUM HOLOGRAPHIC CORE INSPECTOR
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    High-Definition 3D Geometry Laboratory • 10 Morphing Designs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInspectModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Design Highlight */}
            <div
              className="p-3 rounded-2xl border flex items-center justify-between"
              style={{
                backgroundColor: `${currentPalette.hex}15`,
                borderColor: `${currentPalette.hex}50`,
              }}
            >
              <div>
                <div className="text-xs font-mono uppercase text-slate-400">CURRENT GEOMETRY DESIGN</div>
                <div className="text-base font-orbitron font-bold text-white flex items-center gap-2 mt-0.5">
                  <span style={{ color: currentPalette.hex }}>{currentDesign.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                    {currentDesign.category}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1">{currentDesign.description}</div>
              </div>
              <div
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
                style={{
                  backgroundColor: currentPalette.hex,
                  color: "#030712",
                }}
              >
                {currentPalette.name}
              </div>
            </div>

            {/* 10 Design Picker Grid */}
            <div>
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                <span>SELECT FROM 10 QUANTUM DESIGNS:</span>
                <span className="text-cyan-400">10 / 10 LOADED</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {QUANTUM_DESIGNS.map((design, idx) => {
                  const isSelected = idx === currentDesignIdx;
                  return (
                    <button
                      key={design.id}
                      onClick={() => {
                        soundEffects.playBeepConfirm();
                        setCurrentDesignIdx(idx);
                        designIdxRef.current = idx;
                        onDesignChange?.(design);
                      }}
                      className={`p-2 rounded-xl text-left border transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 border-2 font-bold shadow-lg"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
                      }`}
                      style={{
                        borderColor: isSelected ? currentPalette.hex : undefined,
                        boxShadow: isSelected ? `0 0 15px ${currentPalette.glow}` : undefined,
                      }}
                    >
                      <span className="text-[9px] font-mono opacity-70">0{idx + 1}</span>
                      <span className={`text-[10px] font-orbitron line-clamp-1 mt-1 ${isSelected ? "text-white" : ""}`}>
                        {design.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette Picker */}
            <div>
              <div className="text-xs font-mono text-slate-400 mb-2">SELECT FROM 8 QUANTUM COLOR ENERGIES:</div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {QUANTUM_PALETTES.map((pal, idx) => {
                  const isSelected = idx === currentColorIdx;
                  return (
                    <button
                      key={pal.name}
                      onClick={() => {
                        soundEffects.playClick();
                        setCurrentColorIdx(idx);
                        colorIdxRef.current = idx;
                        onColorChange?.(pal);
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        isSelected ? "scale-105 border-white" : "border-slate-800 hover:border-slate-700"
                      }`}
                      style={{ backgroundColor: `${pal.hex}20` }}
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: pal.hex, boxShadow: `0 0 10px ${pal.hex}` }}
                      />
                      <span className="text-[8px] font-mono text-slate-300 truncate w-full text-center">
                        {pal.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-xs font-mono text-slate-400">
                Coherence: <strong className="text-emerald-400">{coherence.toFixed(2)}%</strong>
              </span>
              <button
                onClick={() => setIsInspectModalOpen(false)}
                className="px-4 py-1.5 rounded-xl font-orbitron font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                CLOSE INSPECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
