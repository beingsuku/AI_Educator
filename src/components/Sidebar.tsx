import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Sparkles, 
  BookOpenCheck, 
  Video, 
  GraduationCap, 
  TrendingUp, 
  BrainCircuit,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PageType } from '../types';

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, userStats, activeLesson } = useApp();

  const navItems: { id: PageType; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Create Lesson', icon: Sparkles, badge: 'AI Generator' },
    { id: 'planner', label: 'Lesson Planner', icon: BookOpenCheck },
    { id: 'teacher', label: 'AI Classroom', icon: Video, badge: 'Live Avatar' },
    { id: 'assessment', label: 'Assessment', icon: GraduationCap },
    { id: 'progress', label: 'Progress & Analytics', icon: TrendingUp },
  ];

  return (
    <aside className="studio-sidebar w-64 border-r border-white/10 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen sticky top-0 backdrop-blur-xl z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-violet-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-none tracking-tight flex items-center gap-1.5">
              Adaptive<span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Personal Teacher v2.4</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-violet-500/10 to-transparent text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/30'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Active Lesson Quick Card */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {/* Active Lesson Mini Widget */}
        {activeLesson && (
          <div 
            onClick={() => setCurrentPage('teacher')}
            className="p-3 rounded-xl bg-gradient-to-br from-violet-900/40 to-slate-900/60 border border-violet-500/30 cursor-pointer hover:border-violet-400/50 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-violet-300 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" /> Active Lesson
              </span>
              <span className="text-[10px] bg-violet-500/20 px-1.5 py-0.5 rounded text-violet-200 border border-violet-400/30">
                {activeLesson.level}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
              {activeLesson.topicTitle}
            </p>
          </div>
        )}

        {/* User Mini Profile */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
          <img
            src={userStats.avatar}
            alt={userStats.name}
            className="w-9 h-9 rounded-full object-cover border border-cyan-400/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{userStats.name}</p>
            <p className="text-[11px] text-cyan-400 font-medium truncate">{userStats.currentLevelBadge}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400">{userStats.overallMastery}%</span>
            <p className="text-[9px] text-slate-400">Mastery</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
