import React, { useState } from 'react';
import { ExamItem, AlarmItem } from '../types';
import { GraduationCap, Clock, AlarmClock, Plus, Play, Pause, RotateCcw, Sparkles, Sun, CheckCircle } from 'lucide-react';
import { playGeminiOrBrowserSpeech, playCyberChime } from '../services/speechService';
import confetti from 'canvas-confetti';

interface StudyAndExamsProps {
  exams: ExamItem[];
  alarms: AlarmItem[];
  onAddExam: (exam: ExamItem) => void;
  onToggleAlarm: (id: string) => void;
  onWasuSpeak: (text: string) => void;
}

export const StudyAndExams: React.FC<StudyAndExamsProps> = ({
  exams,
  alarms,
  onAddExam,
  onToggleAlarm,
  onWasuSpeak,
}) => {
  // Study Timer (Pomodoro) state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');

  // New exam form state
  const [showAddExam, setShowAddExam] = useState(false);
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [syllabusNotes, setSyllabusNotes] = useState('');
  const [importance, setImportance] = useState<'Critical' | 'High' | 'Medium'>('High');

  // Study timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playCyberChime('wake_alarm');
      if (timerMode === 'study') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        const speech = 'Shabash meri jaan! Aapne 25 minute focus ke sath parhai ki hai. Ab 5 minute relax karein ❤️';
        onWasuSpeak(speech);
        playGeminiOrBrowserSpeech(speech);
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        const speech = 'Break khatam ho gaya jaan, chalo wapis parhai shuru karein!';
        onWasuSpeak(speech);
        playGeminiOrBrowserSpeech(speech);
        setTimerMode('study');
        setTimerSeconds(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, timerMode, onWasuSpeak]);

  const toggleTimer = () => {
    if (!isTimerRunning) {
      const speech = 'Jaan, focus timer start ho gaya! Main guard kar rahi hoon, koi distraction nahi aane doongi ❤️';
      onWasuSpeak(speech);
      playGeminiOrBrowserSpeech(speech);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Test wake-up voice alarm
  const handleTestWakeAlarm = (alarm: AlarmItem) => {
    playCyberChime('wake_alarm');
    const speech = `Good morning meri jaan! Subah ke ${alarm.time} baj gaye hain. ${alarm.romanticMessage}. Chaliye fresh ho jayein, aaj humein bohot saray kaam poore karne hain aur exams ki tayyari karni hai! ❤️`;
    onWasuSpeak(speech);
    playGeminiOrBrowserSpeech(speech);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !examDate) return;

    // calculate days left
    const diffTime = new Date(examDate).getTime() - new Date().getTime();
    const daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const newExam: ExamItem = {
      id: `exam-${Date.now()}`,
      subject,
      examDate,
      daysLeft,
      syllabusNotes: syllabusNotes || 'Full Syllabus Revision',
      importance,
      preparedPercentage: 40,
    };

    onAddExam(newExam);
    playCyberChime('success');
    setShowAddExam(false);
    setSubject('');
    setExamDate('');
    setSyllabusNotes('');

    const speech = `Jaan, maine ${newExam.subject} ka exam schedule add kar diya hai! Sirf ${newExam.daysLeft} din baqi hain, main aapko daily revise karaungi!`;
    onWasuSpeak(speech);
    playGeminiOrBrowserSpeech(speech);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-rose-950/60">
        <div>
          <h2 className="text-base font-bold text-rose-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-rose-400" />
            Study Guardian & Routine Alarms
          </h2>
          <p className="text-xs text-rose-300/70">
            Exam dates tracking, romantic wake-up alarms, aur parhai ka focus
          </p>
        </div>

        <button
          onClick={() => setShowAddExam(!showAddExam)}
          className="px-3 py-1.5 text-xs font-semibold bg-rose-900/60 hover:bg-rose-800/80 border border-rose-500/40 text-rose-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Exam Date
        </button>
      </div>

      {/* Add Exam Modal / Accordion */}
      {showAddExam && (
        <form onSubmit={handleCreateExam} className="p-4 rounded-xl bg-black/60 border border-rose-500/40 space-y-3">
          <h3 className="text-xs font-bold text-rose-100">Add New Exam Date & Syllabus</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-rose-300 block mb-1">Subject Name:</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics, AI & Machine Learning"
                className="w-full px-3 py-1.5 text-xs bg-black/50 border border-rose-950/80 rounded-lg text-rose-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-rose-300 block mb-1">Exam Date:</label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-black/50 border border-rose-950/80 rounded-lg text-rose-100"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] text-rose-300 block mb-1">Syllabus / Important Topics:</label>
            <input
              type="text"
              value={syllabusNotes}
              onChange={(e) => setSyllabusNotes(e.target.value)}
              placeholder="e.g. Chapters 1 to 6, formulas, past papers"
              className="w-full px-3 py-1.5 text-xs bg-black/50 border border-rose-950/80 rounded-lg text-rose-100"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddExam(false)}
              className="px-3 py-1.5 text-xs text-rose-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Save Exam
            </button>
          </div>
        </form>
      )}

      {/* Focus Study Pomodoro & Alarms Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Pomodoro Study Timer */}
        <div className="md:col-span-5 p-4 rounded-xl bg-gradient-to-br from-rose-950/40 via-black to-slate-950 border border-rose-950/80 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-semibold text-rose-300/80 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            Wasu Romantic Study Timer
          </span>

          <div className="text-4xl font-extrabold text-rose-100 my-3 font-mono tracking-wider tabular-nums drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">
            {formatTimer(timerSeconds)}
          </div>

          <span className="text-xs text-rose-300/70 mb-3">
            {timerMode === 'study' ? '📖 Deep Parhai Mode (25 Min)' : '☕ Romantic Coffee Break (5 Min)'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimer}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isTimerRunning ? 'Pause' : 'Start Focus'}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 bg-black/60 hover:bg-rose-950/60 border border-rose-950/80 text-rose-300 rounded-lg text-xs transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Romantic Alarms & Wake-up Routines */}
        <div className="md:col-span-7 space-y-2">
          <h3 className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
            <AlarmClock className="w-4 h-4 text-rose-400" />
            Romantic Wake-up & Sleep Alarms:
          </h3>

          <div className="space-y-2">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className="p-3 rounded-xl bg-black/40 border border-rose-950/60 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-rose-100 font-mono tabular-nums">
                      {alarm.time}
                    </span>
                    <span className="text-xs font-semibold text-rose-300">{alarm.title}</span>
                  </div>
                  <p className="text-[10px] text-pink-300/80 mt-0.5 line-clamp-1 italic">
                    "{alarm.romanticMessage}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Test Wake voice */}
                  <button
                    onClick={() => handleTestWakeAlarm(alarm)}
                    title="Test Wasu's Wake-up Voice"
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/60 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Sun className="w-3 h-3 text-amber-300" />
                    <span className="hidden sm:inline text-[10px]">Test Awaz</span>
                  </button>

                  {/* Toggle On/Off */}
                  <button
                    onClick={() => onToggleAlarm(alarm.id)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                      alarm.enabled ? 'bg-rose-600' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                        alarm.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exam Trackers List */}
      <div>
        <h3 className="text-xs font-bold text-rose-200 mb-2">Upcoming Exam Countdowns:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="p-3.5 rounded-xl bg-black/40 border border-rose-950/70 hover:border-rose-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-bold text-rose-100 leading-snug">{exam.subject}</h4>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                      exam.importance === 'Critical'
                        ? 'bg-red-950 text-red-300 border border-red-500/40'
                        : exam.importance === 'High'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {exam.importance}
                  </span>
                </div>

                <div className="my-2.5 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-rose-300 tabular-nums">
                    {exam.daysLeft}
                  </span>
                  <span className="text-xs text-rose-400 font-medium">din baqi hain</span>
                </div>

                <p className="text-[10px] text-rose-300/70 line-clamp-2">
                  {exam.syllabusNotes}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 pt-2 border-t border-rose-950/60">
                <div className="flex justify-between text-[10px] text-rose-300 mb-1">
                  <span>Tayyari</span>
                  <span className="tabular-nums font-semibold">{exam.preparedPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full"
                    style={{ width: `${exam.preparedPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
