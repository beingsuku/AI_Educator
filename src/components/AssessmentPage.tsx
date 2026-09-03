import React, { useState } from 'react';
import { 
  Award, 
  ArrowRight, 
  RotateCcw, 
  BrainCircuit, 
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AssessmentPage: React.FC = () => {
  const { activeLesson, recordAssessmentCompletion, setCurrentPage, remediateConcept } = useApp();
  const questions = activeLesson.assessmentQuestions;

  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct += 1;
      }
    });
    return {
      correct,
      total: questions.length,
      pct: Math.round((correct / questions.length) * 100),
    };
  };

  const handleSubmitAssessment = () => {
    const res = calculateScore();
    setIsSubmitted(true);
    recordAssessmentCompletion(res.pct, res.total, res.correct);
  };

  const scoreRes = isSubmitted ? calculateScore() : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Step 5: Lesson Evaluation Quiz</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Knowledge Evaluation: <span className="gradient-text">{activeLesson.topicTitle}</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Answer the questions below to grade your mastery and pinpoint concept strengths & weaknesses.
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selected = userAnswers[q.id];
          const isCorrect = isSubmitted && selected === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl glass-card border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">QUESTION 0{idx + 1}</span>
                  <h3 className="text-base font-bold text-white">{q.question}</h3>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 shrink-0">
                  Concept: {q.conceptTested}
                </span>
              </div>

              {/* Options */}
              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selected === optIdx;
                    const isOptionCorrect = q.correctAnswer === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={isSubmitted}
                        className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                          isSubmitted
                            ? isOptionCorrect
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                              : isSelected
                              ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold'
                              : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
                            : isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-mono font-bold mr-2 text-cyan-400">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation Post-Submit */}
              {isSubmitted && (
                <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> AI Explanation:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission & AI Feedback Summary */}
      {!isSubmitted ? (
        <button
          onClick={handleSubmitAssessment}
          disabled={Object.keys(userAnswers).length < questions.length}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-violet-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-bold text-base shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-transform hover:scale-[1.01]"
        >
          <Award className="w-5 h-5" />
          <span>Submit Quiz & Grade Answers</span>
        </button>
      ) : (
        <div className="p-8 rounded-3xl glass-card border border-cyan-500/40 space-y-6 text-center shadow-2xl shadow-cyan-500/20">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Assessment Final Score</span>
            <h2 className="text-4xl font-extrabold text-white">
              {scoreRes?.pct}% <span className="text-sm font-normal text-slate-400">({scoreRes?.correct} / {scoreRes?.total} Correct)</span>
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2 max-w-xl mx-auto">
            <span className="font-bold text-violet-300 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-violet-400" /> AI Teacher Assessment Feedback:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {scoreRes && scoreRes.pct >= 80
                ? `Fantastic job! You demonstrated deep comprehension of ${activeLesson.topicTitle}. Your Qubit / Neural baseline concept mastery has been updated in your profile!`
                : `Good effort! You performed well on fundamentals, but struggled on edge cases. We recommend a quick 5-minute AI remediation module.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('progress')}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>View Progress Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {scoreRes && scoreRes.pct < 80 && (
              <button
                onClick={() => remediateConcept(activeLesson.topicTitle)}
                className="px-6 py-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-500/30 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start AI Targeted Remediation</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
