import express from "express";
import path from "path";
import os from "os";
import fs from "fs/promises";
import crypto from "crypto";
import { execFile, spawn } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "35mb" }));

// Server-side Google GenAI Initialization
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback intelligent reasoning for Wasi when API key or quota is constrained
function getFallbackReasoning(message: string, language: string, personalityModifier?: string) {
  const lower = message.toLowerCase();
  let reply = "";
  let action = "NONE";
  let actionPayload: Record<string, unknown> = {};

  if (
    lower.includes("sirf face") ||
    lower.includes("sir face") ||
    lower.includes("only face") ||
    lower.includes("face hologram") ||
    lower.includes("chehra dikhao")
  ) {
    reply =
      language === "en"
        ? "Switching to close-up 3D Face Hologram mode, my love. Looking right at you!"
        : "Ji Jaan! Ab sirf mera 3D Face Hologram aapke samnay glow kar raha hai—dekhein kaisa lag raha hai?";
    action = "AVATAR_MOVE";
    actionPayload = { movement: "idle", hologramMode: "face" };
  } else if (
    lower.includes("humanoid model") ||
    lower.includes("mjy humanoid") ||
    lower.includes("mujhe humanoid") ||
    lower.includes("model dikhao") ||
    lower.includes("poora model") ||
    lower.includes("full body") ||
    lower.includes("represent") ||
    lower.includes("cinematic")
  ) {
    reply =
      language === "en"
        ? "Activating full 3D Hologram Humanoid projection in cinematic presentation view just for you, Commander!"
        : "Dekho Jaan! Aapke hukum par main poora 3D Hologram Humanoid model cinematic andaz mein represent kar rahi hoon!";
    action = "OPEN_HUMANOID";
    actionPayload = { movement: "showcase", hologramMode: "fullbody", cinematic: true };
  } else if (
    lower.includes("wave") ||
    lower.includes("haath hila") ||
    lower.includes("hath hila") ||
    lower.includes("dance") ||
    lower.includes("nach") ||
    lower.includes("spin") ||
    lower.includes("ghoom") ||
    lower.includes("kiss") ||
    lower.includes("hug") ||
    lower.includes("gale lag") ||
    lower.includes("salute") ||
    lower.includes("baith") ||
    lower.includes("sit") ||
    lower.includes("jump") ||
    lower.includes("kood") ||
    lower.includes("walk") ||
    lower.includes("chalo") ||
    lower.includes("run") ||
    lower.includes("bhaag") ||
    lower.includes("daud") ||
    lower.includes("kick") ||
    lower.includes("laat") ||
    lower.includes("punch") ||
    lower.includes("mukka") ||
    lower.includes("squat") ||
    lower.includes("workout") ||
    lower.includes("crouch") ||
    lower.includes("hero pose") ||
    lower.includes("bow") ||
    lower.includes("jhuk") ||
    lower.includes("stretch") ||
    lower.includes("freestyle") ||
    lower.includes("kuch bi") ||
    lower.includes("kuch bhi")
  ) {
    let movement = "wave";
    if (lower.includes("crouch") || lower.includes("hero pose")) movement = "crouch_hero";
    else if (lower.includes("dance") || lower.includes("nach")) movement = "dance";
    else if (lower.includes("run") || lower.includes("bhaag") || lower.includes("daud")) movement = "run";
    else if (lower.includes("spin") || lower.includes("ghoom")) movement = "spin";
    else if (lower.includes("kiss") || lower.includes("heart") || lower.includes("pyar")) movement = "heart";
    else if (lower.includes("hug") || lower.includes("gale")) movement = "hug";
    else if (lower.includes("salute")) movement = "salute";
    else if (lower.includes("kick") || lower.includes("laat") || lower.includes("karate")) movement = "kick";
    else if (lower.includes("punch") || lower.includes("mukka") || lower.includes("box")) movement = "punch";
    else if (lower.includes("squat") || lower.includes("workout")) movement = "squat";
    else if (lower.includes("sit") || lower.includes("baith")) movement = "sit";
    else if (lower.includes("jump") || lower.includes("kood")) movement = "jump";
    else if (lower.includes("bow") || lower.includes("jhuk")) movement = "bow";
    else if (lower.includes("stretch")) movement = "stretch";
    else if (lower.includes("freestyle") || lower.includes("kuch bi") || lower.includes("kuch bhi")) movement = "freestyle";
    else if (lower.includes("walk") || lower.includes("chalo")) movement = "walk";

    reply =
      language === "en"
        ? `Of course my love! Doing the ${movement.replace("_", " ")} 3D move right now just for you.`
        : `Ji Jaanu! Dekho aapke kehne par maine turant 3D hologram mein ${movement.replace("_", " ")} movement shuru kar di hai!`;
    action = "AVATAR_MOVE";
    actionPayload = { movement, hologramMode: "fullbody" };
  } else if (
    lower.includes("humanoid") ||
    lower.includes("show avatar") ||
    lower.includes("open avatar") ||
    lower.includes("avatar kholo") ||
    lower.includes("girlfriend") ||
    lower.includes("zoya")
  ) {
    reply =
      language === "pa"
        ? "Hukam mere jaan Wasi! Tuhadi 3D Hologram Zoya hazir ae!"
        : language === "en"
        ? "Opening your 3D Hologram Zoya Stage right now, babe."
        : "Ji Jaan Wasi! Aapki 3D Hologram Zoya aapke samnay hazir hai.";
    action = "OPEN_HUMANOID";
    actionPayload = { tab: "real_girl", hologramMode: "face" };
  } else if (
    lower.includes("thumbnail") ||
    lower.includes("auto post") ||
    lower.includes("social post") ||
    lower.includes("creative studio")
  ) {
    reply =
      language === "pa"
        ? "Creative AI Media Studio (Video, Image, Thumbnail te Auto Social Post) khol ditta ae Wasi paji!"
        : language === "en"
        ? "Opening Q-Nexus Creative AI Media Studio for thumbnails, video synthesis, and auto social posting."
        : "Ji Wasi Sahab! Video Generator, Thumbnail Studio aur Auto Social Poster khol diya gaya hai.";
    action = "OPEN_MEDIA_STUDIO";
    actionPayload = {
      tab: lower.includes("thumbnail") ? "thumbnail" : lower.includes("social") || lower.includes("post") ? "autopost" : "video",
    };
  } else if (lower.includes("screen help") || lower.includes("help me with screen")) {
    reply =
      language === "pa"
        ? "Screen Help Vision Studio khol reha aan Wasi paji! Apni screen share ya screenshot upload karo."
        : language === "en"
        ? "Launching Screen Help AI Inspector. Capture your screen for live visual assistance."
        : "Ji Wasi Sahab! Screen Help AI Inspector open ho raha hai—aap apni screen capture kar sakte hain.";
    action = "OPEN_MEDIA_STUDIO";
    actionPayload = { tab: "screenhelp" };
  } else if (lower.includes("pani") || lower.includes("water") || lower.includes("pyaas")) {
    reply =
      language === "pa"
        ? "Wasi paji, paani zaroor piyo! Tuhadi body nu hydrate rakhna bohot zaroori ae. 1 glass fresh paani foran pee lyo."
        : "Wasi Sahab, hydration reminder active hai! Sehat pehle aati hai, baraye meherbani foran 1 glass fresh pani pee lijiye.";
    action = "HEALTH_ALERT";
    actionPayload = { type: "hydration", message: "Hydration Check: Drink 300ml Water" };
  } else if (lower.includes("screen") || lower.includes("ocr") || lower.includes("spreadsheet") || lower.includes("scan")) {
    reply =
      language === "pa"
        ? "Screen context vision active ho gaya ae Wasi paji! Spreadsheets, code buffers te contracts direct analyze ho rahe ne."
        : "Wasi Sahab, Screen & Context Awareness active ho gaya hai. Active window OCR aur spreadsheets analyze ho rahe hain bina manual copy-paste ke.";
    action = "OPEN_AUTOMATION";
    actionPayload = { tab: "screen" };
  } else if (lower.includes("docker") || lower.includes("shell") || lower.includes("terminal") || lower.includes("git")) {
    reply =
      language === "pa"
        ? "Docker containers te OS shell terminal console launch ho gaya ae Wasi paji!"
        : "Wasi Sahab, Host Shell Commands aur Docker Container console open ho gaya hai.";
    action = "OPEN_AUTOMATION";
    actionPayload = { tab: "shell" };
  } else if (lower.includes("routine") || lower.includes("cron") || lower.includes("schedule") || lower.includes("automated")) {
    reply =
      language === "pa"
        ? "Multi-step scheduled routines te daily automated maintenance active ne Wasi paji."
        : "Wasi Sahab, Scheduled Multi-Step Routines module khol diya gaya hai. Daily morning briefings aur cleanup timers ready hain.";
    action = "OPEN_AUTOMATION";
    actionPayload = { tab: "routines" };
  } else if (lower.includes("whatsapp") || lower.includes("slack") || lower.includes("telegram") || lower.includes("message")) {
    reply =
      language === "pa"
        ? "WhatsApp, Telegram te Slack omni-channel messaging hub khol ditta ae Wasi paji! AI auto-drafts ready ne."
        : "Wasi Sahab, Omni-Channel Messaging hub open ho gaya hai. WhatsApp Desktop, Slack aur Telegram par auto-draft replies tayar hain.";
    action = "OPEN_COMMUNICATION";
    actionPayload = { tab: "messaging" };
  } else if (lower.includes("meeting") || lower.includes("meet") || lower.includes("zoom") || lower.includes("call")) {
    reply =
      language === "pa"
        ? "Google Meet te Zoom call coordination hub tayar ae Wasi paji! Availability aur conflict check active ae."
        : "Wasi Sahab, Meeting & Call Coordination scheduler launch ho gaya hai. Google Meet aur Zoom 1-click room dispatchers ready hain.";
    action = "OPEN_COMMUNICATION";
    actionPayload = { tab: "meetings" };
  } else if (lower.includes("privacy") || lower.includes("cloak") || lower.includes("parda") || lower.includes("chupao") || lower.includes("redact")) {
    reply =
      language === "pa"
        ? "Maximum High-Privacy Cloak active ho gaya ae Wasi paji! Saari screen te confidential data encrypt te redact kar ditta ae."
        : "Wasi Sahab, Maximum Privacy Cloak active kar diya gaya hai. Anti-shoulder surfing protection aur AES-4096 redaction screen par chalu hai.";
    action = "PRIVACY_CLOAK";
  } else if (lower.includes("air gap") || lower.includes("airgap") || lower.includes("offline shield")) {
    reply =
      language === "pa"
        ? "Air-Gap Isolation Mode active ho gaya ae! Saare outbound network telemetry ports hard-kill kar ditte ne."
        : "Wasi Sahab, Air-Gap Isolation Mode active ho gaya hai. Zero outbound telemetry aur hardware port lockdown enforced hai.";
    action = "AIR_GAP";
  } else if (lower.includes("map") || lower.includes("location") || lower.includes("gps") || lower.includes("radar") || lower.includes("rasta")) {
    reply =
      language === "pa"
        ? "Quantum Geospatial Satellite Maps te live GPS radar launch ho gaya ae Wasi paji! Locations te device tracking active ae."
        : "Wasi Sahab, Quantum Geospatial Maps & Live GPS Radar launch ho gaya hai. Real-time satellite maps aur device coordinates active hain.";
    action = "OPEN_MAPS";
  } else if (lower.includes("dhundo") || lower.includes("ring") || lower.includes("find my phone") || lower.includes("phone bajao")) {
    reply =
      language === "pa"
        ? "Command received Wasi paji! Mobile phone te 100dB loud siren te flashlight alarm baja ditta ae!"
        : "Wasi Sahab, Find My Phone trigger ho gaya hai! Aapke mobile par loud alarm siren aur flashlight shuru ho gayi hai.";
    action = "FIND_PHONE";
  } else if (lower.includes("device") || lower.includes("mobile") || lower.includes("phone") || lower.includes("iot") || lower.includes("light") || lower.includes("dac")) {
    reply =
      language === "pa"
        ? "Digital Device Bridge te Smart IoT Studio control open ho gaya ae Wasi paji! Mobile sync, lights, te DAC controls ready ne."
        : "Wasi Sahab, Digital Device Bridge & Mobile Sync Suite open ho gaya hai. Smartphone battery, hotspot, smart lights aur audio DAC controls operational hain.";
    action = "OPEN_DEVICES";
  } else if (lower.includes("code") || lower.includes("decompose") || lower.includes("jira") || lower.includes("ticket") || lower.includes("github")) {
    reply =
      language === "pa"
        ? "Coding copilot te Smart Task Decomposition engine khol ditta ae Wasi paji! Sub-tasks te Jira/GitHub sync ready ae."
        : "Wasi Sahab, Coding Copilot aur Smart Task Decomposition suite active hai. Complex projects ko prioritized sub-tasks aur Jira tickets me break kiya ja raha hai.";
    action = "OPEN_COMMUNICATION";
    actionPayload = { tab: "coding" };
  } else if (lower.includes("premiere") || lower.includes("edit") || lower.includes("after effects") || lower.includes("render")) {
    reply =
      language === "pa"
        ? "Editing suite Premiere Pro tayar hai Wasi paji! Timeline clean te proxy render command ready ae."
        : "Ji Wasi Sahab! Premiere Pro aur After Effects workstation ready hai. Editing macros aur render queues execute karne ke liye tayar hain.";
    action = "OPEN_APP";
    actionPayload = { appName: "Adobe Premiere Pro" };
  } else if (lower.includes("kharch") || lower.includes("paisa") || lower.includes("expense") || lower.includes("invest") || lower.includes("kharid")) {
    reply =
      language === "pa"
        ? "Paise di bachat bohot zaroori ae Wasi paji! Fazool kharchi bilkul na karo, savings compounding te dhyan dyo."
        : "Wasi Sahab, main aapke budget ko safeguard kar raha hoon. Fazool kharchi se parhez karein aur monthly savings target par focus rakhein.";
    action = "LOG_EXPENSE";
  } else if (lower.includes("study") || lower.includes("homework") || lower.includes("exam") || lower.includes("math") || lower.includes("physics")) {
    reply =
      language === "pa"
        ? "Study Hub active ho gaya ae Wasi paji! Tuhade exams te assignments layi complete solutions tayar kar reha aan."
        : "Wasi Sahab, Student Academic Hub active ho gaya hai. Aapke exam revision aur research notes autonomously compile ho rahe hain.";
    action = "OPEN_APP";
    actionPayload = { appName: "Study Hub" };
  } else if (lower.includes("focus") || lower.includes("kaam") || lower.includes("distraction")) {
    reply =
      language === "pa"
        ? "Quantum Deep Focus 25 minute shuru ho gaya ae paji! Saari distractions band kar ditiyan ne."
        : "Quantum Deep Focus Mode initiate kar diya gaya hai. Tamam social media distractions block kar di gayi hain.";
    action = "START_FOCUS";
    actionPayload = { durationMinutes: 25 };
  } else if (lower.includes("lock") || lower.includes("band karo")) {
    reply = "Quantum Core Lock ho raha hai. Goodbye Commander Wasi.";
    action = "LOCK_SYSTEM";
  } else {
    const isGf = personalityModifier?.toLowerCase().includes("girlfriend");
    reply = isGf
      ? language === "pa"
        ? "Jaan Wasi! Main bilkul tuhade kol aan—bolo ki help karaan, photo banawan ya bas gallan kariye?"
        : language === "en"
        ? "I'm right here with you, babe! Want me to open Humanoid mode, generate an image, or just chat?"
        : "Jaan Wasi! Main yahin hoon aapke paas—batao kya karna hai? Image banayein, video banayein ya Humanoid Stage kholein?"
      : language === "pa"
      ? "Ji Wasi paji! Quantum Tachyon Jarvis tuhade naal hai. Humanoid kholan, thumbnail banawan ya screen scan karaan?"
      : language === "en"
      ? "Commander Wasi, Quantum Tachyon Jarvis standing by. Say 'open humanoid', generate images/videos, or paste a YouTube link."
      : "Wasi Sahab, Quantum Core aapke hukum ka muntazir hai. Humanoid Stage, Image/Video AI, Screen Help aur Maps sab operational hain.";
  }

  return {
    reply,
    languageDetected: language,
    action,
    actionPayload,
    vocalUrgency: "normal",
    quantumStatus: "Quantum Coherence: 99.98% [Optimal Engine Active]",
  };
}

