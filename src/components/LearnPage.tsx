import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  Clock, 
  Target, 
  Globe, 
  GraduationCap, 
  X,
  FileCheck,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { LearnerLevel, Language, DurationMins, LearningGoal } from '../types';

export const LearnPage: React.FC = () => {
  const { generateCustomLesson, isGeneratingLesson } = useApp();

  const [inputMode, setInputMode] = useState<'topic' | 'file'>('topic');
  const [topicText, setTopicText] = useState('Quantum Computing & Qubit Mechanics');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  const [level, setLevel] = useState<LearnerLevel>('Intermediate');
  const [language, setLanguage] = useState<Language>('English');
  const [duration, setDuration] = useState<DurationMins>(20);
  const [goal, setGoal] = useState<LearningGoal>('Concept Mastery');

  const suggestedTopics = [
    'Quantum Computing & Qubits',
    'Neural Networks & Deep Learning',
    'Photosynthesis & Bioenergetics',
    'System Design & Microservices',
    'Thermodynamics & Heat Transfer',
    'Organic Chemistry Mechanisms',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
      setInputMode('file');
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateCustomLesson({
      level,
      language,
      duration,
      goal,
      customTopic: inputMode === 'topic' ? topicText : undefined,
      fileName: inputMode === 'file' ? uploadedFile?.name : undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 relative">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1: Input & Personalization</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Create Your Custom AI Lesson</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Upload any document or specify a topic. Our AI engine will structure a multi-modal lesson with live checkpoints.
        </p>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-8">
        {/* Input Method Selector (Upload File vs Topic Input) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-200">1. Content Source</label>
            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setInputMode('topic')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  inputMode === 'topic' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Enter Topic
              </button>
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  inputMode === 'file' ? 'bg-cyan-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload PDF / Notes / PPT
              </button>
            </div>
          </div>

          {inputMode === 'topic' ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  placeholder="e.g. Quantum Computing, Photosynthesis, Microservices..."
                  className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  required
                />
              </div>

              {/* Quick Topic Chips */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs text-slate-400 font-medium">Quick suggestions:</span>
                {suggestedTopics.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopicText(t)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-8 text-center bg-cyan-950/10 transition-all relative">
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileCheck className="w-8 h-8 text-emerald-400" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{uploadedFile.name}</p>
                    <p className="text-xs text-emerald-400">File Parsed ({uploadedFile.size})</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                    className="p-1 rounded-full bg-white/10 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">Drag and drop your PDF, PPT, or Study Notes</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF, PPTX, TXT up to 50MB</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <hr className="border-white/10" />

        {/* Personalization Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learner Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" /> Learner Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as LearnerLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    level === lvl
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-400" /> Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['English', 'Hindi', 'Hinglish', 'Marathi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    language === lang
                      ? 'bg-violet-500/20 border-violet-400 text-violet-300 shadow-md shadow-violet-500/10'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Time */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Learning Time
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([5, 20, 30, 60] as DurationMins[]).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    duration === mins
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins} Mins
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goal */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400" /> Learning Goal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Exam Prep', 'Concept Mastery', 'Quick Revision', 'Deep Dive'] as LearningGoal[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    goal === g
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-md shadow-rose-500/10'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-bold text-base shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 transition-transform hover:scale-[1.01]"
        >
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>Generate My Lesson</span>
        </button>
      </form>

      {/* AI Processing Modal Overlay */}
      {isGeneratingLesson && (
        <div className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="p-8 rounded-3xl glass-card border border-cyan-500/40 text-center max-w-md w-full space-y-6 shadow-2xl shadow-cyan-500/30">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Sparkles className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">AI Engine Processing</h3>
              <p className="text-xs text-cyan-300 font-mono animate-pulse">
                Parsing document • Extracting key concepts • Synthesizing visual slides • Formulating adaptive checkpoints...
              </p>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-violet-500 h-full animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
