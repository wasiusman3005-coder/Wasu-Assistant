import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Tablet,
  Watch,
  Monitor,
  Lightbulb,
  Headphones,
  Plug,
  Wifi,
  Bluetooth,
  BatteryCharging,
  Battery,
  Signal,
  BellRing,
  Lock,
  Unlock,
  Radio,
  Share2,
  Sliders,
  Volume2,
  VolumeX,
  Power,
  RefreshCw,
  QrCode,
  Plus,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Cpu,
  Activity,
  HardDrive,
  Cast,
} from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { fetchSystemTelemetry } from "../services/systemTelemetry";
import {
  LanguageCode,
  VoiceGender,
  ConnectedDeviceItem,
  DeviceCommandLog,
  DeviceType,
} from "../types";

interface DigitalDeviceBridgeSuiteProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
  onOpenMapLocation?: (lat: number, lng: number) => void;
}

export const DigitalDeviceBridgeSuite: React.FC<DigitalDeviceBridgeSuiteProps> = ({
  language,
  voiceGender,
  onOpenMapLocation,
}) => {
  const [activeTab, setActiveTab] = useState<"devices" | "iot_studio" | "pairing" | "logs">("devices");

  // Initial Connected Devices State (Host PC is synced live first)
  const [devices, setDevices] = useState<ConnectedDeviceItem[]>([
    {
      id: "dev-host-pc",
      name: "This Host PC (Connecting...)",
      type: "pc",
      model: "Probing Host Hardware...",
      osVersion: "Detecting OS...",
      protocol: "WiFi_LAN",
      ipAddress: "127.0.0.1",
      status: "online",
      lastPing: "Live",
      paired: true,
      controllableStates: {
        power: true,
      },
      metrics: {
        storageUsedGb: 0,
        storageTotalGb: 0,
        ramUsedPercent: 0,
      },
    },
    {
      id: "dev-mob-1",
      name: "Commander Mobile (Galaxy S24 Ultra)",
      type: "mobile",
      model: "SM-S928B • 512GB Titanium",
      osVersion: "Android 15 • OneUI 7.0",
      protocol: "WiFi_LAN",
      ipAddress: "192.168.1.108",
      batteryPercent: 88,
      isCharging: true,
      signalStrengthDbm: -62,
      status: "online",
      lastPing: "Just now",
      paired: true,
      controllableStates: {
        power: true,
        hotspotActive: false,
        screenLocked: false,
        doNotDisturb: false,
        ringing: false,
      },
      metrics: {
        storageUsedGb: 198,
        storageTotalGb: 512,
        ramUsedPercent: 44,
      },
      location: {
        lat: 31.5326,
        lng: 74.3412,
        locationName: "Gulberg III, Lahore (4.2 km from Base)",
      },
    },
    {
      id: "dev-tab-1",
      name: "Studio iPad Pro M4",
      type: "tablet",
      model: "iPad Pro 13-inch M4 • 256GB",
      osVersion: "iPadOS 18.2",
      protocol: "BLE",
      ipAddress: "192.168.1.115",
      batteryPercent: 94,
      isCharging: false,
      signalStrengthDbm: -55,
      status: "online",
      lastPing: "1m ago",
      paired: true,
      controllableStates: {
        power: true,
        screenLocked: true,
        doNotDisturb: true,
      },
      metrics: {
        storageUsedGb: 74,
        storageTotalGb: 256,
        ramUsedPercent: 32,
      },
    },
    {
      id: "dev-wear-1",
      name: "Quantum Biometric Watch",
      type: "wearable",
      model: "Galaxy Watch Ultra 47mm",
      osVersion: "Wear OS 5",
      protocol: "BLE",
      batteryPercent: 76,
      isCharging: false,
      status: "online",
      lastPing: "Just now",
      paired: true,
      controllableStates: {
        power: true,
      },
      metrics: {
        heartRateBpm: 74,
        stepsToday: 8420,
      },
    },
    {
      id: "dev-light-1",
      name: "Nanoleaf Quantum RGB Light Bar",
      type: "smart_light",
      model: "RGBIC Smart Studio Strips",
      protocol: "WiFi_LAN",
      ipAddress: "192.168.1.201",
      status: "online",
      lastPing: "Just now",
      paired: true,
      controllableStates: {
        power: true,
        brightness: 85,
        colorHex: "#06b6d4",
      },
    },
    {
      id: "dev-dac-1",
      name: "Topping DX7 Pro+ Audio DAC",
      type: "audio_dac",
      model: "Dual ES9038PRO Balanced DAC/Amp",
      protocol: "USB_C",
      status: "online",
      lastPing: "Just now",
      paired: true,
      controllableStates: {
        power: true,
        volume: 68,
      },
    },
    {
      id: "dev-plug-1",
      name: "Server Rack Smart Plug",
      type: "smart_plug",
      model: "16A Smart Energy Monitor",
      protocol: "WiFi_LAN",
      ipAddress: "192.168.1.220",
      status: "online",
      lastPing: "Just now",
      paired: true,
      controllableStates: {
        power: true,
      },
    },
  ]);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("dev-host-pc");
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0];

  useEffect(() => {
    let cancelled = false;
    const syncHostPc = async () => {
      const tel = await fetchSystemTelemetry();
      if (cancelled || !tel) return;
      setDevices((prev) =>
        prev.map((d) =>
          d.id === "dev-host-pc"
            ? {
                ...d,
                name: `${tel.hostname} (This PC)`,
                model: `${tel.cpuModel} • ${tel.gpuName}`,
                osVersion: tel.osCaption,
                ipAddress: tel.ipAddress,
                batteryPercent: tel.batteryPercent ?? undefined,
                isCharging: tel.isCharging ?? undefined,
                status: "online",
                lastPing: "Live Host",
                metrics: {
                  storageUsedGb: tel.primaryDisk.usedGb,
                  storageTotalGb: tel.primaryDisk.totalGb,
                  ramUsedPercent: tel.ramPercent,
                },
              }
            : d
        )
      );
    };
    syncHostPc();
    const timer = setInterval(syncHostPc, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // Device Command Logs
  const [logs, setLogs] = useState<DeviceCommandLog[]>([
    {
      id: "log-1",
      deviceId: "dev-mob-1",
      deviceName: "Commander Mobile",
      action: "Clipboard Synced: 'https://meet.google.com/qnx-wasi-demo'",
      timestamp: "12m ago",
      status: "success",
    },
    {
      id: "log-2",
      deviceId: "dev-light-1",
      deviceName: "Nanoleaf RGB Light Bar",
      action: "Preset Switched to 'Cyber Cyan #06b6d4' (85% Brightness)",
      timestamp: "35m ago",
      status: "success",
    },
    {
      id: "log-3",
      deviceId: "dev-mob-1",
      deviceName: "Commander Mobile",
      action: "Battery Health Check: 88% Fast Wireless Charging",
      timestamp: "1h ago",
      status: "success",
    },
  ]);

  // Pairing Scanner State
  const [isScanningNew, setIsScanningNew] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<{
    id: string;
    name: string;
    type: DeviceType;
    protocol: string;
    signal: string;
  }[]>([
    {
      id: "disc-1",
      name: "Keychron Q3 Max (Bluetooth)",
      type: "peripherals",
      protocol: "BLE 5.2",
      signal: "-48 dBm (Strong)",
    },
    {
      id: "disc-2",
      name: "Sony WH-1000XM5 Studio",
      type: "audio_dac",
      protocol: "LDAC Bluetooth",
      signal: "-58 dBm (Good)",
    },
    {
      id: "disc-3",
      name: "Pixel 9 Pro Fold (Nearby)",
      type: "mobile",
      protocol: "Wi-Fi Direct",
      signal: "-65 dBm (Good)",
    },
  ]);

  const [copiedText, setCopiedText] = useState(false);
  const [quickSmsDraft, setQuickSmsDraft] = useState("Assalam o Alaikum! Wasi Sahab ki taraf se Q-Nexus OS auto notification.");

  // Helper to add log
  const addLog = (deviceId: string, deviceName: string, action: string) => {
    const newLog: DeviceCommandLog = {
      id: `log-${Date.now()}`,
      deviceId,
      deviceName,
      action,
      timestamp: "Just now",
      status: "success",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Actions on Mobile / Device
  const handleTogglePower = (deviceId: string) => {
    soundEffects.playClick();
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const nextPower = !d.controllableStates.power;
          addLog(d.id, d.name, `Power turned ${nextPower ? "ON" : "OFF"}`);
          return {
            ...d,
            controllableStates: { ...d.controllableStates, power: nextPower },
            status: nextPower ? "online" : "offline",
          };
        }
        return d;
      })
    );
  };

  const handleRingPhone = (deviceId: string) => {
    soundEffects.playAlert();
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const nextRinging = !d.controllableStates.ringing;
          addLog(d.id, d.name, nextRinging ? "TRIGGERED FIND MY PHONE ALARM" : "Stopped Alarm");
          return {
            ...d,
            controllableStates: { ...d.controllableStates, ringing: nextRinging },
          };
        }
        return d;
      })
    );

    const vocal =
      language === "pa"
        ? "Wasi paji, mobile te loud siren bajna shuru ho gaya ae!"
        : "Find My Phone triggered! Loud alarm and flashlight activated on Commander's phone.";
    speechService.speak(vocal, { lang: language, gender: voiceGender });
  };

  const handleToggleHotspot = (deviceId: string) => {
    soundEffects.playClick();
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const next = !d.controllableStates.hotspotActive;
          addLog(d.id, d.name, `Mobile 5G Hotspot ${next ? "ENABLED" : "DISABLED"}`);
          return {
            ...d,
            controllableStates: { ...d.controllableStates, hotspotActive: next },
          };
        }
        return d;
      })
    );
    soundEffects.playBeepConfirm();
  };

  const handleToggleScreenLock = (deviceId: string) => {
    soundEffects.playClick();
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const next = !d.controllableStates.screenLocked;
          addLog(d.id, d.name, `Device Screen ${next ? "LOCKED" : "UNLOCKED"}`);
          return {
            ...d,
            controllableStates: { ...d.controllableStates, screenLocked: next },
          };
        }
        return d;
      })
    );
  };

  const handleSyncClipboard = (deviceId: string) => {
    soundEffects.playBeepConfirm();
    navigator.clipboard.writeText("https://nexus.quantum-wasi.ai/token/4096-auth");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    addLog(deviceId, selectedDevice.name, "Synced bidirectional clipboard buffer between PC and Mobile.");
    speechService.speak("PC clipboard buffer synchronized with mobile device.", {
      lang: language,
      gender: voiceGender,
    });
  };

  const handleLightColorChange = (hex: string) => {
    soundEffects.playClick();
    setDevices((prev) =>
      prev.map((d) =>
        d.id === "dev-light-1"
          ? {
              ...d,
              controllableStates: { ...d.controllableStates, colorHex: hex },
            }
          : d
      )
    );
    addLog("dev-light-1", "Nanoleaf RGB Light Bar", `Color changed to ${hex}`);
  };

  const handleLightBrightnessChange = (brightness: number) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === "dev-light-1"
          ? {
              ...d,
              controllableStates: { ...d.controllableStates, brightness },
            }
          : d
      )
    );
  };

  const handleVolumeChange = (volume: number) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === "dev-dac-1"
          ? {
              ...d,
              controllableStates: { ...d.controllableStates, volume },
            }
          : d
      )
    );
  };

  const handleScanDiscovery = () => {
    soundEffects.playScan();
    setIsScanningNew(true);
    setTimeout(() => {
      setIsScanningNew(false);
      soundEffects.playBeepConfirm();
      speechService.speak(
        language === "pa"
          ? "Nave devices scan ho gaye ne Wasi paji! 3 devices pair karan layi ready ne."
          : "Device discovery complete. 3 nearby Bluetooth & Wi-Fi peripherals found.",
        { lang: language, gender: voiceGender }
      );
    }, 1200);
  };

  const handlePairDiscovered = (disc: { id: string; name: string; type: DeviceType; protocol: string }) => {
    soundEffects.playBeepConfirm();
    const newDevice: ConnectedDeviceItem = {
      id: `dev-${Date.now()}`,
      name: disc.name,
      type: disc.type,
      model: disc.protocol,
      protocol: "BLE",
      status: "online",
      lastPing: "Just now",
      paired: true,
      batteryPercent: 90,
      controllableStates: {
        power: true,
      },
    };

    setDevices((prev) => [...prev, newDevice]);
    setDiscoveredDevices((prev) => prev.filter((d) => d.id !== disc.id));
    addLog(newDevice.id, newDevice.name, `Successfully paired via ${disc.protocol}`);
    speechService.speak(`Paired ${newDevice.name} to Quantum Jarvis OS.`, {
      lang: language,
      gender: voiceGender,
    });
  };

  return (
    <div className="w-full h-full flex flex-col font-rajdhani select-none overflow-hidden">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-3 mb-4 overflow-x-auto shrink-0">
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("devices");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "devices"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-cyan-300 border border-slate-800"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>CONNECTED MOBILE & TABLETS</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("iot_studio");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "iot_studio"
              ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-purple-300 border border-slate-800"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>STUDIO HARDWARE & IOT DAC</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("pairing");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "pairing"
              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-emerald-300 border border-slate-800"
          }`}
        >
          <Bluetooth className="w-4 h-4" />
          <span>PAIR NEW DEVICE & QR SYNC</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("logs");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "logs"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-amber-300 border border-slate-800"
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>DEVICE AUDIT LOGS</span>
        </button>
      </div>

      {/* Tab 1: Connected Mobile & Tablets */}
      {activeTab === "devices" && (
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-4 pr-1">
          {/* Devices List Left Column */}
          <div className="space-y-3 lg:col-span-1">
            <div className="text-xs font-orbitron font-bold text-slate-400 px-1 flex items-center justify-between">
              <span>ACTIVE DIGITAL COMPANIONS</span>
              <span className="text-cyan-400 font-mono text-[10px]">
                {devices.filter((d) => d.status === "online").length} ONLINE
              </span>
            </div>

            {devices
              .filter((d) => d.type === "pc" || d.type === "mobile" || d.type === "tablet" || d.type === "wearable")
              .map((device) => {
                const isSelected = selectedDevice.id === device.id;
                const IconComp =
                  device.type === "pc"
                    ? Monitor
                    : device.type === "mobile"
                    ? Smartphone
                    : device.type === "tablet"
                    ? Tablet
                    : Watch;

                return (
                  <div
                    key={device.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedDeviceId(device.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-400 text-slate-100 shadow-lg shadow-cyan-950"
                        : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? "bg-cyan-500 text-slate-950 font-bold"
                              : "bg-slate-900 text-slate-400 border border-slate-800"
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="font-orbitron font-bold text-xs truncate">{device.name}</span>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                          device.status === "online"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-900 text-slate-500 border border-slate-800"
                        }`}
                      >
                        {device.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 truncate">{device.model}</div>

                    {/* Quick Telemetry Chips */}
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      {device.batteryPercent !== undefined && (
                        <span className="flex items-center gap-1 text-emerald-300">
                          {device.isCharging ? (
                            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          ) : (
                            <Battery className="w-3.5 h-3.5" />
                          )}
                          <span>{device.batteryPercent}%</span>
                        </span>
                      )}

                      {device.signalStrengthDbm && (
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Signal className="w-3 h-3 text-cyan-400" />
                          <span>{device.signalStrengthDbm} dBm</span>
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-purple-300">
                        {device.protocol === "BLE" ? (
                          <Bluetooth className="w-3 h-3" />
                        ) : (
                          <Wifi className="w-3 h-3" />
                        )}
                        <span>{device.protocol}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Active Device Deep Control Center */}
          <div className="lg:col-span-2 p-4 md:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
            <div>
              {/* Header with Live Status & Ring State */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                      REMOTE HARDWARE TELEMETRY & CONTROL
                    </span>
                    {selectedDevice.controllableStates.ringing && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500 font-bold animate-ping">
                        ALARM RINGING!
                      </span>
                    )}
                  </div>
                  <h3 className="font-orbitron font-bold text-base text-slate-100 mt-0.5">
                    {selectedDevice.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    {selectedDevice.model} • OS: {selectedDevice.osVersion || "Sync Active"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTogglePower(selectedDevice.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1.5 cursor-pointer ${
                      selectedDevice.controllableStates.power
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                        : "bg-red-950 text-red-300 border border-red-500/40"
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{selectedDevice.controllableStates.power ? "CONNECTED" : "DISCONNECTED"}</span>
                  </button>
                </div>
              </div>

              {/* Real-time Mobile Diagnostics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                  <span className="text-[10px] text-slate-500 block">Battery Level</span>
                  <div className="font-bold text-emerald-300 text-sm flex items-center gap-1 mt-0.5">
                    {selectedDevice.isCharging ? (
                      <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
                    ) : (
                      <Battery className="w-4 h-4" />
                    )}
                    <span>{selectedDevice.batteryPercent || "--"}%</span>
                  </div>
                  <span className="text-[9px] text-slate-400">
                    {selectedDevice.isCharging ? "Fast Wireless (15W)" : "Discharging"}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                  <span className="text-[10px] text-slate-500 block">Cellular / Wi-Fi</span>
                  <div className="font-bold text-cyan-300 text-sm flex items-center gap-1 mt-0.5">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span>{selectedDevice.signalStrengthDbm || "-60"} dBm</span>
                  </div>
                  <span className="text-[9px] text-slate-400">IP: {selectedDevice.ipAddress || "192.168.1.108"}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                  <span className="text-[10px] text-slate-500 block">Storage Memory</span>
                  <div className="font-bold text-purple-300 text-sm flex items-center gap-1 mt-0.5">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span>
                      {selectedDevice.metrics?.storageUsedGb || 198} / {selectedDevice.metrics?.storageTotalGb || 512} GB
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400">61% Free Space</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
                  <span className="text-[10px] text-slate-500 block">Security State</span>
                  <div className="font-bold text-amber-300 text-sm flex items-center gap-1 mt-0.5">
                    {selectedDevice.controllableStates.screenLocked ? (
                      <Lock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{selectedDevice.controllableStates.screenLocked ? "Locked" : "Unlocked"}</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Biometric Guard</span>
                </div>
              </div>

              {/* Remote Control Action Matrix */}
              <div className="space-y-3">
                <div className="text-xs font-orbitron font-bold text-slate-300">
                  INSTANT COMMAND DISPATCHER
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Find My Phone / Ring Device */}
                  <button
                    type="button"
                    onClick={() => handleRingPhone(selectedDevice.id)}
                    className={`p-3 rounded-xl border text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                      selectedDevice.controllableStates.ringing
                        ? "bg-red-500 text-slate-950 font-bold border-red-400 animate-pulse shadow-lg shadow-red-500/50"
                        : "bg-slate-900 hover:bg-red-950 border-slate-700 hover:border-red-500 text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-red-400" />
                      <span>{selectedDevice.controllableStates.ringing ? "STOP SIREN ALARM" : "FIND MY PHONE (RING)"}</span>
                    </span>
                    <span className="text-[10px] font-bold">100dB ALARM</span>
                  </button>

                  {/* Toggle Hotspot */}
                  <button
                    type="button"
                    onClick={() => handleToggleHotspot(selectedDevice.id)}
                    className={`p-3 rounded-xl border text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                      selectedDevice.controllableStates.hotspotActive
                        ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/40"
                        : "bg-slate-900 hover:bg-cyan-950 border-slate-700 hover:border-cyan-500 text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-cyan-400" />
                      <span>5G MOBILE HOTSPOT</span>
                    </span>
                    <span className="text-[10px] font-bold">
                      {selectedDevice.controllableStates.hotspotActive ? "ACTIVE" : "OFF"}
                    </span>
                  </button>

                  {/* Remote Screen Lock */}
                  <button
                    type="button"
                    onClick={() => handleToggleScreenLock(selectedDevice.id)}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-purple-400 text-slate-200 text-xs font-mono transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      <span>REMOTE SCREEN LOCK</span>
                    </span>
                    <span className="text-[10px] font-mono text-purple-300">Toggle Lock</span>
                  </button>

                  {/* Sync Clipboard */}
                  <button
                    type="button"
                    onClick={() => handleSyncClipboard(selectedDevice.id)}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-mono transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                      <span>SYNC CLIPBOARD BUFFER</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">{copiedText ? "COPIED" : "BIDIRECTIONAL"}</span>
                  </button>
                </div>

                {/* Quick SMS & Notification Dispatch */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Push Instant Notification or SMS to Mobile:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={quickSmsDraft}
                      onChange={(e) => setQuickSmsDraft(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg text-xs font-mono text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playBeepConfirm();
                        addLog(selectedDevice.id, selectedDevice.name, `Pushed Mobile Alert: "${quickSmsDraft}"`);
                        speechService.speak("Notification pushed to Commander Wasi's mobile.", {
                          lang: language,
                          gender: voiceGender,
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-orbitron font-bold transition cursor-pointer shrink-0"
                    >
                      PUSH TO PHONE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Geospatial Coordinate Link */}
            {selectedDevice.location && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  GPS Location: <strong className="text-slate-200">{selectedDevice.location.locationName}</strong>
                </span>
                {onOpenMapLocation && (
                  <button
                    type="button"
                    onClick={() => onOpenMapLocation(selectedDevice.location!.lat, selectedDevice.location!.lng)}
                    className="px-3 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 transition cursor-pointer flex items-center gap-1"
                  >
                    <span>View on Geospatial Map</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Smart Studio Hardware & IoT DAC */}
      {activeTab === "iot_studio" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex items-center justify-between">
            <div>
              <h3 className="font-orbitron font-bold text-sm text-purple-300">
                Connected Studio Hardware & Smart Peripherals
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Control studio lighting ambience, high-fidelity DAC audio, and workstation power distribution.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400">IoT Protocol: Local Socket & MQTT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Smart Light Controller */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold text-sm text-slate-100">
                        Nanoleaf RGB Studio Light Bar
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        Wi-Fi 2.4GHz • Status: {devices.find((d) => d.id === "dev-light-1")?.controllableStates.power ? "ON" : "OFF"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePower("dev-light-1")}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
                      devices.find((d) => d.id === "dev-light-1")?.controllableStates.power
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    POWER
                  </button>
                </div>

                {/* Brightness Slider */}
                <div className="my-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Brightness</span>
                    <span className="text-cyan-300 font-bold">
                      {devices.find((d) => d.id === "dev-light-1")?.controllableStates.brightness || 85}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={devices.find((d) => d.id === "dev-light-1")?.controllableStates.brightness || 85}
                    onChange={(e) => handleLightBrightnessChange(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Color Preset Palette */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-slate-400">Quantum Color Ambience:</span>
                  <div className="flex items-center gap-2">
                    {[
                      { name: "Cyber Cyan", hex: "#06b6d4" },
                      { name: "Quantum Purple", hex: "#a855f7" },
                      { name: "Neon Emerald", hex: "#10b981" },
                      { name: "Tachyon Gold", hex: "#f59e0b" },
                      { name: "Warm Daylight", hex: "#fde047" },
                    ].map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => handleLightColorChange(col.hex)}
                        className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer"
                        style={{
                          backgroundColor: col.hex,
                          borderColor:
                            devices.find((d) => d.id === "dev-light-1")?.controllableStates.colorHex === col.hex
                              ? "#ffffff"
                              : "transparent",
                        }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Power Draw: 18W</span>
                <span className="text-emerald-400">Zero Flicker LED</span>
              </div>
            </div>

            {/* High-Fidelity Audio DAC Controller */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-400 text-purple-300 flex items-center justify-center">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold text-sm text-slate-100">
                        Topping DX7 Pro+ Audio DAC
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        USB Audio Class 2.0 • 384kHz / 32-bit DSD512
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePower("dev-dac-1")}
                    className={`px-3 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
                      devices.find((d) => d.id === "dev-dac-1")?.controllableStates.power
                        ? "bg-purple-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    POWER
                  </button>
                </div>

                {/* Master Volume Slider */}
                <div className="my-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Balanced Output Master Volume</span>
                    <span className="text-purple-300 font-bold">
                      {devices.find((d) => d.id === "dev-dac-1")?.controllableStates.volume || 68}% (-14 dB)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={devices.find((d) => d.id === "dev-dac-1")?.controllableStates.volume || 68}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>

                {/* Output Mode Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-slate-400">Routing Output Target:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playBeepConfirm();
                        addLog("dev-dac-1", "Topping DAC", "Switched to XLR Balanced Studio Monitors");
                      }}
                      className="py-1.5 px-3 rounded-xl bg-purple-950 text-purple-200 border border-purple-500/50 cursor-pointer hover:bg-purple-900"
                    >
                      XLR Studio Monitors
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playBeepConfirm();
                        addLog("dev-dac-1", "Topping DAC", "Switched to 4.4mm Balanced Headphones");
                      }}
                      className="py-1.5 px-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 cursor-pointer hover:bg-purple-950"
                    >
                      4.4mm Headphones
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Signal-to-Noise: 130 dB</span>
                <span className="text-emerald-400">THD+N: 0.00006%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pair New Device & QR Sync */}
      {activeTab === "pairing" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* QR Code Sync Card for Mobile */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 flex flex-col items-center justify-between text-center">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                  INSTANT SMARTPHONE LINK
                </span>
                <h4 className="font-orbitron font-bold text-base text-slate-100 mt-2">
                  Scan QR with Mobile Camera
                </h4>
                <p className="text-xs font-mono text-slate-400 max-w-sm mt-1">
                  Connect your Android or iPhone device via encrypted local WebSocket bridge for live battery, notifications, and clipboard sync.
                </p>

                {/* Holographic QR Code Box */}
                <div className="my-4 p-4 rounded-2xl bg-white inline-block shadow-xl shadow-cyan-500/20">
                  <QrCode className="w-36 h-36 text-slate-950" />
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Pairing Key: <strong className="text-emerald-400">QNX-WASI-8842-TOKEN</strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 w-full text-[11px] font-mono text-slate-500 flex justify-between">
                <span>Protocol: TLS 1.3 + WSS</span>
                <span className="text-emerald-400">Auto-Reconnecting</span>
              </div>
            </div>

            {/* Nearby Wireless Discovery Scanner */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="font-orbitron font-bold text-sm text-slate-100">
                      Nearby Bluetooth & Wi-Fi Discovery
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      BLE 5.3 & mDNS Local Subnet Broadcast
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleScanDiscovery}
                    disabled={isScanningNew}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanningNew ? "animate-spin" : ""}`} />
                    <span>{isScanningNew ? "SCANNING..." : "SCAN PERIPHERALS"}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {discoveredDevices.map((disc) => (
                    <div
                      key={disc.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between transition"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-200">{disc.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {disc.protocol} • Signal: {disc.signal}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePairDiscovered(disc)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-400 text-emerald-300 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pair Device</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                Found {discoveredDevices.length} unassigned hardware endpoints in transmission proximity.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Device Audit Logs */}
      {activeTab === "logs" && (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between">
            <div>
              <h3 className="font-orbitron font-bold text-sm text-amber-300">
                Device Command Execution Audit Trail
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Immutable chronological log of all hardware triggers, mobile rings, and telemetry sync events.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEffects.playBeepConfirm();
                setLogs([]);
              }}
              className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <span className="font-bold text-cyan-300">{log.deviceName}</span>
                    <span className="text-slate-400 ml-2">{log.action}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                  <span>{log.timestamp}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
