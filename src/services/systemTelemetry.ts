export interface SystemDiskInfo {
  drive: string;
  totalGb: number;
  freeGb: number;
  usedGb: number;
}

export interface SystemTelemetry {
  realHost: boolean;
  hostname: string;
  username: string;
  platform: string;
  arch: string;
  osCaption: string;
  uptimeMinutes: number;
  cpuModel: string;
  cpuCores: number;
  cpuSpeedGhz: number;
  cpuUsagePercent: number;
  gpuName: string;
  gpuVramGb: number | null;
  ramTotalGb: number;
  ramUsedGb: number;
  ramPercent: number;
  disks: SystemDiskInfo[];
  primaryDisk: SystemDiskInfo;
  batteryPercent: number | null;
  isCharging: boolean | null;
  ipAddress: string;
  netInterface: string;
  runningApps: Record<string, boolean>;
  timestamp: number;
}

export interface HostFileEntry {
  name: string;
  type: "video" | "image" | "audio" | "document" | "code" | "archive";
  size: string;
  path: string;
  fullPath: string;
  suggestedFolder: string;
}

export async function fetchSystemTelemetry(): Promise<SystemTelemetry | null> {
  try {
    const res = await fetch("/api/system/telemetry", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as SystemTelemetry;
    return data && data.realHost === true ? data : null;
  } catch {
    return null;
  }
}

export async function fetchSystemFiles(): Promise<HostFileEntry[]> {
  try {
    const res = await fetch("/api/system/files", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.files) ? data.files : [];
  } catch {
    return [];
  }
}

export async function organizeSystemFiles(): Promise<{ moved: number; files: HostFileEntry[] }> {
  const res = await fetch("/api/system/organize-files", { method: "POST" });
  if (!res.ok) throw new Error("Failed to organize files");
  return await res.json();
}

export async function launchSystemApp(appName: string): Promise<{ ok: boolean; message: string }> {
  const res = await fetch("/api/system/launch-app", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ appName }),
  });
  return await res.json();
}