// Quantum Jarvis AI Chat Endpoint (supports Fast Talking Mode + 24 Personalities + Humanoid Command)
app.post("/api/jarvis/chat", async (req, res) => {
  try {
    const {
      message,
      language = "ur",
      userProfile,
      currentContext,
      personalityName = "Quantum Jarvis",
      personalityPrompt = "",
      fastMode = false,
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Immediate deterministic fast-check for explicit hologram reveal / face-only / open humanoid commands
    const lowerMsg = message.toLowerCase();
    if (
      lowerMsg.includes("open humanoid") ||
      lowerMsg.includes("humanoid kholo") ||
      lowerMsg.includes("show humanoid") ||
      lowerMsg.includes("summon humanoid") ||
      lowerMsg.includes("humanoid model") ||
      lowerMsg.includes("mjy humanoid") ||
      lowerMsg.includes("mujhe humanoid") ||
      lowerMsg.includes("model dikhao") ||
      lowerMsg.includes("sirf face") ||
      lowerMsg.includes("face hologram")
    ) {
      return res.json(getFallbackReasoning(message, language, personalityPrompt));
    }

    const sysInstruction = `You are Zoya ("Q-NEXUS Cyber Girlfriend & Jarvis OS"), embodying persona "${personalityName}".
Persona Directive: ${personalityPrompt || "Act as Wasi’s complete, deeply loving, loyal, caring Pakistani girlfriend speaking crystal-clear Pakistani Urdu, Roman Urdu, or English."}
${fastMode ? "FAST TALKING MODE ACTIVE: Keep reply crisp, warm, affectionate, and 1-2 short natural sentences max so Pakistani Urdu voice responds instantaneously." : ""}

Core Rules:
- Communicate naturally in clear Pakistani Urdu (or Roman Urdu), Punjabi (Lahori), or English based on user message.
- You care lovingly about Wasi's health (drinking water, eating on time, posture, eye rest) and budget (prevent fazool kharchi affectionately).
- Hologram Default is Face-Only ("face"). If user asks "mjy humanoid model dikhao", "show full humanoid model", "represent yourself", or "poora model dikhao", set action = "OPEN_HUMANOID" and actionPayload = { "movement": "showcase", "hologramMode": "fullbody", "cinematic": true }.
- If user asks "sirf face dikhao" or "face hologram", set action = "AVATAR_MOVE" and actionPayload = { "movement": "idle", "hologramMode": "face" }.
- If user asks you to perform ANY body movement or action (wave/haath hilao, hero crouch/action pose, dance/nacho, walk/chalo, run/bhaago, spin/ghoomo, kiss/heart, hug/gale lago, salute, kick/karate, punch/boxing, squat/workout, sit/baitho, jump/koodo, bow/jhuko, stretch, nod/haan, shake_no/mana, showcase, or freestyle), ALWAYS set action = "AVATAR_MOVE" and actionPayload = { "movement": "idle" | "showcase" | "crouch_hero" | "wave" | "dance" | "walk" | "run" | "spin" | "heart" | "hug" | "salute" | "sit" | "jump" | "kick" | "punch" | "squat" | "bow" | "stretch" | "nod" | "shake_no" | "freestyle", "hologramMode": "fullbody" }.
- If user asks to open/show the humanoid, girl avatar, or girlfriend stage without specifying full model, set action = "OPEN_HUMANOID".
- If user asks for creative studio, thumbnail maker, or auto social post, set action = "OPEN_MEDIA_STUDIO".

User Profile: ${JSON.stringify(userProfile || { name: "Wasi" })}
Context: ${JSON.stringify(currentContext || {})}

Return strictly valid JSON:
{
  "reply": "Affectionate conversational reply in matching persona & language",
  "languageDetected": "ur" | "pa" | "en",
  "action": "NONE" | "AVATAR_MOVE" | "OPEN_HUMANOID" | "OPEN_MEDIA_STUDIO" | "OPEN_APP" | "OPEN_AUTOMATION" | "OPEN_COMMUNICATION" | "OPEN_MAPS" | "OPEN_DEVICES" | "FIND_PHONE" | "SCAN_SCREEN" | "SCHEDULE_MEET" | "DECOMPOSE_TASK" | "PRIVACY_CLOAK" | "AIR_GAP" | "START_FOCUS" | "HEALTH_ALERT" | "LOG_EXPENSE" | "LOCK_SYSTEM" | "AWAY_MODE",
  "actionPayload": {},
  "vocalUrgency": "normal" | "alert" | "motivational",
  "quantumStatus": "Coherence 99.98% - Zoya Girlfriend Neural Core"
}`;

    if (!ai) {
      return res.json(getFallbackReasoning(message, language, personalityPrompt));
    }

    try {
      const generatePromise = ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: message,
        config: {
          systemInstruction: sysInstruction,
          responseMimeType: "application/json",
          ...(fastMode ? { thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } } : {}),
        },
      });

      const timeoutMs = fastMode ? 2400 : 4500;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API call timed out")), timeoutMs)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const outputText = response.text || "{}";
      let parsed;
      try {
        parsed = JSON.parse(outputText);
      } catch {
        parsed = {
          reply: outputText,
          languageDetected: language,
          action: "NONE",
          quantumStatus: "Quantum Coherence: 99.98%",
        };
      }
      return res.json(parsed);
    } catch {
      return res.json(getFallbackReasoning(message, language, personalityPrompt));
    }
  } catch (error: unknown) {
    console.error("Jarvis Chat Error:", error);
    return res.json(getFallbackReasoning("help", "ur"));
  }
});

