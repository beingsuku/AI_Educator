import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Zap, 
  MessageSquare, 
  Code, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const AITeacherPage: React.FC = () => {
  const { 
    activeLesson, 
    currentSlideIndex, 
    setCurrentSlideIndex, 
    isPlayingAudio, 
    speakText, 
    stopSpeech,
    audioSpeed,
    setAudioSpeed,
    captionsEnabled,
    selectedLanguage,
    adaptiveModeActive,
    setAdaptiveModeActive,
    recordCheckpointResult,
    setCurrentPage
  } = useApp();

  const slides = activeLesson.slides;
  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Active Checkpoint State
  const [showCheckpointModal, setShowCheckpointModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checkpointEvaluated, setCheckpointEvaluated] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [isFollowUpMode, setIsFollowUpMode] = useState<boolean>(false);

  // Auto-speak current narration text when slide changes
  useEffect(() => {
    if (currentSlide) {
      const textToSpeak = currentSlide.narrationTextTranslations?.[selectedLanguage] || currentSlide.narrationText;
      speakText(textToSpeak);
    }
  }, [currentSlideIndex, selectedLanguage]);

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setShowCheckpointModal(false);
      setCheckpointEvaluated(false);
      setSelectedOption(null);
      setIsFollowUpMode(false);
    } else {
      // Finished all slides -> go to Assessment!
      setCurrentPage('assessment');
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setShowCheckpointModal(false);
      setCheckpointEvaluated(false);
      setSelectedOption(null);
      setIsFollowUpMode(false);
    }
  };

  const handleTriggerCheckpoint = () => {
    stopSpeech();
    setShowCheckpointModal(true);
    setSelectedOption(null);
    setCheckpointEvaluated(false);
  };

  const handleOptionSubmit = () => {
    if (selectedOption === null || !currentSlide.checkpoint) return;

    const cp = currentSlide.checkpoint;
    const correctIdx = isFollowUpMode ? cp.adaptiveRemediation.followUpCorrectAnswer : cp.correctAnswer;
    const correct = selectedOption === correctIdx;

    setIsAnswerCorrect(correct);
    setCheckpointEvaluated(true);
    recordCheckpointResult(cp.id, correct);

    if (correct) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      speakText("Excellent job! That is completely correct. You have mastered this core principle.");
    } else {
      // ADAPTIVE LEARNING TRIGGERED!
      setAdaptiveModeActive(true);
      speakText(cp.adaptiveRemediation.simplifiedNarration);
    }
  };

  const handleSwitchToFollowUp = () => {
    setIsFollowUpMode(true);
    setSelectedOption(null);
    setCheckpointEvaluated(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header & Slide Progress Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">SLIDE {currentSlideIndex + 1} OF {slides.length}</span>
            {adaptiveModeActive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/40 animate-pulse">
                <Zap className="w-3 h-3 text-amber-400" /> Adaptive Mode Active
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">{currentSlide.title}</h2>
        </div>

        {/* Progress Bar & Navigation Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:block w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-violet-500 h-full transition-all duration-300"
              style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextSlide}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1"
            >
              <span>{currentSlideIndex === slides.length - 1 ? 'Go to Quiz' : 'Next Slide'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Teaching Grid: AI Avatar Video Area (Left) + Visual Explanation Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Teacher Video & Avatar (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Avatar Canvas / Video Screen */}
          <div className="relative rounded-3xl bg-slate-950 border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/10 flex flex-col items-center justify-center p-6 text-center min-h-[360px]">
            {/* Background Futuristic Grid & Glowing Ring */}
            <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
            <div className={`absolute w-64 h-64 rounded-full blur-[80px] transition-all duration-500 pointer-events-none ${
              adaptiveModeActive ? 'bg-violet-500/30' : isPlayingAudio ? 'bg-cyan-500/30' : 'bg-slate-700/20'
            }`} />

            {/* AI Avatar Face & Soundwave Visualizer */}
            <div className="relative z-10 space-y-4">
              {/* Avatar Image Frame with Pulsing Aura */}
              <div className="relative w-36 h-36 mx-auto">
                <div className={`absolute -inset-2 rounded-full blur-md transition-all duration-300 ${
                  isPlayingAudio ? 'bg-gradient-to-tr from-cyan-500 via-violet-500 to-pink-500 animate-pulse' : 'bg-slate-700/40'
                }`} />
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                  alt="AI Teacher Avatar"
                  className="relative w-full h-full rounded-full object-cover border-2 border-cyan-400 shadow-xl"
                />

                {/* State Badge Overlay */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0B0F19] border border-cyan-400 text-[10px] font-bold text-cyan-300 flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{adaptiveModeActive ? 'Adapting Depth' : isPlayingAudio ? 'Explaining Live' : 'Ready'}</span>
                </div>
              </div>

              {/* Soundwave Visualizer Bars */}
              <div className="flex items-center justify-center gap-1 h-6">
                {[40, 70, 100, 60, 90, 50, 80, 40].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPlayingAudio ? 'bg-cyan-400 animate-wave' : 'bg-slate-700 h-2'
                    }`}
                    style={{
                      height: isPlayingAudio ? `${h}%` : '8px',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              {/* Voice Controls Bar */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    if (isPlayingAudio) stopSpeech();
                    else speakText(currentSlide.narrationTextTranslations?.[selectedLanguage] || currentSlide.narrationText);
                  }}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
                    isPlayingAudio
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlayingAudio ? 'Pause Narration' : 'Play Voice'}</span>
                </button>

                {/* Speed Toggle */}
                <button
                  onClick={() => setAudioSpeed(audioSpeed === 1.0 ? 1.25 : audioSpeed === 1.25 ? 1.5 : 1.0)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-slate-300 hover:text-white"
                >
                  {audioSpeed}x
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Checkpoint Launcher Trigger (If slide has checkpoint) */}
          {currentSlide.hasCheckpoint && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900/40 to-slate-900 border border-violet-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-amber-400 animate-bounce" />
                <div>
                  <p className="text-xs font-bold text-white">Live Checkpoint Question</p>
                  <p className="text-[10px] text-slate-400">Test comprehension to proceed</p>
                </div>
              </div>

              <button
                onClick={handleTriggerCheckpoint}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all"
              >
                Answer Question
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Visual Explanation Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-6 min-h-[360px] flex flex-col justify-between">
            {/* Visual Panel Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Code className="w-4 h-4" /> Interactive Visual Canvas
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Format: {currentSlide.visualType.toUpperCase()}
                </span>
              </div>

              {/* Dynamic Visual Content Rendering */}
              {adaptiveModeActive && currentSlide.checkpoint?.adaptiveRemediation ? (
                /* Adaptive Simplified View */
                <div className="p-5 rounded-2xl bg-violet-950/40 border border-violet-500/40 space-y-3">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-amber-400" /> Simplified Analogy View
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {currentSlide.checkpoint.adaptiveRemediation.simplifiedVisual}
                  </p>
                </div>
              ) : (
                /* Normal Slide Visual Content */
                <div className="space-y-4">
                  {currentSlide.visualContent.subtitle && (
                    <h3 className="text-base font-bold text-slate-200">{currentSlide.visualContent.subtitle}</h3>
                  )}

                  {/* Formulas */}
                  {currentSlide.visualContent.formula && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 font-mono text-center text-cyan-300 text-base font-bold shadow-inner">
                      {currentSlide.visualContent.formula}
                    </div>
                  )}

                  {/* Code Snippet */}
                  {currentSlide.visualContent.codeSnippet && (
                    <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto">
                      <code>{currentSlide.visualContent.codeSnippet}</code>
                    </pre>
                  )}

                  {/* Bullet Items */}
                  {currentSlide.visualContent.items && (
                    <ul className="space-y-2">
                      {currentSlide.visualContent.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Analogy Box */}
                  {currentSlide.visualContent.analogyText && (
                    <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 italic">
                      💡 {currentSlide.visualContent.analogyText}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subtitles & Captions Stream */}
            {captionsEnabled && (
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Live Subtitles ({selectedLanguage})
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed italic">
                  "{currentSlide.narrationTextTranslations?.[selectedLanguage] || currentSlide.narrationText}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mid-Lesson Interactive Checkpoint Modal / Overlay */}
      {showCheckpointModal && currentSlide.checkpoint && (
        <div className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-amber-500/40 text-left max-w-xl w-full space-y-6 shadow-2xl shadow-amber-500/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                {isFollowUpMode ? 'Adaptive Follow-Up Question' : 'Mid-Lesson Checkpoint'}
              </span>
              <button
                onClick={() => setShowCheckpointModal(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-bold text-white">
              {isFollowUpMode
                ? currentSlide.checkpoint.adaptiveRemediation.followUpQuestion
                : currentSlide.checkpoint.question}
            </h3>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {(isFollowUpMode
                ? currentSlide.checkpoint.adaptiveRemediation.followUpOptions
                : currentSlide.checkpoint.options
              ).map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  disabled={checkpointEvaluated}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    selectedOption === idx
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-mono font-bold mr-2 text-cyan-400">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>

            {/* Evaluation Result Feedback */}
            {checkpointEvaluated && (
              <div className={`p-4 rounded-xl border space-y-2 ${
                isAnswerCorrect ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isAnswerCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Correct Answer!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>Incorrect - Adaptive Engine Triggered!</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAnswerCorrect
                    ? currentSlide.checkpoint.explanation
                    : currentSlide.checkpoint.adaptiveRemediation.simplifiedNarration}
                </p>

                {!isAnswerCorrect && !isFollowUpMode && (
                  <button
                    onClick={handleSwitchToFollowUp}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Simplified Hint Question</span>
                  </button>
                )}
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowCheckpointModal(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Skip Question
              </button>

              {!checkpointEvaluated ? (
                <button
                  onClick={handleOptionSubmit}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowCheckpointModal(false);
                    handleNextSlide();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/20"
                >
                  <span>Continue Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
