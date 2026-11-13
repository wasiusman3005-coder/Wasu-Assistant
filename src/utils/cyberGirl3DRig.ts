import * as THREE from "three";
import { AvatarBodyMovement, HologramDisplayMode, StandbyAnimationType } from "../types";

export const ZOYA_FACE_PHOTO_URL = "/assets/aistudio/images__5__ddc17e2d.jpg";

export interface CyberGirl3DRig {
  root: THREE.Group;
  pedestalRing: THREE.Mesh;
  pedestalInnerRing: THREE.Mesh;
  thrusterLeft: THREE.Mesh;
  thrusterRight: THREE.Mesh;
  heartSprites: THREE.Group;
  update: (params: {
    dt: number;
    elapsed: number;
    movement: AvatarBodyMovement;
    standby: StandbyAnimationType;
    hologramMode: HologramDisplayMode;
    isSpeaking: boolean;
    isListening: boolean;
  }) => void;
  dispose: () => void;
}

interface TargetPose {
  rootX: number;
  rootY: number;
  rootZ: number;
  rootRotY: number;
  hipsRotX: number;
  hipsRotY: number;
  hipsRotZ: number;
  spineRotX: number;
  spineRotY: number;
  spineRotZ: number;
  chestRotX: number;
  chestRotY: number;
  chestRotZ: number;
  headRotX: number;
  headRotY: number;
  headRotZ: number;
  lShoulderX: number;
  lShoulderY: number;
  lShoulderZ: number;
  lElbowX: number;
  lElbowZ: number;
  rShoulderX: number;
  rShoulderY: number;
  rShoulderZ: number;
  rElbowX: number;
  rElbowZ: number;
  lHipX: number;
  lHipY: number;
  lHipZ: number;
  lKneeX: number;
  lAnkleX: number;
  rHipX: number;
  rHipY: number;
  rHipZ: number;
  rKneeX: number;
  rAnkleX: number;
}

function createZeroPose(): TargetPose {
  return {
    rootX: 0,
    rootY: 0,
    rootZ: 0,
    rootRotY: 0,
    hipsRotX: 0,
    hipsRotY: 0,
    hipsRotZ: 0,
    spineRotX: 0,
    spineRotY: 0,
    spineRotZ: 0,
    chestRotX: 0,
    chestRotY: 0,
    chestRotZ: 0,
    headRotX: 0,
    headRotY: 0,
    headRotZ: 0,
    lShoulderX: 0.04,
    lShoulderY: 0,
    lShoulderZ: 0.14,
    lElbowX: -0.18,
    lElbowZ: 0,
    rShoulderX: 0.04,
    rShoulderY: 0,
    rShoulderZ: -0.14,
    rElbowX: -0.18,
    rElbowZ: 0,
    lHipX: 0,
    lHipY: 0,
    lHipZ: 0.03,
    lKneeX: 0.04,
    lAnkleX: -0.04,
    rHipX: 0,
    rHipY: 0,
    rHipZ: -0.03,
    rKneeX: 0.04,
    rAnkleX: -0.04,
  };
}

// High-Definition cropped face CanvasTexture aligned 1:1 with ZOYA_FACE_PHOTO_URL
function createHologramFacePortraitTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const paintFallback = () => {
    ctx.fillStyle = "#03101e";
    ctx.fillRect(0, 0, size, size);
    const faceGrad = ctx.createRadialGradient(size * 0.5, size * 0.48, 30, size * 0.5, size * 0.48, size * 0.42);
    faceGrad.addColorStop(0, "#e0f7ff");
    faceGrad.addColorStop(0.55, "#38bdf8");
    faceGrad.addColorStop(1, "#03101e");
    ctx.fillStyle = faceGrad;
    ctx.fillRect(0, 0, size, size);
  };

  paintFallback();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    ctx.clearRect(0, 0, size, size);
    // Center-aligned portrait crop covering full face, dark hair framing & chin (excluding shoulder armor)
    // Matched to 0.245 / 0.285 (~0.86) plane aspect ratio for zero facial distortion
    const sh = img.naturalHeight * 0.65;
    const sw = Math.min(img.naturalWidth * 0.92, sh * (0.245 / 0.285));
    const sx = (img.naturalWidth - sw) * 0.5;
    const sy = img.naturalHeight * 0.02;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
    texture.needsUpdate = true;
  };
  img.src = ZOYA_FACE_PHOTO_URL;

  return texture;
}

// Sculpt a true 3D anatomical facial relief PlaneGeometry (nose, cheekbones, brow, eyes, lips, chin)
function createSculptedFaceGeometry(): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(0.245, 0.285, 56, 68);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const u = uv.getX(i);
    const v = uv.getY(i);
    const nx = (u - 0.5) * 2; // -1 .. 1 left-to-right
    const ny = (v - 0.48) * 2; // centered near mid-face

    // Gentle oval taper at lower jaw while keeping hair silhouette smooth
    const jawTaper = v < 0.4 ? 1 - Math.pow((0.4 - v) / 0.4, 1.5) * 0.18 : 1;
    const xScaled = pos.getX(i) * jawTaper;

    // Smooth curved cranium relief tapering cleanly at outer perimeter
    let z = Math.cos(Math.min(1.5, Math.abs(nx) * 1.15)) * 0.058 * Math.cos(Math.min(1.38, Math.abs(ny) * 0.86));

    // Forehead & brow ridge volume
    z += 0.011 * Math.exp(-(Math.pow(nx / 0.48, 2) + Math.pow((v - 0.68) / 0.16, 2)));

    // Subtle eye socket recesses
    z -= 0.008 * Math.exp(-(Math.pow((nx - 0.25) / 0.13, 2) + Math.pow((v - 0.54) / 0.075, 2)));
    z -= 0.008 * Math.exp(-(Math.pow((nx + 0.25) / 0.13, 2) + Math.pow((v - 0.54) / 0.075, 2)));

    // Nose bridge & nose tip 3D projection
    z += 0.018 * Math.exp(-(Math.pow(nx / 0.095, 2) + Math.pow((v - 0.46) / 0.11, 2)));
    z += 0.017 * Math.exp(-(Math.pow(nx / 0.105, 2) + Math.pow((v - 0.39) / 0.05, 2)));

    // Feminine cheekbones
    z += 0.009 * Math.exp(-(Math.pow((nx - 0.38) / 0.18, 2) + Math.pow((v - 0.43) / 0.095, 2)));
    z += 0.009 * Math.exp(-(Math.pow((nx + 0.38) / 0.18, 2) + Math.pow((v - 0.43) / 0.095, 2)));

    // Sculpted lips & delicate chin
    z += 0.009 * Math.exp(-(Math.pow(nx / 0.14, 2) + Math.pow((v - 0.26) / 0.042, 2)));
    z += 0.008 * Math.exp(-(Math.pow(nx / 0.18, 2) + Math.pow((v - 0.14) / 0.075, 2)));

    pos.setXYZ(i, xScaled, pos.getY(i), z);
  }

  geo.computeVertexNormals();
  return geo;
}

