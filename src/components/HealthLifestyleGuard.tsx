import React, { useState, useEffect } from "react";
import { Heart, Droplet, Eye, Activity, Moon, Utensils, AlertCircle, Plus, Check, Coffee, ShieldAlert } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { storageService } from "../services/storage";
import { HealthState, LanguageCode, VoiceGender } from "../types";

interface HealthLifestyleGuardProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const HealthLifestyleGuard: React.FC<HealthLifestyleGuardProps> = ({
  language,
  voiceGender,
}) => {
  const [health, setHealth] = useState<HealthState>(() => storageService.getHealth());
  const [eyeRestTimer, setEyeRestTimer] = useState(20 * 60); // 20 mins in seconds
  const [isEyeRestModalOpen, setIsEyeRestModalOpen] = useState(false);
  const [eyeRestCountdown, setEyeRestCountdown] = useState(20);

  // New Meal form
  const [showMealForm, setShowMealForm] = useState(false);
  const [mealCategory, setMealCategory] = useState<"Breakfast" | "Lunch" | "Dinner" | "Healthy Snack">("Dinner");
  const [mealDesc, setMealDesc] = useState("");
  const [mealCalories, setMealCalories] = useState(550);
  const [mealProtein, setMealProtein] = useState(35);
  const [isMealHealthy, setIsMealHealthy] = useState(true);

  // Eye Rest Countdown interval
  useEffect(() => {
    const timer = setInterval(() => {
      setEyeRestTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (eyeRestTimer === 0) {
      triggerEyeRestAlert();
      setEyeRestTimer(20 * 60);
    }
  }, [eyeRestTimer, language, voiceGender]);

  // Save health changes
  const updateHealth = (newHealth: HealthState) => {
    setHealth(newHealth);
    storageService.saveHealth(newHealth);
  };

  // Water Drink Action
  const handleDrinkWater = () => {
    soundEffects.playBeepConfirm();
    const newGlasses = Math.min(12, health.waterDrankGlasses + 1);
    const updated = {
      ...health,
      waterDrankGlasses: newGlasses,
      lastWaterReminder: Date.now(),
    };
    updateHealth(updated);

    const vocalText =
      language === "pa"
        ? `Shabash Wasi paji! ${newGlasses} glass paani complete ho gaya. Hydration level bohot fit ae.`
        : `Zabardast Wasi Sahab! ${newGlasses} glasses pani complete ho chuka hai. Aapka hydration level bilkul fit hai.`;

    speechService.speak(vocalText, { lang: language, gender: voiceGender });
  };

  // Trigger Eye Rest
  const triggerEyeRestAlert = () => {
    soundEffects.playAlert();
    setIsEyeRestModalOpen(true);
    setEyeRestCountdown(20);

    const vocalText =
      language === "pa"
        ? "Wasi paji, screen to dhyan hatao te 20 second layi 20 foot door dekho."
        : "Wasi Sahab, 20 minute ho chuke hain. Baraye meherbani screen se nazar hataiye aur 20 second ke liye 20 feet door dekhiye.";

    speechService.speak(vocalText, { lang: language, gender: voiceGender });
  };

  // Eye rest countdown modal tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEyeRestModalOpen && eyeRestCountdown > 0) {
      interval = setInterval(() => {
        setEyeRestCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isEyeRestModalOpen && eyeRestCountdown === 0) {
      soundEffects.playBeepConfirm();
      setIsEyeRestModalOpen(false);
      const doneText =
        language === "pa"
          ? "Eye rest complete ho gaya Wasi paji. Hun tussi dubara kaam shuru kar sakde o."
          : "Eye rest complete ho gaya Wasi Sahab. Aap wapas apna kaam continue kar sakte hain.";
      speechService.speak(doneText, { lang: language, gender: voiceGender });
    }
    return () => clearInterval(interval);
  }, [isEyeRestModalOpen, eyeRestCountdown]);

  // Posture Alert
  const handlePostureCheck = () => {
    soundEffects.playAlert();
    const updated = { ...health, postureAlertsCount: health.postureAlertsCount + 1 };
    updateHealth(updated);

    const vocalText =
      language === "pa"
        ? "Wasi paji, posture theek karo! Apni pith sidhi rakho te thoda stretch kar lo."
        : "Wasi Sahab, posture alert! Apni kamar bilkul seedhi rakhein aur shoulders ko relax karein.";

    speechService.speak(vocalText, { lang: language, gender: voiceGender });
  };

  // Add Meal
  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealDesc.trim()) return;

    soundEffects.playBeepConfirm();
    const newMeal = {
      meal: mealCategory,
      desc: mealDesc.trim(),
      calories: Number(mealCalories),
      proteinGrams: Number(mealProtein),
      healthy: isMealHealthy,
    };

    const updated = {
      ...health,
      mealsLogged: [...health.mealsLogged, newMeal],
    };
    updateHealth(updated);
    setMealDesc("");
    setShowMealForm(false);

    let vocalText = "";
    if (isMealHealthy) {
      vocalText =
        language === "pa"
          ? `Zabardast Wasi paji! ${mealDesc} badiya healthy meal ae. Protein intake vi fit ae.`
          : `Shabash Wasi Sahab, healthy meal log ho gaya hai. Aapki protein aur calorie targets theek chal rahi hain.`;
    } else {
      vocalText =
        language === "pa"
          ? "Dhyan dyo Wasi paji! Yeh junk food hai, zyada na khao, sehat kharab ho sakdi ae."
          : "Wasi Sahab, yeh un-healthy meal hai. Baraye meherbani junk food kam karein taake aapki energy aur focus high rahe.";
    }
    speechService.speak(vocalText, { lang: language, gender: voiceGender });
  };

  const totalCalories = health.mealsLogged.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = health.mealsLogged.reduce((sum, m) => sum + m.proteinGrams, 0);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 font-rajdhani">
      {/* 20-20-20 Eye Rest Modal Overlay */}
      {isEyeRestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border-2 border-cyan-400 text-center shadow-2xl shadow-cyan-500/50">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Eye className="w-10 h-10 animate-pulse" />
            </div>
            <h2 className="text-2xl font-orbitron font-bold text-cyan-300 mb-2">
              20-20-20 EYE REST IN PROGRESS
            </h2>
            <p className="text-sm font-mono text-slate-300 mb-6">
              Look away from the screen at an object 20 feet away to relax optic nerves.
            </p>
            <div className="text-5xl font-orbitron font-bold text-emerald-400 mb-6">
              00:{eyeRestCountdown.toString().padStart(2, "0")}
            </div>
            <button
              onClick={() => setIsEyeRestModalOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
            >
              Skip Break
            </button>
          </div>
        </div>
      )}

      {/* Top Health Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hydration */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-cyan-400" />
              HYDRATION (WATER)
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {health.waterDrankGlasses} / 8 GLASSES
            </span>
          </div>

          <div className="flex items-center gap-1.5 my-3">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-8 rounded-md transition-all duration-300 flex items-end justify-center pb-1 ${
                  idx < health.waterDrankGlasses
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40"
                    : "bg-slate-950 border border-slate-800 text-slate-600"
                }`}
              >
                <Droplet className="w-3 h-3" />
              </div>
            ))}
          </div>

          <button
            onClick={handleDrinkWater}
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>LOG 1 GLASS WATER</span>
          </button>
        </div>

        {/* 20-20-20 Eye Rest Timer */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-purple-400" />
              20-20-20 EYE REST
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold">NEXT BREAK</span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-orbitron font-bold text-slate-100">
              {formatTimer(eyeRestTimer)}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Screen strain fatigue prevention active
            </div>
          </div>

          <button
            onClick={triggerEyeRestAlert}
            className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-purple-900/40"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>TAKE 20s BREAK NOW</span>
          </button>
        </div>

        {/* Posture & Stretch Guardian */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              POSTURE & ERGONOMICS
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">OPTIMAL</span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-orbitron font-bold text-slate-100">
              {health.postureAlertsCount}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Posture calibrations logged today
            </div>
          </div>

          <button
            onClick={handlePostureCheck}
            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>CALIBRATE POSTURE</span>
          </button>
        </div>

        {/* Sleep & Rest Guard */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-blue-400" />
              REST & RECOVERY
            </span>
            <span className="text-xs font-mono text-blue-400 font-bold">RECHARGED</span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-orbitron font-bold text-slate-100">
              {health.sleepHoursLastNight}h
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              Sleep Debt: 0.0 hrs • Bedtime: 11:30 PM
            </div>
          </div>

          <div className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-blue-300 text-center">
            Evening Workout: 6:00 PM - 7:00 PM
          </div>
        </div>
      </div>

      {/* Diet & Nutrition Log */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <h3 className="font-orbitron font-bold text-base text-amber-400 uppercase">
              DIET & NUTRITION GUARDIAN
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">
              Calories: <strong className="text-slate-100">{totalCalories} kcal</strong>
            </span>
            <span className="text-slate-400">
              Protein: <strong className="text-emerald-400">{totalProtein}g</strong>
            </span>
            <button
              onClick={() => setShowMealForm(!showMealForm)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showMealForm ? "CANCEL" : "LOG MEAL"}</span>
            </button>
          </div>
        </div>

        {/* Meal Logging Form */}
        {showMealForm && (
          <form
            onSubmit={handleAddMeal}
            className="mb-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Meal Type</label>
                <select
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Healthy Snack">Healthy Snack</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono text-slate-400 mb-1">What did you eat?</label>
                <input
                  type="text"
                  value={mealDesc}
                  onChange={(e) => setMealDesc(e.target.value)}
                  placeholder="e.g. 2 Boiled Eggs & Oatmeal or Grilled Chicken"
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={mealProtein}
                  onChange={(e) => setMealProtein(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMealHealthy}
                  onChange={(e) => setIsMealHealthy(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-emerald-500"
                />
                <span>Clean & Healthy Diet (Uncheck if junk/fast food)</span>
              </label>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono cursor-pointer"
              >
                SAVE MEAL
              </button>
            </div>
          </form>
        )}

        {/* Meals Log List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {health.mealsLogged.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                m.healthy
                  ? "bg-slate-950/80 border-slate-800 text-slate-200"
                  : "bg-red-950/20 border-red-500/30 text-red-200"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-amber-400">{m.meal}</span>
                  {!m.healthy && (
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 text-[10px]">
                      JUNK FOOD FLAGGED
                    </span>
                  )}
                </div>
                <div className="text-slate-300">{m.desc}</div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-slate-400">{m.calories} kcal</div>
                <div className="text-emerald-400 font-bold">{m.proteinGrams}g Protein</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
