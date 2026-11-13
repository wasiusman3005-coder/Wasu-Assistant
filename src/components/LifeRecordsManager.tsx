import React, { useState, useEffect } from "react";
import { Database, Plus, Search, Trash2, Edit3, Check, Volume2, Sparkles, Filter, X, Tag } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { LanguageCode, VoiceGender } from "../types";

export interface LifeRecord {
  id: string;
  title: string;
  category: "routine" | "study" | "finance" | "health" | "memory" | "tech";
  content: string;
  dateCreated: string;
  priority: "high" | "medium" | "low";
}

const defaultLifeRecords: LifeRecord[] = [
  {
    id: "rec-1",
    title: "Daily YouTube Video Editing & Upload Routine",
    category: "routine",
    content: "Rough cut by 1:00 PM, audio mastering & noise reduction by 3:00 PM, final 4K render and thumbnail upload by 6:00 PM.",
    dateCreated: "Active",
    priority: "high",
  },
  {
    id: "rec-2",
    title: "Computer Science University Exam Syllabus",
    category: "study",
    content: "Advanced Algorithms, Operating Systems memory management, and Neural Networks matrix derivations.",
    dateCreated: "Active",
    priority: "high",
  },
  {
    id: "rec-3",
    title: "Host PC Workstation Profile & Performance Rules",
    category: "tech",
    content: "Live Host PC hardware probe active in PC & Video Suite; prioritize SSD cache cleanup before 4K renders.",
    dateCreated: "Saved",
    priority: "medium",
  },
  {
    id: "rec-4",
    title: "Monthly Saving Target & Fazool Kharchi Rule",
    category: "finance",
    content: "Minimum 40,000 PKR to be moved to Emergency Gold/Investment Vault immediately on 1st of every month.",
    dateCreated: "Saved",
    priority: "high",
  },
  {
    id: "rec-5",
    title: "Daily Vitamin D & Omega 3 Supplement",
    category: "health",
    content: "Take 1 Vitamin D3 + Omega 3 capsule after lunch with water. Avoid late-night tea.",
    dateCreated: "Daily",
    priority: "medium",
  },
];

interface LifeRecordsManagerProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const LifeRecordsManager: React.FC<LifeRecordsManagerProps> = ({
  language,
  voiceGender,
}) => {
  const [records, setRecords] = useState<LifeRecord[]>(() => {
    try {
      const stored = localStorage.getItem("q_nexus_life_records");
      return stored ? JSON.parse(stored) : defaultLifeRecords;
    } catch {
      return defaultLifeRecords;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<LifeRecord["category"]>("routine");
  const [formContent, setFormContent] = useState("");
  const [formPriority, setFormPriority] = useState<LifeRecord["priority"]>("high");

  const saveRecords = (newRecords: LifeRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem("q_nexus_life_records", JSON.stringify(newRecords));
    } catch {}
  };

  const handleOpenAdd = () => {
    soundEffects.playClick();
    setEditingId(null);
    setFormTitle("");
    setFormContent("");
    setFormCategory("routine");
    setFormPriority("high");
    setShowForm(true);
  };

  const handleOpenEdit = (rec: LifeRecord) => {
    soundEffects.playClick();
    setEditingId(rec.id);
    setFormTitle(rec.title);
    setFormContent(rec.content);
    setFormCategory(rec.category);
    setFormPriority(rec.priority);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    soundEffects.playClick();
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    soundEffects.playBeepConfirm();

    if (editingId) {
      // Edit
      const updated = records.map((r) =>
        r.id === editingId
          ? {
              ...r,
              title: formTitle.trim(),
              category: formCategory,
              content: formContent.trim(),
              priority: formPriority,
            }
          : r
      );
      saveRecords(updated);
    } else {
      // Add
      const newRec: LifeRecord = {
        id: Date.now().toString(),
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        priority: formPriority,
        dateCreated: new Date().toLocaleDateString(),
      };
      saveRecords([newRec, ...records]);

      const announce =
        language === "pa"
          ? `Record save ho gaya Wasi paji: ${newRec.title}. Main sab yaad rakhanga.`
          : `Wasi Sahab, aapka record save kar liya gaya hai: ${newRec.title}. Main her waqt aapko guide karta rahoonga.`;

      speechService.speak(announce, { lang: language, gender: voiceGender });
    }

    setShowForm(false);
  };

  const handleSpeakRecord = (rec: LifeRecord) => {
    soundEffects.playClick();
    const vocalText = `${rec.title}. ${rec.content}`;
    speechService.speak(vocalText, { lang: language, gender: voiceGender });
  };

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || rec.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-rajdhani">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300">
            <Database className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase">
                UNIVERSAL LIFE RECORDS & TASKS VAULT
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                {records.length} TOTAL RECORDS
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Add, update, or delete any task, routine, habit, or memory whenever you want. Jarvis remembers everything for you.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW RECORD</span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any life record, habit, or note..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {["all", "routine", "study", "finance", "health", "tech", "memory"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEffects.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg uppercase transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white font-bold"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <form onSubmit={handleSaveForm} className="p-5 rounded-2xl bg-slate-900/95 border border-purple-500/40 space-y-4 animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-orbitron font-bold text-sm text-purple-300 uppercase">
              {editingId ? "Edit Life Record" : "Add New Life Record / Memory"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Title / Task Name</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Daily Gym Workout Routine or Client Deliverable"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              >
                <option value="routine">Routine & Productivity</option>
                <option value="study">Study & Academic</option>
                <option value="finance">Finance & Investment</option>
                <option value="health">Health & Diet</option>
                <option value="tech">Tech & PC Hardware</option>
                <option value="memory">Personal Life Memory</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Detailed Information / Notes</label>
            <textarea
              rows={3}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Write anything you want Jarvis to store, monitor, or execute..."
              required
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">Priority:</span>
              {(["high", "medium", "low"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormPriority(p)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase cursor-pointer ${
                    formPriority === p ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-950 text-slate-400"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs transition cursor-pointer"
            >
              {editingId ? "UPDATE RECORD" : "SAVE TO QUANTUM CORE"}
            </button>
          </div>
        </form>
      )}

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300 uppercase">
                    {rec.category}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${rec.priority === "high" ? "bg-red-950 text-red-400" : "bg-slate-800 text-slate-400"}`}>
                    {rec.priority.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeakRecord(rec)}
                    title="Speak Record in Native Voice"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(rec)}
                    title="Edit Record"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    title="Delete Record"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="font-semibold text-sm text-slate-100 mb-1.5">{rec.title}</h4>
              <p className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{rec.content}</p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Status: {rec.dateCreated}</span>
              <span>JARVIS MEMORY SYNCED</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
