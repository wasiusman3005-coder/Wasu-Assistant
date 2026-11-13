import { JarvisInterfaceThemeId } from "../../types";

export interface ThemeMetadata {
  id: JarvisInterfaceThemeId;
  name: string;
  tagline: string;
  imagePath: string;
  accentHex: string;
  glowColor: string;
  category: string;
  features: string[];
}

export const ALL_JARVIS_THEMES: ThemeMetadata[] = [
  {
    id: "quantum_cockpit",
    name: "Quantum Tachyon Cockpit",
    tagline: "Holographic Desk Command Room with Radiating Circuits & Pedestal Core",
    imagePath: "/assets/aistudio/images_ea059939.jpg",
    accentHex: "#00f5ff",
    glowColor: "rgba(0, 245, 255, 0.7)",
    category: "3D Command Room",
    features: [
      "Center Circular Hologram Pedestal with 10 3D Morphing Geometries",
      "Radiating Neon Circuit Traces with Dynamic Overdrive Warp",
      "3D Biometric Token Crystal Cube & Perspective Touch Console",
      "Floating Glass HUD Cards with Live PC & Records Telemetry",
    ],
  },
  {
    id: "vector_hud_gui",
    name: "Vector HUD GUI 4",
    tagline: "Precision Multi-Ring Radar Reticle & Dual Seismic Signal Waveforms",
    imagePath: "/assets/aistudio/vector-hud-gui-interface-004_e93adaf2.jpg",
    accentHex: "#00ffcc",
    glowColor: "rgba(0, 255, 204, 0.7)",
    category: "Vector HUD GUI",
    features: [
      "Off-Center Right Massive Multi-Ring Radar Reticle with Lime/Orange Arcs",
      "Side Element 7 Dual Waveform Oscilloscopes with Live Signal Beats",
      "Side Element 10 Trackers with Real-Time Input/Output Slider Gauges",
      "Bottom Equalizer Histogram & Mini Concentric Sub-Gauges",
    ],
  },
  {
    id: "ironman_shield",
    name: "Iron Man & S.H.I.E.L.D. OS",
    tagline: "Mark VII Helmet Profile, Dual Speedometer Core & S.H.I.E.L.D. Badge",
    imagePath: "/assets/aistudio/images__1__d271a28a.jpg",
    accentHex: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.7)",
    category: "S.H.I.E.L.D. Division",
    features: [
      "Center Dual Cockpit Speedometer Dials inside Cyan Sawtooth Ring",
      "Golden/Crimson Iron Man Helmet Profile with Glowing Eye Slits",
      "Unibeam Callout Telemetry Tags (value23 through value28)",
      "Circular APRIL 27 Calendar Gauge & S.H.I.E.L.D. Crest Clock",
    ],
  },
  {
    id: "carbon_industrial",
    name: "Carbon Industrial Jarvis",
    tagline: "Brushed Carbon-Fiber Texture, 3D Battery Cylinder & Angled Tabs",
    imagePath: "/assets/aistudio/images__2__c5f03e7f.jpg",
    accentHex: "#00f0ff",
    glowColor: "rgba(0, 240, 255, 0.7)",
    category: "Industrial Tactical",
    features: [
      "Carbon-Fiber Grid Mesh with Angled Metal Chassis Brackets",
      "Center Glowing Cyan Turbine Core labeled 'JARVIS'",
      "Angled Left Cyber Tabs (My PC, Opera, Task Mngr, CMD, Team Vwr)",
      "3D Holographic Vertical Battery Cylinder (28% Low Battery)",
      "Einstein Quote Banner: 'Only two things are infinite...'",
    ],
  },
  {
    id: "stark_mark3",
    name: "Stark Industries Mark III",
    tagline: "Stark Expo 2010 Tactical Defense, Armor Silhouette & Russian HUD",
    imagePath: "/assets/aistudio/images__3__0fd67f24.jpg",
    accentHex: "#00f5ff",
    glowColor: "rgba(0, 245, 255, 0.7)",
    category: "Stark Defense",
    features: [
      "Stark Industries Dual-Ring Radar Center with Tracking Coordinates",
      "March 30 Date Ring & 100% Energy Arc Core Dial",
      "Full Armored Mark III Silhouette with Stark Expo 2010 Manifest",
      "Bottom Glass Desktop Dock Icons with Specular Reflections",
    ],
  },
  {
    id: "cosmic_nebula",
    name: "Deep Space Cosmic Nebula",
    tagline: "Stellar Cloud Rift, Branching Arc Node Tree & Interactive Terminal",
    imagePath: "/assets/aistudio/images__4__27575c52.jpg",
    accentHex: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.7)",
    category: "Cosmic Astrophysics",
    features: [
      "Deep-Space Luminous Blue Cosmic Nebula Rift Background",
      "Glowing White-Hot Arc Reactor with Radiating Node Branch Tree",
      "March 31 Circular Date HUD & Storage Capacity Meters",
      "Interactive Hacking NASA Terminal Window with Progress Animation",
    ],
  },
  {
    id: "mark_85_deck",
    name: "Mark LXXXV Holographic Deck",
    tagline: "Turbine Arc Reactor, Wireframe Armor Hologram & Weapons System",
    imagePath: "/assets/aistudio/images_be3c8b70.jpg",
    accentHex: "#00d4ff",
    glowColor: "rgba(0, 212, 255, 0.75)",
    category: "Avengers Endgame",
    features: [
      "Massive Glowing Arc Reactor Turbine Core with Spinning Vanes",
      "Wireframe Hologram of Mark LXXXV Armor & Full Suit Diagnostics",
      "Weapons Systems HUD (Missiles 12, Unibeam 100%, Repulsors 100%)",
      "Live 4-Core CPU, RAM/Swap, and Environmental Sensor Readings",
    ],
  },
];