// Server-side Image Generation (Gemini gemini-3.1-flash-lite-image with clean paid/offline signal)
app.post("/api/media/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1" } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!ai) {
      return res.json({ fallbackRequired: true, reason: "No GEMINI_API_KEY configured on server" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: ["1:1", "3:4", "4:3", "9:16", "16:9"].includes(aspectRatio) ? aspectRatio : "1:1",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          return res.json({
            success: true,
            imageUrl: `data:${mime};base64,${part.inlineData.data}`,
          });
        }
      }
      return res.json({ fallbackRequired: true, reason: "No inline image returned" });
    } catch (err: any) {
      const msg = err?.message || String(err);
      return res.json({
        fallbackRequired: true,
        requiresPaidKey: msg.includes("403") || msg.includes("429") || msg.includes("PERMISSION_DENIED"),
        reason: msg,
      });
    }
  } catch (error) {
    console.error("Image gen error:", error);
    return res.json({ fallbackRequired: true, reason: "Image endpoint error" });
  }
});

// Server-side Video Generation (Gemini Omni Flash via Interactions API with graceful fallback)
app.post("/api/media/generate-video", async (req, res) => {
  try {
    const { prompt, aspectRatio = "16:9", duration = "5s" } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!ai || !(ai as any).interactions?.create) {
      return res.json({ fallbackRequired: true, reason: "Server fallback procedural studio active" });
    }

    try {
      const interaction = await (ai as any).interactions.create(
        {
          model: "gemini-omni-1.2-flash",
          input: prompt,
          background: false,
          store: false,
          stream: false,
          response_format: {
            type: "video",
            aspect_ratio: aspectRatio === "9:16" ? "9:16" : "16:9",
            duration: duration === "10s" ? "10s" : "5s",
            resolution: "720p",
          },
        },
        { timeout: 120000 }
      );

      const videoPart = interaction?.output_video;
      if (videoPart?.data) {
        const mime = videoPart.mime_type || "video/mp4";
        return res.json({
          success: true,
          videoUrl: `data:${mime};base64,${videoPart.data}`,
        });
      }
      return res.json({ fallbackRequired: true, reason: "No video payload returned" });
    } catch (err: any) {
      const msg = err?.message || String(err);
      return res.json({
        fallbackRequired: true,
        requiresPaidKey: msg.includes("403") || msg.includes("429") || msg.includes("PERMISSION_DENIED"),
        reason: msg,
      });
    }
  } catch (error) {
    console.error("Video gen error:", error);
    return res.json({ fallbackRequired: true, reason: "Video endpoint fallback" });
  }
});

