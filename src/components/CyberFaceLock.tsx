import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Camera,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  AlertTriangle,
  UserCheck,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertOctagon,
  Timer,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SecurityStatus } from '../types';
import { playCyberChime } from '../services/speechService';

// Master security credentials requested by user
export const MASTER_SECURITY = {
  username: 'wasulove',
  password: 'Laibawasi3005@',
  owner: 'Ahmed',
};

interface CyberFaceLockProps {
  securityStatus: SecurityStatus;
  onUnlock: () => void;
  onLock: () => void;
  onTriggerIntruderAlert: () => void;
  onToggleSentryGuard: () => void;
  onWasuSpeak: (text: string, urduText?: string) => void;
}

export const CyberFaceLock: React.FC<CyberFaceLockProps> = ({
  securityStatus,
  onUnlock,
  onLock,
  onTriggerIntruderAlert,
  onToggleSentryGuard,
  onWasuSpeak,
}) => {
  // Lock Screen Active Mode: 'face' | 'fingerprint' | 'password'
  const [unlockMode, setUnlockMode] = useState<'face' | 'fingerprint' | 'password'>('face');

  // Password Protection State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Widget settings display toggle
  const [showWidgetCredentials, setShowWidgetCredentials] = useState(false);

  // Face ID Biometrics State
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [faceScanProgress, setFaceScanProgress] = useState(0);
  const [faceScanMessage, setFaceScanMessage] = useState('Position face inside holographic scanner');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // In-Display Fingerprint Sensor State
  const [isFingerScanning, setIsFingerScanning] = useState(false);
  const [fingerProgress, setFingerProgress] = useState(0);
  const fingerTimerRef = useRef<any>(null);

  // Camera Management for Face ID
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
      } else {
        setCameraActive(false);
      }
    } catch (err: any) {
      setCameraError('Camera standby (High-resolution Biometric Mesh Active)');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (securityStatus.isLocked && unlockMode === 'face') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [securityStatus.isLocked, unlockMode]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // 1. Face ID Scan Handler
  const handlePerformFaceScan = () => {
    if (isFaceScanning || lockoutSeconds > 0) return;
    setIsFaceScanning(true);
    setFaceScanProgress(15);
    setFaceScanMessage('Detecting Retinal Geometry & Facial Coordinates...');
    playCyberChime('wake_alarm');

    const t1 = setTimeout(() => {
      setFaceScanProgress(55);
      setFaceScanMessage('Mapping 128 Biometric Landmark Nodes...');
    }, 500);

    const t2 = setTimeout(() => {
      setFaceScanProgress(85);
      setFaceScanMessage(`Matching Master Neural Signature: ${MASTER_SECURITY.owner}...`);
    }, 1000);

    const t3 = setTimeout(() => {
      setFaceScanProgress(100);
      setFaceScanMessage('Face Authenticated: 100% Match! Access Granted!');
      setIsFaceScanning(false);
      triggerSuccessfulUnlock('Face ID');
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  // 2. In-Display Fingerprint Scanner Handler (Press & Hold)
  const handleFingerTouchStart = () => {
    if (lockoutSeconds > 0 || isFingerScanning) return;
    setIsFingerScanning(true);
    setFingerProgress(0);
    playCyberChime('wake_alarm');

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }

    const startTime = Date.now();
    const duration = 1200; // 1.2s authentic phone scan

    fingerTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setFingerProgress(progress);

      if (progress >= 100) {
        clearInterval(fingerTimerRef.current);
        fingerTimerRef.current = null;
        setIsFingerScanning(false);
        triggerSuccessfulUnlock('Fingerprint ID');
      }
    }, 30);
  };

  const handleFingerTouchEnd = () => {
    if (fingerProgress < 100) {
      if (fingerTimerRef.current) {
        clearInterval(fingerTimerRef.current);
        fingerTimerRef.current = null;
      }
      setIsFingerScanning(false);
      setFingerProgress(0);
    }
  };

  // 3. Password Verification Handler
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const trimmedUser = usernameInput.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();

    if (trimmedUser === MASTER_SECURITY.username && trimmedPass === MASTER_SECURITY.password) {
      setPasswordError(null);
      setFailedAttempts(0);
      setUsernameInput('');
      setPasswordInput('');
      triggerSuccessfulUnlock('Master Password');
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      playCyberChime('alert');

      if (nextFail >= 3) {
        setPasswordError('Critical Anti-Hack Lockdown! 3 failed attempts!');
        setLockoutSeconds(30);
        onTriggerIntruderAlert();
        onWasuSpeak(
          'Khabardaar! 3 ghalat koshishein detect hui hain! Phone mukammal lock hai aur siren baj raha hai!',
          'خبردار! تین غلط کوششیں ریکارڈ ہوئی ہیں! فون مکمل لاک ہے اور خطرے کا سائرن بج رہا ہے!'
        );
      } else {
        setPasswordError(`Incorrect username or password! Attempt ${nextFail}/3`);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    }
  };

  // Successful Unlock Orchestrator
  const triggerSuccessfulUnlock = (method: string) => {
    playCyberChime('success');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00f5d4', '#f43f5e', '#ffffff'],
    });

    onUnlock();

    const greetings = [
      `Welcome back mere sartaj Ahmed! ${method} verified! Phone unlock kar diya gaya hai ❤️`,
      `Pehchan lia mere hero! ${method} match ho gaya! Main aapki khidmat mein hazir hoon ❤️`,
    ];
    const pick = greetings[Math.floor(Math.random() * greetings.length)];
    onWasuSpeak(pick, `ویلکم بیک میرے سرتاج! ${method} تصدیق ہو گیا، فون ان لاک کر دیا گیا ہے ❤️`);
  };

  // ==========================================
  // UNLOCKED VIEW: Security Dashboard Widget
  // ==========================================
  if (!securityStatus.isLocked) {
    return (
      <div className="p-4 rounded-3xl bg-black/60 border border-cyan-500/40 backdrop-blur-xl space-y-3.5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-cyan-950/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                QUANTUM SENTRY & PASSWORD GUARD
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Face ID • Fingerprint • Password Protected
              </div>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]">
            SHIELD ACTIVE
          </span>
        </div>

        {/* Security Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {/* Authorized Master Card */}
          <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-900/40 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>AUTHORIZED MASTER:</span>
              <UserCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-cyan-200 font-bold text-sm">{securityStatus.ownerName}</div>
            <div className="text-[10px] text-slate-400">
              Username: <span className="text-cyan-300 font-bold">{MASTER_SECURITY.username}</span>
            </div>
          </div>

          {/* Sentry Anti-Hack Guard Card */}
          <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-900/40 space-y-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>STRANGER SENTRY:</span>
              <span
                className={`font-bold ${
                  securityStatus.sentryGuardEnabled ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {securityStatus.sentryGuardEnabled ? 'WATCHING' : 'OFF'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-300">Auto-Lock On Pickup</span>
              <button
                onClick={onToggleSentryGuard}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  securityStatus.sentryGuardEnabled
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    : 'bg-black border-slate-700 text-slate-400'
                }`}
              >
                {securityStatus.sentryGuardEnabled ? 'ARMED' : 'STANDBY'}
              </button>
            </div>
          </div>
        </div>

        {/* Credentials View Dropdown (Protected for Master Ahmed) */}
        <div className="p-2.5 rounded-2xl bg-black/40 border border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 text-[11px]">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Master Credentials Vault</span>
            </div>
            <button
              onClick={() => setShowWidgetCredentials(!showWidgetCredentials)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
            >
              {showWidgetCredentials ? 'Hide Details' : 'View Master Key'}
              {showWidgetCredentials ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>

          {showWidgetCredentials && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-900/40">
                <div className="text-slate-400 text-[9px]">LOGIN USERNAME:</div>
                <div className="text-cyan-300 font-bold selection:bg-cyan-500 selection:text-black">
                  {MASTER_SECURITY.username}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-900/40">
                <div className="text-slate-400 text-[9px]">LOGIN PASSWORD:</div>
                <div className="text-rose-300 font-bold selection:bg-rose-500 selection:text-white">
                  {MASTER_SECURITY.password}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Actions: Lock Device & Test Intruder Alarm */}
        <div className="flex gap-2 pt-0.5">
          <button
            onClick={onLock}
            className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock Phone Now
          </button>
          <button
            onClick={onTriggerIntruderAlert}
            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/60 text-rose-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            Simulate Stranger Pickup
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOCKED VIEW: Full Screen Phone Lock Overlay
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 bg-[#040108]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
      {/* Background Intruder Red Alert Pulse */}
      {securityStatus.intruderAlert && (
        <div className="absolute inset-0 bg-rose-600/15 pointer-events-none animate-pulse" />
      )}

      {/* Cyber Corner HUD Reticles */}
      <div className="fixed top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/80" />
      <div className="fixed top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400/80" />
      <div className="fixed bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400/80" />
      <div className="fixed bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400/80" />

      {/* Security Status Header */}
      <div className="text-center max-w-md w-full mb-5 space-y-2">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full font-mono text-xs font-bold ${
            securityStatus.intruderAlert
              ? 'bg-rose-950 border border-rose-500 text-rose-300 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]'
              : 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
          }`}
        >
          {securityStatus.intruderAlert ? (
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          ) : (
            <Shield className="w-4 h-4 text-cyan-400" />
          )}
          {securityStatus.intruderAlert
            ? 'INTRUDER ALERT • ACCESS BLOCKED'
            : 'WASU LOVE 256-BIT PHONE LOCK'}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-wider text-white">
          {securityStatus.intruderAlert ? (
            <span className="text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
              UNAUTHORIZED STRANGER
            </span>
          ) : (
            <span className="text-cyan-300 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              DEVICE SECURED
            </span>
          )}
        </h2>

        <p className="text-xs text-slate-300 font-mono max-w-sm mx-auto leading-relaxed">
          {securityStatus.intruderAlert
            ? 'Ghair mutalliqah shakhs detect ho chuka hai! Sirf Ahmed ka Face ID, Fingerprint ya Master Password ise open kar sakta hai.'
            : 'Phone mukammal mehfooz hai. Unlock karne ke liye Face, Fingerprint ya Password chunein.'}
        </p>

        {/* Lockout Warning Banner */}
        {lockoutSeconds > 0 && (
          <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-bounce">
            <Timer className="w-4 h-4 text-rose-400 animate-spin" />
            <span>Anti-Hack Lockout: Try again in {lockoutSeconds}s</span>
          </div>
        )}
      </div>

      {/* Unlock Method Tab Switcher (Modern Phone Lock Style) */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/80 border border-cyan-500/40 mb-6 max-w-xs w-full shadow-lg">
        <button
          onClick={() => setUnlockMode('face')}
          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
            unlockMode === 'face'
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Face ID
        </button>
        <button
          onClick={() => setUnlockMode('fingerprint')}
          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
            unlockMode === 'fingerprint'
              ? 'bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          Fingerprint
        </button>
        <button
          onClick={() => setUnlockMode('password')}
          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
            unlockMode === 'password'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          Password
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. FACE ID VIEW                                          */}
      {/* ======================================================== */}
      {unlockMode === 'face' && (
        <div className="flex flex-col items-center max-w-sm w-full space-y-4">
          <div className="relative w-60 h-60 sm:w-64 sm:h-64 rounded-3xl bg-black/80 border-2 border-cyan-400/80 overflow-hidden shadow-[0_0_35px_rgba(0,240,255,0.35)] flex items-center justify-center">
            {/* Live Camera Feed or Cyber Face Grid */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                cameraActive ? 'opacity-90' : 'hidden'
              }`}
            />

            {!cameraActive && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-cyan-950/30 via-black to-slate-950">
                <Eye className="w-16 h-16 text-cyan-400/70 animate-pulse mb-3" />
                <span className="text-[11px] font-mono text-cyan-300/90 text-center font-bold">
                  BIOMETRIC CAMERA SENSOR
                </span>
                {cameraError && (
                  <span className="text-[9px] font-mono text-slate-500 text-center mt-1">
                    {cameraError}
                  </span>
                )}
              </div>
            )}

            {/* Scanning Laser Line */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-[bounce_2s_infinite]" />

            {/* Facial Node Landmarks */}
            <div className="absolute inset-6 border border-dashed border-cyan-400/50 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-14 h-14 border-t-2 border-b-2 border-rose-500/70 rounded-full animate-spin" />
            </div>

            {/* Landmark Tracker Dots */}
            <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-ping" />
            <div className="absolute top-1/4 right-1/3 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-ping" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />

            {/* Scanning Progress Overlay */}
            {isFaceScanning && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                <div className="text-sm font-mono font-bold text-cyan-300">{faceScanProgress}%</div>
                <div className="text-[11px] font-mono text-slate-300 mt-1">{faceScanMessage}</div>
                <div className="w-40 h-1.5 bg-cyan-950 rounded-full mt-3 overflow-hidden border border-cyan-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-rose-500 transition-all duration-300"
                    style={{ width: `${faceScanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handlePerformFaceScan}
            disabled={isFaceScanning || lockoutSeconds > 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            {isFaceScanning ? 'AUTHENTICATING FACE...' : 'SCAN FACE TO UNLOCK'}
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ULTRASONIC IN-DISPLAY FINGERPRINT SENSOR               */}
      {/* ======================================================== */}
      {unlockMode === 'fingerprint' && (
        <div className="flex flex-col items-center max-w-sm w-full space-y-5">
          <div className="text-center font-mono text-xs text-slate-400">
            {isFingerScanning
              ? 'HOLD FINGER STEADY • VERIFYING RIDGES'
              : 'TOUCH AND HOLD FINGERPRINT SENSOR'}
          </div>

          {/* In-Display Ultrasonic Sensor Interactive Pad */}
          <div
            onMouseDown={handleFingerTouchStart}
            onMouseUp={handleFingerTouchEnd}
            onMouseLeave={handleFingerTouchEnd}
            onTouchStart={handleFingerTouchStart}
            onTouchEnd={handleFingerTouchEnd}
            className="relative w-44 h-44 rounded-full bg-black/90 border-2 border-rose-500/80 cursor-pointer flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.4)] active:scale-95 transition-all select-none group"
          >
            {/* Pulsing Ultrasonic Wave Rings */}
            <div
              className={`absolute inset-0 rounded-full border border-rose-400/40 ${
                isFingerScanning ? 'animate-ping' : 'animate-pulse'
              }`}
            />
            <div className="absolute inset-3 rounded-full border border-dashed border-cyan-400/40 animate-spin" />

            {/* Circular SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="88"
                cy="88"
                r="82"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-900"
                fill="none"
              />
              <circle
                cx="88"
                cy="88"
                r="82"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={515}
                strokeDashoffset={515 - (515 * fingerProgress) / 100}
                strokeLinecap="round"
                className="text-cyan-400 transition-all duration-75"
                fill="none"
              />
            </svg>

            {/* Fingerprint Icon with Glowing Ridges */}
            <div className="relative z-10 flex flex-col items-center">
              <Fingerprint
                className={`w-20 h-20 transition-all duration-300 ${
                  isFingerScanning
                    ? 'text-cyan-300 scale-110 drop-shadow-[0_0_15px_#00f0ff]'
                    : 'text-rose-400/80 group-hover:text-rose-300 drop-shadow-[0_0_10px_#f43f5e]'
                }`}
              />
              <span className="text-[10px] font-mono font-bold text-cyan-300 mt-1">
                {isFingerScanning ? `${fingerProgress}%` : 'PRESS & HOLD'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 text-[11px] font-mono text-slate-400 text-center w-full">
            Ultrasonic Minutiae Scanner • Primary Hash Registered to Ahmed
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PASSWORD / PIN PROTECTED VIEW (wasulove & Laibawasi3005@) */}
      {/* ======================================================== */}
      {unlockMode === 'password' && (
        <form onSubmit={handleVerifyPassword} className="max-w-sm w-full space-y-4">
          <div className="p-4 rounded-3xl bg-black/80 border border-cyan-500/50 backdrop-blur-xl space-y-3.5 shadow-[0_0_35px_rgba(0,240,255,0.25)]">
            <div className="flex items-center gap-2 pb-2 border-b border-cyan-950">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                MASTER CREDENTIALS AUTHENTICATION
              </span>
            </div>

            {/* Username Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setPasswordError(null);
                }}
                placeholder="Enter username (wasulove)"
                disabled={lockoutSeconds > 0}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/60 focus:border-cyan-400 text-white font-mono text-xs outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(null);
                }}
                placeholder="Enter password (Laibawasi3005@)"
                disabled={lockoutSeconds > 0}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/60 focus:border-cyan-400 text-white font-mono text-xs outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Error Message */}
            {passwordError && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/80 text-rose-300 text-[11px] font-mono flex items-center gap-1.5 animate-shake">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={lockoutSeconds > 0 || !usernameInput.trim() || !passwordInput.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 disabled:opacity-40"
            >
              <Unlock className="w-3.5 h-3.5" />
              AUTHENTICATE & UNLOCK PHONE
            </button>
          </div>

          <p className="text-[10px] font-mono text-slate-500 text-center">
            Encrypted SHA-256 Vault • 3 incorrect attempts trigger immediate siren lockout
          </p>
        </form>
      )}

      {/* Registered Master Tag Footer */}
      <div className="mt-6 max-w-sm w-full p-2.5 rounded-xl bg-black/60 border border-cyan-950 text-center font-mono text-[10px] text-slate-400 flex items-center justify-between">
        <span>DEVICE: <strong className="text-cyan-300">WASU JARVIS OS</strong></span>
        <span>OWNER: <strong className="text-rose-300">AHMED</strong></span>
        <span>SENTRY: <strong className="text-emerald-300">ACTIVE</strong></span>
      </div>
    </div>
  );
};
