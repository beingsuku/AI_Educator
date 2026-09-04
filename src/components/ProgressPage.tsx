import React, { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  BrainCircuit,
  CheckCircle2,
  Flame,
  Gauge,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';

import { useApp } from '../context/AppContext';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ProgressPage: React.FC = () => {
  const { userStats, remediateConcept, setCurrentPage } = useApp();

  // ------------------------------------------------------------
  // DERIVED DATA
  // ------------------------------------------------------------

  const recentScores = userStats.recentScores || [];

  const trajectoryData = useMemo(() => {
    return [...recentScores]
      .slice(0, 7)
      .reverse()
      .map((item, index) => ({
        name: `L${index + 1}`,
        score: item.score,
        title: item.lessonTitle,
      }));
  }, [recentScores]);

  const averageScore = useMemo(() => {
    if (!recentScores.length) return 0;

    return Math.round(
      recentScores.reduce((sum, item) => sum + item.score, 0) /
      recentScores.length
    );
  }, [recentScores]);

  const bestScore = useMemo(() => {
    if (!recentScores.length) return 0;

    return Math.max(...recentScores.map(item => item.score));
  }, [recentScores]);

  const latestScore = recentScores.length
    ? recentScores[0].score
    : userStats.overallMastery;

  const weakestConcept = userStats.weakConcepts?.[0];
  const strongestConcept = userStats.strongConcepts?.[0];

  const mastery = Math.max(
    0,
    Math.min(100, userStats.overallMastery)
  );

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Strong';
    if (score >= 70) return 'On Track';
    if (score >= 50) return 'Needs Practice';
    return 'Needs Attention';
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  // ------------------------------------------------------------
  // PAGE
  // ------------------------------------------------------------

  return (
    <div className="min-h-full pb-20">

      {/* ======================================================
          HERO / AI INTELLIGENCE HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-slate-950/70 p-7 sm:p-9 mb-7">

        {/* Background effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-7">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold mb-4">
              <BrainCircuit className="w-4 h-4" />
              AI LEARNING INTELLIGENCE
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Your Learning
              <span className="text-cyan-400"> Command Center</span>
            </h1>

            <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-6">
              Your learning behavior is being analyzed continuously.
              See where you are strong, where your knowledge is fading,
              and what the AI recommends next.
            </p>

          </div>

          <button
            onClick={() => setCurrentPage('planner')}
            className="group shrink-0 px-5 py-3.5 rounded-2xl bg-white text-slate-950 text-sm font-black flex items-center gap-2 hover:bg-cyan-50 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            Generate Next Lesson
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

        </div>

        {/* Intelligence strip */}

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">

          <MiniInsight
            icon={<Activity className="w-4 h-4" />}
            label="Learning State"
            value="Adaptive"
          />

          <MiniInsight
            icon={<Target className="w-4 h-4" />}
            label="Current Mastery"
            value={`${mastery}%`}
          />

          <MiniInsight
            icon={<TrendingUp className="w-4 h-4" />}
            label="Recent Average"
            value={`${averageScore}%`}
          />

          <MiniInsight
            icon={<Zap className="w-4 h-4" />}
            label="Best Score"
            value={`${bestScore}%`}
          />

        </div>
      </div>

      {/* ======================================================
          TOP INTELLIGENCE GRID
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

        {/* MASTERy PULSE */}

        <div className="lg:col-span-4 rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 relative overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-cyan-500/[0.05]" />

          <div className="relative">

            <div className="flex items-center justify-between mb-5">

              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Mastery Pulse
                </p>
                <h2 className="text-lg font-black text-white mt-1">
                  Overall Intelligence
                </h2>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                <Gauge className="w-5 h-5 text-emerald-400" />
              </div>

            </div>

            <div className="flex items-center gap-6">

              <div className="relative w-36 h-36 shrink-0">

                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full -rotate-90"
                >

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-800"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-emerald-400 transition-all duration-1000"
                    strokeDasharray={`${mastery * 3.02} 302`}
                  />

                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {mastery}
                  </span>

                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                    percent
                  </span>
                </div>

              </div>

              <div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-bold">
                    {getScoreLabel(mastery)}
                  </span>
                </div>

                <p className="text-sm text-slate-400 leading-5">
                  Your overall concept retention is currently being
                  evaluated across completed adaptive lessons.
                </p>

              </div>

            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex justify-between">

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Lessons
                </p>
                <p className="text-lg font-black text-white mt-1">
                  {userStats.completedLessonsCount}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Study Time
                </p>
                <p className="text-lg font-black text-cyan-400 mt-1">
                  {userStats.totalStudyHours}h
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">
                  Streak
                </p>
                <p className="text-lg font-black text-amber-400 mt-1">
                  {userStats.studyStreakDays}d
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* LEARNING TRAJECTORY */}

        <div className="lg:col-span-8 rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                Neural Learning Curve
              </p>

              <h2 className="text-lg font-black text-white mt-1">
                Your Learning Trajectory
              </h2>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold">
              LIVE DATA
            </div>

          </div>

          <div className="h-56">

            {trajectoryData.length > 0 ? (

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={trajectoryData}>

                  <defs>
                    <linearGradient
                      id="learningGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#06B6D4"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#06B6D4"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#ffffff08"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '14px',
                      color: '#fff',
                    }}
                    formatter={(value) => [`${value}%`, 'Mastery']}
                  />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    fill="url(#learningGradient)"
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: '#0f172a',
                    }}
                    activeDot={{
                      r: 7,
                    }}
                  />

                </AreaChart>

              </ResponsiveContainer>

            ) : (

              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                Complete an assessment to generate your learning trajectory.
              </div>

            )}

          </div>

        </div>

      </div>

      {/* ======================================================
          AI FOCUS ZONE
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {/* NEXT BEST ACTION */}

        <div className="lg:col-span-2 rounded-[1.75rem] border border-violet-500/20 bg-gradient-to-br from-violet-950/40 via-slate-900/80 to-slate-950 p-6 relative overflow-hidden">

          <div className="absolute right-0 top-0 w-52 h-52 bg-violet-500/10 blur-3xl rounded-full" />

          <div className="relative">

            <div className="flex items-start justify-between">

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-400/10 border border-violet-400/20 text-violet-300 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Recommendation
                </div>

                <h2 className="text-xl font-black text-white mt-4">
                  Your Next Best Learning Action
                </h2>

              </div>

              <Lightbulb className="w-7 h-7 text-violet-300" />

            </div>

            {weakestConcept ? (

              <div className="mt-5">

                <p className="text-sm text-slate-400">
                  The system detected a knowledge gap around
                </p>

                <p className="text-2xl font-black text-white mt-1">
                  {weakestConcept.concept}
                </p>

                <div className="flex items-center gap-3 mt-3">

                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-violet-500"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, weakestConcept.masteryScore)
                        )}%`,
                      }}
                    />

                  </div>

                  <span className="text-xs font-black text-rose-300">
                    {weakestConcept.masteryScore}%
                  </span>

                </div>

                <p className="text-xs text-slate-400 mt-4 max-w-xl leading-5">
                  Instead of repeating the entire lesson, AdaptiveAI
                  will create a targeted remediation session focused
                  specifically on this concept.
                </p>

                <button
                  onClick={() =>
                    remediateConcept(weakestConcept.concept)
                  }
                  className="mt-5 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-black flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-violet-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  Fix This Knowledge Gap
                </button>

              </div>

            ) : (

              <div className="mt-6 p-5 rounded-2xl bg-emerald-400/5 border border-emerald-400/10">

                <div className="flex gap-3">

                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />

                  <div>

                    <p className="text-sm font-bold text-emerald-300">
                      No critical knowledge gaps detected.
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Continue learning to give the adaptive engine
                      more data about your strengths.
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>
        </div>

        {/* MOMENTUM */}

        <div className="rounded-[1.75rem] border border-amber-500/20 bg-slate-900/80 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                Momentum
              </p>

              <h2 className="text-lg font-black text-white mt-1">
                Learning Streak
              </h2>
            </div>

            <div className="p-3 rounded-2xl bg-amber-400/10">
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>

          </div>

          <div className="mt-6 flex items-end gap-2">

            <span className="text-5xl font-black text-white">
              {userStats.studyStreakDays}
            </span>

            <span className="text-sm text-amber-400 font-bold mb-2">
              DAYS
            </span>

          </div>

          <p className="text-xs text-slate-400 mt-2">
            Keep the neural pathway active.
          </p>

          <div className="grid grid-cols-7 gap-1.5 mt-6">

            {Array.from({ length: 7 }).map((_, index) => {

              const active =
                index >=
                Math.max(
                  0,
                  7 - Math.min(7, userStats.studyStreakDays)
                );

              return (
                <div
                  key={index}
                  className={`h-8 rounded-lg ${active
                      ? 'bg-amber-400/80 shadow-lg shadow-amber-400/10'
                      : 'bg-slate-800'
                    }`}
                />
              );
            })}

          </div>

          <div className="mt-6 pt-5 border-t border-white/10">

            <p className="text-[10px] text-slate-500 uppercase font-bold">
              Total Learning Time
            </p>

            <p className="text-2xl font-black text-cyan-400 mt-1">
              {userStats.totalStudyHours}
              <span className="text-sm ml-1 text-slate-500">
                hours
              </span>
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          KNOWLEDGE MAP
      ====================================================== */}

      <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6 mb-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

          <div>

            <div className="flex items-center gap-2">

              <div className="p-2 rounded-xl bg-cyan-400/10">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
              </div>

              <div>

                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                  Knowledge Map
                </p>

                <h2 className="text-lg font-black text-white">
                  Concept Strength Network
                </h2>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold">

            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              STRONG
            </span>

            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              DEVELOPING
            </span>

            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              WEAK
            </span>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* STRONG CONCEPTS */}

          <div className="rounded-2xl bg-emerald-400/[0.04] border border-emerald-400/10 p-5">

            <div className="flex items-center gap-2 mb-4">

              <Trophy className="w-5 h-5 text-emerald-400" />

              <h3 className="text-sm font-black text-white">
                Strong Concepts
              </h3>

              <span className="ml-auto text-[10px] text-emerald-400 font-bold">
                {userStats.strongConcepts?.length || 0} mastered
              </span>

            </div>

            <div className="space-y-2">

              {(userStats.strongConcepts || [])
                .slice(0, 4)
                .map((concept, index) => (

                  <ConceptRow
                    key={`${concept.concept}-${index}`}
                    name={concept.concept}
                    score={concept.masteryScore}
                    type="strong"
                  />

                ))}

              {!userStats.strongConcepts?.length && (
                <EmptyConceptState text="Your strongest concepts will appear here." />
              )}

            </div>

          </div>

          {/* WEAK CONCEPTS */}

          <div className="rounded-2xl bg-rose-400/[0.04] border border-rose-400/10 p-5">

            <div className="flex items-center gap-2 mb-4">

              <AlertTriangle className="w-5 h-5 text-rose-400" />

              <h3 className="text-sm font-black text-white">
                Attention Required
              </h3>

              <span className="ml-auto text-[10px] text-rose-400 font-bold">
                {userStats.weakConcepts?.length || 0} gaps
              </span>

            </div>

            <div className="space-y-2">

              {(userStats.weakConcepts || [])
                .slice(0, 4)
                .map((concept, index) => (

                  <ConceptRow
                    key={`${concept.concept}-${index}`}
                    name={concept.concept}
                    score={concept.masteryScore}
                    type="weak"
                    onClick={() =>
                      remediateConcept(concept.concept)
                    }
                  />

                ))}

              {!userStats.weakConcepts?.length && (
                <EmptyConceptState text="No major knowledge gaps detected." />
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          ASSESSMENT INTELLIGENCE
      ====================================================== */}

      <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Assessment Intelligence
            </p>

            <h2 className="text-lg font-black text-white mt-1">
              Recent Performance
            </h2>

          </div>

          <Award className="w-6 h-6 text-cyan-400" />

        </div>

        <div className="space-y-3">

          {recentScores.slice(0, 5).map((item, index) => (

            <div
              key={item.id}
              className="group rounded-2xl border border-white/5 bg-white/[0.025] hover:bg-white/[0.05] hover:border-cyan-400/20 p-4 transition-all"
            >

              <div className="flex items-center gap-4">

                {/* Index */}

                <div className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-800 items-center justify-center text-xs font-black text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Lesson */}

                <div className="flex-1 min-w-0">

                  <p className="text-sm font-bold text-slate-200 truncate">
                    {item.lessonTitle}
                  </p>

                  <div className="flex items-center gap-2 mt-1">

                    <span className="text-[10px] text-slate-500">
                      {item.date}
                    </span>

                    <span className="text-slate-700">
                      •
                    </span>

                    <span className="text-[10px] text-slate-500">
                      {item.timeSpentMinutes} min
                    </span>

                    <span className="text-slate-700">
                      •
                    </span>

                    <span className="text-[10px] text-slate-500">
                      {item.correctCount}/{item.totalQuestions} correct
                    </span>

                  </div>

                </div>

                {/* Score */}

                <div className="text-right">

                  <p
                    className={`text-xl font-black ${getScoreClass(
                      item.score
                    )}`}
                  >
                    {item.score}%
                  </p>

                  <p className="text-[9px] text-slate-500 uppercase font-bold">
                    {getScoreLabel(item.score)}
                  </p>

                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors" />

              </div>

            </div>

          ))}

          {!recentScores.length && (

            <div className="py-12 text-center">

              <div className="w-14 h-14 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center">
                <Target className="w-6 h-6 text-slate-500" />
              </div>

              <p className="text-sm text-slate-400 mt-4">
                No assessment data yet.
              </p>

              <p className="text-xs text-slate-600 mt-1">
                Complete your first lesson assessment to activate analytics.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ======================================================
          AI STATUS FOOTER
      ====================================================== */}

      <div className="mt-5 rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.025] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          <div className="relative">

            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
            </div>

            <span className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />

          </div>

          <div>

            <p className="text-xs font-black text-slate-200">
              Adaptive Neural Engine
            </p>

            <p className="text-[10px] text-slate-500">
              Continuously analyzing your learning pattern
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SYSTEM OPTIMIZED
        </div>

      </div>

    </div>
  );
};

// ============================================================
// MINI INSIGHT
// ============================================================

const MiniInsight: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => {

  return (
    <div className="rounded-xl bg-white/[0.035] border border-white/5 px-4 py-3 flex items-center gap-3">

      <div className="text-cyan-400">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">
          {label}
        </p>

        <p className="text-xs text-white font-black mt-0.5 truncate">
          {value}
        </p>

      </div>

    </div>
  );
};

// ============================================================
// CONCEPT ROW
// ============================================================

const ConceptRow: React.FC<{
  name: string;
  score: number;
  type: 'strong' | 'weak';
  onClick?: () => void;
}> = ({ name, score, type, onClick }) => {

  const isStrong = type === 'strong';

  return (
    <div
      onClick={onClick}
      className={`group p-3 rounded-xl border transition-all ${isStrong
          ? 'bg-emerald-400/[0.025] border-emerald-400/5'
          : 'bg-rose-400/[0.025] border-rose-400/5 cursor-pointer hover:border-rose-400/20'
        }`}
    >

      <div className="flex items-center gap-3">

        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${isStrong
              ? 'bg-emerald-400/10 text-emerald-400'
              : 'bg-rose-400/10 text-rose-400'
            }`}
        >
          {isStrong ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">

          <p className="text-xs font-bold text-slate-200 truncate">
            {name}
          </p>

          <div className="h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">

            <div
              className={`h-full rounded-full ${isStrong
                  ? 'bg-emerald-400'
                  : 'bg-rose-400'
                }`}
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, score)
                )}%`,
              }}
            />

          </div>

        </div>

        <div className="text-right shrink-0">

          <p
            className={`text-xs font-black ${isStrong
                ? 'text-emerald-400'
                : 'text-rose-400'
              }`}
          >
            {score}%
          </p>

          {!isStrong && (
            <p className="text-[8px] text-slate-600 uppercase font-bold mt-0.5">
              Fix →
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

// ============================================================
// EMPTY CONCEPT
// ============================================================

const EmptyConceptState: React.FC<{
  text: string;
}> = ({ text }) => {

  return (
    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-500 text-center">
      {text}
    </div>
  );
};