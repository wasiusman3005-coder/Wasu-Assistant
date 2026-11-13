import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Volume2, Radio, RotateCcw, User, Sparkles } from "lucide-react";
import { AvatarBodyMovement, HologramDisplayMode, StandbyAnimationType } from "../types";
import { createCyberGirl3DRig } from "../utils/cyberGirl3DRig";

export const CYBER_GIRL_PORTRAIT_URL = "/assets/aistudio/images__5__ddc17e2d.jpg";

// Pre-allocated vectors for zero-GC cinematic camera damping
const _camGoal = new THREE.Vector3();
const _targetGoal = new THREE.Vector3();

interface CyberGirlFullBodyAvatarProps {
  isSpeaking: boolean;
  isListening?: boolean;
  bodyMovement?: AvatarBodyMovement;
  standbyAnimation?: StandbyAnimationType;
  hologramMode?: HologramDisplayMode;
  cinematicTrigger?: number;
  onToggleHologramMode?: (mode: HologramDisplayMode) => void;
  personalityName?: string;
  size?: "sm" | "md" | "lg" | "uhd";
  onClickAvatar?: () => void;
}

export const CyberGirlFullBodyAvatar: React.FC<CyberGirlFullBodyAvatarProps> = ({
  isSpeaking,
  isListening = false,
  bodyMovement = "idle",
  standbyAnimation = "breathe",
  hologramMode = "face",
  cinematicTrigger = 0,
  onToggleHologramMode,
  personalityName = "Zoya (Your Cyber Girlfriend)",
  size = "uhd",
  onClickAvatar,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [mouthPulse, setMouthPulse] = useState(0);
  const [webglFailed, setWebglFailed] = useState(false);

  // Scripted cinematic camera transition state kept in ref so WebGL canvas never remounts
  const camScriptRef = useRef<{
    active: boolean;
    phaseElapsed: number;
    phaseDuration: number;
    mode: HologramDisplayMode;
  }>({
    active: true,
    phaseElapsed: 0,
    phaseDuration: 1.8,
    mode: hologramMode,
  });

  const stateRef = useRef({
    isSpeaking,
    isListening,
    bodyMovement,
    standbyAnimation,
    hologramMode,
  });

  // Trigger cinematic camera glide whenever hologramMode or cinematicTrigger changes
  useEffect(() => {
    const prevMode = stateRef.current.hologramMode;
    stateRef.current = {
      isSpeaking,
      isListening,
      bodyMovement,
      standbyAnimation,
      hologramMode,
    };

    if (prevMode !== hologramMode || cinematicTrigger > 0) {
      camScriptRef.current = {
        active: true,
        phaseElapsed: 0,
        phaseDuration: hologramMode === "fullbody" ? 2.4 : 1.2,
        mode: hologramMode,
      };
      if (cameraRef.current && controlsRef.current) {
        if (hologramMode === "fullbody" && prevMode === "face") {
          // Sweep smoothly outward from heroic low-left angle
          cameraRef.current.position.set(-0.85, 0.72, 1.9);
        }
        controlsRef.current.minDistance = hologramMode === "face" ? 0.45 : 1.35;
        controlsRef.current.maxDistance = hologramMode === "face" ? 1.8 : 4.6;
      }
    }
  }, [isSpeaking, isListening, bodyMovement, standbyAnimation, hologramMode, cinematicTrigger]);

  // Voice waveform pulse for footer indicator
  useEffect(() => {
    if (!isSpeaking) {
      setMouthPulse(0);
      return;
    }
    const timer = setInterval(() => {
      setMouthPulse(Math.random() * 0.85 + 0.15);
    }, 85);
    return () => clearInterval(timer);
  }, [isSpeaking]);

  // Real-Time 3D Hologram WebGL Scene Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const initialW = Math.max(container.clientWidth || 320, 140);
    const initialH = Math.max(container.clientHeight || 440, 180);

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement("canvas").getContext("webgl2");
        if (!probe) return true;
        const ext = probe.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, size === "sm" ? 1.5 : 2.5)
    );
    renderer.setSize(initialW, initialH);
    renderer.shadowMap.enabled = false;

    container.innerHTML = "";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030816, 0.08);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const startFace = stateRef.current.hologramMode === "face";
    const camera = new THREE.PerspectiveCamera(35, initialW / initialH, 0.08, 40);
    if (startFace) {
      camera.position.set(0, 1.57, 0.74);
    } else {
      camera.position.set(0.32, 1.05, 2.65);
    }
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, startFace ? 1.57 : 0.88, startFace ? 0.04 : 0.02);
    controls.enablePan = false;
    controls.enableZoom = size !== "sm";
    controls.enableRotate = size !== "sm";
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = startFace ? 0.45 : 1.35;
    controls.maxDistance = startFace ? 1.8 : 4.6;
    controls.maxPolarAngle = Math.PI * 0.56;
    controls.minPolarAngle = Math.PI * 0.16;
    controls.update();
    controlsRef.current = controls;

    // Yield scripted cinematic camera motion immediately if user drags manually
    const onUserControlStart = () => {
      camScriptRef.current.active = false;
    };
    controls.addEventListener("start", onUserControlStart);

    // Balanced Studio Lighting Rig for Projector Base
    const hemiLight = new THREE.HemisphereLight(0xcbe8ff, 0x0f172a, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 1.6);
    keyLight.position.set(1.8, 3.2, 2.6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.25);
    rimLight.position.set(-2.0, 2.1, -2.2);
    scene.add(rimLight);

    // Deep Obsidian Projector Deck under Pedestal
    const floorGeo = new THREE.CircleGeometry(1.9, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x020612,
      roughness: 0.45,
      metalness: 0.55,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.048;
    scene.add(floorMesh);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const rig = createCyberGirl3DRig(maxAniso);
    scene.add(rig.root);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const status = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 6);
    };

    const tick = () => {
      if (disposed) return;
      const dt = Math.max(clock.getDelta(), 0.001);
      const elapsed = clock.getElapsedTime();
      const {
        bodyMovement: mv,
        standbyAnimation: sb,
        hologramMode: hm,
        isSpeaking: spk,
        isListening: lst,
      } = stateRef.current;

      rig.update({
        dt,
        elapsed,
        movement: mv,
        standby: sb,
        hologramMode: hm,
        isSpeaking: spk,
        isListening: lst,
      });

      // Smooth damped cinematic camera glides (auto-stops when arrived or on user drag)
      const script = camScriptRef.current;
      if (script.active) {
        script.phaseElapsed += dt;
        const safeDt = Math.min(dt, 0.05);
        if (script.mode === "face") {
          _camGoal.set(0, 1.57, 0.74);
          _targetGoal.set(0, 1.57, 0.04);
        } else {
          // Two-beat cinematic sweep: low heroic pan -> full-body showcase hero angle
          const t = Math.min(1, script.phaseElapsed / script.phaseDuration);
          if (t < 0.42) {
            _camGoal.set(-0.55, 0.85, 2.25);
            _targetGoal.set(0, 1.05, 0);
          } else {
            _camGoal.set(0.32, 1.04, 2.68);
            _targetGoal.set(0, 0.88, 0);
          }
        }
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoal.x, 3.8, safeDt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoal.y, 3.8, safeDt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoal.z, 3.8, safeDt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetGoal.x, 4.5, safeDt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetGoal.y, 4.5, safeDt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetGoal.z, 4.5, safeDt);

        if (
          script.phaseElapsed >= script.phaseDuration &&
          camera.position.distanceTo(_camGoal) < 0.025
        ) {
          script.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 100);
        const h = Math.max(entry.contentRect.height, 120);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener("start", onUserControlStart);
      resizeObserver.disconnect();
      controls.dispose();
      rig.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  const handleResetCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    camScriptRef.current = {
      active: true,
      phaseElapsed: 0,
      phaseDuration: hologramMode === "fullbody" ? 1.8 : 1.0,
      mode: hologramMode,
    };
  };

  const frameDimensions =
    size === "sm"
      ? "w-40 h-52"
      : size === "md"
      ? "w-60 h-80"
      : size === "lg"
      ? "w-72 h-[410px]"
      : "w-full h-[430px] sm:h-[490px]";

  const moveLabelMap: Record<AvatarBodyMovement, string> = {
    idle: hologramMode === "face" ? "3D FACE HOLOGRAM" : "3D HOLOGRAM STANDBY",
    showcase: "CINEMATIC HUMANOID REVEAL",
    crouch_hero: "HOLOGRAM HERO CROUCH",
    wave: "HOLOGRAM WAVING",
    dance: "HOLOGRAM 3D DANCE",
    walk: "HOLOGRAM CATWALK",
    run: "HOLOGRAM SPRINT",
    spin: "360° HOLOGRAM TURN",
    heart: "HOLOGRAM FLYING KISS",
    hug: "HOLOGRAM HUG",
    salute: "COMMANDER SALUTE",
    kick: "HOLOGRAM KARATE KICK",
    punch: "HOLOGRAM COMBAT",
    squat: "HOLOGRAM SQUATS",
    sit: "HOLOGRAM SEATED",
    jump: "HOLOGRAM THRUSTER JUMP",
    bow: "HOLOGRAM BOW",
    stretch: "HOLOGRAM STRETCH",
    nod: "HOLOGRAM NOD",
    shake_no: "HOLOGRAM NO",
    freestyle: "FREESTYLE 3D HOLOGRAM",
  };

  return (
    <div
      onClick={onClickAvatar}
      className={`relative flex flex-col items-center justify-between select-none ${frameDimensions} ${
        onClickAvatar ? "cursor-pointer" : ""
      }`}
    >
      {/* Top Mode Toggle, Camera Hint & Reset Button (No backdrop-blur over WebGL!) */}
      {size !== "sm" && (
        <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-between pointer-events-none gap-2">
          <div className="flex items-center gap-1 pointer-events-auto">
            {onToggleHologramMode ? (
              <div className="flex items-center rounded bg-[#030916]/95 border border-cyan-500/40 p-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleHologramMode("face");
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                    hologramMode === "face"
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-cyan-200 hover:text-white"
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Face Holo</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleHologramMode("fullbody");
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                    hologramMode === "fullbody"
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-cyan-200 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Full Model</span>
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-300 bg-[#030916]/90 px-2 py-0.5 rounded border border-cyan-400/40">
                {hologramMode === "face" ? "Face Hologram" : "Full 3D Model"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="hidden sm:inline text-[10px] font-mono text-cyan-200/80 bg-[#040918]/90 px-2 py-0.5 rounded border border-cyan-500/30">
              Drag 360°
            </span>
            <button
              type="button"
              onClick={handleResetCamera}
              title="Reset / Replay Cinematic View"
              className="p-1 rounded bg-[#040918]/90 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Isolated 3D Hologram WebGL Viewport Container */}
      {!webglFailed ? (
        <div
          ref={mountRef}
          className="w-full flex-1 min-h-0 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-cyan-500/25 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.18)_0%,rgba(4,10,24,0.92)_68%,rgba(2,5,14,0.98)_100%)]"
          aria-label={`${personalityName} 3D Hologram Projection`}
        />
      ) : (
        <div className="w-full flex-1 flex items-center justify-center rounded-xl border border-cyan-500/30 bg-[#030714]">
          <img
            src={CYBER_GIRL_PORTRAIT_URL}
            alt={personalityName}
            referrerPolicy="no-referrer"
            className="h-full object-contain rounded-xl opacity-85"
          />
        </div>
      )}

      {/* Bottom Compact Telemetry Bar (No backdrop-filter over WebGL!) */}
      <div className="relative z-20 mt-1 flex items-center gap-2 px-3 py-1 rounded-md bg-[#030712] border border-cyan-500/45 pointer-events-none">
        {isSpeaking ? (
          <>
            <div className="flex items-end gap-0.5 h-3.5">
              {[0.45, 0.9, 0.7, 1, 0.6, 0.85, 0.5].map((m, i) => (
                <span
                  key={i}
                  className="w-0.5 rounded-sm bg-cyan-300 transition-all duration-75"
                  style={{ height: `${Math.max(3, Math.round(mouthPulse * m * 14))}px` }}
                />
              ))}
            </div>
            <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-[10px] font-mono font-semibold text-cyan-200 whitespace-nowrap">
              {size === "sm" ? "Holo Voice" : "Hologram Speaking"}
            </span>
          </>
        ) : (
          <>
            <Radio className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="text-[10px] font-mono font-semibold text-cyan-100 whitespace-nowrap">
              {moveLabelMap[bodyMovement]}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
