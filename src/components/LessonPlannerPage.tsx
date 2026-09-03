import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Play, 
  BookOpen, 
  Layers, 
  BrainCircuit
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LessonPlannerPage: React.FC = () => {
  const { activeLesson, startLessonFromPlanner, setCurrentPage } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Step 2: AI Curriculum Plan</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Generated Lesson Architecture: <span className="gradient-text">{activeLesson.topicTitle}</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Our AI has structured this topic into optimal micro-learning modules based on your level. Review the outline below before launching the AI Classroom.
        </p>
      </div>

      {/* Overview Metadata Bar */}
      <div className="p-6 rounded-2xl glass-card border border-cyan-500/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-xs text-slate-400 font-medium">Learner Level</p>
          <p className="text-base font-bold text-cyan-400 mt-1">{activeLesson.level}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Language</p>
          <p className="text-base font-bold text-violet-400 mt-1">{activeLesson.language}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Duration</p>
          <p className="text-base font-bold text-amber-400 mt-1">{activeLesson.duration} Mins</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Goal</p>
          <p className="text-base font-bold text-emerald-400 mt-1">{activeLesson.goal}</p>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> Module Breakdown ({activeLesson.modules.length} Modules)
        </h2>

        {activeLesson.modules.map((mod, idx) => (
          <div key={mod.id} className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 hover:border-violet-500/40 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-cyan-400">MODULE 0{idx + 1}</span>
                <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                <p className="text-xs text-slate-300">{mod.description}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 shrink-0 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> {mod.estimatedMinutes} Mins
              </span>
            </div>

            <hr className="border-white/5" />

            {/* Concepts & Real-World Example */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-semibold text-cyan-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Concepts Covered:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mod.conceptsCovered.map((c, cIdx) => (
                    <span key={cIdx} className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-emerald-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Real-World Analogy:
                </span>
                <p className="text-slate-300 bg-white/5 p-2 rounded-lg border border-white/5 leading-relaxed">
                  "{mod.realWorldExample}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adaptive Checkpoints & Quiz Summary Info */}
      <div className="p-6 rounded-2xl glass-card border border-violet-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
            <HelpCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Live Interactive Checkpoints Included</h4>
            <p className="text-xs text-slate-400">
              The AI Teacher will pause mid-lesson to evaluate your understanding and adapt explanation depth in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Launcher CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={() => setCurrentPage('learn')}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-card text-slate-300 hover:text-white font-semibold text-xs transition-all"
        >
          ← Adjust Personalization Options
        </button>

        <button
          onClick={startLessonFromPlanner}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-bold text-base shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 transition-transform hover:scale-105"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Start AI Lesson</span>
        </button>
      </div>
    </div>
  );
};
