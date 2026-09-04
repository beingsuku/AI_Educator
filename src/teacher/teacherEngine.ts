import type { LearnerLevel, LessonSlide, Language } from '../types';

export interface TeacherResponse {
  speech: string;
  strategy: 'analogy' | 'step-by-step' | 'example' | 'clarify';
  visualTitle: string;
  visualItems: string[];
  analogy?: string;
  checkQuestion?: string;
}

interface TeacherEngineInput {
  question: string;
  slide: LessonSlide;
  level: LearnerLevel;
  language: Language;
}

export function buildTeacherResponse({
  question,
  slide,
  level,
}: TeacherEngineInput): TeacherResponse {
  const q = question.toLowerCase().trim();

  const visual = slide.visualContent;
  const items = visual.items ?? [];

  const wantsSimple =
    q.includes('simple') ||
    q.includes('easy') ||
    q.includes("don't understand") ||
    q.includes('dont understand') ||
    q.includes('simplify');

  const wantsExample =
    q.includes('example') ||
    q.includes('real life') ||
    q.includes('real-life');

  const wantsWhy =
    q.includes('why') ||
    q.includes('how') ||
    q.includes('explain');

  /*
   * BEGINNER
   */
  if (wantsSimple || level === 'Beginner') {
    const analogy =
      visual.analogyText ||
      `Think of ${slide.title} as something you already use in everyday life. We will understand the basic idea first and then look at the technical details.`;

    return {
      strategy: 'analogy',
      speech:
        `Let's make ${slide.title} really simple. ` +
        `${analogy} ` +
        `The main idea is: ${slide.narrationText}`,
      visualTitle: `Simple explanation: ${slide.title}`,
      visualItems:
        items.length > 0
          ? items
          : [
              `First understand the basic idea of ${slide.title}.`,
              `Connect the idea with a real-world example.`,
              `Then learn the technical details.`,
            ],
      analogy,
      checkQuestion: `Can you explain ${slide.title} in your own words?`,
    };
  }

  /*
   * EXAMPLE REQUEST
   */
  if (wantsExample) {
    const example =
      visual.analogyText ||
      items[0] ||
      `Imagine a real-world situation where ${slide.title} is being used.`;

    return {
      strategy: 'example',
      speech:
        `Sure. Let's understand ${slide.title} with an example. ` +
        `${example} ` +
        `Now connect that example to the concept: ${slide.narrationText}`,
      visualTitle: `Example of ${slide.title}`,
      visualItems:
        items.length > 0
          ? items
          : [
              'Start with the real-world situation.',
              'Identify the important parts.',
              `Connect those parts to ${slide.title}.`,
            ],
      analogy: example,
      checkQuestion: `What part of the example represents ${slide.title}?`,
    };
  }

  /*
   * WHY / HOW / EXPLAIN REQUEST
   */
  if (wantsWhy) {
    const steps =
      items.length > 0
        ? items
        : [
            `Understand what ${slide.title} means.`,
            'Break the concept into smaller parts.',
            'Connect each part together.',
            'Apply the concept to an example.',
          ];

    return {
      strategy: 'step-by-step',
      speech:
        `Let's understand ${slide.title} step by step. ` +
        `${slide.narrationText} ` +
        `The important steps are: ${steps.join('. ')}`,
      visualTitle: `${slide.title} — Step by Step`,
      visualItems: steps,
      checkQuestion: `What is the first important step in understanding ${slide.title}?`,
    };
  }

  /*
   * DEFAULT EXPLANATION
   */
  return {
    strategy: 'clarify',
    speech:
      `Let me explain ${slide.title}. ` +
      `${slide.narrationText} ` +
      (items.length > 0
        ? `The key points are: ${items.join('. ')}`
        : ''),
    visualTitle: `Understanding ${slide.title}`,
    visualItems:
      items.length > 0
        ? items
        : [
            `Key concept: ${slide.title}`,
            'Understand the definition.',
            'Understand how it works.',
            'Apply it using an example.',
          ],
    analogy: visual.analogyText,
    checkQuestion: `What is the main idea you understood from ${slide.title}?`,
  };
}