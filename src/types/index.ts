export type PageType = 'landing' | 'dashboard' | 'learn' | 'planner' | 'teacher' | 'assessment' | 'progress';

export type LearnerLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type Language = 'English' | 'Hindi' | 'Hinglish' | 'Marathi';
export type DurationMins = 5 | 15 | 20 | 30 | 60;
export type LearningGoal = 'Exam Prep' | 'Concept Mastery' | 'Quick Revision' | 'Deep Dive';

export interface PersonalizationOptions {
  level: LearnerLevel;
  language: Language;
  duration: DurationMins;
  goal: LearningGoal;
  customTopic?: string;
  fileName?: string;
}

export interface CheckpointQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  adaptiveRemediation: {
    simplifiedNarration: string;
    simplifiedVisual: string;
    followUpQuestion: string;
    followUpOptions: string[];
    followUpCorrectAnswer: number;
  };
}

export interface LessonSlide {
  id: number;
  title: string;
  narrationText: string;
  narrationTextTranslations: Record<Language, string>;
  visualType: 'diagram' | 'formula' | 'code' | 'comparison' | 'flowchart';
  visualContent: {
    subtitle?: string;
    items?: string[];
    codeSnippet?: string;
    formula?: string;
    diagramSteps?: { title: string; desc: string; icon: string }[];
    analogyText?: string;
  };
  hasCheckpoint?: boolean;
  checkpoint?: CheckpointQuestion;
}

export interface LessonPlanModule {
  id: string;
  title: string;
  description: string;
  conceptsCovered: string[];
  realWorldExample: string;
  estimatedMinutes: number;
}

export interface LessonPlan {
  id: string;
  topicTitle: string;
  level: LearnerLevel;
  language: Language;
  duration: DurationMins;
  goal: LearningGoal;
  sourceType: 'topic' | 'pdf' | 'notes';
  sourceName: string;
  modules: LessonPlanModule[];
  slides: LessonSlide[];
  assessmentQuestions: AssessmentQuestion[];
  createdAt: string;
}

export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  conceptTested: string;
  explanation: string;
}

export interface ConceptMastery {
  concept: string;
  masteryScore: number; // 0 to 100
  status: 'Strong' | 'Developing' | 'Weak';
  category: string;
  lastPracticed: string;
}

export interface UserAssessmentHistory {
  id: string;
  lessonTitle: string;
  date: string;
  score: number; // 0-100
  totalQuestions: number;
  correctCount: number;
  timeSpentMinutes: number;
}

export interface UserStats {
  name: string;
  avatar: string;
  currentLevelBadge: string;
  overallMastery: number;
  completedLessonsCount: number;
  studyStreakDays: number;
  totalStudyHours: number;
  strongConcepts: ConceptMastery[];
  weakConcepts: ConceptMastery[];
  recentScores: UserAssessmentHistory[];
  weeklyActivity: { day: string; hours: number; score: number }[];
}
