import React, { useState, useEffect, useMemo } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Crosshair,
  Smartphone,
  Laptop,
  Radio,
  Search,
  Zap,
  Globe,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ChevronRight,
  Route,
} from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { LanguageCode, VoiceGender, MapLocationItem, ConnectedDeviceItem } from "../types";

interface QuantumGeospatialMapSuiteProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
  connectedDevices?: ConnectedDeviceItem[];
  onSelectDevice?: (deviceId: string) => void;
}

// Preset Quantum Strategic Geo-Points
const PRESET_LOCATIONS: MapLocationItem[] = [
  {
    id: "loc-base",
    title: "Command Central - Wasi Tech Studio",
    category: "base",
    lat: 31.5204,
    lng: 74.3587,
    description: "Primary Quantum Tachyon OS Host PC Workstation Node.",
    accuracyMeters: 2,
  },
  {
    id: "loc-phone",
    title: "Wasi Mobile Phone (Galaxy S24 Ultra)",
    category: "device",
    lat: 31.5326,
    lng: 74.3412,
    description: "Active Cellular Link • Battery 88% • 5G Ultra Wideband",
    accuracyMeters: 4,
    associatedDeviceId: "dev-mob-1",
  },
  {
    id: "loc-studio",
    title: "Media Production & 4K Render Lab",
    category: "studio",
    lat: 31.4822,
    lng: 74.3033,
    description: "Secondary studio node with Premiere Pro & After Effects render cluster.",
    accuracyMeters: 5,
  },
  {
    id: "loc-safezone",
    title: "Islamabad Tech Headquarters",
    category: "poi",
    lat: 33.7294,
    lng: 73.0931,
    description: "Cloud relay & redundant quantum database synchronization mirror.",
    accuracyMeters: 10,
  },
  {
    id: "loc-dubai",
    title: "Dubai Media City Studio Node",
    category: "poi",
    lat: 25.0936,
    lng: 55.1561,
    description: "International client delivery hub & low-latency CDN gateway.",
    accuracyMeters: 15,
  },
];

