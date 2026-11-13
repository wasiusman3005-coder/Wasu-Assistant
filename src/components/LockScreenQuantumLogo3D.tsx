import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface LockScreenQuantumLogo3DProps {
  className?: string;
  onClick?: () => void;
}

export const LockScreenQuantumLogo3D: React.FC<LockScreenQuantumLogo3DProps> = ({
  className = "w-44 h-44 sm:w-52 sm:h-52",
  onClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.8;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5)); // UHD 4K sharpness
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Color Spectrum: Cyan -> Violet -> Emerald -> Solar Gold -> Rose -> Sapphire
    const palette = [
      new THREE.Color(0x06b6d4),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x10b981),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xf43f5e),
      new THREE.Color(0x3b82f6),
    ];

    let colorIdx = 0;
    let nextColorIdx = 1;
    let colorT = 0;
    const liveColor = palette[0].clone();
    const liveSecondary = palette[1].clone();

    // Quantum Logo Assembly Group
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // 1. Central Quantum Singularity Sphere (Glowing Core)
    const coreGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: palette[0],
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    logoGroup.add(coreMesh);

    // 2. Morphing Geometry Shell 1: Crystalline Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(0.95, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: palette[1],
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    logoGroup.add(icoMesh);

    // 3. Morphing Geometry Shell 2: Nested Tesseract Cube
    const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = new THREE.MeshBasicMaterial({
      color: palette[2],
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    logoGroup.add(boxMesh);

    // 4. Tachyon Orbital Rings (Gimbal)
    const ring1Geo = new THREE.TorusGeometry(1.45, 0.025, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: palette[0],
      transparent: true,
      opacity: 0.75,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    logoGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.75, 0.022, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: palette[1],
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.z = Math.PI / 6;
    logoGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(1.98, 0.018, 16, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: palette[2],
      transparent: true,
      opacity: 0.55,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = -Math.PI / 3;
    logoGroup.add(ring3);

    // 5. Orbiting Quantum Spark Particles
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: palette[0],
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    logoGroup.add(particles);

    // Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 1.5;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 1.5;
    };
    container.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 220;
      const newH = container.clientHeight || 220;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Continuous Color Shifting
      colorT += delta * 0.35;
      if (colorT >= 1.0) {
        colorT = 0;
        colorIdx = nextColorIdx;
        nextColorIdx = (nextColorIdx + 1) % palette.length;
      }
      liveColor.lerpColors(palette[colorIdx], palette[nextColorIdx], colorT);
      liveSecondary.lerpColors(
        palette[(colorIdx + 2) % palette.length],
        palette[(nextColorIdx + 2) % palette.length],
        colorT
      );

      coreMat.color.copy(liveColor);
      ring1Mat.color.copy(liveColor);
      ring2Mat.color.copy(liveSecondary);
      ring3Mat.color.copy(liveColor);
      icoMat.color.copy(liveSecondary);
      boxMat.color.copy(liveColor);
      particlesMat.color.copy(liveColor);

      // Continuous Fluid 3D Rotation
      logoGroup.rotation.y = time * 0.45;
      logoGroup.rotation.x = Math.sin(time * 0.3) * 0.2;

      ring1.rotation.z += 0.018;
      ring2.rotation.x += 0.015;
      ring3.rotation.y -= 0.012;

      icoMesh.rotation.x = -time * 0.5;
      icoMesh.rotation.z = time * 0.4;

      boxMesh.rotation.x = time * 0.3;
      boxMesh.rotation.y = -time * 0.4;

      // Morphing scale breathing
      const morphCycle = Math.sin(time * 1.2);
      icoMesh.scale.setScalar(0.95 + morphCycle * 0.15);
      boxMesh.scale.setScalar(0.85 - morphCycle * 0.15);
      boxMat.opacity = 0.4 + morphCycle * 0.35;
      icoMat.opacity = 0.7 - morphCycle * 0.25;

      const pulse = 1.0 + Math.sin(time * 2.5) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Camera soft lerp
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (mouseY - camera.position.y) * 0.05;
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
      icoGeo.dispose();
      icoMat.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      onClick={onClick}
      title="Quantum Tachyon Reactor - Auto-Morphing 3D Logo"
      className={`relative flex items-center justify-center cursor-pointer select-none group ${className}`}
    >
      <div ref={mountRef} className="w-full h-full" />

      {/* Outer Cyan Glowing Halo */}
      <div
        className="absolute inset-2 rounded-full border border-cyan-400/25 pointer-events-none animate-spin"
        style={{ animationDuration: "18s" }}
      ></div>
      <div
        className="absolute inset-5 rounded-full border border-dashed border-purple-400/30 pointer-events-none animate-spin"
        style={{ animationDuration: "28s", animationDirection: "reverse" }}
      ></div>

      {/* Central Holographic Pulse Ring */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/5 group-hover:bg-cyan-500/15 transition-all pointer-events-none"></div>
    </div>
  );
};