// High-Detail HD Hologram Portrait Shader (razor-sharp eyes, cyan circuits, glowing Fresnel jaw rim)
function createHologramPortraitFaceMaterial(faceMap: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeakEnergy: { value: 0 },
      uBlink: { value: 0 },
      uFaceMap: { value: faceMap },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSpeakEnergy;
      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      void main() {
        vUv = uv;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vec4 mvPos = viewMatrix * worldPos;
        vNormalView = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uSpeakEnergy;
      uniform float uBlink;
      uniform sampler2D uFaceMap;

      varying vec2 vUv;
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      void main() {
        vec3 tex = texture2D(uFaceMap, vUv).rgb;

        // Soft seamless vignette fade into space — zero hard lines or rim borders
        vec2 centered = (vUv - vec2(0.5, 0.50)) / vec2(0.46, 0.48);
        float radial = length(centered);
        float bottomFade = smoothstep(0.03, 0.18, vUv.y);
        float topFade = smoothstep(0.99, 0.88, vUv.y);
        float mask = (1.0 - smoothstep(0.66, 0.98, radial)) * bottomFade * topFade;
        if (mask < 0.02) discard;

        // Preserve blue cyber circuit glow & crisp natural holographic lighting without lines
        float luma = dot(tex, vec3(0.299, 0.587, 0.114));
        float blueBoost = clamp((tex.b - max(tex.r, tex.g) * 0.72) * 2.5, 0.0, 1.0);

        // Clean, clear pearl-cyan holographic face shading (zero scanlines, zero rim stroke)
        vec3 deepHolo = vec3(0.01, 0.05, 0.12);
        vec3 midHolo = vec3(0.36, 0.86, 0.99);
        vec3 brightPearl = vec3(0.96, 0.99, 1.0);
        vec3 portraitHolo = mix(deepHolo, midHolo, smoothstep(0.05, 0.48, luma));
        portraitHolo = mix(portraitHolo, brightPearl, smoothstep(0.48, 0.90, luma));
        // Keep natural facial clarity and warmth from reference portrait
        portraitHolo = mix(portraitHolo, tex * vec3(0.92, 1.02, 1.08), 0.52);

        // Radiant electric-aqua cheek/temple circuits
        portraitHolo += vec3(0.05, 0.88, 1.0) * blueBoost * 0.65;

        // Fade near-black background pixels smoothly so only her face & hair glow cleanly
        float contentAlpha = smoothstep(0.015, 0.14, luma + blueBoost * 0.4);
        vec3 finalCol = portraitHolo * (1.0 + uSpeakEnergy * 0.1);

        gl_FragColor = vec4(finalCol, clamp(mask * contentAlpha, 0.0, 1.0));
      }
    `,
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: true,
    side: THREE.FrontSide,
  });
}

// Volumetric Hologram Shader for body, hair, armor trim, and full-body plasma reveal wipe
function createVolumetricHoloMaterial(options: {
  baseColor: number;
  rimColor: number;
  opacity: number;
  scanDensity?: number;
  gridStrength?: number;
}): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeakEnergy: { value: 0 },
      uRevealFloorY: { value: -0.5 },
      uBaseColor: { value: new THREE.Color(options.baseColor) },
      uRimColor: { value: new THREE.Color(options.rimColor) },
      uOpacity: { value: options.opacity },
      uScanDensity: { value: options.scanDensity ?? 125.0 },
      uGridStrength: { value: options.gridStrength ?? 0.36 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSpeakEnergy;
      varying vec3 vNormalView;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        float glitchBand = sin(worldPos.y * 18.0 - uTime * 9.0);
        float glitchPulse = smoothstep(0.965, 1.0, sin(uTime * 3.1 + worldPos.y * 2.5));
        worldPos.x += glitchBand * glitchPulse * 0.008 * (1.0 + uSpeakEnergy);

        vWorldPos = worldPos.xyz;
        vec4 mvPos = viewMatrix * worldPos;
        vNormalView = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPos.xyz);

        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uSpeakEnergy;
      uniform float uRevealFloorY;
      uniform vec3 uBaseColor;
      uniform vec3 uRimColor;
      uniform float uOpacity;
      uniform float uScanDensity;
      uniform float uGridStrength;

      varying vec3 vNormalView;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      void main() {
        // Holographic top-down reveal scan clip
        if (vWorldPos.y < uRevealFloorY - 0.04) discard;
        float revealEdge = exp(-pow((vWorldPos.y - uRevealFloorY) * 26.0, 2.0));

        vec3 N = normalize(vNormalView);
        vec3 V = normalize(vViewDir);
        float ndotv = abs(dot(N, V));
        float fresnel = pow(clamp(1.0 - ndotv, 0.0, 1.0), 2.1);

        float scan = 0.72 + 0.28 * sin(vWorldPos.y * uScanDensity - uTime * 7.5);
        float sweepY = mod(uTime * 0.65, 2.2) - 0.15;
        float sweepBand = exp(-pow((vWorldPos.y - sweepY) * 7.5, 2.0));

        float gridX = smoothstep(0.92, 0.99, abs(sin(vWorldPos.x * 65.0)));
        float gridY = smoothstep(0.92, 0.99, abs(sin(vWorldPos.y * 65.0)));
        float holoGrid = max(gridX, gridY) * uGridStrength;

        float flicker = 0.94 + 0.06 * sin(uTime * 23.0 + vWorldPos.y * 5.0);
        float speakBoost = 1.0 + uSpeakEnergy * 0.42;

        vec3 col = mix(uBaseColor, uRimColor, clamp(fresnel * 1.15 + sweepBand * 0.55 + holoGrid * 0.5, 0.0, 1.0));
        col += vec3(0.65, 0.98, 1.0) * revealEdge * 1.6;
        float alpha = (0.16 + fresnel * 0.82 + sweepBand * 0.35 + holoGrid * 0.28 + revealEdge * 0.85) * scan * flicker * uOpacity;

        gl_FragColor = vec4(col * speakBoost, clamp(alpha, 0.0, 0.95));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

export function createCyberGirl3DRig(maxAnisotropy: number): CyberGirl3DRig {
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const holoShaderMats: THREE.ShaderMaterial[] = [];
  const trackHoloMat = (mat: THREE.ShaderMaterial) => {
    track(mat);
    holoShaderMats.push(mat);
    return mat;
  };

  const faceTex = track(createHologramFacePortraitTexture(maxAnisotropy));
  const headFaceHoloMat = track(createHologramPortraitFaceMaterial(faceTex));

  const bodyHoloMat = trackHoloMat(
    createVolumetricHoloMaterial({
      baseColor: 0x0284c7,
      rimColor: 0x38f9ff,
      opacity: 0.78,
      scanDensity: 135,
      gridStrength: 0.36,
    })
  );

  const armorHoloMat = trackHoloMat(
    createVolumetricHoloMaterial({
      baseColor: 0x0ea5e9,
      rimColor: 0xa5f3fc,
      opacity: 0.9,
      scanDensity: 160,
      gridStrength: 0.46,
    })
  );

  const hairHoloMat = trackHoloMat(
    createVolumetricHoloMaterial({
      baseColor: 0x1d4ed8,
      rimColor: 0x22d3ee,
      opacity: 0.74,
      scanDensity: 110,
      gridStrength: 0.22,
    })
  );

  const wireMeshMat = track(
    new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  const brightWireMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xa5f3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  const coreNodeMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  const roseHeartHoloMat = track(
    new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  const addHoloMesh = (
    parent: THREE.Object3D,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    withWireframe = true,
    wireMat: THREE.Material = wireMeshMat
  ) => {
    const mesh = new THREE.Mesh(geo, mat);
    parent.add(mesh);
    if (withWireframe) {
      const wire = new THREE.Mesh(geo, wireMat);
      wire.scale.setScalar(1.006);
      mesh.add(wire);
    }
    return mesh;
  };

  const root = new THREE.Group();

  // =========================================================================
  // 1A. FULL-BODY HOLOGRAPHIC FLOOR PEDESTAL & VOLUMETRIC BEAM CONE (y = 0)
  // =========================================================================
  const floorProjectorGroup = new THREE.Group();
  root.add(floorProjectorGroup);

  const pedHousingGeo = track(new THREE.CylinderGeometry(0.58, 0.72, 0.05, 48));
  const pedHousingMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x061020,
      roughness: 0.28,
      metalness: 0.92,
    })
  );
  const pedHousing = new THREE.Mesh(pedHousingGeo, pedHousingMat);
  pedHousing.position.y = -0.025;
  floorProjectorGroup.add(pedHousing);

  const emitterLensGeo = track(new THREE.CircleGeometry(0.52, 48));
  const emitterLensMat = track(
    new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const emitterLens = new THREE.Mesh(emitterLensGeo, emitterLensMat);
  emitterLens.rotation.x = -Math.PI / 2;
  emitterLens.position.y = 0.002;
  floorProjectorGroup.add(emitterLens);

  const ringMat = track(
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  const outerRingGeo = track(new THREE.TorusGeometry(0.66, 0.011, 10, 64));
  const pedestalRing = new THREE.Mesh(outerRingGeo, ringMat);
  pedestalRing.rotation.x = Math.PI / 2;
  pedestalRing.position.y = 0.004;
  floorProjectorGroup.add(pedestalRing);

  const innerRingGeo = track(new THREE.TorusGeometry(0.46, 0.008, 10, 48, Math.PI * 1.45));
  const pedestalInnerRing = new THREE.Mesh(innerRingGeo, ringMat);
  pedestalInnerRing.rotation.x = Math.PI / 2;
  pedestalInnerRing.position.y = 0.01;
  floorProjectorGroup.add(pedestalInnerRing);

  const midSegmentedGeo = track(new THREE.TorusGeometry(0.56, 0.006, 8, 48, Math.PI * 1.1));
  const midSegmentedRing = new THREE.Mesh(midSegmentedGeo, coreNodeMat);
  midSegmentedRing.rotation.x = Math.PI / 2;
  midSegmentedRing.position.y = 0.007;
  floorProjectorGroup.add(midSegmentedRing);

  const beamConeGeo = track(new THREE.CylinderGeometry(0.86, 0.44, 1.9, 44, 1, true));
  const beamConeMat = track(
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00e5ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          float vertFade = pow(1.0 - vUv.y, 1.85);
          float rays = 0.72 + 0.28 * sin(vUv.x * 62.8318 + uTime * 1.6);
          float alpha = vertFade * rays * 0.14;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );
  const beamCone = new THREE.Mesh(beamConeGeo, beamConeMat);
  beamCone.position.y = 0.95;
  floorProjectorGroup.add(beamCone);

  // =========================================================================
  // 1B. DEDICATED FACE-MODE EMITTER RINGS & PORTRAIT PROJECTION BEAM (y = 1.24)
  // =========================================================================
  const faceEmitterGroup = new THREE.Group();
  faceEmitterGroup.position.set(0, 1.25, 0);
  root.add(faceEmitterGroup);

  const faceEmitterBase = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.24, 0.005, 8, 48)),
    ringMat
  );
  faceEmitterBase.rotation.x = Math.PI / 2;
  faceEmitterGroup.add(faceEmitterBase);

  const faceEmitterInner = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.175, 0.004, 8, 42, Math.PI * 1.35)),
    coreNodeMat
  );
  faceEmitterInner.rotation.x = Math.PI / 2;
  faceEmitterInner.position.y = 0.012;
  faceEmitterGroup.add(faceEmitterInner);

  // Compact pedestal projection glow strictly below chin/neck (never covering face)
  const faceBeamCone = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.24, 0.15, 0.22, 36, 1, true)),
    beamConeMat
  );
  faceBeamCone.position.y = 0.11;
  faceEmitterGroup.add(faceBeamCone);

  // Outer perimeter holographic particles (kept clear of center face area)
  const particleCount = 72;
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.28 + Math.random() * 0.32;
    pPos[i * 3] = Math.cos(angle) * radius;
    pPos[i * 3 + 1] = Math.random() * 1.85;
    pPos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  const particleGeo = track(new THREE.BufferGeometry());
  particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particleMat = track(
    new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.014,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const holoParticles = new THREE.Points(particleGeo, particleMat);
  root.add(holoParticles);

  // Thruster plasma discs (visible on jump)
  const thrusterGeo = track(new THREE.RingGeometry(0.03, 0.15, 24));
  const thrusterMat = track(
    new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  const thrusterLeft = new THREE.Mesh(thrusterGeo, thrusterMat);
  thrusterLeft.rotation.x = -Math.PI / 2;
  thrusterLeft.position.set(0.11, 0.02, 0);
  const thrusterRight = new THREE.Mesh(thrusterGeo, thrusterMat);
  thrusterRight.rotation.x = -Math.PI / 2;
  thrusterRight.position.set(-0.11, 0.02, 0);
  root.add(thrusterLeft, thrusterRight);

  // =========================================================================
  // 2. ARTICULATED FEMALE HOLOGRAM SKELETON (17 Joints + Sculpted Bust)
  // =========================================================================
  const characterRoot = new THREE.Group();
  root.add(characterRoot);

  const hipsGroup = new THREE.Group();
  hipsGroup.position.set(0, 0.91, 0);
  characterRoot.add(hipsGroup);

  const lowerBodyMeshes: THREE.Object3D[] = [];
  const registerLowerBody = <T extends THREE.Object3D>(obj: T): T => {
    lowerBodyMeshes.push(obj);
    return obj;
  };

  const pelvisPts = [
    new THREE.Vector2(0.0, -0.07),
    new THREE.Vector2(0.085, -0.055),
    new THREE.Vector2(0.148, -0.005),
    new THREE.Vector2(0.142, 0.055),
    new THREE.Vector2(0.112, 0.095),
    new THREE.Vector2(0.0, 0.095),
  ];
  const pelvisGeo = track(new THREE.LatheGeometry(pelvisPts, 28));
  const pelvisMesh = registerLowerBody(addHoloMesh(hipsGroup, pelvisGeo, bodyHoloMat, true));
  pelvisMesh.scale.set(1.06, 1, 0.78);

  const beltGeo = track(new THREE.TorusGeometry(0.125, 0.014, 10, 28));
  const beltMesh = registerLowerBody(addHoloMesh(hipsGroup, beltGeo, armorHoloMat, false));
  beltMesh.rotation.x = Math.PI / 2;
  beltMesh.scale.set(1.04, 0.78, 1);
  beltMesh.position.y = 0.082;

  const spineGroup = new THREE.Group();
  spineGroup.position.set(0, 0.09, 0);
  hipsGroup.add(spineGroup);

  const waistPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.11, 0.0),
    new THREE.Vector2(0.102, 0.085),
    new THREE.Vector2(0.12, 0.165),
    new THREE.Vector2(0.0, 0.165),
  ];
  const waistGeo = track(new THREE.LatheGeometry(waistPts, 28));
  const waistMesh = registerLowerBody(addHoloMesh(spineGroup, waistGeo, bodyHoloMat, true));
  waistMesh.scale.set(1.04, 1, 0.76);

  const vertGeo = track(new THREE.OctahedronGeometry(0.016, 0));
  for (let i = 0; i < 4; i++) {
    const vNode = registerLowerBody(new THREE.Mesh(vertGeo, coreNodeMat));
    vNode.position.set(0, 0.03 + i * 0.042, -0.02);
    spineGroup.add(vNode);
  }

  const chestGroup = new THREE.Group();
  chestGroup.position.set(0, 0.155, 0);
  spineGroup.add(chestGroup);

  const chestPts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.122, 0.0),
    new THREE.Vector2(0.156, 0.115),
    new THREE.Vector2(0.158, 0.185),
    new THREE.Vector2(0.114, 0.24),
    new THREE.Vector2(0.068, 0.258),
    new THREE.Vector2(0.0, 0.258),
  ];
  const chestGeo = track(new THREE.LatheGeometry(chestPts, 32));
  const chestMesh = registerLowerBody(addHoloMesh(chestGroup, chestGeo, bodyHoloMat, true));
  chestMesh.scale.set(1.08, 1, 0.78);

  const bustGeo = track(new THREE.SphereGeometry(0.072, 20, 16));
  const bustL = registerLowerBody(addHoloMesh(chestGroup, bustGeo, bodyHoloMat, false));
  bustL.scale.set(1.0, 0.92, 0.85);
  bustL.position.set(0.058, 0.135, 0.086);
  const bustR = registerLowerBody(addHoloMesh(chestGroup, bustGeo, bodyHoloMat, false));
  bustR.scale.set(1.0, 0.92, 0.85);
  bustR.position.set(-0.058, 0.135, 0.086);

  const chestCoreRingGeo = track(new THREE.TorusGeometry(0.034, 0.005, 8, 24));
  const chestCoreRing = registerLowerBody(new THREE.Mesh(chestCoreRingGeo, coreNodeMat));
  chestCoreRing.position.set(0, 0.165, 0.065);
  chestGroup.add(chestCoreRing);

  const chestCoreOrb = registerLowerBody(
    new THREE.Mesh(track(new THREE.OctahedronGeometry(0.022, 1)), coreNodeMat)
  );
  chestCoreOrb.position.set(0, 0.165, 0.065);
  chestGroup.add(chestCoreOrb);

  const strapGeo = track(new THREE.TorusGeometry(0.115, 0.009, 8, 24));
  const harnessL = registerLowerBody(addHoloMesh(chestGroup, strapGeo, armorHoloMat, false));
  harnessL.position.set(0.095, 0.16, 0);
  harnessL.rotation.set(0, Math.PI / 2, 0.2);
  harnessL.scale.set(0.95, 1.15, 1);
  const harnessR = registerLowerBody(addHoloMesh(chestGroup, strapGeo, armorHoloMat, false));
  harnessR.position.set(-0.095, 0.16, 0);
  harnessR.rotation.set(0, Math.PI / 2, -0.2);
  harnessR.scale.set(0.95, 1.15, 1);

  // Neck, collar, rear cranium, hair & halo are strictly hidden in Face-Only mode
  // so ZERO lines appear above, below, or beside her face!
  const extraHeadMeshes: THREE.Object3D[] = [];
  const registerExtraHead = <T extends THREE.Object3D>(obj: T): T => {
    extraHeadMeshes.push(obj);
    return obj;
  };

  const neckGroup = new THREE.Group();
  neckGroup.position.set(0, 0.252, 0.005);
  chestGroup.add(neckGroup);

  const neckGeo = track(new THREE.CylinderGeometry(0.041, 0.052, 0.105, 22));
  const neckMesh = registerExtraHead(addHoloMesh(neckGroup, neckGeo, bodyHoloMat, false));
  neckMesh.position.y = 0.042;

  const collarGeo = track(new THREE.CylinderGeometry(0.074, 0.105, 0.055, 24, 1, true, Math.PI * 0.16, Math.PI * 1.68));
  const collarMesh = registerExtraHead(addHoloMesh(neckGroup, collarGeo, armorHoloMat, false));
  collarMesh.rotation.y = 0;
  collarMesh.position.y = 0.005;

  // =========================================================================
  // 3. HD 3D HOLOGRAPHIC SCULPTED FACE (100% PURE & CLEAN) + FULLBODY CRANIUM/HAIR
  // =========================================================================
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.092, 0.01);
  neckGroup.add(headGroup);

  // Depth-sculpted 3D Facial Relief Mesh mapped 1:1 with ZOYA_FACE_PHOTO_URL (Zero lines/occlusion!)
  const sculptedFaceGeo = track(createSculptedFaceGeometry());
  const sculptedFaceMesh = new THREE.Mesh(sculptedFaceGeo, headFaceHoloMat);
  sculptedFaceMesh.position.set(0, 0.072, 0.044);
  sculptedFaceMesh.renderOrder = 2;
  headGroup.add(sculptedFaceMesh);

  // Rear-hemisphere cranium & cyber hair (visible ONLY in Full-Body mode)
  const craniumGeo = track(new THREE.SphereGeometry(0.106, 22, 16, Math.PI, Math.PI));
  const craniumMesh = registerExtraHead(new THREE.Mesh(craniumGeo, bodyHoloMat));
  craniumMesh.scale.set(0.84, 1.04, 0.86);
  craniumMesh.position.set(0, 0.076, -0.018);
  headGroup.add(craniumMesh);

  const hairCrownGeo = track(
    new THREE.SphereGeometry(0.118, 24, 16, Math.PI * 0.92, Math.PI * 1.16, 0, Math.PI * 0.42)
  );
  const hairCrown = registerExtraHead(addHoloMesh(headGroup, hairCrownGeo, hairHoloMat, false));
  hairCrown.scale.set(0.92, 1.06, 0.94);
  hairCrown.position.set(0, 0.088, -0.025);
  hairCrown.rotation.x = -0.22;

  const hairBackGeo = track(new THREE.CylinderGeometry(0.108, 0.142, 0.25, 22, 4, true, Math.PI * 0.34, Math.PI * 1.32));
  const hairBack = registerExtraHead(addHoloMesh(headGroup, hairBackGeo, hairHoloMat, false));
  hairBack.position.set(0, -0.008, -0.024);
  hairBack.rotation.y = 0;

  const sideLockGeo = track(new THREE.CylinderGeometry(0.019, 0.01, 0.21, 10));
  const lockL = registerExtraHead(addHoloMesh(headGroup, sideLockGeo, hairHoloMat, false));
  lockL.position.set(0.106, 0.016, -0.008);
  lockL.rotation.set(0.06, 0, 0.12);
  const lockR = registerExtraHead(addHoloMesh(headGroup, sideLockGeo, hairHoloMat, false));
  lockR.position.set(-0.106, 0.016, -0.008);
  lockR.rotation.set(0.06, 0, -0.12);

  const holoHaloGeo = track(new THREE.TorusGeometry(0.165, 0.0032, 8, 48, Math.PI * 1.45));
  const holoHaloMesh = registerExtraHead(new THREE.Mesh(holoHaloGeo, ringMat));
  holoHaloMesh.position.set(0, 0.105, -0.098);
  holoHaloMesh.rotation.set(Math.PI * 0.08, 0, 0);
  headGroup.add(holoHaloMesh);

  // =========================================================================
  // 4. ARMS & LEGS (Registered in lowerBodyMeshes for Face-Only <-> Full-Body)
  // =========================================================================
  function createArm(side: 1 | -1) {
    const shoulderPivot = registerLowerBody(new THREE.Group());
    shoulderPivot.position.set(side * 0.175, 0.21, 0);
    chestGroup.add(shoulderPivot);

    const shoulderCore = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.022, 1)), coreNodeMat);
    shoulderPivot.add(shoulderCore);

    const pauldronGeo = track(new THREE.SphereGeometry(0.056, 16, 12));
    const pauldron = addHoloMesh(shoulderPivot, pauldronGeo, armorHoloMat, true);
    pauldron.scale.set(0.9, 1.15, 0.95);
    pauldron.position.set(side * 0.012, -0.015, 0);

    const upperArmGeo = track(new THREE.CylinderGeometry(0.043, 0.035, 0.255, 16));
    const upperArm = addHoloMesh(shoulderPivot, upperArmGeo, bodyHoloMat, true);
    upperArm.position.set(side * 0.012, -0.145, 0);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(side * 0.012, -0.275, 0);
    shoulderPivot.add(elbowPivot);

    const elbowCore = new THREE.Mesh(track(new THREE.SphereGeometry(0.02, 12, 10)), coreNodeMat);
    elbowPivot.add(elbowCore);

    const forearmGeo = track(new THREE.CylinderGeometry(0.034, 0.026, 0.225, 16));
    const forearm = addHoloMesh(elbowPivot, forearmGeo, bodyHoloMat, true);
    forearm.position.y = -0.112;

    const cuffGeo = track(new THREE.CylinderGeometry(0.033, 0.03, 0.068, 18));
    const cuff = addHoloMesh(elbowPivot, cuffGeo, armorHoloMat, true, brightWireMat);
    cuff.position.y = -0.205;

    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.248, 0);
    elbowPivot.add(handGroup);

    const palmGeo = track(new THREE.CapsuleGeometry(0.018, 0.032, 6, 10));
    const palm = addHoloMesh(handGroup, palmGeo, armorHoloMat, false);
    palm.scale.set(0.85, 1, 1.15);
    palm.position.y = -0.03;

    const fingersGeo = track(new THREE.CapsuleGeometry(0.014, 0.036, 6, 10));
    const fingers = addHoloMesh(handGroup, fingersGeo, armorHoloMat, false);
    fingers.scale.set(0.8, 1, 1.1);
    fingers.position.set(0, -0.072, 0.005);
    fingers.rotation.x = -0.18;

    return { shoulderPivot, elbowPivot, handGroup };
  }

  const leftArm = createArm(1);
  const rightArm = createArm(-1);

  function createLeg(side: 1 | -1) {
    const hipPivot = registerLowerBody(new THREE.Group());
    hipPivot.position.set(side * 0.104, -0.04, 0);
    hipsGroup.add(hipPivot);

    const hipCore = new THREE.Mesh(track(new THREE.SphereGeometry(0.024, 12, 10)), coreNodeMat);
    hipPivot.add(hipCore);

    const thighPts = [
      new THREE.Vector2(0.0, -0.41),
      new THREE.Vector2(0.054, -0.41),
      new THREE.Vector2(0.072, -0.24),
      new THREE.Vector2(0.084, -0.06),
      new THREE.Vector2(0.078, 0.0),
      new THREE.Vector2(0.0, 0.0),
    ];
    const thighGeo = track(new THREE.LatheGeometry(thighPts, 22));
    const thigh = addHoloMesh(hipPivot, thighGeo, bodyHoloMat, true);
    thigh.scale.set(0.95, 1, 1.0);

    const thighStrapGeo = track(new THREE.TorusGeometry(0.075, 0.008, 8, 22));
    const thighStrap = addHoloMesh(hipPivot, thighStrapGeo, armorHoloMat, false);
    thighStrap.rotation.x = Math.PI / 2;
    thighStrap.position.y = -0.16;

    if (side === 1) {
      const holsterGeo = track(new THREE.BoxGeometry(0.034, 0.11, 0.065));
      const holster = addHoloMesh(hipPivot, holsterGeo, armorHoloMat, true, brightWireMat);
      holster.position.set(0.074, -0.185, -0.005);
    }

    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -0.415, 0);
    hipPivot.add(kneePivot);

    const kneeCore = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.022, 1)), coreNodeMat);
    kneePivot.add(kneeCore);

    const kneePadGeo = track(new THREE.SphereGeometry(0.054, 16, 12));
    const kneePad = addHoloMesh(kneePivot, kneePadGeo, armorHoloMat, true);
    kneePad.scale.set(0.92, 1.1, 0.9);
    kneePad.position.set(0, 0.005, 0.014);

    const shinGeo = track(new THREE.CylinderGeometry(0.053, 0.044, 0.15, 18));
    const shin = addHoloMesh(kneePivot, shinGeo, bodyHoloMat, true);
    shin.position.y = -0.075;

    const bootShaftGeo = track(new THREE.CylinderGeometry(0.055, 0.045, 0.25, 20));
    const bootShaft = addHoloMesh(kneePivot, bootShaftGeo, armorHoloMat, true, brightWireMat);
    bootShaft.position.y = -0.25;

    for (const strapY of [-0.165, -0.215, -0.295]) {
      const bootStrapGeo = track(new THREE.TorusGeometry(0.053, 0.005, 8, 22));
      const bootStrap = addHoloMesh(kneePivot, bootStrapGeo, coreNodeMat, false);
      bootStrap.rotation.x = Math.PI / 2;
      bootStrap.position.y = strapY;
    }

    const anklePivot = new THREE.Group();
    anklePivot.position.set(0, -0.39, 0);
    kneePivot.add(anklePivot);

    const footUpperGeo = track(new THREE.CapsuleGeometry(0.042, 0.088, 8, 14));
    const footUpper = addHoloMesh(anklePivot, footUpperGeo, armorHoloMat, true);
    footUpper.rotation.x = Math.PI / 2;
    footUpper.scale.set(0.95, 1.0, 0.72);
    footUpper.position.set(0, -0.038, 0.045);

    const bootSoleGeo = track(new THREE.BoxGeometry(0.086, 0.018, 0.195));
    const bootSole = addHoloMesh(anklePivot, bootSoleGeo, coreNodeMat, false);
    bootSole.position.set(0, -0.057, 0.045);

    return { hipPivot, kneePivot, anklePivot };
  }

  const leftLeg = createLeg(1);
  const rightLeg = createLeg(-1);

  // Floating 3D Rose Holographic Hearts
  const heartSprites = new THREE.Group();
  const miniHeartGeo = track(new THREE.OctahedronGeometry(0.045, 1));
  for (let i = 0; i < 6; i++) {
    const hMesh = new THREE.Mesh(miniHeartGeo, roseHeartHoloMat);
    const angle = (i / 6) * Math.PI * 2;
    hMesh.position.set(Math.cos(angle) * 0.45, 1.15 + (i % 3) * 0.16, Math.sin(angle) * 0.35);
    hMesh.scale.set(1.1, 1.25, 0.65);
    heartSprites.add(hMesh);
  }
  heartSprites.visible = false;
  root.add(heartSprites);

  const currPose: TargetPose = createZeroPose();
  const targetPose: TargetPose = createZeroPose();
  let revealFloorY = 1.25;
  let prevHologramMode: HologramDisplayMode = "face";

  const FREESTYLE_SEQUENCE: AvatarBodyMovement[] = [
    "showcase",
    "crouch_hero",
    "dance",
    "kick",
    "spin",
    "heart",
    "wave",
  ];

  // =========================================================================
  // 5. 60FPS DAMPED KINEMATIC SOLVER + HOLOGRAM MATERIALIZATION WIPE
  // =========================================================================
  const update: CyberGirl3DRig["update"] = ({
    dt,
    elapsed,
    movement,
    standby,
    hologramMode,
    isSpeaking,
    isListening,
  }) => {
    const safeDt = Math.min(dt, 0.05);
    const breath = Math.sin(elapsed * 2.1);
    const speakWave = isSpeaking ? Math.sin(elapsed * 11) : 0;
    const speakEnergy = isSpeaking ? 0.55 + Math.abs(Math.sin(elapsed * 12)) * 0.45 : isListening ? 0.25 : 0;

    // Trigger downward holographic body scan-wipe when transitioning into fullbody!
    if (hologramMode === "fullbody" && prevHologramMode !== "fullbody") {
      revealFloorY = 1.32;
    }
    prevHologramMode = hologramMode;

    const isFullBody = hologramMode === "fullbody";
    const targetRevealFloor = isFullBody ? -0.35 : 1.24;
    revealFloorY = THREE.MathUtils.damp(revealFloorY, targetRevealFloor, isFullBody ? 3.2 : 7.5, safeDt);

    for (let i = 0; i < lowerBodyMeshes.length; i++) {
      lowerBodyMeshes[i].visible = isFullBody;
    }
    for (let i = 0; i < extraHeadMeshes.length; i++) {
      extraHeadMeshes[i].visible = isFullBody;
    }
    floorProjectorGroup.visible = isFullBody;
    faceEmitterGroup.visible = false;
    holoParticles.visible = isFullBody;

    // Blink every 3.6 seconds
    const blinkCycle = elapsed % 3.6;
    const blinkFactor = blinkCycle < 0.13 ? Math.sin((blinkCycle / 0.13) * Math.PI) : 0;

    // Update shaders
    headFaceHoloMat.uniforms.uTime.value = elapsed;
    headFaceHoloMat.uniforms.uSpeakEnergy.value = speakEnergy;
    headFaceHoloMat.uniforms.uBlink.value = blinkFactor;

    for (let i = 0; i < holoShaderMats.length; i++) {
      holoShaderMats[i].uniforms.uTime.value = elapsed;
      holoShaderMats[i].uniforms.uSpeakEnergy.value = speakEnergy;
      holoShaderMats[i].uniforms.uRevealFloorY.value = revealFloorY;
    }
    beamConeMat.uniforms.uTime.value = elapsed;

    // Animate ascending holographic particles cleanly within active emitter height
    const minY = isFullBody ? 0.02 : 1.26;
    const maxY = isFullBody ? 1.92 : 1.82;
    const posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < particleCount; i++) {
      let py = posAttr.getY(i) + safeDt * 0.34;
      if (py > maxY || py < minY) py = minY + Math.random() * (maxY - minY) * 0.25;
      const angleShift = safeDt * 0.55;
      const px = posAttr.getX(i);
      const pz = posAttr.getZ(i);
      const cosA = Math.cos(angleShift);
      const sinA = Math.sin(angleShift);
      posAttr.setXYZ(i, px * cosA - pz * sinA, py, px * sinA + pz * cosA);
    }
    posAttr.needsUpdate = true;

    Object.assign(targetPose, createZeroPose());

    const effectiveMove: AvatarBodyMovement = !isFullBody
      ? "idle"
      : movement === "freestyle"
      ? FREESTYLE_SEQUENCE[Math.floor(elapsed / 2.6) % FREESTYLE_SEQUENCE.length]
      : movement;

    targetPose.chestRotX = breath * 0.02;
    targetPose.headRotX = breath * 0.02 + (isSpeaking ? speakWave * 0.032 : 0);
    targetPose.headRotY = Math.sin(elapsed * 0.72) * (isFullBody ? 0.06 : 0.12);
    targetPose.headRotZ = !isFullBody ? Math.sin(elapsed * 0.5) * 0.045 : 0;

    if (!isFullBody) {
      // Subtle floating levitation for Face-Only Hologram bust
      targetPose.rootY = 0.015 * Math.sin(elapsed * 2.0);
    } else if (standby === "float") {
      targetPose.rootY = 0.06 + Math.sin(elapsed * 2.4) * 0.04;
    } else if (standby === "sway") {
      targetPose.hipsRotY = Math.sin(elapsed * 1.1) * 0.08;
    }

    switch (effectiveMove) {
      case "showcase": {
        // Cinematic Model Presentation Stance (graceful 3/4 turn + confident poised arms!)
        targetPose.rootRotY = Math.sin(elapsed * 0.68) * 0.52;
        targetPose.hipsRotZ = 0.065;
        targetPose.hipsRotY = -0.12;
        targetPose.chestRotY = 0.14;
        targetPose.headRotY = -Math.sin(elapsed * 0.68) * 0.24;
        targetPose.headRotX = -0.04;
        targetPose.lShoulderX = -0.28;
        targetPose.lShoulderZ = 0.34;
        targetPose.lElbowX = -0.92;
        targetPose.lElbowZ = -0.35;
        targetPose.rShoulderX = 0.14;
        targetPose.rShoulderZ = -0.38;
        targetPose.rElbowX = -0.62;
        targetPose.lHipX = -0.06;
        targetPose.rHipX = 0.05;
        targetPose.rHipZ = -0.07;
        targetPose.lKneeX = 0.08;
        break;
      }

      case "crouch_hero": {
        targetPose.hipsRotX = 0.42;
        targetPose.spineRotX = 0.28;
        targetPose.chestRotX = 0.16;
        targetPose.headRotX = -0.68;
        targetPose.headRotY = 0.08;
        targetPose.rHipX = -1.25;
        targetPose.rHipZ = -0.38;
        targetPose.rHipY = -0.22;
        targetPose.rKneeX = 1.48;
        targetPose.rAnkleX = -0.25;
        targetPose.lHipX = -0.45;
        targetPose.lHipZ = 0.34;
        targetPose.lKneeX = 1.65;
        targetPose.lAnkleX = -0.8;
        targetPose.lShoulderX = -0.82;
        targetPose.lShoulderZ = 0.14;
        targetPose.lElbowX = -0.15;
        targetPose.rShoulderX = 0.52;
        targetPose.rShoulderZ = -0.42;
        targetPose.rElbowX = -0.95;
        targetPose.rootY = -0.34 + breath * 0.01;
        break;
      }

      case "wave": {
        targetPose.rShoulderZ = -2.45 + Math.sin(elapsed * 7.5) * 0.25;
        targetPose.rShoulderX = -0.28;
        targetPose.rElbowX = -0.55 + Math.sin(elapsed * 7.5 + 0.6) * 0.38;
        targetPose.lShoulderZ = 0.2;
        targetPose.headRotZ = 0.12;
        targetPose.hipsRotZ = -0.05;
        break;
      }

      case "dance": {
        const beat = elapsed * 6.2;
        targetPose.rootX = Math.sin(beat * 0.5) * 0.12;
        targetPose.rootY = Math.abs(Math.sin(beat)) * 0.08;
        targetPose.hipsRotZ = Math.sin(beat * 0.5) * 0.18;
        targetPose.hipsRotY = Math.cos(beat * 0.5) * 0.24;
        targetPose.spineRotZ = -Math.sin(beat * 0.5) * 0.14;
        targetPose.chestRotY = -Math.cos(beat * 0.5) * 0.22;
        targetPose.headRotZ = Math.sin(beat * 0.5) * 0.12;
        targetPose.lShoulderZ = 1.05 + Math.sin(beat) * 0.65;
        targetPose.lShoulderX = -0.45 + Math.cos(beat) * 0.35;
        targetPose.lElbowX = -1.1 + Math.sin(beat) * 0.35;
        targetPose.rShoulderZ = -1.05 - Math.cos(beat) * 0.65;
        targetPose.rShoulderX = -0.45 - Math.sin(beat) * 0.35;
        targetPose.rElbowX = -1.1 - Math.cos(beat) * 0.35;
        targetPose.lHipX = -0.18 - Math.max(0, Math.sin(beat)) * 0.35;
        targetPose.lKneeX = 0.32 + Math.max(0, Math.sin(beat)) * 0.55;
        targetPose.rHipX = -0.18 - Math.max(0, -Math.sin(beat)) * 0.35;
        targetPose.rKneeX = 0.32 + Math.max(0, -Math.sin(beat)) * 0.55;
        break;
      }

      case "walk": {
        const s = Math.sin(elapsed * 4.6);
        const c = Math.cos(elapsed * 4.6);
        targetPose.rootY = Math.abs(c) * 0.035;
        targetPose.hipsRotY = s * 0.14;
        targetPose.hipsRotZ = s * 0.06;
        targetPose.chestRotY = -s * 0.14;
        targetPose.lHipX = -s * 0.48;
        targetPose.lKneeX = Math.max(0.05, s * 0.58 + 0.15);
        targetPose.rHipX = s * 0.48;
        targetPose.rKneeX = Math.max(0.05, -s * 0.58 + 0.15);
        targetPose.lShoulderX = s * 0.42;
        targetPose.lElbowX = -0.35;
        targetPose.rShoulderX = -s * 0.42;
        targetPose.rElbowX = -0.35;
        break;
      }

      case "run": {
        const s = Math.sin(elapsed * 9.5);
        const c = Math.cos(elapsed * 9.5);
        targetPose.spineRotX = 0.26;
        targetPose.headRotX = -0.2;
        targetPose.rootY = Math.abs(c) * 0.09;
        targetPose.lHipX = -s * 0.85;
        targetPose.lKneeX = Math.max(0.12, s * 1.1 + 0.35);
        targetPose.rHipX = s * 0.85;
        targetPose.rKneeX = Math.max(0.12, -s * 1.1 + 0.35);
        targetPose.lShoulderX = s * 0.95;
        targetPose.lElbowX = -1.35;
        targetPose.rShoulderX = -s * 0.95;
        targetPose.rElbowX = -1.35;
        break;
      }

      case "spin": {
        targetPose.rootRotY = (elapsed * 3.2) % (Math.PI * 2);
        targetPose.lShoulderZ = 0.55;
        targetPose.rShoulderZ = -0.55;
        targetPose.lElbowX = -0.45;
        targetPose.rElbowX = -0.45;
        targetPose.rootY = 0.03 + Math.sin(elapsed * 4) * 0.02;
        break;
      }

      case "heart": {
        targetPose.lShoulderX = -0.95;
        targetPose.lShoulderZ = 0.42;
        targetPose.lElbowX = -1.55;
        targetPose.lElbowZ = -0.62;
        targetPose.rShoulderX = -0.95;
        targetPose.rShoulderZ = -0.42;
        targetPose.rElbowX = -1.55;
        targetPose.rElbowZ = 0.62;
        targetPose.headRotZ = 0.1;
        targetPose.headRotX = 0.06;
        break;
      }

      case "hug": {
        targetPose.lShoulderX = -1.15;
        targetPose.lShoulderZ = 0.85 + Math.sin(elapsed * 3) * 0.1;
        targetPose.lElbowX = -0.35;
        targetPose.rShoulderX = -1.15;
        targetPose.rShoulderZ = -0.85 - Math.sin(elapsed * 3) * 0.1;
        targetPose.rElbowX = -0.35;
        targetPose.spineRotX = 0.08;
        targetPose.headRotZ = -0.08;
        break;
      }

      case "salute": {
        targetPose.rShoulderX = -1.45;
        targetPose.rShoulderZ = -0.65;
        targetPose.rElbowX = -1.85;
        targetPose.rElbowZ = 0.35;
        targetPose.lShoulderZ = 0.1;
        targetPose.lElbowX = -0.1;
        targetPose.chestRotX = -0.05;
        break;
      }

      case "kick": {
        const kickPhase = (Math.sin(elapsed * 4.2) + 1) * 0.5;
        targetPose.hipsRotY = 0.45;
        targetPose.spineRotY = -0.35;
        targetPose.spineRotZ = 0.25 * kickPhase;
        targetPose.lShoulderX = -1.05;
        targetPose.lElbowX = -1.45;
        targetPose.rShoulderX = -0.95;
        targetPose.rElbowX = -1.55;
        targetPose.rHipX = -1.55 * kickPhase;
        targetPose.rHipZ = -0.25 * kickPhase;
        targetPose.rKneeX = 0.25 * (1 - kickPhase);
        targetPose.lKneeX = 0.16;
        break;
      }

      case "punch": {
        const p = Math.sin(elapsed * 8.5);
        targetPose.hipsRotY = -0.35 + p * 0.18;
        targetPose.chestRotY = 0.32 - p * 0.28;
        targetPose.lShoulderX = -1.35 + Math.max(0, p) * 0.25;
        targetPose.lElbowX = -0.2 - Math.max(0, -p) * 1.45;
        targetPose.rShoulderX = -1.35 + Math.max(0, -p) * 0.25;
        targetPose.rElbowX = -0.2 - Math.max(0, p) * 1.45;
        targetPose.lHipX = -0.22;
        targetPose.lKneeX = 0.32;
        targetPose.rHipX = 0.18;
        targetPose.rKneeX = 0.24;
        targetPose.rootY = -0.05;
        break;
      }

      case "squat": {
        const sq = (Math.sin(elapsed * 3.2) + 1) * 0.5;
        targetPose.lHipX = -1.15 * sq;
        targetPose.lKneeX = 1.95 * sq;
        targetPose.lAnkleX = -0.75 * sq;
        targetPose.rHipX = -1.15 * sq;
        targetPose.rKneeX = 1.95 * sq;
        targetPose.rAnkleX = -0.75 * sq;
        targetPose.spineRotX = 0.35 * sq;
        targetPose.headRotX = -0.25 * sq;
        targetPose.lShoulderX = -1.1 * sq;
        targetPose.rShoulderX = -1.1 * sq;
        targetPose.rootY = -0.35 * sq;
        break;
      }

      case "sit": {
        targetPose.lHipX = -1.35;
        targetPose.lKneeX = 1.45;
        targetPose.lAnkleX = -0.15;
        targetPose.rHipX = -1.35;
        targetPose.rKneeX = 1.45;
        targetPose.rAnkleX = -0.15;
        targetPose.lShoulderX = -0.55;
        targetPose.lElbowX = -0.75;
        targetPose.rShoulderX = -0.55;
        targetPose.rElbowX = -0.75;
        targetPose.rootY = -0.36 + breath * 0.01;
        break;
      }

      case "jump": {
        const raw = Math.sin(elapsed * 4.8);
        const hop = Math.max(0, raw);
        const crouchPrep = Math.max(0, -raw);
        targetPose.rootY = hop * 0.42 - crouchPrep * 0.14;
        targetPose.lShoulderZ = 0.35 + hop * 2.1;
        targetPose.rShoulderZ = -0.35 - hop * 2.1;
        targetPose.lHipX = -0.25 * hop - 0.55 * crouchPrep;
        targetPose.lKneeX = 0.45 * hop + 0.95 * crouchPrep;
        targetPose.rHipX = -0.25 * hop - 0.55 * crouchPrep;
        targetPose.rKneeX = 0.45 * hop + 0.95 * crouchPrep;
        break;
      }

      case "bow": {
        targetPose.spineRotX = 0.48;
        targetPose.chestRotX = 0.25;
        targetPose.headRotX = 0.22;
        targetPose.rShoulderX = -0.85;
        targetPose.rElbowX = -1.3;
        targetPose.rElbowZ = 0.5;
        targetPose.lShoulderX = -0.2;
        break;
      }

      case "stretch": {
        const st = (Math.sin(elapsed * 1.8) + 1) * 0.5;
        targetPose.lShoulderZ = 2.65;
        targetPose.rShoulderZ = -2.65;
        targetPose.lElbowX = -0.35 + st * 0.25;
        targetPose.rElbowX = -0.35 + st * 0.25;
        targetPose.chestRotX = -0.14 * st;
        targetPose.headRotX = -0.18 * st;
        break;
      }

      case "nod": {
        targetPose.headRotX = Math.sin(elapsed * 9) * 0.24;
        break;
      }

      case "shake_no": {
        targetPose.headRotY = Math.sin(elapsed * 10) * 0.32;
        targetPose.rShoulderX = -0.85;
        targetPose.rElbowX = -1.1;
        targetPose.rShoulderZ = -0.35 + Math.sin(elapsed * 10) * 0.15;
        break;
      }

      default: {
        targetPose.hipsRotZ = 0.035 * Math.sin(elapsed * 0.9);
        targetPose.lShoulderX = 0.04 + (isSpeaking ? Math.sin(elapsed * 4) * 0.08 : 0);
        targetPose.rShoulderX = 0.04 + (isSpeaking ? Math.cos(elapsed * 4) * 0.08 : 0);
        targetPose.lElbowX = -0.22 - (isSpeaking ? Math.abs(Math.sin(elapsed * 3.5)) * 0.18 : 0);
        targetPose.rElbowX = -0.22 - (isSpeaking ? Math.abs(Math.cos(elapsed * 3.5)) * 0.18 : 0);
        break;
      }
    }

    const lambda = effectiveMove === "punch" || effectiveMove === "run" ? 16 : 9.5;
    const damp = (curr: number, targ: number, spd = lambda) =>
      THREE.MathUtils.damp(curr, targ, spd, safeDt);

    currPose.rootX = damp(currPose.rootX, targetPose.rootX);
    currPose.rootY = damp(currPose.rootY, targetPose.rootY);
    currPose.rootZ = damp(currPose.rootZ, targetPose.rootZ);
    if (effectiveMove === "spin") {
      currPose.rootRotY = targetPose.rootRotY;
    } else {
      currPose.rootRotY = damp(currPose.rootRotY, targetPose.rootRotY);
    }

    currPose.hipsRotX = damp(currPose.hipsRotX, targetPose.hipsRotX);
    currPose.hipsRotY = damp(currPose.hipsRotY, targetPose.hipsRotY);
    currPose.hipsRotZ = damp(currPose.hipsRotZ, targetPose.hipsRotZ);

    currPose.spineRotX = damp(currPose.spineRotX, targetPose.spineRotX);
    currPose.spineRotY = damp(currPose.spineRotY, targetPose.spineRotY);
    currPose.spineRotZ = damp(currPose.spineRotZ, targetPose.spineRotZ);

    currPose.chestRotX = damp(currPose.chestRotX, targetPose.chestRotX);
    currPose.chestRotY = damp(currPose.chestRotY, targetPose.chestRotY);
    currPose.chestRotZ = damp(currPose.chestRotZ, targetPose.chestRotZ);

    currPose.headRotX = damp(currPose.headRotX, targetPose.headRotX);
    currPose.headRotY = damp(currPose.headRotY, targetPose.headRotY);
    currPose.headRotZ = damp(currPose.headRotZ, targetPose.headRotZ);

    currPose.lShoulderX = damp(currPose.lShoulderX, targetPose.lShoulderX);
    currPose.lShoulderY = damp(currPose.lShoulderY, targetPose.lShoulderY);
    currPose.lShoulderZ = damp(currPose.lShoulderZ, targetPose.lShoulderZ);
    currPose.lElbowX = damp(currPose.lElbowX, targetPose.lElbowX);
    currPose.lElbowZ = damp(currPose.lElbowZ, targetPose.lElbowZ);

    currPose.rShoulderX = damp(currPose.rShoulderX, targetPose.rShoulderX);
    currPose.rShoulderY = damp(currPose.rShoulderY, targetPose.rShoulderY);
    currPose.rShoulderZ = damp(currPose.rShoulderZ, targetPose.rShoulderZ);
    currPose.rElbowX = damp(currPose.rElbowX, targetPose.rElbowX);
    currPose.rElbowZ = damp(currPose.rElbowZ, targetPose.rElbowZ);

    currPose.lHipX = damp(currPose.lHipX, targetPose.lHipX);
    currPose.lHipY = damp(currPose.lHipY, targetPose.lHipY);
    currPose.lHipZ = damp(currPose.lHipZ, targetPose.lHipZ);
    currPose.lKneeX = damp(currPose.lKneeX, targetPose.lKneeX);
    currPose.lAnkleX = damp(currPose.lAnkleX, targetPose.lAnkleX);

    currPose.rHipX = damp(currPose.rHipX, targetPose.rHipX);
    currPose.rHipY = damp(currPose.rHipY, targetPose.rHipY);
    currPose.rHipZ = damp(currPose.rHipZ, targetPose.rHipZ);
    currPose.rKneeX = damp(currPose.rKneeX, targetPose.rKneeX);
    currPose.rAnkleX = damp(currPose.rAnkleX, targetPose.rAnkleX);

    characterRoot.position.set(currPose.rootX, currPose.rootY, currPose.rootZ);
    characterRoot.rotation.y = currPose.rootRotY;

    hipsGroup.rotation.set(currPose.hipsRotX, currPose.hipsRotY, currPose.hipsRotZ);
    spineGroup.rotation.set(currPose.spineRotX, currPose.spineRotY, currPose.spineRotZ);
    chestGroup.rotation.set(currPose.chestRotX, currPose.chestRotY, currPose.chestRotZ);
    headGroup.rotation.set(currPose.headRotX, currPose.headRotY, currPose.headRotZ);

    leftArm.shoulderPivot.rotation.set(currPose.lShoulderX, currPose.lShoulderY, currPose.lShoulderZ);
    leftArm.elbowPivot.rotation.set(currPose.lElbowX, 0, currPose.lElbowZ);
    rightArm.shoulderPivot.rotation.set(currPose.rShoulderX, currPose.rShoulderY, currPose.rShoulderZ);
    rightArm.elbowPivot.rotation.set(currPose.rElbowX, 0, currPose.rElbowZ);

    leftLeg.hipPivot.rotation.set(currPose.lHipX, currPose.lHipY, currPose.lHipZ);
    leftLeg.kneePivot.rotation.x = currPose.lKneeX;
    leftLeg.anklePivot.rotation.x = currPose.lAnkleX;

    rightLeg.hipPivot.rotation.set(currPose.rHipX, currPose.rHipY, currPose.rHipZ);
    rightLeg.kneePivot.rotation.x = currPose.rKneeX;
    rightLeg.anklePivot.rotation.x = currPose.rAnkleX;

    // Spin orbital HUD rings & quantum core (strictly behind/below face)
    chestCoreRing.rotation.z = elapsed * 2.2;
    chestCoreOrb.rotation.y = elapsed * 3.0;
    holoHaloMesh.rotation.z = -elapsed * 1.1;
    pedestalInnerRing.rotation.z = elapsed * 1.15;
    midSegmentedRing.rotation.z = -elapsed * 0.75;
    faceEmitterInner.rotation.z = -elapsed * 1.3;

    const showHearts = isFullBody && (effectiveMove === "heart" || effectiveMove === "hug");
    heartSprites.visible = showHearts;
    if (showHearts) {
      heartSprites.rotation.y = elapsed * 1.4;
      heartSprites.children.forEach((child, i) => {
        child.position.y = 1.15 + ((elapsed * 0.55 + i * 0.25) % 0.75);
      });
    }

    thrusterMat.opacity = isFullBody && effectiveMove === "jump" && currPose.rootY > 0.08 ? 0.78 : 0;
  };

  const dispose = () => {
    disposables.forEach((d) => d.dispose());
  };

  return {
    root,
    pedestalRing,
    pedestalInnerRing,
    thrusterLeft,
    thrusterRight,
    heartSprites,
    update,
    dispose,
  };
}