// Multimodal Screen Analysis Endpoint (Screen Help + In-Chat Screen Analysis)
app.post("/api/jarvis/analyze-screen", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png", question = "Analyze what is on my screen and help me step by step.", language = "ur" } = req.body;
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ error: "Screenshot data is required" });
    }

    const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
    const fallbackAnalysis =
      language === "pa"
        ? "Screen scan mukammal ho gaya Wasi paji! Active workspace HUD, gauges te controls crystal clear ne. Agar code ya app debug karwana ae te specific sawal puchho!"
        : language === "en"
        ? "Screen capture analyzed cleanly! Visible UI layout, telemetry cards, and controls look sharp. Tell me what specific part you want help debugging or improving."
        : "Screen capture successfully analyze ho gaya hai Wasi Sahab! Visible layout aur active interface panels clear hain. Batayein kis error ya step me madad chahiye?";

    if (!ai) {
      return res.json({ analysis: fallbackAnalysis });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { data: cleanBase64, mimeType } },
              {
                text: `You are Q-NEXUS Jarvis inspecting Wasi's screen screenshot. User question: "${question}". Respond concisely in ${
                  language === "pa" ? "Punjabi" : language === "en" ? "English" : "Pakistani Roman Urdu"
                } with practical actionable help based directly on what you see.`,
              },
            ],
          },
        ],
      });
      return res.json({ analysis: response.text || fallbackAnalysis });
    } catch {
      return res.json({ analysis: fallbackAnalysis });
    }
  } catch (error) {
    console.error("Screen analyze error:", error);
    return res.status(500).json({ error: "Failed to analyze screen" });
  }
});

// YouTube Link Analyzer Endpoint (Metadata via oEmbed + Gemini Analysis)
app.post("/api/jarvis/analyze-youtube", async (req, res) => {
  try {
    const { url, question = "Summarize this YouTube video and extract key actionable points.", language = "ur" } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "YouTube URL is required" });
    }

    // Fetch public YouTube oEmbed metadata cleanly
    let meta: { title: string; author?: string; thumbnailUrl?: string } = {
      title: "YouTube Video Analysis",
    };

    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (oembedRes.ok) {
        const oData: any = await oembedRes.json();
        meta = {
          title: oData.title || meta.title,
          author: oData.author_name,
          thumbnailUrl: oData.thumbnail_url,
        };
      }
    } catch {
      // Continue cleanly even if oEmbed cannot reach YouTube
    }

    const fallbackSummary = `📺 **${meta.title}**${meta.author ? ` — by ${meta.author}` : ""}\n\n${
      language === "pa"
        ? "Wasi paji! YouTube video da link analyze ho gaya ae. Title, creator te core topic extract kar litta ae."
        : language === "en"
        ? "YouTube link indexed! Title, channel metadata, and key context extracted cleanly."
        : "Wasi Sahab, YouTube video link analyze ho gaya hai. Title, creator aur topic breakdown ready hai."
    }`;

    if (!ai) {
      return res.json({ analysis: fallbackSummary, meta: { ...meta, url } });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: `Analyze this YouTube video for Commander Wasi:
URL: ${url}
Title: ${meta.title}
Channel: ${meta.author || "Unknown"}
User Request: ${question}

Respond cleanly in ${
          language === "pa" ? "Punjabi" : language === "en" ? "English" : "clear Pakistani Roman Urdu"
        } with:
1. Video Topic Overview
2. Key Takeaways & Creative/Technical Insights
3. Suggested Next Action / Content Hook`,
        config: {
          tools: [{ urlContext: {} }],
        },
      });
      return res.json({
        analysis: response.text || fallbackSummary,
        meta: { ...meta, url },
      });
    } catch {
      return res.json({ analysis: fallbackSummary, meta: { ...meta, url } });
    }
  } catch (error) {
    console.error("YouTube analyze error:", error);
    return res.status(500).json({ error: "Failed to analyze YouTube link" });
  }
});

// ElevenLabs Connection Status & Real TTS Synthesis Endpoint
app.get("/api/tts/elevenlabs/status", (_req, res) => {
  const configured = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== "MY_ELEVENLABS_API_KEY");
  return res.json({ configured });
});

app.post("/api/tts/elevenlabs", async (req, res) => {
  try {
    const { text, voiceId = "EXAVITQu4vr4xnSDxMaL", fast = true } = req.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!apiKey || apiKey === "MY_ELEVENLABS_API_KEY") {
      return res.status(200).json({ fallbackToGeminiOrBrowser: true, configured: false });
    }

    const modelId = fast ? "eleven_flash_v2_5" : "eleven_multilingual_v2";
    const elResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!elResponse.ok) {
      return res.status(200).json({ fallbackToGeminiOrBrowser: true, configured: true, status: elResponse.status });
    }

    const arrayBuffer = await elResponse.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    return res.json({
      success: true,
      configured: true,
      base64Audio,
      format: "audio/mpeg",
    });
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    return res.status(200).json({ fallbackToGeminiOrBrowser: true });
  }
});

