import React, { useState } from "react";
import { DollarSign, TrendingUp, AlertTriangle, ShieldCheck, Plus, Sparkles, PieChart, ArrowUpRight, CheckCircle } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { storageService, defaultExpenses } from "../services/storage";
import { ExpenseItem, LanguageCode, VoiceGender } from "../types";

interface FinanceInvestManagerProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const FinanceInvestManager: React.FC<FinanceInvestManagerProps> = ({
  language,
  voiceGender,
}) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => storageService.getExpenses());
  const [monthlyBudget] = useState(150000); // 150k PKR
  const [emergencyFund] = useState(380000); // 380k PKR saved
  const [emergencyTarget] = useState(500000); // 500k target

  // Fazool Kharchi Advisor Tool
  const [itemQuery, setItemQuery] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [analysisResult, setAnalysisResult] = useState<{
    verdict: "APPROVED_INVESTMENT" | "FAZOOL_KHARCHI" | "CONSIDER_WAITING";
    reason: string;
    advice: string;
    score: number;
  } | null>(null);

  // New Expense Modal / Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState<ExpenseItem["category"]>("hardware");
  const [isWasteful, setIsWasteful] = useState(false);

  // Analyze Item for Fazool Kharchi
  const handleAnalyzeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemQuery.trim()) return;

    soundEffects.playBeepConfirm();
    const q = itemQuery.toLowerCase();
    const price = Number(itemPrice) || 0;

    let verdict: "APPROVED_INVESTMENT" | "FAZOOL_KHARCHI" | "CONSIDER_WAITING" = "CONSIDER_WAITING";
    let reason = "";
    let advice = "";
    let score = 50;

    if (q.includes("ssd") || q.includes("ram") || q.includes("monitor") || q.includes("course") || q.includes("gpu")) {
      verdict = "APPROVED_INVESTMENT";
      reason = "High Return on Investment (ROI): Directly accelerates video editing & coding speed.";
      advice =
        language === "pa"
          ? "Wasi paji, eh tuhade kaam di chiz ae! Eh kharcha nahi balkay productive investment ae."
          : "Wasi Sahab, yeh aapke professional work aur video rendering ko fast karega. Approved investment!";
      score = 92;
    } else if (q.includes("iphone") || q.includes("watch") || q.includes("shoes") || q.includes("perfume") || q.includes("fast food")) {
      verdict = "FAZOOL_KHARCHI";
      reason = "Impulse Luxury / Lifestyle Inflation: High cost with zero financial return.";
      advice =
        language === "pa"
          ? "Ruk jao Wasi paji! Eh fazool kharchi ae. Apne paise bacha ke Quantum Investment Fund ch lao!"
          : "Wasi Sahab, yeh fazool kharchi hai! Abhi iski zaroorat nahi hai. Yeh raqam bacha kar investment mein dalein.";
      score = 22;
    } else {
      verdict = "CONSIDER_WAITING";
      reason = "Medium Priority: Apply the 72-Hour Rule before spending.";
      advice =
        language === "pa"
          ? "3 din ruko Wasi paji, agar pher vi bohot zaroori lageya taan sochaange."
          : "Wasi Sahab, 72 ghante wait karein. Agar phir bhi zaroorat hui tab purchase karein.";
      score = 55;
    }

    setAnalysisResult({ verdict, reason, advice, score });
    speechService.speak(advice, { lang: language, gender: voiceGender });
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount) return;

    soundEffects.playClick();
    const newExp: ExpenseItem = {
      id: Date.now().toString(),
      title: expTitle.trim(),
      amount: Number(expAmount),
      category: expCategory,
      isFazoolKharchi: isWasteful,
      date: "Just now",
    };

    const updated = [newExp, ...expenses];
    setExpenses(updated);
    storageService.saveExpenses(updated);

    setExpTitle("");
    setExpAmount("");
    setShowAddForm(false);

    if (isWasteful) {
      soundEffects.playAlert();
      const alertText =
        language === "pa"
          ? "Dhyan dyo Wasi paji! Yeh fazool kharcha log hoya ae, budget balance maintain rakho."
          : "Wasi Sahab, fazool kharchi alert! Aapka monthly budget limit se kam ho raha hai.";
      speechService.speak(alertText, { lang: language, gender: voiceGender });
    }
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fazoolSpent = expenses.filter((e) => e.isFazoolKharchi).reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, monthlyBudget - totalSpent);

  return (
    <div className="space-y-6 font-rajdhani">
      {/* Top Financial Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Budget */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              MONTHLY BUDGET
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">150,000 PKR</span>
          </div>
          <div className="text-2xl font-orbitron font-bold text-slate-100">
            {remainingBudget.toLocaleString()} <span className="text-xs font-mono text-slate-400 font-normal">PKR Left</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800 mt-3">
            <div
              className={`h-full transition-all duration-500 ${
                remainingBudget < 30000 ? "bg-red-500" : "bg-cyan-400"
              }`}
              style={{ width: `${Math.min(100, (totalSpent / monthlyBudget) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1.5 flex justify-between">
            <span>Spent: {totalSpent.toLocaleString()} PKR</span>
            <span>{Math.round((totalSpent / monthlyBudget) * 100)}% used</span>
          </div>
        </div>

        {/* Fazool Kharchi Shield */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              FAZOOL KHARCHI SHIELD
            </span>
            <span className="text-xs font-mono text-red-400 font-bold">ACTIVE DEFENSE</span>
          </div>
          <div className="text-2xl font-orbitron font-bold text-red-300">
            {fazoolSpent.toLocaleString()} <span className="text-xs font-mono text-slate-400 font-normal">PKR Flagged</span>
          </div>
          <div className="text-xs font-mono text-emerald-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4 IMPULSE PURCHASES BLOCKED</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">
            Estimated 85,000 PKR saved this month
          </div>
        </div>

        {/* Emergency Fund */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              EMERGENCY VAULT
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">76% OF TARGET</span>
          </div>
          <div className="text-2xl font-orbitron font-bold text-slate-100">
            {emergencyFund.toLocaleString()} <span className="text-xs font-mono text-slate-400 font-normal">/ {emergencyTarget.toLocaleString()} PKR</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800 mt-3">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${(emergencyFund / emergencyTarget) * 100}%` }}
            ></div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1.5">
            Safe buffer for 4 months of runway
          </div>
        </div>

        {/* Quantum Investment Growth */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              PORTFOLIO COMPOUNDING
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold">+14.2% APY</span>
          </div>
          <div className="text-2xl font-orbitron font-bold text-slate-100">
            185,000 <span className="text-xs font-mono text-slate-400 font-normal">PKR Invested</span>
          </div>
          <div className="text-[11px] font-mono text-purple-300 mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Yielding ~2,100 PKR monthly dividend</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">
            Assets: Tech Capital, Gold, Index Fund
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fazool Kharchi AI Analyzer ("Need vs Want") */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="font-orbitron font-bold text-base text-cyan-400 uppercase">
                FAZOOL KHARCHI AI ANALYZER
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-4">
              Enter any item you are tempted to buy. Jarvis will test if it's an essential productive investment or wasteful spending.
            </p>

            <form onSubmit={handleAnalyzeItem} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={itemQuery}
                  onChange={(e) => setItemQuery(e.target.value)}
                  placeholder="Item name (e.g. Mechanical Keyboard, New Jacket)"
                  className="col-span-2 px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="Price (PKR)"
                  className="px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs transition cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                TEST NEED VS WANT
              </button>
            </form>
          </div>

          {/* Analysis Result Box */}
          {analysisResult && (
            <div
              className={`mt-4 p-4 rounded-xl border animate-fadeIn ${
                analysisResult.verdict === "APPROVED_INVESTMENT"
                  ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                  : analysisResult.verdict === "FAZOOL_KHARCHI"
                  ? "bg-red-950/30 border-red-500/40 text-red-200"
                  : "bg-amber-950/30 border-amber-500/40 text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-orbitron font-bold text-xs uppercase tracking-wider">
                  VERDICT: {analysisResult.verdict.replace("_", " ")}
                </span>
                <span className="text-xs font-mono font-bold">
                  Score: {analysisResult.score}/100
                </span>
              </div>
              <p className="text-xs font-mono mb-2">{analysisResult.reason}</p>
              <div className="pt-2 border-t border-slate-700/60 text-xs font-mono">
                <strong>Jarvis Vocal Advice:</strong> "{analysisResult.advice}"
              </div>
            </div>
          )}
        </div>

        {/* Expenses Tracker & Add Expense */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              <h3 className="font-orbitron font-bold text-base text-purple-400 uppercase">
                RECENT EXPENSES & LOG
              </h3>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? "CANCEL" : "LOG EXPENSE"}</span>
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleAddExpense} className="mb-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="Expense description"
                  required
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                />
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder="Amount (PKR)"
                  required
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
                >
                  <option value="hardware">Hardware / Gear</option>
                  <option value="food">Healthy Food</option>
                  <option value="subscriptions">Subscriptions</option>
                  <option value="investment">Investment</option>
                  <option value="bills">Bills</option>
                  <option value="personal">Personal</option>
                </select>

                <label className="flex items-center gap-1.5 cursor-pointer text-red-300">
                  <input
                    type="checkbox"
                    checked={isWasteful}
                    onChange={(e) => setIsWasteful(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-red-500"
                  />
                  <span>Flag as Fazool Kharchi</span>
                </label>

                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  SAVE
                </button>
              </div>
            </form>
          )}

          {/* List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                  exp.isFazoolKharchi
                    ? "bg-red-950/20 border-red-500/30 text-red-200"
                    : "bg-slate-950/80 border-slate-800 text-slate-200"
                }`}
              >
                <div>
                  <div className="font-semibold text-slate-100">{exp.title}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="uppercase text-cyan-400">{exp.category}</span>
                    <span>•</span>
                    <span>{exp.date}</span>
                    {exp.isFazoolKharchi && (
                      <span className="text-red-400 font-bold">[FAZOOL KHARCHI]</span>
                    )}
                  </div>
                </div>

                <div className="font-orbitron font-bold text-slate-100 text-sm">
                  {exp.amount.toLocaleString()} PKR
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
