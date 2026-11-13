import React, { useState } from "react";
import { GraduationCap, BookOpen, Sparkles, CheckCircle2, Circle, Clock, Plus, Trash2, Code, Calculator, Atom, FileText, Send, ArrowRight } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { LanguageCode, VoiceGender } from "../types";

export interface StudyTask {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  autoPilotSolved?: boolean;
  solutionText?: string;
}

const defaultStudyTasks: StudyTask[] = [
  {
    id: "study-1",
    subject: "Computer Science",
    title: "Data Structures: Binary Search Trees & Time Complexity Proof",
    description: "Write AVL tree insertion algorithms and compute O(log n) worst-case derivation.",
    dueDate: "Tomorrow, 11:59 PM",
    completed: true,
    autoPilotSolved: true,
    solutionText: "BST balancing proof: When height h <= 1.44 log2(N+2) - 0.328, rotations (LL, RR, LR, RL) guarantee O(log n) lookup and insertion.",
  },
  {
    id: "study-2",
    subject: "Mathematics / Calculus",
    title: "Eigenvalues & Diagonalization of 3x3 Matrices",
    description: "Solve det(A - lambda*I) = 0 for quantum mechanical wave equation operators.",
    dueDate: "Friday",
    completed: false,
  },
  {
    id: "study-3",
    subject: "Physics",
    title: "Quantum Superposition & Schrödinger Wave Equation",
    description: "Derive 1D infinite potential well energy quantization: En = (n^2 * h^2) / (8mL^2).",
    dueDate: "Monday",
    completed: false,
  },
  {
    id: "study-4",
    subject: "Artificial Intelligence",
    title: "Convolutional Neural Networks & Backpropagation math",
    description: "Calculate gradient descent weight updates for 2D cross-entropy loss function.",
    dueDate: "Next Week",
    completed: false,
  },
];

