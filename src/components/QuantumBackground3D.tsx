import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface QuantumBackground3DProps {
  intensity?: number;
  customAccentHex?: string;
  show3D?: boolean;
  customBgUrl?: string;
}

export const QuantumBackground3D: React.FC<QuantumBackground3DProps> = ({
  intensity = 1.0,
  customAccentHex,
  show3D = true,
  customBgUrl,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050f, 0.032);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 20;

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
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 3)); // 4K UHD crispness
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // ==========================================
    // 1. DYNAMIC COLOR SPECTRUM PALETTE
    // Constantly morphs through 6 vibrant quantum spectrums
    // ==========================================
    const palette = [
      new THREE.Color(0x06b6d4), // Tachyon Cyan
      new THREE.Color(0xa855f7), // Nebula Violet
      new THREE.Color(0x10b981), // Matrix Emerald
      new THREE.Color(0xf59e0b), // Solar Gold
      new THREE.Color(0xf43f5e), // Cosmic Rose
      new THREE.Color(0x3b82f6), // Electric Sapphire
    ];

    let colorIndex = 0;
    let nextColorIndex = 1;
    let colorProgress = 0;
    const activeColor = palette[0].clone();
    const secondaryColor = palette[1].clone();

    // ==========================================
    // 2. MORPHING BACKGROUND LOGO GEOMETRIES (5 DISTINCT 3D LOGO MODES)
    // Automatically transitions between different quantum logo structures
    // ==========================================
    const logoMasterGroup = new THREE.Group();
    scene.add(logoMasterGroup);

    // MODE 0: Tachyon Qubit Reactor (Concentric Gimbal Rings + Singularity Core)
    const mode0Group = new THREE.Group();
    const coreSphereGeo = new THREE.SphereGeometry(1.6, 28, 28);
    const coreSphereMat = new THREE.MeshBasicMaterial({
      color: palette[0],
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const coreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    mode0Group.add(coreSphere);

    const ring0AGeo = new THREE.TorusGeometry(6.2, 0.12, 16, 90);
    const ring0AMat = new THREE.MeshBasicMaterial({ color: palette[0], transparent: true, opacity: 0.7 });
    const ring0A = new THREE.Mesh(ring0AGeo, ring0AMat);
    ring0A.rotation.x = Math.PI / 3;
    mode0Group.add(ring0A);

    const ring0BGeo = new THREE.TorusGeometry(7.6, 0.12, 16, 90);
    const ring0BMat = new THREE.MeshBasicMaterial({ color: palette[1], transparent: true, opacity: 0.6 });
    const ring0B = new THREE.Mesh(ring0BGeo, ring0BMat);
    ring0B.rotation.y = Math.PI / 3.5;
    mode0Group.add(ring0B);

    const ring0CGeo = new THREE.TorusGeometry(9.0, 0.1, 16, 90);
    const ring0CMat = new THREE.MeshBasicMaterial({ color: palette[2], transparent: true, opacity: 0.5 });
    const ring0C = new THREE.Mesh(ring0CGeo, ring0CMat);
    ring0C.rotation.z = Math.PI / 4;
    mode0Group.add(ring0C);
    logoMasterGroup.add(mode0Group);

    // MODE 1: 4D Hypercube Tesseract (Nested Geometric Projection)
    const mode1Group = new THREE.Group();
    const outerBoxGeo = new THREE.BoxGeometry(6.5, 6.5, 6.5);
    const outerBoxMat = new THREE.MeshBasicMaterial({
      color: palette[1],
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const outerBox = new THREE.Mesh(outerBoxGeo, outerBoxMat);
    mode1Group.add(outerBox);

    const innerBoxGeo = new THREE.BoxGeometry(3.6, 3.6, 3.6);
    const innerBoxMat = new THREE.MeshBasicMaterial({
      color: palette[0],
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const innerBox = new THREE.Mesh(innerBoxGeo, innerBoxMat);
    mode1Group.add(innerBox);
    logoMasterGroup.add(mode1Group);

    // MODE 2: Crystalline Geodesic Icosahedron Diamond
    const mode2Group = new THREE.Group();
    const icoOuterGeo = new THREE.IcosahedronGeometry(5.2, 1);
    const icoOuterMat = new THREE.MeshBasicMaterial({
      color: palette[2],
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const icoOuter = new THREE.Mesh(icoOuterGeo, icoOuterMat);
    mode2Group.add(icoOuter);

    const dodecaInnerGeo = new THREE.DodecahedronGeometry(3.2, 0);
    const dodecaInnerMat = new THREE.MeshBasicMaterial({
      color: palette[3],
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const dodecaInner = new THREE.Mesh(dodecaInnerGeo, dodecaInnerMat);
    mode2Group.add(dodecaInner);
    logoMasterGroup.add(mode2Group);

    // MODE 3: Neural Energy Vortex & Torus Knot Singularity
    const mode3Group = new THREE.Group();
    const knotGeo = new THREE.TorusKnotGeometry(4.8, 0.28, 120, 24, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
      color: palette[4],
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    mode3Group.add(knotMesh);
    logoMasterGroup.add(mode3Group);

    // MODE 4: Tachyon Double Helix Matrix
    const mode4Group = new THREE.Group();
    const helixNodeCount = 140;
    const helixSphereGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const helixSphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });

    const helixNodes1: THREE.Mesh[] = [];
    const helixNodes2: THREE.Mesh[] = [];

    for (let i = 0; i < helixNodeCount; i++) {
      const s1 = new THREE.Mesh(helixSphereGeo, helixSphereMat);
      mode4Group.add(s1);
      helixNodes1.push(s1);

      const s2 = new THREE.Mesh(helixSphereGeo, helixSphereMat);
      mode4Group.add(s2);
      helixNodes2.push(s2);
    }
    logoMasterGroup.add(mode4Group);

    // ==========================================
    // 3. CONTINUOUS BACKGROUND EFFECTS
    // ==========================================
    // Effect A: Pulsing Expanding Dimensional Shockwave Rings (Ripples)
    const rippleCount = 4;
    const rippleMeshes: { mesh: THREE.Mesh; speed: number; maxRadius: number }[] = [];
    for (let i = 0; i < rippleCount; i++) {
      const rGeo = new THREE.RingGeometry(0.5, 0.65, 64);
      const rMat = new THREE.MeshBasicMaterial({
        color: palette[0],
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.z = -2;
      scene.add(rMesh);
      rippleMeshes.push({ mesh: rMesh, speed: 0.12 + i * 0.04, maxRadius: 26 });
    }

    // Effect B: Flying Quantum Starfield / Tachyon Particle Warp (1,000+ particles with Z travel)
    const particleCount = 1000;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      velocities[i] = 0.06 + Math.random() * 0.14; // forward warp velocity
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.14,
      color: palette[0],
      transparent: true,
      opacity: 0.75,
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Effect C: Sweeping Quantum Energy Ray Beams (Cross-axis lasers)
    const beamCount = 6;
    const beamGroup = new THREE.Group();
    const beamMeshes: THREE.Line[] = [];
    for (let i = 0; i < beamCount; i++) {
      const beamGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-30, 0, 0),
        new THREE.Vector3(30, 0, 0),
      ]);
      const beamMat = new THREE.LineBasicMaterial({
        color: palette[1],
        transparent: true,
        opacity: 0.15,
      });
      const beam = new THREE.Line(beamGeo, beamMat);
      beam.position.y = (i - 2.5) * 6;
      beam.position.z = -5 + Math.random() * 8;
      beamGroup.add(beam);
      beamMeshes.push(beam);
    }
    scene.add(beamGroup);

    // Mouse Parallax Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 5;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 4;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 4. ANIMATION & MORPHING RENDER LOOP
    // ==========================================
    const clock = new THREE.Clock();
    let currentLogoMode = 0;
    let logoModeTimer = 0;
    const LOGO_SWITCH_DURATION = 6.5; // Switch logo design every 6.5 seconds

    // Mode opacity trackers for smooth cross-fading
    const modeOpacities = [1, 0, 0, 0, 0];

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // --- A. Dynamic Continuous Color Morphing ---
      colorProgress += delta * 0.28;
      if (colorProgress >= 1.0) {
        colorProgress = 0;
        colorIndex = nextColorIndex;
        nextColorIndex = (nextColorIndex + 1) % palette.length;
      }
      activeColor.lerpColors(palette[colorIndex], palette[nextColorIndex], colorProgress);
      secondaryColor.lerpColors(
        palette[(colorIndex + 2) % palette.length],
        palette[(nextColorIndex + 2) % palette.length],
        colorProgress
      );

      // --- B. Automatic Logo Mode Switching & Smooth Morphing ---
      logoModeTimer += delta;
      if (logoModeTimer >= LOGO_SWITCH_DURATION) {
        logoModeTimer = 0;
        currentLogoMode = (currentLogoMode + 1) % 5;
      }

      // Smoothly interpolate opacity for all 5 logo designs
      for (let m = 0; m < 5; m++) {
        const targetOp = m === currentLogoMode ? 1.0 : 0.0;
        modeOpacities[m] = THREE.MathUtils.lerp(modeOpacities[m], targetOp, delta * 2.8);
      }

      // Apply opacities & colors to Mode 0: Reactor
      const op0 = modeOpacities[0];
      coreSphereMat.opacity = op0 * 0.75;
      coreSphereMat.color.copy(activeColor);
      ring0AMat.opacity = op0 * 0.7;
      ring0AMat.color.copy(activeColor);
      ring0BMat.opacity = op0 * 0.6;
      ring0BMat.color.copy(secondaryColor);
      ring0CMat.opacity = op0 * 0.5;
      ring0CMat.color.copy(activeColor);
      mode0Group.visible = op0 > 0.01;

      // Apply to Mode 1: 4D Hypercube Tesseract
      const op1 = modeOpacities[1];
      outerBoxMat.opacity = op1 * 0.75;
      outerBoxMat.color.copy(activeColor);
      innerBoxMat.opacity = op1 * 0.85;
      innerBoxMat.color.copy(secondaryColor);
      mode1Group.visible = op1 > 0.01;

      // Apply to Mode 2: Crystalline Icosahedron
      const op2 = modeOpacities[2];
      icoOuterMat.opacity = op2 * 0.8;
      icoOuterMat.color.copy(activeColor);
      dodecaInnerMat.opacity = op2 * 0.7;
      dodecaInnerMat.color.copy(secondaryColor);
      mode2Group.visible = op2 > 0.01;

      // Apply to Mode 3: Torus Knot Singularity
      const op3 = modeOpacities[3];
      knotMat.opacity = op3 * 0.85;
      knotMat.color.copy(activeColor);
      mode3Group.visible = op3 > 0.01;

      // Apply to Mode 4: Double Helix
      const op4 = modeOpacities[4];
      helixSphereMat.opacity = op4 * 0.75;
      helixSphereMat.color.copy(activeColor);
      mode4Group.visible = op4 > 0.01;

      // --- C. Dynamic Logo Rotations & Pulsing ---
      logoMasterGroup.rotation.y = time * 0.25;
      logoMasterGroup.rotation.x = Math.sin(time * 0.2) * 0.18;

      // Mode 0 rotations
      ring0A.rotation.z += 0.02;
      ring0B.rotation.x += 0.018;
      ring0C.rotation.y -= 0.015;
      const pulse0 = 1 + Math.sin(time * 2.8) * 0.08;
      coreSphere.scale.set(pulse0, pulse0, pulse0);

      // Mode 1 rotations
      outerBox.rotation.x = time * 0.35;
      outerBox.rotation.y = time * 0.5;
      innerBox.rotation.x = -time * 0.6;
      innerBox.rotation.y = -time * 0.4;

      // Mode 2 rotations
      icoOuter.rotation.x = time * 0.4;
      icoOuter.rotation.y = time * 0.6;
      dodecaInner.rotation.y = -time * 0.5;

      // Mode 3 rotations
      knotMesh.rotation.y = -time * 0.25;
      knotMesh.rotation.z = time * 0.2;

      // Mode 4 Helix animation
      if (mode4Group.visible) {
        for (let i = 0; i < helixNodeCount; i++) {
          const t = (i / helixNodeCount) * Math.PI * 8 + time * 1.5;
          const y = (i - helixNodeCount / 2) * 0.16;
          const r = 3.6 + Math.sin(time * 2 + i * 0.1) * 0.4;

          helixNodes1[i].position.set(Math.cos(t) * r, y, Math.sin(t) * r);
          helixNodes2[i].position.set(-Math.cos(t) * r, y, -Math.sin(t) * r);
        }
      }

      // --- D. Continuous Background Effect: Expanding Shockwave Ripples ---
      rippleMeshes.forEach((item, index) => {
        const mesh = item.mesh;
        const currentScale = mesh.scale.x;
        const newScale = currentScale + item.speed * 0.8;

        if (newScale >= item.maxRadius) {
          mesh.scale.set(0.5, 0.5, 0.5);
          (mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        } else {
          mesh.scale.set(newScale, newScale, newScale);
          const life = newScale / item.maxRadius;
          const fade = Math.sin(life * Math.PI) * 0.35;
          (mesh.material as THREE.MeshBasicMaterial).opacity = fade;
          (mesh.material as THREE.MeshBasicMaterial).color.copy(activeColor);
        }
        mesh.rotation.z = time * 0.1 + index * (Math.PI / 4);
      });

      // --- E. Continuous Background Effect: Forward Particle Warp Motion ---
      const posArr = particlesGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 2] += velocities[i] * 1.8; // Move toward camera
        if (posArr[i * 3 + 2] > 22) {
          posArr[i * 3 + 2] = -35;
          posArr[i * 3] = (Math.random() - 0.5) * 60;
          posArr[i * 3 + 1] = (Math.random() - 0.5) * 45;
        }
      }
      particlesGeo.attributes.position.needsUpdate = true;
      particlesMat.color.copy(activeColor);

      // --- F. Continuous Background Effect: Sweeping Energy Beams ---
      beamGroup.rotation.z = Math.sin(time * 0.25) * 0.35;
      beamMeshes.forEach((beam, idx) => {
        const mat = beam.material as THREE.LineBasicMaterial;
        mat.opacity = 0.12 + Math.sin(time * 2.2 + idx) * 0.12;
        mat.color.copy(secondaryColor);
        beam.position.y = Math.sin(time * 0.5 + idx) * 12;
      });

      // --- G. Smooth Camera Parallax Lerp ---
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      camera.position.x = mouseX;
      camera.position.y = mouseY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();

      coreSphereGeo.dispose();
      coreSphereMat.dispose();
      ring0AGeo.dispose();
      ring0AMat.dispose();
      ring0BGeo.dispose();
      ring0BMat.dispose();
      ring0CGeo.dispose();
      ring0CMat.dispose();

      outerBoxGeo.dispose();
      outerBoxMat.dispose();
      innerBoxGeo.dispose();
      innerBoxMat.dispose();

      icoOuterGeo.dispose();
      icoOuterMat.dispose();
      dodecaInnerGeo.dispose();
      dodecaInnerMat.dispose();

      knotGeo.dispose();
      knotMat.dispose();
      helixSphereGeo.dispose();
      helixSphereMat.dispose();

      particlesGeo.dispose();
      particlesMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {customBgUrl && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center opacity-30 pointer-events-none transition-opacity duration-1000"
          style={{ backgroundImage: `url(${customBgUrl})` }}
        />
      )}
      {show3D && (
        <div
          ref={mountRef}
          className="fixed inset-0 z-0 pointer-events-none opacity-90 overflow-hidden"
        />
      )}
    </>
  );
};
