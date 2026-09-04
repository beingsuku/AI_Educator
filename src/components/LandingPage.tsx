import React from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Video, 
  Volume2, 
  Globe, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Layers, 
  Cpu, 
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const workflowSteps = [
    {
      step: '01',
      title: 'Understand',
      desc: 'Parses your PDF / notes / topic and assesses your current baseline knowledge.',
      icon: Layers,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      step: '02',
      title: 'Plan',
      desc: 'Architects a personalized module structure with real-world examples and time limits.',
      icon: Cpu,
      color: 'from-blue-500 to-violet-500',
    },
    {
      step: '03',
      title: 'Teach',
      desc: 'Interactive AI Avatar delivers multi-modal visual slides with natural voice narration.',
      icon: Video,
      color: 'from-violet-500 to-purple-500',
    },
    {
      step: '04',
      title: 'Question',
      desc: 'Poses live mid-lesson checkpoint questions to test instant comprehension.',
      icon: HelpCircle,
      color: 'from-purple-500 to-pink-500',
    },
    {
      step: '05',
      title: 'Evaluate',
      desc: 'Analyzes student responses in real time with precision sentiment and accuracy diagnostics.',
      icon: CheckCircle2,
      color: 'from-pink-500 to-rose-500',
    },
    {
      step: '06',
      title: 'Adapt',
      desc: 'If stuck, AI automatically simplifies concepts with intuitive analogies and new slides!',
      icon: Zap,
      color: 'from-rose-500 to-amber-500',
    },
  ];

  const features = [
    {
      title: 'Personalized Teaching',
      desc: 'Curriculum adapts to your level: Beginner, Intermediate, or Advanced.',
      icon: BrainCircuit,
      badge: 'Level Tailored',
    },
    {
      title: 'Interactive AI Avatar & Video',
      desc: 'Not just text! Watch dynamic lip-synced video explanations on interactive slides.',
      icon: Video,
      badge: 'Visual Avatar',
    },
    {
      title: 'AI Voice Engine',
      desc: 'Listen with realistic multi-speed voice controls and rolling captions stream.',
      icon: Volume2,
      badge: 'Speech Synthesis',
    },
    {
      title: 'Multilingual Support',
      desc: 'Learn naturally in English, Hindi, Hinglish, or Marathi with native terminology.',
      icon: Globe,
      badge: '4 Languages',
    },
    {
      title: 'Mid-Lesson Interactivity',
      desc: 'Live checkpoints ensure you do not zone out. Learn by active participation.',
      icon: HelpCircle,
      badge: 'Active Checkpoints',
    },
    {
      title: 'Real-Time Adaptive Learning',
      desc: 'Makes a mistake? The AI teacher pivots immediately to simpler analogies and hints.',
      icon: TrendingUp,
      badge: 'Self-Correcting',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="landing-hero relative overflow-hidden pt-12 pb-16 px-4 rounded-3xl border cyber-grid">
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-violet-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Next-Gen EdTech • Beyond Simple Chatbots</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Meet Your Personal <br />
            <span className="gradient-text">AI Teacher</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload any PDF or topic and experience an interactive AI Avatar teacher that <strong className="text-cyan-300 font-semibold">explains visually</strong>, <strong className="text-violet-300 font-semibold">asks live questions</strong>, and <strong className="text-emerald-300 font-semibold">adapts dynamically</strong> when you get stuck.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('learn')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-bold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Learning Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentPage('teacher')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-slate-200 hover:text-white font-semibold text-base flex items-center justify-center gap-2 transition-all hover:bg-white/10"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Watch Live Demo Lesson</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            {[
              { label: 'Multilingual Voice', value: '4 Languages', sub: 'EN, HI, Hinglish, MR' },
              { label: 'Adaptation Speed', value: '< 200ms', sub: 'Real-time difficulty shift' },
              { label: 'Interactive Visuals', value: '100% Canvas', sub: 'Diagrams & Code formulas' },
              { label: 'Comprehension Boost', value: '+42%', sub: 'Over static video lectures' },
            ].map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-xs text-slate-400 font-medium">{m.label}</p>
                <p className="text-lg font-bold text-cyan-400 mt-1">{m.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Workflow Section */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Architectural Loop</span>
          <h2 className="text-3xl font-extrabold text-white">How AdaptiveAI Teaches You</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Unlike static text chatbots, AdaptiveAI executes a closed-loop pedagogical cycle for total mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl glass-card glass-card-hover group border border-white/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} p-2 flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </span>
                    <span className="text-2xl font-black text-white/20 group-hover:text-cyan-400/40 transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs text-cyan-400 font-semibold gap-1 opacity-80 group-hover:opacity-100">
                  <span>Step {idx + 1} Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="text-3xl font-extrabold text-white">Designed for Hackathon-Quality Excellence</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Everything you need for an immersive, adaptive personal tutoring session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-violet-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Box */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-900/40 via-cyan-950/40 to-slate-900 border border-cyan-500/30 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to Experience <span className="gradient-text">AdaptiveAI</span>?
        </h2>
        <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
          Stop struggling with static videos or dry chatbots. Let your personal AI Teacher guide you step by step.
        </p>
        <button
          onClick={() => setCurrentPage('learn')}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-cyan-500/30 inline-flex items-center gap-3 transition-transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span>Create Your First Lesson</span>
        </button>
      </section>
    </div>
  );
};
