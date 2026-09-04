import React from 'react';
import {
  Play,
  Sparkles,
  Award,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Zap,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    userStats,
    activeLesson,
    setCurrentPage,
    remediateConcept,
    studyStreak,
    studyDate,
    studyTime,
  } = useApp();
  const recommendedTopics = [
    { title: 'Neural Networks & Deep Learning', level: 'Beginner', duration: '15 mins', icon: '🧠', tag: 'High Priority' },
    { title: 'System Design & Distributed Caching', level: 'Intermediate', duration: '25 mins', icon: '⚡', tag: 'Trending' },
    { title: 'Photosynthesis & Cellular Respiration', level: 'Beginner', duration: '20 mins', icon: '🌱', tag: 'Biology' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-900/40 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Teacher Status: Ready for Next Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, <span className="gradient-text">{userStats.name}</span> 👋
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            You've maintained a <strong className="text-amber-400">{studyStreak}-day study streak</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-400">Today</p>
              <p className="text-xs font-semibold text-cyan-300">
                {studyDate}
              </p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-400">Current Time</p>
              <p className="text-xs font-semibold text-violet-300">
                {studyTime}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('learn')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Lesson</span>
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Mastery', value: `${userStats.overallMastery}%`, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Completed Lessons', value: userStats.completedLessonsCount, icon: CheckCircle2, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
          { label: 'Total Study Time', value: `${userStats.totalStudyHours} hrs`, icon: Clock, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
          { label: 'Study Streak', value: `${studyStreak} Days`, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl border ${stat.bg} glass-card`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-extrabold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Current Lesson Resume + Recommended Topic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Lesson Quick Resume Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-cyan-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Current Active Lesson
              </span>
              <span className="text-xs text-slate-400">{activeLesson.duration} Mins Duration</span>
            </div>

            <h3 className="text-xl font-bold text-white">{activeLesson.topicTitle}</h3>
            <p className="text-xs text-slate-300">
              Level: <strong className="text-cyan-400">{activeLesson.level}</strong> • Language: <strong className="text-violet-400">{activeLesson.language}</strong> • Modules: <strong className="text-emerald-400">{activeLesson.modules.length} Modules</strong>
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-xs font-semibold text-slate-200">First Module Preview:</p>
              <p className="text-xs text-slate-300 line-clamp-2">{activeLesson.modules[0]?.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentPage('planner')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <BookOpen className="w-4 h-4" /> View Architecture Outline
            </button>

            <button
              onClick={() => setCurrentPage('teacher')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Resume AI Lesson</span>
            </button>
          </div>
        </div>

        {/* Recommended Next Topic Card */}
        <div className="p-6 rounded-2xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> AI Recommendation
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                Recommended
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Based on your weak concepts in neural networks, we recommend starting this 15-minute quick module next.
            </p>

            <div className="space-y-3">
              {recommendedTopics.slice(0, 2).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{item.level} • {item.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentPage('learn')}
                    className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strong & Weak Concepts Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Concepts */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Strong Concepts ({userStats.strongConcepts.length})
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">Mastered</span>
          </div>

          <div className="space-y-3">
            {userStats.strongConcepts.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">{item.concept}</p>
                  <p className="text-[10px] text-slate-400">{item.category} • Practiced {item.lastPracticed}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-400">{item.masteryScore}%</span>
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${item.masteryScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Concepts (With AI Remediation Button) */}
        <div className="p-6 rounded-2xl glass-card border border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Weak Concepts ({userStats.weakConcepts.length})
            </h3>
            <span className="text-xs text-rose-400 font-semibold">Needs Revision</span>
          </div>

          <div className="space-y-3">
            {userStats.weakConcepts.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">{item.concept}</p>
                  <p className="text-[10px] text-slate-400">{item.category} • Score: {item.masteryScore}%</p>
                </div>

                <button
                  onClick={() => remediateConcept(item.concept)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-1 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Remediate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Activity Chart (Recharts) */}
      <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" /> Weekly Learning Activity
            </h3>
            <p className="text-xs text-slate-400">Hours spent learning vs average assessment scores</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-cyan-400"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Hours</span>
            <span className="flex items-center gap-1 text-violet-400"><span className="w-2.5 h-2.5 rounded-full bg-violet-400" /> Score %</span>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userStats.weeklyActivity}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="hours" stroke="#06B6D4" fillOpacity={1} fill="url(#colorHours)" />
              <Area type="monotone" dataKey="score" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
