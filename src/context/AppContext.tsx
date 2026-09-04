import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  PageType,
  LessonPlan,
  PersonalizationOptions,
  UserStats,
} from '../types';

type Language =
  | 'English'
  | 'Hindi'
  | 'Hinglish'
  | 'Marathi';
import { INITIAL_USER_STATS, SAMPLE_LESSONS } from '../mockData';

interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  // Real-time date, time and streak
  currentTime: Date;
  studyDate: string;
  studyTime: string;
  studyStreak: number;
  recordStudyActivity: () => void;
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
  const getInitialLanguage = (): 'English' | 'Hindi' | 'Hinglish' | 'Marathi' => {
    const savedLanguage = localStorage.getItem('adaptiveai-language');

    if (
      savedLanguage === 'English' ||
      savedLanguage === 'Hindi' ||
      savedLanguage === 'Hinglish' ||
      savedLanguage === 'Marathi'
    ) {
      return savedLanguage;
    }

    const browserLanguage = navigator.language.toLowerCase();

    if (browserLanguage.startsWith('hi')) {
      return 'Hindi';
    }

    if (browserLanguage.startsWith('mr')) {
      return 'Marathi';
    }

    return 'English';
  };

  const [selectedLanguage, setSelectedLanguageState] =
    useState<'English' | 'Hindi' | 'Hinglish' | 'Marathi'>(
      getInitialLanguage
    );

  const setSelectedLanguage = (
    lang: 'English' | 'Hindi' | 'Hinglish' | 'Marathi'
  ) => {
    setSelectedLanguageState(lang);
    localStorage.setItem('adaptiveai-language', lang);

    setPersonalization(prev => ({
      ...prev,
      language: lang,
    }));
  };
  const [adaptiveModeActive, setAdaptiveModeActive] = useState<boolean>(false);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Record<string, boolean>>({});

  // ============================================================
  // REAL-TIME DATE / TIME
  // ============================================================

  const [currentTime, setCurrentTime] = useState<Date>(
    () => new Date()
  );

  // ============================================================
  // REAL STUDY STREAK
  // ============================================================

  const [studyStreak, setStudyStreak] = useState<number>(0);
  // ============================================================
  // LIVE CLOCK
  // Updates every second using the user's local device time
  // ============================================================

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date());
    };

    updateClock();

    const timer = window.setInterval(
      updateClock,
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, []);
  // ============================================================
  // REAL STUDY STREAK LOGIC
  // ============================================================

  const getTodayKey = (date: Date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const calculateStudyStreak = (dates: string[]) => {
    if (dates.length === 0) {
      return 0;
    }

    const uniqueDates = [...new Set(dates)].sort().reverse();

    const today = getTodayKey();

    const yesterday = getTodayKey(
      new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    // If user has not studied today or yesterday,
    // the streak is broken.
    if (
      uniqueDates[0] !== today &&
      uniqueDates[0] !== yesterday
    ) {
      return 0;
    }

    let streak = 0;

    let currentDate = new Date(
      `${uniqueDates[0]}T00:00:00`
    );

    for (const date of uniqueDates) {
      if (date !== getTodayKey(currentDate)) {
        break;
      }

      streak++;

      currentDate = new Date(
        currentDate.getTime() - 24 * 60 * 60 * 1000
      );
    }

    return streak;
  };

  const recordStudyActivity = () => {
    const savedDates = localStorage.getItem(
      'adaptiveai-study-dates'
    );

    const studyDates: string[] = savedDates
      ? JSON.parse(savedDates)
      : [];

    const today = getTodayKey();

    // Only record today's activity once
    if (!studyDates.includes(today)) {
      studyDates.push(today);
    }

    localStorage.setItem(
      'adaptiveai-study-dates',
      JSON.stringify(studyDates)
    );

    const newStreak = calculateStudyStreak(studyDates);

    setStudyStreak(newStreak);

    // Keep userStats synchronized
    setUserStats(prev => ({
      ...prev,
      studyStreakDays: newStreak
    }));
  };
  // ============================================================
  // LOAD SAVED STREAK WHEN APP STARTS
  // ============================================================

  useEffect(() => {
    const savedDates = localStorage.getItem(
      'adaptiveai-study-dates'
    );

    if (!savedDates) {
      setStudyStreak(0);

      setUserStats(prev => ({
        ...prev,
        studyStreakDays: 0,
      }));

      return;
    }

    const studyDates: string[] = JSON.parse(savedDates);

    const streak = calculateStudyStreak(studyDates);

    setStudyStreak(streak);

    setUserStats(prev => ({
      ...prev,
      studyStreakDays: streak,
    }));
  }, []);
  useEffect(() => {
    const savedDates = localStorage.getItem(
      'adaptiveai-study-dates'
    );

    if (!savedDates) {
      setStudyStreak(0);

      setUserStats(prev => ({
        ...prev,
        studyStreakDays: 0
      }));

      return;
    }

    const studyDates: string[] = JSON.parse(savedDates);

    const streak = calculateStudyStreak(studyDates);

    setStudyStreak(streak);

    setUserStats(prev => ({
      ...prev,
      studyStreakDays: streak
    }));
  }, []);
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

    const voices = window.speechSynthesis.getVoices();

    const speechLanguages: Record<Language, string> = {
      English: 'en-IN',
      Hindi: 'hi-IN',
      Hinglish: 'hi-IN',
      Marathi: 'mr-IN',
    };

    const targetLanguage = speechLanguages[selectedLanguage];

    utterance.lang = targetLanguage;

    const exactVoice = voices.find(
      voice => voice.lang.toLowerCase() === targetLanguage.toLowerCase()
    );

    const baseLanguage = targetLanguage.split('-')[0].toLowerCase();

    const languageVoice = voices.find(
      voice => voice.lang.toLowerCase().startsWith(baseLanguage)
    );

    if (exactVoice) {
      utterance.voice = exactVoice;
    } else if (languageVoice) {
      utterance.voice = languageVoice;
    }

    console.log(
      'Selected language:',
      selectedLanguage,
      'Speech language:',
      targetLanguage,
      'Voice:',
      utterance.voice?.name || 'Browser default'
    );

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
      const topic =
        opts.customTopic ||
        (opts.fileName ? `Analysis of ${opts.fileName}` : 'Quantum Computing');

      // ============================================================
      // LANGUAGE CONTENT
      // ============================================================

      const content = {
        English: {
          introTitle: `1. Introduction to ${topic}`,
          introNarration: `Welcome to your personalized lesson on ${topic}. In this lesson, we will understand the important concepts step by step.`,
          mechanicsTitle: `2. Understanding ${topic}`,
          mechanicsNarration: `Let's understand the important concepts behind ${topic}. We will break the topic into simple and practical ideas.`,
          module1: `Learn the fundamentals and important definitions of ${topic}.`,
          module2: `Understand the main concepts, working principles, and practical applications of ${topic}.`,
          module3: `Test your understanding of ${topic} through practical questions and problem solving.`,
          q1: `What is the main purpose of studying ${topic}?`,
          q1Options: [
            `To understand the core concepts of ${topic}`,
            'To memorize unrelated information',
            'To remove all practical applications',
            'To avoid understanding the topic',
          ],
          q1Explanation: `Understanding the core concepts of ${topic} provides the foundation for learning more advanced ideas.`,
          q2: `Which approach is most useful when learning ${topic}?`,
          q2Options: [
            'Understanding concepts and applying them to examples',
            'Only memorizing definitions',
            'Skipping the fundamentals',
            'Avoiding practical examples',
          ],
          q2Explanation: `Conceptual understanding combined with practical examples makes learning ${topic} more effective.`,
        },

        Hindi: {
          introTitle: `${topic} का परिचय`,
          introNarration: `${topic} के आपके व्यक्तिगत पाठ में आपका स्वागत है। इस पाठ में हम महत्वपूर्ण अवधारणाओं को एक-एक करके सरल तरीके से समझेंगे।`,
          mechanicsTitle: `${topic} को समझना`,
          mechanicsNarration: `आइए ${topic} की महत्वपूर्ण अवधारणाओं को समझते हैं। हम इस विषय को आसान और व्यावहारिक भागों में समझेंगे।`,
          module1: `${topic} की मूल बातें और महत्वपूर्ण परिभाषाएँ सीखें।`,
          module2: `${topic} की मुख्य अवधारणाओं, कार्यप्रणाली और व्यावहारिक उपयोग को समझें।`,
          module3: `प्रश्नों और समस्या समाधान के माध्यम से ${topic} की अपनी समझ जाँचें।`,
          q1: `${topic} का अध्ययन करने का मुख्य उद्देश्य क्या है?`,
          q1Options: [
            `${topic} की मूल अवधारणाओं को समझना`,
            'असंबंधित जानकारी को याद करना',
            'सभी व्यावहारिक उपयोगों को हटाना',
            'विषय को समझने से बचना',
          ],
          q1Explanation: `${topic} की मूल अवधारणाओं को समझना आगे की जानकारी सीखने का आधार बनता है।`,
          q2: `${topic} सीखने के लिए कौन सा तरीका सबसे उपयोगी है?`,
          q2Options: [
            'अवधारणाओं को समझना और उदाहरणों पर लागू करना',
            'केवल परिभाषाएँ याद करना',
            'मूल बातें छोड़ देना',
            'व्यावहारिक उदाहरणों से बचना',
          ],
          q2Explanation: `अवधारणाओं की समझ और व्यावहारिक उदाहरण ${topic} को बेहतर तरीके से सीखने में मदद करते हैं।`,
        },

        Hinglish: {
          introTitle: `${topic} ka Introduction`,
          introNarration: `Aapke personalized ${topic} lesson mein welcome hai. Is lesson mein hum important concepts ko step by step simple way mein samjhenge.`,
          mechanicsTitle: `${topic} ko Samajhna`,
          mechanicsNarration: `Chaliye ${topic} ke important concepts ko samajhte hain. Hum is topic ko easy aur practical examples ke saath break down karenge.`,
          module1: `${topic} ke fundamentals aur important definitions seekhein.`,
          module2: `${topic} ke main concepts, working principles aur practical applications samjhein.`,
          module3: `Questions aur problem solving ke through ${topic} ki understanding test karein.`,
          q1: `${topic} ko study karne ka main purpose kya hai?`,
          q1Options: [
            `${topic} ke core concepts ko samajhna`,
            'Unrelated information ko memorize karna',
            'Practical applications ko remove karna',
            'Topic ko samajhne se bachna',
          ],
          q1Explanation: `${topic} ke core concepts ko samajhna advanced concepts learn karne ke liye strong foundation deta hai.`,
          q2: `${topic} seekhne ke liye kaunsa approach sabse useful hai?`,
          q2Options: [
            'Concepts ko samajhna aur examples par apply karna',
            'Sirf definitions memorize karna',
            'Fundamentals ko skip karna',
            'Practical examples avoid karna',
          ],
          q2Explanation: `Conceptual understanding ke saath practical examples use karne se ${topic} ko effectively learn karna easy hota hai.`,
        },

        Marathi: {
          introTitle: `${topic} चा परिचय`,
          introNarration: `${topic} वरील आपल्या वैयक्तिकृत धड्यात आपले स्वागत आहे. या धड्यात आपण महत्त्वाच्या संकल्पना सोप्या पद्धतीने टप्प्याटप्प्याने समजून घेणार आहोत.`,
          mechanicsTitle: `${topic} समजून घेणे`,
          mechanicsNarration: `चला ${topic} मधील महत्त्वाच्या संकल्पना समजून घेऊया. आपण हा विषय सोप्या आणि व्यावहारिक उदाहरणांद्वारे समजून घेणार आहोत.`,
          module1: `${topic} ची मूलभूत माहिती आणि महत्त्वाच्या व्याख्या शिका.`,
          module2: `${topic} मधील मुख्य संकल्पना, कार्यपद्धती आणि व्यावहारिक उपयोग समजून घ्या.`,
          module3: `प्रश्न आणि समस्या सोडवण्याच्या माध्यमातून ${topic} ची तुमची समज तपासा.`,
          q1: `${topic} चा अभ्यास करण्याचा मुख्य उद्देश काय आहे?`,
          q1Options: [
            `${topic} च्या मूलभूत संकल्पना समजून घेणे`,
            'असंबंधित माहिती पाठ करणे',
            'सर्व व्यावहारिक उपयोग काढून टाकणे',
            'विषय समजून घेणे टाळणे',
          ],
          q1Explanation: `${topic} च्या मूलभूत संकल्पना समजून घेणे हे पुढील प्रगत माहिती शिकण्यासाठी महत्त्वाचे आहे.`,
          q2: `${topic} शिकण्यासाठी कोणती पद्धत सर्वात उपयुक्त आहे?`,
          q2Options: [
            'संकल्पना समजून घेऊन त्या उदाहरणांमध्ये वापरणे',
            'फक्त व्याख्या पाठ करणे',
            'मूलभूत माहिती सोडून देणे',
            'व्यावहारिक उदाहरणे टाळणे',
          ],
          q2Explanation: `संकल्पना समजून घेणे आणि व्यावहारिक उदाहरणांचा वापर केल्याने ${topic} अधिक प्रभावीपणे शिकता येतो.`,
        },
      }[opts.language];

      // ============================================================
      // NEW LESSON
      // ============================================================

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
            title: content.introTitle,
            description: content.module1,
            conceptsCovered: [
              `${topic} Core`,
              'Key Definitions',
              'Fundamentals',
            ],
            realWorldExample: `A practical real-world example of ${topic}.`,
            estimatedMinutes: Math.round(opts.duration * 0.3),
          },
          {
            id: 'm2',
            title: content.mechanicsTitle,
            description: content.module2,
            conceptsCovered: [
              'Main Concepts',
              'Working Principles',
              'Practical Applications',
            ],
            realWorldExample: `Practical application of ${topic}.`,
            estimatedMinutes: Math.round(opts.duration * 0.4),
          },
          {
            id: 'm3',
            title: `3. ${content.module3}`,
            description: content.module3,
            conceptsCovered: [
              'Problem Solving',
              'Application',
              'Assessment',
            ],
            realWorldExample: `Hands-on practice related to ${topic}.`,
            estimatedMinutes: Math.round(opts.duration * 0.3),
          },
        ],

        slides: [
          {
            id: 1,
            title: content.introTitle,
            narrationText: content.introNarration,
            narrationTextTranslations: {
              English: content.introNarration,
              Hindi: content.introNarration,
              Hinglish: content.introNarration,
              Marathi: content.introNarration,
            },
            visualType: 'diagram',
            visualContent: {
              subtitle: topic,
              items: [
                `Level: ${opts.level}`,
                `Duration: ${opts.duration} Minutes`,
                `Goal: ${opts.goal}`,
              ],
              analogyText: `Think of ${topic} using a simple real-world example.`,
            },
          },

          {
            id: 2,
            title: content.mechanicsTitle,
            narrationText: content.mechanicsNarration,
            narrationTextTranslations: {
              English: content.mechanicsNarration,
              Hindi: content.mechanicsNarration,
              Hinglish: content.mechanicsNarration,
              Marathi: content.mechanicsNarration,
            },
            visualType: 'formula',
            visualContent: {
              subtitle: `${topic} - Key Concepts`,
              items: [
                'Understand the concept',
                'Connect it with examples',
                'Apply what you learned',
              ],
            },
            hasCheckpoint: true,
            checkpoint: {
              id: 'cp-custom-1',
              question: content.q1,
              options: content.q1Options,
              correctAnswer: 0,
              explanation: content.q1Explanation,
              adaptiveRemediation: {
                simplifiedNarration: content.q1Explanation,
                simplifiedVisual: `${topic} simple concept explanation`,
                followUpQuestion: content.q2,
                followUpOptions: content.q2Options,
                followUpCorrectAnswer: 0,
              },
            },
          },
        ],

        // ============================================================
        // DYNAMIC ASSESSMENT
        // ============================================================

        assessmentQuestions: [
          {
            id: `caq-${Date.now()}-1`,
            type: 'mcq',
            question: content.q1,
            options: content.q1Options,
            correctAnswer: 0,
            conceptTested: `${topic} Core`,
            explanation: content.q1Explanation,
          },
          {
            id: `caq-${Date.now()}-2`,
            type: 'mcq',
            question: content.q2,
            options: content.q2Options,
            correctAnswer: 0,
            conceptTested: `${topic} Application`,
            explanation: content.q2Explanation,
          },
        ],
      };

      setActiveLesson(newLesson);
      setIsGeneratingLesson(false);
      setCurrentPage('planner');
    }, 1000);
  };
  const startLessonFromPlanner = () => {
    // Record today's study activity
    recordStudyActivity();

    setCurrentSlideIndex(0);
    setAdaptiveModeActive(false);
    setCurrentPage('teacher');
  };
  const recordAssessmentCompletion = (
    scorePct: number,
    total: number,
    correctCount: number
  ) => {

    // Record today's study activity and update streak
    recordStudyActivity();
    setUserStats(prev => {
      const newScoreHistory = [
        {
          id: `score-${Date.now()}`,
          lessonTitle: activeLesson.topicTitle,
          date: new Date().toLocaleString(),
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
  // ============================================================
  // REAL DATE & TIME FOR UI
  // ============================================================

  const studyDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const studyTime = currentTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        currentTime,
        studyDate,
        studyTime,
        studyStreak,
        recordStudyActivity,
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