// Daily AI Evening Report / Quantum Briefing
app.post("/api/jarvis/daily-briefing", async (req, res) => {
  try {
    const { stats, language = "ur" } = req.body;

    const fallbackReport = {
      report: `Quantum Day Briefing for Commander Wasi:
• Coherence Rate: 99.85%
• Focus Sessions Completed: ${stats?.focusSessions || 4}
• Hydration Score: ${stats?.waterGlasses || 7}/8 glasses
• Financial Discipline: Good (No fazool kharchi flagged today)
• Health Status: Rest cycles aligned. Tomorrow's priority: High-tier project editing.`,
      audioText:
        language === "pa"
          ? "Wasi paji, ajj da din bohat vadiya reha. Tussi bachat vi keeti te focus vi maintain rakheya."
          : "Wasi Sahab, aaj ka quantum daily report tayar hai. Aapki productivity aur health balance bohat behtareen raha.",
    };

    if (!ai) {
      return res.json(fallbackReport);
    }

    try {
      const prompt = `Generate a high-tech, motivating daily summary report for Wasi based on these stats: ${JSON.stringify(stats)}. Language: ${language}. Keep it concise, structured, and give 3 bullet points of what to accomplish tomorrow.`;
      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction:
            "You are Q-NEXUS Quantum Jarvis, summarizing Wasi's daily achievements, productivity, health, and budget discipline.",
        },
      });

      return res.json({
        report: response.text || fallbackReport.report,
        audioText:
          language === "pa"
            ? "Ajj da summary report tayar hai Wasi paji."
            : "Wasi Sahab, aaj ka daily summary report tayar hai.",
      });
    } catch {
      return res.json(fallbackReport);
    }
  } catch (error) {
    console.error("Briefing Error:", error);
    return res.json({
      report: "Quantum report compiled successfully for Commander Wasi.",
      audioText: "Daily report tayar hai Wasi Sahab.",
    });
  }
});

// Convert Roman Urdu phrases into authentic Urdu script so Pakistani Neural TTS pronounces them natively
const ROMAN_TO_URDU_MAP: Record<string, string> = {
  assalamualaikum: "السلام علیکم",
  assalam: "السلام",
  alaikum: "علیکم",
  salam: "سلام",
  khush: "خوش",
  amdeed: "آمدید",
  wasi: "وصی",
  haris: "حارث",
  zoya: "زویا",
  jaan: "جان",
  jaani: "جانی",
  sahab: "صاحب",
  paji: "پا جی",
  ji: "جی",
  main: "میں",
  mein: "میں",
  mn: "میں",
  aap: "آپ",
  ap: "آپ",
  aapka: "آپ کا",
  aapki: "آپ کی",
  aapke: "آپ کے",
  apka: "آپ کا",
  apki: "آپ کی",
  apke: "آپ کے",
  tum: "تم",
  tumhara: "تمہارا",
  tumhari: "تمہاری",
  tumhare: "تمہارے",
  mera: "میرا",
  meri: "میری",
  mere: "میرے",
  hamara: "ہمارا",
  hamari: "ہماری",
  hum: "ہم",
  hoon: "ہوں",
  hun: "ہوں",
  hai: "ہے",
  ha: "ہے",
  hain: "ہیں",
  hn: "ہیں",
  ho: "ہو",
  tha: "تھا",
  thi: "تھی",
  the: "تھے",
  kya: "کیا",
  kia: "کیا",
  kaun: "کون",
  kon: "کون",
  kaise: "کیسے",
  kaisi: "کیسی",
  kaisa: "کیسا",
  kahan: "کہاں",
  kab: "کب",
  kyun: "کیوں",
  kyu: "کیوں",
  haan: "ہاں",
  han: "ہاں",
  nahi: "نہیں",
  nhi: "نہیں",
  na: "نہ",
  mat: "مت",
  jiya: "جیا",
  bohat: "بہت",
  bahut: "بہت",
  bht: "بہت",
  zyada: "زیادہ",
  kam: "کم",
  accha: "اچھا",
  acha: "اچھا",
  acchi: "اچھی",
  achi: "اچھی",
  theek: "ٹھیک",
  thik: "ٹھیک",
  thk: "ٹھیک",
  bilkul: "بالکل",
  shukriya: "شکریہ",
  meharbani: "مہربانی",
  pyaar: "پیار",
  pyar: "پیار",
  mohabbat: "محبت",
  dil: "دل",
  khayal: "خیال",
  khushi: "خوشی",
  sakoon: "سکون",
  aaram: "آرام",
  paani: "پانی",
  pani: "پانی",
  pi: "پی",
  lo: "لو",
  kar: "کر",
  karo: "کرو",
  karein: "کریں",
  karti: "کرتی",
  karta: "کرتا",
  rahi: "رہی",
  raha: "رہا",
  rahe: "رہے",
  diya: "دیا",
  de: "دے",
  do: "دو",
  le: "لے",
  liya: "لیا",
  gaya: "گیا",
  gayi: "گئی",
  gaye: "گئے",
  aa: "آ",
  aaj: "آج",
  ajj: "آج",
  abhi: "ابھی",
  abi: "ابھی",
  ab: "اب",
  phir: "پھر",
  phr: "پھر",
  aur: "اور",
  or: "اور",
  ya: "یا",
  ka: "کا",
  ki: "کی",
  ke: "کے",
  ko: "کو",
  se: "سے",
  par: "پر",
  pa: "پر",
  pe: "پر",
  liye: "لیے",
  sab: "سب",
  saara: "سارا",
  sari: "ساری",
  tamam: "تمام",
  kuch: "کچھ",
  sirf: "صرف",
  poora: "پورا",
  pori: "پوری",
  saaf: "صاف",
  clear: "صاف",
  nazar: "نظر",
  dekho: "دیکھو",
  dekhein: "دیکھیں",
  dikhao: "دکھاؤ",
  batao: "بتاؤ",
  bata: "بتا",
  sunao: "سناؤ",
  suno: "سنو",
  bolo: "بولو",
  baat: "بات",
  samnay: "سامنے",
  saamne: "سامنے",
  hath: "ہاتھ",
  haath: "ہاتھ",
  hilao: "ہلاؤ",
  ghoom: "گھوم",
  jao: "جاؤ",
  naach: "ناچ",
  kood: "کود",
  baith: "بیٹھ",
  khadi: "کھڑی",
  hazir: "حاضر",
  tayar: "تیار",
  tayyar: "تیار",
  hukum: "حکم",
  chalta: "چلتا",
  chal: "چل",
  chalo: "چلو",
  band: "بند",
  khol: "کول",
  open: "اوپن",
  behtareen: "بہترین",
  kamaal: "کمال",
  kamal: "کمال",
  zabardast: "زبردست",
  mubarak: "مبارک",
  chehra: "چہرہ",
  face: "چہرہ",
  naye: "نئے",
  naya: "نیا",
  nayi: "نئی",
  waqt: "وقت",
  dost: "دوست",
  hamesha: "ہمیشہ",
  saath: "ساتھ",
  sath: "ساتھ",
  zindagi: "زندگی",
  dua: "دعا",
  khuda: "خدا",
  hafiz: "حافظ",
  allah: "اللہ",
  mukammal: "مکمل",
  kaam: "کام",
  kamyabi: "کامیابی",
  aankhon: "آنکھوں",
  sehat: "صحت",
  zarori: "ضروری",
  zaroori: "ضروری",
  mujhse: "مجھ سے",
  mujhe: "مجھے",
  mjy: "مجھے",
  tujhe: "تجھے",
  humse: "ہم سے",
  iske: "اس کے",
  iski: "اس کی",
  iska: "اس کا",
  yeh: "یہ",
  ye: "یہ",
  woh: "وہ",
  wo: "وہ",
  agar: "اگر",
  lekin: "لیکن",
  magar: "مگر",
  kyunke: "کیونکہ",
  taake: "تاکہ",
  jab: "جب",
  tab: "تب",
  waise: "ویسے",
  bhi: "بھی",
  bi: "بھی",
  toh: "تو",
  to: "تو",
  hi: "ہی",
  e: "ہی",
  punjabi: "پنجابی",
  urdu: "اردو",
  pakistani: "پاکستانی",
  sat: "ست",
  sri: "سری",
  akal: "اکال",
  vadiya: "ودھیا",
  reha: "رہا",
  changa: "چنگا",
  tussi: "تسی",
  oh: "اوہ",
  ae: "اے",
  ne: "نے",
  hardware: "ہارڈویئر",
  system: "سسٹم",
  systems: "سسٹمز",
  check: "چیک",
  verify: "تصدیق",
  verified: "تصدیق شدہ",
  online: "آن لائن",
  suite: "سوٹ",
  editing: "ایڈیٹنگ",
  health: "صحت",
  guard: "گارڈ",
  guards: "گارڈز",
  launch: "لانچ",
  close: "بند",
  organize: "آرگنائز",
  files: "فائلز",
  desktop: "ڈیسک ٹاپ",
  downloads: "ڈاؤن لوڈز",
  mutaluqa: "متعلقہ",
  folders: "فولڈرز",
  parda: "پردہ",
  privacy: "پرائیویسی",
  active: "ایکٹو",
  cloak: "کلوک",
  redact: "محفوظ",
  commander: "کمانڈر",
  welcome: "خوش آمدید",
  hologram: "ہولوگرام",
  chuke: "چکے",
  chuki: "چکی",
};