export const QuantumGeospatialMapSuite: React.FC<QuantumGeospatialMapSuiteProps> = ({
  language,
  voiceGender,
  connectedDevices = [],
  onSelectDevice,
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";
  const [activeCenter, setActiveCenter] = useState<{ lat: number; lng: number }>({
    lat: 31.5204,
    lng: 74.3587,
  });
  const [zoomLevel, setZoomLevel] = useState(13);
  const [mapTypeId, setMapTypeId] = useState<"roadmap" | "satellite" | "hybrid" | "terrain">("roadmap");
  const [selectedLocation, setSelectedLocation] = useState<MapLocationItem | null>(PRESET_LOCATIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [routeActive, setRouteActive] = useState(true);
  const [radarSweepDeg, setRadarSweepDeg] = useState(0);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Rotating radar animation for HUD
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarSweepDeg((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Listen to Google Maps quota exceeded event as per Skill guidance
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener("gmp-quota-exceeded", handleQuotaExceeded);
    return () => window.removeEventListener("gmp-quota-exceeded", handleQuotaExceeded);
  }, []);

  // Compute live locations merging presets with connected devices
  const allLocations: MapLocationItem[] = useMemo(() => {
    const deviceLocs: MapLocationItem[] = connectedDevices
      .filter((d) => d.location)
      .map((d) => ({
        id: `dev-loc-${d.id}`,
        title: d.name,
        category: "device",
        lat: d.location!.lat,
        lng: d.location!.lng,
        description: `${d.model} • Battery: ${d.batteryPercent || "--"}% • Signal: ${d.signalStrengthDbm || "-65"} dBm`,
        accuracyMeters: 5,
        associatedDeviceId: d.id,
      }));

    // Filter out duplicates by title
    const existingTitles = new Set(deviceLocs.map((l) => l.title));
    const staticFiltered = PRESET_LOCATIONS.filter((l) => !existingTitles.has(l.title));
    return [...staticFiltered, ...deviceLocs];
  }, [connectedDevices]);

  // Handle Current Location via Browser GPS
  const handleLocateCommander = () => {
    soundEffects.playScan();
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          soundEffects.playBeepConfirm();
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setActiveCenter(newPos);
          setZoomLevel(15);

          const updatedLoc: MapLocationItem = {
            id: "loc-live-gps",
            title: "Commander Wasi (Live GPS)",
            category: "base",
            lat: newPos.lat,
            lng: newPos.lng,
            description: `Live Coordinates: ${newPos.lat.toFixed(5)}, ${newPos.lng.toFixed(5)} • Accuracy: ${pos.coords.accuracy.toFixed(1)}m`,
            accuracyMeters: Math.round(pos.coords.accuracy),
          };
          setSelectedLocation(updatedLoc);

          const speech =
            language === "pa"
              ? "Live GPS coordinates lock ho gaye ne Wasi paji!"
              : "Live GPS location acquired. Quantum satellite link locked.";
          speechService.speak(speech, { lang: language, gender: voiceGender });
        },
        (err) => {
          setIsLocating(false);
          soundEffects.playAlert();
          // Fallback to Lahore Center
          setActiveCenter({ lat: 31.5204, lng: 74.3587 });
          speechService.speak(
            "GPS unavailable. Loaded primary Command Center coordinates.",
            { lang: language, gender: voiceGender }
          );
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Fly to Preset or Target
  const handleSelectLoc = (loc: MapLocationItem) => {
    soundEffects.playClick();
    setSelectedLocation(loc);
    setActiveCenter({ lat: loc.lat, lng: loc.lng });
    setZoomLevel(14);
  };

  // Search Handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    soundEffects.playClick();
    const query = searchQuery.toLowerCase();

    // Check presets first
    const match = allLocations.find(
      (l) => l.title.toLowerCase().includes(query) || l.description.toLowerCase().includes(query)
    );

    if (match) {
      handleSelectLoc(match);
      setSearchQuery("");
      return;
    }

    // Common city coordinates lookup
    const cityCoords: Record<string, { lat: number; lng: number; title: string }> = {
      lahore: { lat: 31.5204, lng: 74.3587, title: "Lahore, Pakistan" },
      islamabad: { lat: 33.6844, lng: 73.0479, title: "Islamabad, Pakistan" },
      karachi: { lat: 24.8607, lng: 67.0011, title: "Karachi, Pakistan" },
      dubai: { lat: 25.2048, lng: 55.2708, title: "Dubai, UAE" },
      london: { lat: 51.5074, lng: -0.1278, title: "London, UK" },
      "new york": { lat: 40.7128, lng: -74.006, title: "New York, USA" },
    };

    const foundCity = Object.keys(cityCoords).find((c) => query.includes(c));
    if (foundCity) {
      const city = cityCoords[foundCity];
      setActiveCenter({ lat: city.lat, lng: city.lng });
      setZoomLevel(12);
      setSelectedLocation({
        id: `search-${foundCity}`,
        title: city.title,
        category: "poi",
        lat: city.lat,
        lng: city.lng,
        description: `Queried Region: ${city.title}`,
      });
      setSearchQuery("");
      soundEffects.playBeepConfirm();
    } else {
      speechService.speak(`Searching sector for: ${searchQuery}`, { lang: language, gender: voiceGender });
    }
  };

  // Distance calculation (Haversine in km)
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const distanceToMobile = calculateDistanceKm(
    31.5204,
    74.3587,
    PRESET_LOCATIONS[1].lat,
    PRESET_LOCATIONS[1].lng
  );

  return (
    <div className="w-full h-full flex flex-col font-rajdhani select-none overflow-hidden">
      {/* Client-Side Quota Defense Sticky Banner (as mandated by Skill) */}
      {quotaExceeded && (
        <div className="bg-amber-950/90 border-b border-amber-500 text-amber-200 px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{" "}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-amber-300 hover:text-white"
            >
              maps developer site
            </a>{" "}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Header Bar with Search & Radar Mode */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-cyan-500/30 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
              <span>QUANTUM SATELLITE GEOSPATIAL RADAR</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">MIL-SPEC GPS LOCKED</span>
          </div>
          <h3 className="text-base font-orbitron font-bold text-slate-100 mt-1 flex items-center gap-2">
            <span>Global Maps & Connected Device Tracking</span>
          </h3>
        </div>

        {/* Search & Action Tools */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex-1 sm:w-64 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search location or city..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </form>

          <button
            type="button"
            onClick={handleLocateCommander}
            disabled={isLocating}
            title="Locate Command Base via GPS"
            className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-mono transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? "animate-spin text-amber-400" : ""}`} />
            <span className="hidden md:inline">{isLocating ? "Locating..." : "My GPS"}</span>
          </button>

          {/* Map Layer Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setMapTypeId("roadmap")}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                mapTypeId === "roadmap" ? "bg-cyan-950 text-cyan-300 font-bold" : "text-slate-400"
              }`}
            >
              Road
            </button>
            <button
              type="button"
              onClick={() => setMapTypeId("satellite")}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                mapTypeId === "satellite" ? "bg-cyan-950 text-cyan-300 font-bold" : "text-slate-400"
              }`}
            >
              Sat
            </button>
            <button
              type="button"
              onClick={() => setMapTypeId("hybrid")}
              className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                mapTypeId === "hybrid" ? "bg-cyan-950 text-cyan-300 font-bold" : "text-slate-400"
              }`}
            >
              Hybrid
            </button>
          </div>
        </div>
      </div>

      {/* Main Map View & Tactical Telemetry Sidebar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 min-h-0 overflow-hidden">
        {/* Interactive Google Map Canvas (Takes 3 columns on large screens) */}
        <div className="lg:col-span-3 h-full relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-2xl flex flex-col">
          {/* Active Radar Sweep Overlay Indicator */}
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/50 text-[10px] font-mono text-cyan-300 flex items-center gap-2 pointer-events-none shadow-lg">
            <span
              className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"
              style={{ animationDuration: "2s" }}
            ></span>
            <span>RADAR AZIMUTH: {radarSweepDeg}°</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400">LAT: {activeCenter.lat.toFixed(4)}</span>
            <span className="text-emerald-400">LNG: {activeCenter.lng.toFixed(4)}</span>
          </div>

          {/* Quick Location Pills Top-Left */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 overflow-x-auto max-w-[calc(100%-200px)] p-1 bg-slate-950/70 backdrop-blur-md rounded-xl border border-slate-800">
            {allLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectLoc(loc)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  selectedLocation?.id === loc.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
                    : "bg-slate-900/80 text-slate-300 hover:text-cyan-300 border border-slate-700/60"
                }`}
              >
                {loc.category === "base" ? (
                  <Laptop className="w-3 h-3" />
                ) : loc.category === "device" ? (
                  <Smartphone className="w-3 h-3" />
                ) : (
                  <MapPin className="w-3 h-3" />
                )}
                <span>{loc.title.split(" - ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Google Maps Container */}
          <div className="w-full flex-1 relative min-h-[350px]">
            <APIProvider apiKey={apiKey}>
              <GoogleMap
                center={activeCenter}
                zoom={zoomLevel}
                mapTypeId={mapTypeId}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                style={{ width: "100%", height: "100%" }}
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                {/* Advanced Markers for All Tactical Locations & Devices */}
                {allLocations.map((loc) => {
                  const isBase = loc.category === "base";
                  const isDevice = loc.category === "device";
                  const isStudio = loc.category === "studio";

                  return (
                    <AdvancedMarker
                      key={loc.id}
                      position={{ lat: loc.lat, lng: loc.lng }}
                      title={loc.title}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedLocation(loc);
                      }}
                    >
                      <Pin
                        background={isBase ? "#06b6d4" : isDevice ? "#a855f7" : isStudio ? "#10b981" : "#f59e0b"}
                        borderColor="#ffffff"
                        glyphColor="#020617"
                        scale={selectedLocation?.id === loc.id ? 1.3 : 1.0}
                      />
                    </AdvancedMarker>
                  );
                })}

                {/* Selected Location InfoWindow */}
                {selectedLocation && (
                  <InfoWindow
                    position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div className="p-1 font-rajdhani text-slate-900 max-w-xs">
                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-800 uppercase">
                        <MapPin className="w-3 h-3 text-cyan-600" />
                        <span>{selectedLocation.category}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-950 mt-0.5">{selectedLocation.title}</h4>
                      <p className="text-xs text-slate-700 mt-1 font-mono">{selectedLocation.description}</p>
                      <div className="text-[10px] font-mono text-slate-500 mt-1.5 flex justify-between">
                        <span>Lat: {selectedLocation.lat.toFixed(4)}</span>
                        <span>Lng: {selectedLocation.lng.toFixed(4)}</span>
                      </div>
                      {selectedLocation.associatedDeviceId && onSelectDevice && (
                        <button
                          type="button"
                          onClick={() => onSelectDevice(selectedLocation.associatedDeviceId!)}
                          className="mt-2 w-full py-1 rounded bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>Open Device Control</span>
                        </button>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </APIProvider>
          </div>

          {/* Bottom Telemetry HUD Bar on Map */}
          <div className="p-2.5 bg-slate-950/95 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-cyan-300">
                <Navigation className="w-3.5 h-3.5" />
                <span>Base-to-Mobile Range:</span>
                <strong className="text-slate-100">{distanceToMobile} km</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Geofence Status: OPTIMAL (Inside Safe Perimeter)</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playBeepConfirm();
                  speechService.speak(
                    `Command Base distance to Mobile Device is ${distanceToMobile} kilometers. Telemetry link optimal.`,
                    { lang: language, gender: voiceGender }
                  );
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono transition cursor-pointer flex items-center gap-1"
              >
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>Voice Telemetry Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Tactical Geospatial Intelligence & Device Locations */}
        <div className="lg:col-span-1 h-full flex flex-col space-y-3 overflow-y-auto pr-1">
          {/* Active Target Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 flex flex-col justify-between shrink-0">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="text-cyan-400 uppercase font-bold flex items-center gap-1">
                  <Crosshair className="w-3 h-3" />
                  <span>TARGET LOCK</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  ACCURACY: ±{selectedLocation?.accuracyMeters || 3}m
                </span>
              </div>
              <h4 className="font-orbitron font-bold text-sm text-slate-100">{selectedLocation?.title}</h4>
              <p className="text-xs font-mono text-slate-400 mt-1 line-clamp-2">{selectedLocation?.description}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-400">
              <span>Sector: Central Command</span>
              <span className="text-emerald-400 font-bold">Signal: 99.8%</span>
            </div>
          </div>

          {/* Connected Device Radar List */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between text-xs font-orbitron font-bold text-slate-300 mb-2 pb-1.5 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>GEOTAGGED DEVICES</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {allLocations.filter((l) => l.category === "device").length} Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {allLocations.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectLoc(loc)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-950"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-slate-200 truncate">{loc.title}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold ${
                          loc.category === "base"
                            ? "bg-cyan-950 text-cyan-300"
                            : loc.category === "device"
                            ? "bg-purple-950 text-purple-300"
                            : "bg-emerald-950 text-emerald-300"
                        }`}
                      >
                        {loc.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{loc.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Command Actions */}
          <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 shrink-0 space-y-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playBeepConfirm();
                const phoneLoc = allLocations.find((l) => l.category === "device");
                if (phoneLoc) handleSelectLoc(phoneLoc);
                speechService.speak("Focused camera on Commander Wasi's primary mobile device.", {
                  lang: language,
                  gender: voiceGender,
                });
              }}
              className="w-full py-2 px-3 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-mono transition flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>Track Mobile Device</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                handleSelectLoc(PRESET_LOCATIONS[0]);
              }}
              className="w-full py-2 px-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-mono transition flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                <span>Center Command Base</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