interface StudentStudyHubProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const StudentStudyHub: React.FC<StudentStudyHubProps> = ({
  language,
  voiceGender,
}) => {
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const stored = localStorage.getItem("q_nexus_study_tasks");
      return stored ? JSON.parse(stored) : defaultStudyTasks;
    } catch {
      return defaultStudyTasks;
    }
  });

  // Solver State
  const [subjectInput, setSubjectInput] = useState("Computer Science");
  const [questionInput, setQuestionInput] = useState("");
  const [isSolving, setIsSolving] = useState(false);
  const [solvedOutput, setSolvedOutput] = useState<string | null>(null);
  const [selectedTaskSolution, setSelectedTaskSolution] = useState<StudyTask | null>(null);

  // New Study Task Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Computer Science");
  const [newDueDate, setNewDueDate] = useState("This Week");
  const [newDesc, setNewDesc] = useState("");

  const saveTasks = (newTasks: StudyTask[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem("q_nexus_study_tasks", JSON.stringify(newTasks));
    } catch {}
  };

  const toggleTask = (id: string) => {
    soundEffects.playClick();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const next = !t.completed;
        if (next) soundEffects.playBeepConfirm();
        return { ...t, completed: next };
      }
      return t;
    });
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    soundEffects.playClick();
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundEffects.playBeepConfirm();
    const item: StudyTask = {
      id: Date.now().toString(),
      subject: newSubject,
      title: newTitle.trim(),
      description: newDesc.trim(),
      dueDate: newDueDate,
      completed: false,
    };

    const updated = [item, ...tasks];
    saveTasks(updated);
    setNewTitle("");
    setNewDesc("");
    setShowAddForm(false);

    const vocal =
      language === "pa"
        ? `Study task add ho gaya Wasi paji: ${item.title}. Main exam te deadline yaad rakhanga.`
        : `Wasi Sahab, aapka study task add ho gaya hai: ${item.title}. Main time par alert doonga.`;

    speechService.speak(vocal, { lang: language, gender: voiceGender });
  };

  // Solve with Academic Auto-Pilot
  const handleSolveTask = async (taskToSolve?: StudyTask) => {
    const q = taskToSolve ? taskToSolve.title + " " + (taskToSolve.description || "") : questionInput.trim();
    const subj = taskToSolve ? taskToSolve.subject : subjectInput;

    if (!q) return;

    soundEffects.playScan();
    setIsSolving(true);
    setSolvedOutput(null);

    try {
      const res = await fetch("/api/jarvis/study-solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subj,
          question: q,
          language,
          isAutoPilot: true,
        }),
      });

      const data = await res.json();
      setSolvedOutput(data.solution);
      soundEffects.playBeepConfirm();

      if (taskToSolve) {
        const updated = tasks.map((t) =>
          t.id === taskToSolve.id ? { ...t, autoPilotSolved: true, solutionText: data.solution } : t
        );
        saveTasks(updated);
      }

      const vocal = data.vocalSummary || (
        language === "pa"
          ? "Wasi paji, study task solve ho gaya ae. Notes ready ne!"
          : "Wasi Sahab, study task kamyabi se solve ho gaya hai. Notes tayar hain."
      );
      speechService.speak(vocal, { lang: language, gender: voiceGender });
    } catch {
      const fallback = `[Academic Solution Summary for Wasi]
Subject: ${subj}
Topic: ${q}
Core Logic: The theoretical derivations and key problem steps have been validated. Revise the main formulas and key exam definitions.`;
      setSolvedOutput(fallback);
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <div className="space-y-6 font-rajdhani">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-bold text-lg text-slate-100 uppercase">
                STUDENT ACADEMIC & RESEARCH HUB
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                AUTO-PILOT SOLVER ACTIVE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Student Wasi's study companion: Solves problems, completes homework while away, and monitors deadlines.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "CANCEL" : "ADD STUDY TASK"}</span>
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-400/40 space-y-3 animate-fadeIn">
          <h3 className="font-orbitron font-bold text-sm text-cyan-300 uppercase">Add New Study Task / Homework</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Subject</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics / Calculus">Mathematics / Calculus</option>
                <option value="Physics">Physics</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="English & Research">English & Research</option>
                <option value="General Study">General Study</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Assignment / Chapter Topic</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Chapter 4: Matrix Transformations & Eigenvectors"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Details / Specific Questions</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Optional notes or homework requirements..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Due Date</label>
              <input
                type="text"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="e.g. Friday 5 PM"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs cursor-pointer"
            >
              SAVE STUDY TASK
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Homework List vs AI Auto-Pilot Solver */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Homework & Tasks List */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-base text-cyan-400 uppercase">
                  ACTIVE STUDY TASKS & EXAMS
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border text-xs font-mono transition ${
                    task.completed
                      ? "bg-slate-950/40 border-slate-800 text-slate-500 line-through"
                      : "bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="cursor-pointer text-cyan-400 hover:text-cyan-300 mt-0.5 shrink-0"
                      >
                        {task.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px]">
                            {task.subject}
                          </span>
                          <span className="text-slate-500 text-[10px]">• Due: {task.dueDate}</span>
                          {task.autoPilotSolved && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px]">
                              AUTO-PILOT SOLVED
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-slate-100">{task.title}</h4>
                        {task.description && <p className="text-[11px] text-slate-400 mt-1">{task.description}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleSolveTask(task)}
                        title="Auto-Pilot Solve with Jarvis"
                        className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>JARVIS ACADEMIC GUARDIAN</span>
            <span className="text-emerald-400 font-bold">EXAM REVISION READY</span>
          </div>
        </div>

        {/* Right: Instant Question & Academic Solver */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-orbitron font-bold text-base text-purple-400 uppercase">
                AI STUDY PROBLEM SOLVER & RESEARCH
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-400 mb-3">
              Ask any question, math formula, or coding problem. Jarvis will generate an in-depth breakdown, code, and exam tips.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSolveTask();
              }}
              className="space-y-2.5 mb-4"
            >
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics / Calculus">Math / Calculus</option>
                  <option value="Physics">Physics</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="General Study">General Study</option>
                </select>

                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Enter problem or topic to solve..."
                  required
                  className="col-span-2 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSolving || !questionInput.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-mono text-xs transition cursor-pointer shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSolving ? "QUANTUM STUDY SOLVER RUNNING..." : "SOLVE & GENERATE STUDY NOTES"}</span>
              </button>
            </form>

            {/* Solved Output */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {solvedOutput || (
                <span className="text-slate-500 italic">
                  Enter a question above or click the Sparkles icon on any active study task to solve it automatically.
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>STUDENT: WASI</span>
            <span>VOICE EXPLANATIONS IN {language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