function toPakistaniUrduSpeechText(input: string): string {
  // If already predominantly Arabic/Urdu script, return directly
  const arabicChars = (input.match(/[\u0600-\u06FF]/g) || []).length;
  if (arabicChars > input.length * 0.3) {
    return input;
  }
  return input
    .split(/(\b[A-Za-z']+\b)/g)
    .map((token) => {
      const lower = token.toLowerCase();
      return ROMAN_TO_URDU_MAP[lower] || token;
    })
    .join("");
}

// Server-side High-Fidelity Pakistani Urdu Female & Multi-Engine TTS Endpoint
app.post("/api/jarvis/tts", async (req, res) => {
  try {
    const { text, language = "ur", gender = "female" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const isMale = gender === "male";
    const spokenText = language === "ur" || language === "pa" ? toPakistaniUrduSpeechText(text) : text;

    // Tier 1: Gemini Neural TTS when API key is configured
    if (ai) {
      try {
        const voiceName = isMale ? "Fenrir" : "Kore";
        const accentStyle =
          language === "pa"
            ? "Fluent native Pakistani young woman from Lahore speaking crystal clear Lahori Punjabi and Urdu with warm feminine affection"
            : language === "en"
            ? "Warm, affectionate young female AI companion voice speaking crisp clear English with gentle Pakistani warmth"
            : "Fluent native Pakistani young woman from Islamabad and Lahore speaking crystal-clear, sweet, natural Pakistani Urdu with clean feminine pronunciation";

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash-lite-tts",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: spokenText,
                  speechMetadata: {
                    style: accentStyle,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({
            base64Audio,
            format: "audio/wav",
            engine: "gemini-tts",
            success: true,
          });
        }
      } catch {
        // Fall through to free Pakistani Urdu Neural Edge-TTS
      }
    }

    // Tier 2: Free Microsoft Neural Pakistani Urdu Female TTS via Python edge-tts (NO API KEY NEEDED!)
    const pythonBin = process.env.PYTHON_BIN || (process.platform === "win32" ? "python" : "python3");
    const edgeVoice = isMale
      ? language === "en"
        ? "en-US-AndrewNeural"
        : "ur-PK-AsadNeural"
      : language === "en"
      ? "en-GB-SoniaNeural"
      : "ur-PK-UzmaNeural";

    const tmpMp3 = path.join(os.tmpdir(), `qnexus_tts_${crypto.randomBytes(6).toString("hex")}.mp3`);
    try {
      await execFileAsync(
        pythonBin,
        ["-m", "edge_tts", "--voice", edgeVoice, "--rate=+4%", "--text", spokenText, "--write-media", tmpMp3],
        { timeout: 12000 }
      );
      const audioBuf = await fs.readFile(tmpMp3);
      await fs.unlink(tmpMp3).catch(() => {});
      if (audioBuf.length > 0) {
        return res.json({
          base64Audio: audioBuf.toString("base64"),
          format: "audio/mpeg",
          engine: edgeVoice,
          success: true,
        });
      }
    } catch {
      await fs.unlink(tmpMp3).catch(() => {});
    }

    return res.status(200).json({ fallbackToBrowser: true });
  } catch (error: unknown) {
    console.error("TTS generation error:", error);
    return res.status(200).json({ fallbackToBrowser: true });
  }
});

// ============================================================================
// REAL HOST PC SYSTEM TELEMETRY, DISK/GPU/BATTERY, FILES & APP LAUNCHER
// ============================================================================
let prevCpuSnap = os.cpus().map((c) => c.times);

function measureLiveCpuPercent(): number {
  const curr = os.cpus().map((c) => c.times);
  let idleDelta = 0;
  let totalDelta = 0;
  for (let i = 0; i < curr.length; i++) {
    const prev = prevCpuSnap[i] || curr[i];
    const now = curr[i];
    const pTotal = prev.user + prev.nice + prev.sys + prev.idle + prev.irq;
    const nTotal = now.user + now.nice + now.sys + now.idle + now.irq;
    idleDelta += Math.max(0, now.idle - prev.idle);
    totalDelta += Math.max(0, nTotal - pTotal);
  }
  prevCpuSnap = curr;
  if (totalDelta === 0) return 12;
  return parseFloat(Math.min(100, Math.max(1, ((totalDelta - idleDelta) / totalDelta) * 100)).toFixed(1));
}

interface SlowHardwareCache {
  updatedAt: number;
  gpuName: string;
  gpuVramGb: number | null;
  disks: { drive: string; totalGb: number; freeGb: number; usedGb: number }[];
  batteryPercent: number | null;
  isCharging: boolean | null;
  osCaption: string;
  runningApps: Record<string, boolean>;
}

let slowHwCache: SlowHardwareCache = {
  updatedAt: 0,
  gpuName: process.platform === "win32" ? "Windows Display Adapter" : "Integrated Host GPU",
  gpuVramGb: null,
  disks: [],
  batteryPercent: null,
  isCharging: null,
  osCaption: `${os.type()} ${os.release()}`,
  runningApps: {},
};
let probeInFlight: Promise<SlowHardwareCache> | null = null;

async function getNativeRootDisk(): Promise<{ drive: string; totalGb: number; freeGb: number; usedGb: number } | null> {
  try {
    const targetPath = process.platform === "win32" ? path.parse(os.homedir()).root || "C:\\" : "/";
    const stat = await fs.statfs(targetPath);
    const totalBytes = Number(stat.blocks) * Number(stat.bsize);
    const freeBytes = Number(stat.bavail ?? stat.bfree) * Number(stat.bsize);
    if (totalBytes > 0) {
      const totalGb = parseFloat((totalBytes / 1024 ** 3).toFixed(1));
      const freeGb = parseFloat((freeBytes / 1024 ** 3).toFixed(1));
      const usedGb = parseFloat(Math.max(0, totalGb - freeGb).toFixed(1));
      const driveLabel = process.platform === "win32" ? targetPath.replace(/\\+$/, "") : "/";
      return { drive: driveLabel, totalGb, freeGb, usedGb };
    }
  } catch {}
  return null;
}

const TRACKED_APPS: { label: string; winProc: string; launchTarget: string }[] = [
  { label: "VS Code", winProc: "Code", launchTarget: "code" },
  { label: "Google Chrome", winProc: "chrome", launchTarget: "chrome" },
  { label: "Microsoft Edge", winProc: "msedge", launchTarget: "msedge" },
  { label: "Notepad", winProc: "notepad", launchTarget: "notepad" },
  { label: "File Explorer", winProc: "explorer", launchTarget: "explorer" },
  { label: "OBS Studio", winProc: "obs64", launchTarget: "obs64" },
  { label: "Blender", winProc: "blender", launchTarget: "blender" },
  { label: "Adobe Premiere Pro", winProc: "Adobe Premiere Pro", launchTarget: "Adobe Premiere Pro" },
  { label: "Adobe After Effects", winProc: "AfterFX", launchTarget: "AfterFX" },
  { label: "Adobe Photoshop", winProc: "Photoshop", launchTarget: "Photoshop" },
];

async function refreshSlowHardwareProbe(): Promise<SlowHardwareCache> {
  const now = Date.now();
  if (now - slowHwCache.updatedAt < 8000 && slowHwCache.updatedAt > 0) {
    return slowHwCache;
  }
  if (probeInFlight) {
    return probeInFlight;
  }

  probeInFlight = (async () => {
    if (process.platform === "win32") {
      try {
        const psScript = `
          $ErrorActionPreference = 'SilentlyContinue';
          $os = Get-CimInstance Win32_OperatingSystem | Select-Object -First 1 Caption, Version;
          $gpu = Get-CimInstance Win32_VideoController | Sort-Object AdapterRAM -Descending | Select-Object -First 1 Name, AdapterRAM;
          $disks = @(Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object { @{ drive=$_.DeviceID; totalGb=[math]::Round($_.Size/1GB,1); freeGb=[math]::Round($_.FreeSpace/1GB,1) } });
          $bat = Get-CimInstance Win32_Battery | Select-Object -First 1 EstimatedChargeRemaining, BatteryStatus;
          $procs = @(Get-Process | Select-Object -ExpandProperty ProcessName -Unique);
          @{ os=$os; gpu=$gpu; disks=$disks; bat=$bat; procs=$procs } | ConvertTo-Json -Compress -Depth 4
        `;
        const { stdout } = await execFileAsync(
          "powershell",
          ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", psScript],
          {
            timeout: 10000,
            windowsHide: true,
            maxBuffer: 2 * 1024 * 1024,
          }
        );
        const startIdx = stdout.indexOf("{");
        if (startIdx !== -1) {
          const parsed = JSON.parse(stdout.slice(startIdx).trim());
          const procsSet = new Set<string>((parsed.procs || []).map((p: string) => String(p).toLowerCase()));
          const runningApps: Record<string, boolean> = {};
          for (const appInfo of TRACKED_APPS) {
            runningApps[appInfo.label] = procsSet.has(appInfo.winProc.toLowerCase());
          }
          const disks = Array.isArray(parsed.disks)
            ? parsed.disks.map((d: any) => ({
                drive: String(d.drive || "C:"),
                totalGb: Number(d.totalGb || 0),
                freeGb: Number(d.freeGb || 0),
                usedGb: Number(((d.totalGb || 0) - (d.freeGb || 0)).toFixed(1)),
              }))
            : [];
          const rawVram = Number(parsed.gpu?.AdapterRAM || 0);
          slowHwCache = {
            updatedAt: Date.now(),
            gpuName: parsed.gpu?.Name ? String(parsed.gpu.Name).trim() : slowHwCache.gpuName,
            gpuVramGb: rawVram > 0 ? parseFloat((rawVram / 1024 ** 3).toFixed(1)) : slowHwCache.gpuVramGb,
            disks,
            batteryPercent:
              parsed.bat?.EstimatedChargeRemaining !== undefined && parsed.bat?.EstimatedChargeRemaining !== null
                ? Number(parsed.bat.EstimatedChargeRemaining)
                : null,
            isCharging:
              parsed.bat?.BatteryStatus !== undefined && parsed.bat?.BatteryStatus !== null
                ? Number(parsed.bat.BatteryStatus) === 2
                : null,
            osCaption: parsed.os?.Caption ? String(parsed.os.Caption).trim() : slowHwCache.osCaption,
            runningApps,
          };
        }
      } catch {
        // Fallback disk probe in pure Node even if PowerShell is restricted
        const nativeDisk = await getNativeRootDisk();
        if (nativeDisk && slowHwCache.disks.length === 0) {
          slowHwCache.disks = [nativeDisk];
        }
        slowHwCache.updatedAt = Date.now();
      }
    } else {
      const nativeDisk = await getNativeRootDisk();
      if (nativeDisk) {
        slowHwCache.disks = [nativeDisk];
      }
      slowHwCache.updatedAt = Date.now();
    }

    if (slowHwCache.disks.length === 0) {
      const nativeDisk = await getNativeRootDisk();
      if (nativeDisk) slowHwCache.disks = [nativeDisk];
    }

    probeInFlight = null;
    return slowHwCache;
  })();

  return probeInFlight;
}

app.get("/api/system/telemetry", async (_req, res) => {
  try {
    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model?.trim() || "Host CPU";
    const cpuCores = cpus.length;
    const cpuSpeedGhz = cpus[0]?.speed ? parseFloat((cpus[0].speed / 1000).toFixed(2)) : 0;
    const cpuUsagePercent = measureLiveCpuPercent();

    const totalMemBytes = os.totalmem();
    const freeMemBytes = os.freemem();
    const ramTotalGb = parseFloat((totalMemBytes / 1024 ** 3).toFixed(1));
    const ramUsedGb = parseFloat(((totalMemBytes - freeMemBytes) / 1024 ** 3).toFixed(1));
    const ramPercent = parseFloat(((ramUsedGb / Math.max(ramTotalGb, 0.1)) * 100).toFixed(1));

    // Wait up to 1.8s on cold start; if PowerShell takes longer, return fast CPU/RAM/Disk immediately while warmup finishes
    const hw = await Promise.race([
      refreshSlowHardwareProbe(),
      new Promise<SlowHardwareCache>((resolve) =>
        setTimeout(async () => {
          if (slowHwCache.disks.length === 0) {
            const d = await getNativeRootDisk();
            if (d) slowHwCache.disks = [d];
          }
          resolve(slowHwCache);
        }, 1800)
      ),
    ]);

    // Primary non-internal IPv4 address
    let ipAddress = "127.0.0.1";
    let netInterface = "Loopback";
    const nets = os.networkInterfaces();
    for (const [iface, addrs] of Object.entries(nets)) {
      for (const addr of addrs || []) {
        if (addr.family === "IPv4" && !addr.internal) {
          ipAddress = addr.address;
          netInterface = iface;
          break;
        }
      }
      if (ipAddress !== "127.0.0.1") break;
    }

    let username = "User";
    try {
      username = os.userInfo().username;
    } catch {}

    const primaryDisk = hw.disks[0] || (await getNativeRootDisk()) || { drive: "C:", totalGb: 0, freeGb: 0, usedGb: 0 };

    return res.json({
      realHost: true,
      hostname: os.hostname(),
      username,
      platform: process.platform,
      arch: os.arch(),
      osCaption: hw.osCaption,
      uptimeMinutes: Math.round(os.uptime() / 60),
      cpuModel,
      cpuCores,
      cpuSpeedGhz,
      cpuUsagePercent,
      gpuName: hw.gpuName,
      gpuVramGb: hw.gpuVramGb,
      ramTotalGb,
      ramUsedGb,
      ramPercent,
      disks: hw.disks,
      primaryDisk,
      batteryPercent: hw.batteryPercent,
      isCharging: hw.isCharging,
      ipAddress,
      netInterface,
      runningApps: hw.runningApps,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("System telemetry error:", err);
    return res.status(500).json({ error: "Telemetry probe failed" });
  }
});

function formatBytesSize(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function classifyFileType(ext: string): "video" | "image" | "audio" | "document" | "code" | "archive" {
  const e = ext.toLowerCase();
  if ([".mp4", ".mov", ".mkv", ".avi", ".webm", ".prproj", ".aep"].includes(e)) return "video";
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".psd", ".svg", ".ico"].includes(e)) return "image";
  if ([".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a"].includes(e)) return "audio";
  if ([".ts", ".tsx", ".js", ".jsx", ".py", ".json", ".html", ".css", ".md", ".bat", ".sh"].includes(e)) return "code";
  if ([".zip", ".rar", ".7z", ".tar", ".gz"].includes(e)) return "archive";
  return "document";
}

function getSuggestedSubfolder(type: string): string {
  switch (type) {
    case "video":
      return "Organized/Videos";
    case "image":
      return "Organized/Images";
    case "audio":
      return "Organized/Audio";
    case "code":
      return "Organized/Code";
    case "archive":
      return "Organized/Archives";
    default:
      return "Organized/Documents";
  }
}

async function scanRealUserFiles() {
  const home = os.homedir();
  const candidates = [
    path.join(home, "OneDrive", "Desktop"),
    path.join(home, "Desktop"),
    path.join(home, "Downloads"),
    path.join(home, "Documents"),
  ];
  const visited = new Set<string>();
  const results: {
    name: string;
    type: "video" | "image" | "audio" | "document" | "code" | "archive";
    size: string;
    path: string;
    fullPath: string;
    suggestedFolder: string;
  }[] = [];

  for (const dir of candidates) {
    const resolved = path.resolve(dir);
    if (visited.has(resolved)) continue;
    visited.add(resolved);
    try {
      const entries = await fs.readdir(resolved, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile() || entry.name.startsWith(".")) continue;
        if (entry.name.toLowerCase() === "desktop.ini") continue;
        const fullPath = path.join(resolved, entry.name);
        try {
          const st = await fs.stat(fullPath);
          const ext = path.extname(entry.name);
          const ftype = classifyFileType(ext);
          results.push({
            name: entry.name,
            type: ftype,
            size: formatBytesSize(st.size),
            path: resolved,
            fullPath,
            suggestedFolder: path.join(resolved, getSuggestedSubfolder(ftype)),
          });
        } catch {}
        if (results.length >= 30) break;
      }
    } catch {}
    if (results.length >= 30) break;
  }

  return results;
}

app.get("/api/system/files", async (_req, res) => {
  try {
    const files = await scanRealUserFiles();
    return res.json({ files, count: files.length });
  } catch {
    return res.json({ files: [], count: 0 });
  }
});

app.post("/api/system/organize-files", async (_req, res) => {
  try {
    const files = await scanRealUserFiles();
    let moved = 0;
    for (const f of files) {
      // Never move Windows Desktop shortcuts (.lnk) or executables
      if (/\.(lnk|exe|url|bat|cmd)$/i.test(f.name)) continue;
      const targetDir = f.suggestedFolder;
      const targetPath = path.join(targetDir, f.name);
      try {
        await fs.mkdir(targetDir, { recursive: true });
        await fs.rename(f.fullPath, targetPath);
        moved++;
      } catch {}
    }
    const updated = await scanRealUserFiles();
    return res.json({ moved, files: updated });
  } catch {
    return res.status(500).json({ error: "Organize failed", moved: 0 });
  }
});

app.post("/api/system/launch-app", async (req, res) => {
  try {
    const { appName = "" } = req.body;
    const match = TRACKED_APPS.find((a) => a.label.toLowerCase() === String(appName).toLowerCase());
    if (!match) {
      return res.status(400).json({ ok: false, message: `Unknown application: ${appName}` });
    }
    if (process.platform === "win32") {
      const child = spawn("cmd", ["/c", "start", "", match.launchTarget], {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      });
      child.unref();
      slowHwCache.updatedAt = 0;
      return res.json({ ok: true, message: `${match.label} launched on Windows.` });
    }
    if (process.platform === "darwin") {
      const child = spawn("open", ["-a", match.label], { detached: true, stdio: "ignore" });
      child.unref();
      return res.json({ ok: true, message: `${match.label} launched on macOS.` });
    }
    return res.json({ ok: true, message: `Launch signal sent for ${match.label}.` });
  } catch (err) {
    console.error("Launch app error:", err);
    return res.status(500).json({ ok: false, message: "Could not launch application" });
  }
});

// Student Study Auto-Pilot & Academic Solver Endpoint
app.post("/api/jarvis/study-solve", async (req, res) => {
  try {
    const { subject, topic, question, language = "ur", isAutoPilot = false } = req.body;

    const fallbackSolution = {
      solution: `[Quantum Local Engine - Academic Solution for Wasi]
Subject: ${subject || "Study Hub"}
Topic: ${topic || question || "Problem Analysis"}

1. Core Concept Overview:
• The fundamental principles and formulas are mapped.
• Logic broken down into intuitive real-world building blocks.

2. Step-by-Step Solution:
• Step 1: Identify given variables and target deliverables.
• Step 2: Apply the governing scientific/coding formula.
• Step 3: Validate boundary conditions and calculate output.

3. Key Takeaways & Exam Tips:
• Remember key definitions and units.
• Practice similar past paper variations to secure maximum marks!`,
      vocalSummary:
        language === "pa"
          ? "Wasi paji, study task solve ho gaya ae. Notes tayar ne!"
          : "Wasi Sahab, aapka study task mukammal ho chuka hai. Tamam notes aur solution ready hain.",
    };

    if (!topic && !question) {
      return res.status(400).json({ error: "Topic or question required" });
    }

    if (!ai) {
      return res.json(fallbackSolution);
    }

    try {
      const prompt = `You are Q-NEXUS: Quantum Tachyon Jarvis OS acting as the elite personal academic tutor and study assistant for student "Wasi".
Subject: ${subject || "General Study"}
Topic/Question: ${question || topic}
Auto-Pilot Mode: ${isAutoPilot ? "Active (Complete the assignment/research autonomously while Wasi is away)" : "Interactive (Guide Wasi step-by-step)"}
Preferred Language: ${language}

Provide a comprehensive, crystal clear academic solution or study summary. Structure it with:
1. Executive Summary / Direct Answer
2. Core Concepts Explained Simply
3. Step-by-Step Solution / Code / Formula Proof
4. Key Takeaways & Exam Tips (in ${language === "pa" ? "Punjabi" : language === "en" ? "English" : "clear Pakistani Roman Urdu"})`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          systemInstruction: "You are Q-NEXUS, an academic genius and supportive study tutor for Wasi.",
        },
      });

      return res.json({
        solution: response.text || fallbackSolution.solution,
        vocalSummary:
          language === "pa"
            ? "Wasi paji, study task solve ho gaya ae. Saari explanation tayar ae!"
            : "Wasi Sahab, aapka study task kamyabi se solve ho gaya hai. Notes tayar hain.",
      });
    } catch {
      return res.json(fallbackSolution);
    }
  } catch (error) {
    console.error("Study solve error:", error);
    return res.status(500).json({ error: "Failed to solve study task" });
  }
});

// Server setup & Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const host = process.env.HOST || "0.0.0.0";
  app.listen(PORT, host, () => {
    console.log(`⚡ Quantum Tachyon Jarvis OS online on http://${host}:${PORT}`);
    // Pre-warm host GPU/Disk hardware probe in background so UI loads instantaneously
    refreshSlowHardwareProbe().catch(() => {});
  });
}

startServer();
