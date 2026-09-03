import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PageType, LessonPlan, PersonalizationOptions, UserStats } from '../types';
import { INITIAL_USER_STATS, SAMPLE_LESSONS } from '../mockData';

interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  activeLesson: LessonPlan;
  setActiveLesson: (lesson: LessonPlan) => void;
  personalization: PersonalizationOptions;
  setPersonalization: React.Dispatch<React.SetStateAction<PersonalizationOptions>>;
  currentSlideIndex: number;
  setCurrentSlideIndex: (idx: number | ((prev: number) => number)) => void;
  isGeneratingLesson: boolean;
  setIsGeneratingLesson: (val: boolean) => void;
  // Audio & Speech state
  isPlayingAudio: boolean;
  setIsPlayingAudio: (val: boolean) => void;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
  captionsEnabled: boolean;
  setCaptionsEnabled: (val: boolean) => void;
  selectedLanguage: 'English' | 'Hindi' | 'Hinglish' | 'Marathi';
  setSelectedLanguage: (lang: 'English' | 'Hindi' | 'Hinglish' | 'Marathi') => void;
  // Adaptive Learning State
  adaptiveModeActive: boolean;
  setAdaptiveModeActive: (val: boolean) => void;
  completedCheckpoints: Record<string, boolean>;
  recordCheckpointResult: (cpId: string, isCorrect: boolean) => void;
  // Helper Actions
  generateCustomLesson: (options: PersonalizationOptions) => void;
  startLessonFromPlanner: () => void;
  recordAssessmentCompletion: (score: number, total: number, correctCount: number) => void;
  remediateConcept: (conceptName: string) => void;
  speakText: (text: string) => void;
  stopSpeech: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [activeLesson, setActiveLesson] = useState<LessonPlan>(SAMPLE_LESSONS.quantum);
  const [personalization, setPersonalization] = useState<PersonalizationOptions>({
    level: 'Intermediate',
    language: 'English',
    duration: 20,
    goal: 'Concept Mastery',
    customTopic: 'Quantum Computing & Qubit Mechanics',
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Hinglish' | 'Marathi'>('English');
  const [adaptiveModeActive, setAdaptiveModeActive] = useState<boolean>(false);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Record<string, boolean>>({});

  // Web Speech API Integration
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = audioSpeed;
    
    // Choose voice based on selectedLanguage if available
    const voices = window.speechSynthesis.getVoices();
    if (selectedLanguage === 'Hindi' || selectedLanguage === 'Hinglish') {
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
      if (hiVoice) utterance.voice = hiVoice;
    } else if (selectedLanguage === 'Marathi') {
      const mrVoice = voices.find(v => v.lang.includes('mr') || v.lang.includes('hi') || v.lang.includes('IN'));
      if (mrVoice) utterance.voice = mrVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup audio on unmount or page change
  useEffect(() => {
    stopSpeech();
  }, [currentPage, currentSlideIndex]);

  const recordCheckpointResult = (cpId: string, isCorrect: boolean) => {
    setCompletedCheckpoints(prev => ({ ...prev, [cpId]: isCorrect }));
    if (!isCorrect) {
      setAdaptiveModeActive(true);
    }
  };

  const generateCustomLesson = (opts: PersonalizationOptions) => {
    setIsGeneratingLesson(true);
    setPersonalization(opts);
    setSelectedLanguage(opts.language);

    setTimeout(() => {
      const topic = opts.customTopic || (opts.fileName ? `Analysis of ${opts.fileName}` : 'Quantum Computing');
      
      const newLesson: LessonPlan = {
        id: `custom-lesson-${Date.now()}`,
        topicTitle: topic,
        level: opts.level,
        language: opts.language,
        duration: opts.duration,
        goal: opts.goal,
        sourceType: opts.fileName ? 'pdf' : 'topic',
        sourceName: opts.fileName || topic,
        createdAt: new Date().toISOString().split('T')[0],
        modules: [
          {
            id: 'm1',
            title: `Module 1: Fundamentals of ${topic}`,
            description: `Core principles tailored for ${opts.level} level learners.`,
            conceptsCovered: [`${topic} Core`, 'Key Definitions', 'Initial Setup'],
            realWorldExample: `Real-world application of ${topic} in industry today.`,
            estimatedMinutes: Math.round(opts.duration * 0.3),
          },
          {
            id: 'm2',
            title: `Module 2: Advanced Mechanics & Deep Dive`,
            description: `Comprehensive analysis designed for ${opts.goal}.`,
            conceptsCovered: ['System Architecture', 'Algorithmic Optimization', 'Critical Patterns'],
            realWorldExample: `Scale implementation case study.`,
            estimatedMinutes: Math.round(opts.duration * 0.4),
          },
          {
            id: 'm3',
            title: `Module 3: Adaptive Assessment & Problem Solving`,
            description: `Interactive evaluation and practical application.`,
            conceptsCovered: ['Problem Solving', 'Edge Cases', 'Performance Metric'],
            realWorldExample: 'Hands-on synthetic benchmark evaluation.',
            estimatedMinutes: Math.round(opts.duration * 0.3),
          },
        ],
        slides: [
          {
            id: 1,
            title: `1. Introduction to ${topic}`,
            narrationText: `Welcome to your personalized AI lesson on ${topic}! We have tailored this specifically for your ${opts.level} level in ${opts.language}. Let's dive straight into the core principles!`,
            narrationTextTranslations: {
              English: `Welcome to your personalized AI lesson on ${topic}! We have tailored this specifically for your ${opts.level} level in ${opts.language}. Let's dive straight into the core principles!`,
              Hindi: `${topic} के आपके व्यक्तिगत एआई पाठ में आपका स्वागत है! हमने इसे आपके ${opts.level} स्तर के लिए तैयार किया है।`,
              Hinglish: `${topic} ke personalized AI lesson me aapka swagat hai! Ye specially aapke ${opts.level} level ke liye customized hai.`,
              Marathi: `${topic} वरील आपल्या AI पाठात आपले स्वागत आहे! हे विशेषतः आपल्या ${opts.level} स्तरासाठी तयार केले आहे.`,
            },
            visualType: 'diagram',
            visualContent: {
              subtitle: `${topic} Key Architecture`,
              items: [
                `Tailored for ${opts.level} level`,
                `Target Duration: ${opts.duration} Minutes`,
                `Primary Goal: ${opts.goal}`,
              ],
              analogyText: `Intuitive Analogy: ${topic} operates like a well-oiled high-speed Engine!`,
            },
          },
          {
            id: 2,
            title: `2. Deep Mechanics & Key Formulas`,
            narrationText: `Let's break down the mathematical formulation behind ${topic}. Pay close attention to how input variables transform into system outputs!`,
            narrationTextTranslations: {
              English: `Let's break down the mathematical formulation behind ${topic}. Pay close attention to how input variables transform into system outputs!`,
              Hindi: `आइए ${topic} के गणितीय सूत्र को समझें। ध्यान दें कि इनपुट कैसे परिवर्तित होते हैं!`,
              Hinglish: `Aaiye ${topic} ke math formula ko samjhein. Pay attention how inputs transform to output!`,
              Marathi: `चला ${topic} चे गणितीय सूत्र समजून घेऊया. इनपुट कसे रूपांतरित होतात याकडे लक्ष द्या!`,
            },
            visualType: 'formula',
            visualContent: {
              subtitle: 'System Output Equation',
              formula: 'f(X) = ∑ (w_i * x_i) + β_adaptive',
              items: [
                'Parametric scaling factor optimized via gradient loops',
                'Input vectors standardized for high precision',
              ],
            },
            hasCheckpoint: true,
            checkpoint: {
              id: 'cp-custom-1',
              question: `In the primary architecture of ${topic}, what is the main purpose of the adaptive parameter β?`,
              options: [
                'To dynamically balance signal variance under noise',
                'To shut down system execution',
                'To lock memory state permanently',
                'To convert digital signals to analog waves',
              ],
              correctAnswer: 0,
              explanation: 'Adaptive parameter β adjusts signal sensitivity to ensure optimal precision across varying levels of noise.',
              adaptiveRemediation: {
                simplifiedNarration: `Let's adapt and make it crystal clear! Think of parameter β like an auto-brightness slider on your smartphone. When background noise is bright, it auto-adjusts so you can read smoothly!`,
                simplifiedVisual: `Analogy Visual: Smartphone Auto-Brightness Slider adjusting to room ambient light.`,
                followUpQuestion: `What does an auto-brightness sensor do when room light changes?`,
                followUpOptions: ['Adjusts screen brightness automatically', 'Turns off the phone', 'Erases all photos', 'Increases volume'],
                followUpCorrectAnswer: 0,
              },
            },
          },
        ],
        assessmentQuestions: [
          {
            id: 'caq-1',
            type: 'mcq',
            question: `What is the foundational building block of ${topic}?`,
            options: [`Core ${topic} Unit`, 'Classical Resistor', 'Unstructured Buffer', 'Static Bit'],
            correctAnswer: 0,
            conceptTested: `${topic} Core`,
            explanation: `The core unit provides the fundamental state representation for ${topic}.`,
          },
          {
            id: 'caq-2',
            type: 'mcq',
            question: `How does adaptive learning enhance understanding of ${topic}?`,
            options: [
              'By adjusting explanation depth and asking remedial questions based on answers',
              'By forcing students to memorize textbooks',
              'By locking progress until 100 hours are spent',
              'By eliminating teacher feedback',
            ],
            correctAnswer: 0,
            conceptTested: 'Adaptive Feedback Engine',
            explanation: 'Adaptive learning dynamically tailors curriculum depth to individual learner speed and mistakes.',
          },
        ],
      };

      setActiveLesson(newLesson);
      setIsGeneratingLesson(false);
      setCurrentPage('planner');
    }, 2000);
  };

  const startLessonFromPlanner = () => {
    setCurrentSlideIndex(0);
    setAdaptiveModeActive(false);
    setCurrentPage('teacher');
  };

  const recordAssessmentCompletion = (scorePct: number, total: number, correctCount: number) => {
    setUserStats(prev => {
      const newScoreHistory = [
        {
          id: `score-${Date.now()}`,
          lessonTitle: activeLesson.topicTitle,
          date: 'Just now',
          score: scorePct,
          totalQuestions: total,
          correctCount: correctCount,
          timeSpentMinutes: activeLesson.duration,
        },
        ...prev.recentScores,
      ];

      const newOverallMastery = Math.round((prev.overallMastery * 0.7) + (scorePct * 0.3));

      let updatedWeak = [...prev.weakConcepts];
      let updatedStrong = [...prev.strongConcepts];

      if (scorePct >= 80 && updatedWeak.length > 0) {
        const remediated = updatedWeak.pop();
        if (remediated) {
          remediated.status = 'Strong';
          remediated.masteryScore = scorePct;
          remediated.lastPracticed = 'Just now';
          updatedStrong.unshift(remediated);
        }
      }

      return {
        ...prev,
        overallMastery: newOverallMastery,
        completedLessonsCount: prev.completedLessonsCount + 1,
        totalStudyHours: Math.round((prev.totalStudyHours + (activeLesson.duration / 60)) * 10) / 10,
        recentScores: newScoreHistory,
        weakConcepts: updatedWeak,
        strongConcepts: updatedStrong,
      };
    });

    setCurrentPage('progress');
  };

  const remediateConcept = (conceptName: string) => {
    generateCustomLesson({
      level: 'Beginner',
      language: selectedLanguage,
      duration: 15,
      goal: 'Concept Mastery',
      customTopic: `Targeted Remediation: ${conceptName}`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        userStats,
        setUserStats,
        activeLesson,
        setActiveLesson,
        personalization,
        setPersonalization,
        currentSlideIndex,
        setCurrentSlideIndex,
        isGeneratingLesson,
        setIsGeneratingLesson,
        isPlayingAudio,
        setIsPlayingAudio,
        audioSpeed,
        setAudioSpeed,
        captionsEnabled,
        setCaptionsEnabled,
        selectedLanguage,
        setSelectedLanguage,
        adaptiveModeActive,
        setAdaptiveModeActive,
        completedCheckpoints,
        recordCheckpointResult,
        generateCustomLesson,
        startLessonFromPlanner,
        recordAssessmentCompletion,
        remediateConcept,
        speakText,
        stopSpeech,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
