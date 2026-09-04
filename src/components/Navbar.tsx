import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Globe, 
  Menu, 
  Brain, 
  Flame, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Language } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    userStats, 
    selectedLanguage, 
    setSelectedLanguage,
    isPlayingAudio,
    stopSpeech
  } = useApp();

  const languages: Language[] = ['English', 'Hindi', 'Hinglish', 'Marathi'];

  const getPageTitle = () => {
    switch (currentPage) {
      case 'landing': return 'Home';
      case 'dashboard': return 'Student Command Center';
      case 'learn': return 'AI Curriculum Personalizer';
      case 'planner': return 'Interactive Lesson Architecture';
      case 'teacher': return 'Live AI Classroom';
      case 'assessment': return 'Knowledge Assessment & Feedback';
      case 'progress': return 'Mastery Analytics';
      default: return 'AdaptiveAI Teacher';
    }
  };

  return (
    <header className="studio-nav h-16 border-b border-white/10 backdrop-blur-md sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
      {/* Left Title & Mobile Menu */}
      <div className="flex items-center gap-4">
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="p-2 rounded-lg bg-white/5 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-white text-base">Adaptive<span className="text-cyan-400">AI</span></span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide">{getPageTitle()}</h2>
        </div>
      </div>

      {/* Center Adaptive Badge */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-transparent border border-cyan-500/20 text-xs text-cyan-300 font-medium">
        <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span>Adaptive Neural Engine: <strong className="text-emerald-400">Active</strong></span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm">
          <Flame className="w-4 h-4 fill-amber-400" />
          <span>{userStats.studyStreakDays} Day Streak</span>
        </div>

        {/* Audio Mute/Indicator Button */}
        <button
          onClick={stopSpeech}
          className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
            isPlayingAudio
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
          title={isPlayingAudio ? 'Click to Mute AI Voice' : 'AI Speech Ready'}
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Mute Voice</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Voice Ready</span>
            </>
          )}
        </button>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-300">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-[#0B0F19] text-slate-200">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button to Generate Lesson */}
        <button
          onClick={() => setCurrentPage('learn')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/25 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Lesson</span>
        </button>
      </div>
    </header>
  );
};
