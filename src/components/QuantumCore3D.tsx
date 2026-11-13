import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface QuantumCore3DProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  coherence?: number;
  className?: string;
  onClick?: () => void;
}

export const QuantumCore3D: React.FC<QuantumCore3DProps> = ({
  isSpeaking = false,
  isListening = false,
  coherence = 99.98,
  className = "",
  onClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Quantum Nucleus Group
    const nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);

    // Inner Core Icosahedron Wireframe
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    nucleusGroup.add(coreMesh);

    // Inner Solid Glowing Sphere
    const innerGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7, // Purple/Violet
      transparent: true,
      opacity: 0.4,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    nucleusGroup.add(innerMesh);

    // Tachyon Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.9, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    // Tachyon Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Emerald
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // Tachyon Ring 3
    const ring3Geo = new THREE.TorusGeometry(2.7, 0.015, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xec4899, // Pink/Neon
      transparent: true,
      opacity: 0.4,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 3.5;
    scene.add(ring3);

    // Quantum Particles Cloud (Entangled Qubits)
    const particleCount = 420;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4);
    const color2 = new THREE.Color(0xa855f7);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.3 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixed = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 320;
      const newH = container.clientHeight || 320;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic pulse multiplier if speaking or listening
      const pulseSpeed = isSpeaking ? 6 : isListening ? 4 : 2;
      const pulseScale = 1 + Math.sin(elapsedTime * pulseSpeed) * (isSpeaking ? 0.14 : isListening ? 0.08 : 0.03);

      coreMesh.scale.set(pulseScale, pulseScale, pulseScale);
      innerMesh.scale.set(pulseScale * 0.9, pulseScale * 0.9, pulseScale * 0.9);

      // Rotations
      const spinMult = isSpeaking ? 2.2 : isListening ? 1.6 : 1.0;
      nucleusGroup.rotation.x += 0.005 * spinMult;
      nucleusGroup.rotation.y += 0.008 * spinMult;

      ring1.rotation.z += 0.012 * spinMult;
      ring2.rotation.x += 0.009 * spinMult;
      ring3.rotation.y -= 0.007 * spinMult;

      particleSystem.rotation.y += 0.002 * spinMult;
      particleSystem.rotation.x += 0.001 * spinMult;

      // Parallax smooth lerp
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isSpeaking, isListening]);

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none group ${className}`}
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full min-h-[280px] max-h-[420px]" />

      {/* Cybernetic HUD Overlay Rings */}
      <div className="absolute inset-4 rounded-full border border-cyan-500/20 pointer-events-none animate-spin" style={{ animationDuration: "25s" }}></div>
      <div className="absolute inset-8 rounded-full border border-purple-500/20 pointer-events-none animate-spin" style={{ animationDuration: "35s", animationDirection: "reverse" }}></div>
      <div className="absolute inset-14 rounded-full border border-dashed border-cyan-400/30 pointer-events-none"></div>

      {/* Quantum Diagnostics Pill */}
      <div className="absolute bottom-2 flex flex-col items-center gap-1 pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-[11px] font-mono tracking-wider text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-950/50 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-emerald-400 animate-ping" : isListening ? "bg-amber-400 animate-pulse" : "bg-cyan-400"}`}></span>
          <span>{isSpeaking ? "QUANTUM SPEECH ACTIVE" : isListening ? "LISTENING TO COMMAND..." : `COHERENCE ${coherence}%`}</span>
        </div>
      </div>
    </div>
  );
};
