import React from 'react';
import { 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  RotateCcw, 
  BookOpen, 
  Flame,
  BrainCircuit
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const ProgressPage: React.FC = () => {
  const { userStats, remediateConcept } = useApp();

  const radarData = [
    { subject: 'Physics & AI', A: 92, fullMark: 100 },
    { subject: 'Algorithms', A: 88, fullMark: 100 },
    { subject: 'System Design', A: 65, fullMark: 100 },
    { subject: 'Biology', A: 78, fullMark: 100 },
    { subject: 'Chemistry', A: 60, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Step 6: Longitudinal Mastery Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Your Learning Progress</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Track overall concept mastery, assessment score history, and active remediation goals.
        </p>
      </div>

      {/* Overview Metric Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Mastery Gauge Card */}
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 text-center space-y-3 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${userStats.overallMastery}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-white">{userStats.overallMastery}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Mastery</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-white">Overall Mastery Index</h3>
          <p className="text-xs text-slate-400">Based on {userStats.completedLessonsCount} completed adaptive lessons</p>
        </div>

        {/* Total Hours & Lessons Completed */}
        <div className="p-6 rounded-2xl glass-card border border-cyan-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Study Streak</span>
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{userStats.studyStreakDays} Days</p>
            <p className="text-xs text-amber-400 font-semibold mt-1">Keep up the daily momentum!</p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <div>
              <p className="text-slate-400">Total Hours</p>
              <p className="text-base font-bold text-cyan-400 mt-0.5">{userStats.totalStudyHours} Hours</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400">Lessons Completed</p>
              <p className="text-base font-bold text-violet-400 mt-0.5">{userStats.completedLessonsCount} Lessons</p>
            </div>
          </div>
        </div>

        {/* Skill Radar Chart */}
        <div className="p-6 rounded-2xl glass-card border border-violet-500/30 flex flex-col items-center justify-center space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4 text-violet-400" /> Domain Competency Radar
          </h3>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#ffffff15" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
                <Radar name="Mastery" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assessment History Table & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assessment Score History Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" /> Assessment Performance History
            </h3>
            <span className="text-xs text-slate-400">Recent Quizzes</span>
          </div>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userStats.recentScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="lessonTitle" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.slice(0, 12) + '...'} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="score" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning History Log (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-400" /> Recent Learning Log
          </h3>

          <div className="space-y-3">
            {userStats.recentScores.map((scoreItem) => (
              <div key={scoreItem.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">{scoreItem.lessonTitle}</p>
                  <p className="text-[10px] text-slate-400">{scoreItem.date} • {scoreItem.timeSpentMinutes} mins</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${scoreItem.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {scoreItem.score}%
                  </span>
                  <p className="text-[9px] text-slate-400">{scoreItem.correctCount}/{scoreItem.totalQuestions} Correct</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak Concepts Revision Recommendations Banner */}
      {userStats.weakConcepts.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-violet-950/40 to-slate-900 border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Recommended Target Revision</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Revise: <span className="text-rose-300">{userStats.weakConcepts[0].concept}</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Your score on this concept is currently {userStats.weakConcepts[0].masteryScore}%. Launching an AI teacher remediation session will use simplified visual analogies to fix this knowledge gap.
            </p>
          </div>

          <button
            onClick={() => remediateConcept(userStats.weakConcepts[0].concept)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-400 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-rose-500/20 flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Remediate with AI Teacher</span>
          </button>
        </div>
      )}
    </div>
  );
};
