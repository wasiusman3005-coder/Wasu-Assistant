import React, { useState } from "react";
import { Brain, User, Target, Plus, Search, CheckCircle2, Circle, Trash2, Calendar, Bell, Sparkles } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { storageService, defaultTasks } from "../services/storage";
import { TaskItem, UserProfile, LanguageCode, VoiceGender } from "../types";

interface PersonalMemoryBankProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const PersonalMemoryBank: React.FC<PersonalMemoryBankProps> = ({
  userProfile,
  onUpdateProfile,
  language,
  voiceGender,
}) => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => storageService.getTasks());
  const [searchQuery, setSearchQuery] = useState("");

  // New Note state
  const [newNote, setNewNote] = useState("");
  // New Goal state
  const [newGoal, setNewGoal] = useState("");
  // New Task state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<TaskItem["category"]>("editing");
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Toggle Task Completion
  const toggleTask = (taskId: string) => {
    soundEffects.playClick();
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) soundEffects.playBeepConfirm();
        return { ...t, completed: nextState };
      }
      return t;
    });
    setTasks(updated);
    storageService.saveTasks(updated);
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    soundEffects.playClick();
    const item: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: "high",
      completed: false,
      dueDate: "Scheduled",
      assignedToJarvis: true,
    };

    const updated = [item, ...tasks];
    setTasks(updated);
    storageService.saveTasks(updated);
    setNewTaskTitle("");
    setShowTaskForm(false);

    const vocalText =
      language === "pa"
        ? `Task add ho gaya Wasi paji: ${item.title}. Main time te yaad karawaanga.`
        : `Task add kar diya gaya hai Wasi Sahab: ${item.title}. Main waqt par aapko alert doonga.`;

    speechService.speak(vocalText, { lang: language, gender: voiceGender });
  };

  // Delete Task
  const deleteTask = (taskId: string) => {
    soundEffects.playClick();
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    storageService.saveTasks(updated);
  };

  // Add Personal Note / Memory
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    soundEffects.playBeepConfirm();
    const updatedNotes = [...userProfile.personalNotes, newNote.trim()];
    const updatedProfile = { ...userProfile, personalNotes: updatedNotes };
    onUpdateProfile(updatedProfile);
    storageService.saveUserProfile(updatedProfile);
    setNewNote("");
  };

  // Add Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    soundEffects.playBeepConfirm();
    const updatedGoals = [...userProfile.goals, newGoal.trim()];
    const updatedProfile = { ...userProfile, goals: updatedGoals };
    onUpdateProfile(updatedProfile);
    storageService.saveUserProfile(updatedProfile);
    setNewGoal("");
  };

  // Filtered Notes
  const filteredNotes = userProfile.personalNotes.filter((n) =>
    n.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-rajdhani">
      {/* Top Profile Summary Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-bold text-lg text-slate-100">
                COMMANDER {userProfile.displayName.toUpperCase()}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                ID: {userProfile.username}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Primary Role: {userProfile.title} • Quantum Neural Link Synced
            </p>
          </div>
        </div>

        {/* Search Memory Bar */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory & knowledge..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:border-cyan-400 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Two Column Layout: Tasks & Upcoming Schedule vs Knowledge Core */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Task Reminders & Upcoming Schedule */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-base text-cyan-400 uppercase">
                  ACTIVE TASKS & REMINDERS
                </h3>
              </div>
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showTaskForm ? "CANCEL" : "ADD TASK"}</span>
              </button>
            </div>

            {/* Add Task Form */}
            {showTaskForm && (
              <form onSubmit={handleAddTask} className="mb-4 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title (e.g. Export 4K client video, Take protein shake)"
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                />
                <div className="flex items-center justify-between">
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
                  >
                    <option value="editing">Video Editing</option>
                    <option value="coding">Coding / Tech</option>
                    <option value="fitness">Fitness / Health</option>
                    <option value="finance">Finance / Saving</option>
                    <option value="general">General Routine</option>
                  </select>

                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono"
                  >
                    SAVE TASK
                  </button>
                </div>
              </form>
            )}

            {/* Tasks List */}
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition ${
                    task.completed
                      ? "bg-slate-950/40 border-slate-800/50 text-slate-500 line-through"
                      : "bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="cursor-pointer shrink-0 text-cyan-400 hover:text-cyan-300"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="uppercase text-cyan-400">{task.category}</span>
                        {task.dueDate && <span>• Due: {task.dueDate}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-600 hover:text-red-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>JARVIS AUTO-REMINDER ACTIVE</span>
            <span className="text-cyan-400">
              {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
            </span>
          </div>
        </div>

        {/* Right: Personal Memory Bank & Future Goals */}
        <div className="space-y-6">
          {/* Future Goals */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-purple-400" />
              <h3 className="font-orbitron font-bold text-base text-purple-400 uppercase">
                STRATEGIC FUTURE GOALS
              </h3>
            </div>

            <div className="space-y-2 mb-3 max-h-[140px] overflow-y-auto pr-1">
              {userProfile.goals.map((g, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-200 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{g}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add new long-term goal..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold"
              >
                ADD
              </button>
            </form>
          </div>

          {/* Personal Habits & Memories Knowledge Store */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-emerald-400" />
              <h3 className="font-orbitron font-bold text-base text-emerald-400 uppercase">
                QUANTUM MEMORY REPOSITORY
              </h3>
            </div>

            <div className="space-y-2 mb-3 max-h-[160px] overflow-y-auto pr-1">
              {filteredNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-300"
                >
                  • {note}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Teach Jarvis a new habit or preference..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-bold"
              >
                SAVE MEMORY
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
