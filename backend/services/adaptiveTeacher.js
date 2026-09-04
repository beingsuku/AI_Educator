const { generateAnswer } = require("../rag/generate");
const { retrieveContext } = require("../rag/retrieve");

// ============================================================
// ADAPTIVE TEACHER
// ============================================================

async function adaptiveTeach({
    question,
    documentId,
    subject = "General",
    topic = "General",
    level = "Intermediate",
    language = "English",
    difficulty = "medium",
    previousScore = 0,
    recentMistakes = [],
    learningStyle = "visual"
}) {

    const retrievalQuery = `
Subject: ${subject}
Topic: ${topic}

Student question:
${question}

Student level:
${level}

Use the uploaded educational material to answer this question.
`;

    const context = await retrieveContext(
        retrievalQuery,
        documentId
    );

    const teachingPrompt = `
You are an intelligent human-like AI Teacher.

Teach the student dynamically based on the information below.

SUBJECT:
${subject}

TOPIC:
${topic}

STUDENT LEVEL:
${level}

LANGUAGE:
${language}

CURRENT DIFFICULTY:
${difficulty}

PREVIOUS SCORE:
${previousScore}

RECENT MISTAKES:
${JSON.stringify(recentMistakes)}

LEARNING STYLE:
${learningStyle}

STUDENT QUESTION:
${question}

TEACHING RULES:

1. Adapt the explanation to the student's level.
2. If the student is struggling, simplify the explanation.
3. If the student is performing well, increase difficulty.
4. Identify misconceptions.
5. Give topic-specific examples.
6. Use analogies when useful.
7. Explain step-by-step.
8. Ask a useful follow-up question.
9. Encourage the student naturally.
10. Use the uploaded material as the primary source when relevant.
11. Do not contradict the uploaded material.
12. Respond in ${language}.
13. For mathematics, show calculations.
14. For programming, show useful code.
15. For science, use appropriate visual explanations.

IMPORTANT:
Do NOT use generic repeated content.
The explanation must be specifically about:
${topic}

Return ONLY valid JSON:

{
  "answer": "topic-specific teacher explanation",
  "teacherState": "EXPLAINING",
  "difficulty": "medium",
  "misconception": null,
  "nextAction": "practice",
  "followUpQuestion": "topic-specific question",
  "visualNeeded": true,
  "emotion": "encouraging"
}
`;

    const answer = await generateAnswer({
        question: teachingPrompt,
        context,
        level,
        language
    });

    return {
        answer,
        sources: context.map(item => ({
            page: item.page,
            text: item.text
        }))
    };
}


// ============================================================
// DYNAMIC MULTI-SLIDE LESSON GENERATOR
// ============================================================

async function generateAdaptiveLesson({
    documentId,
    subject = "General",
    topic = "General",
    level = "Intermediate",
    language = "English",
    duration = 30,
    goal = "Understand the topic",
    difficulty = "medium",
    learningStyle = "visual"
}) {

    const retrievalQuery = `
Create a complete lesson about:

Subject: ${subject}
Topic: ${topic}
Student level: ${level}
Learning goal: ${goal}
Duration: ${duration} minutes

Retrieve all important information needed to teach this topic.
`;

    const context = await retrieveContext(
        retrievalQuery,
        documentId
    );

    const lessonPrompt = `
You are an expert human teacher and lesson designer.

Create a COMPLETE, DYNAMIC lesson specifically for:

SUBJECT:
${subject}

TOPIC:
${topic}

STUDENT LEVEL:
${level}

LANGUAGE:
${language}

DURATION:
${duration} minutes

LEARNING GOAL:
${goal}

DIFFICULTY:
${difficulty}

LEARNING STYLE:
${learningStyle}

IMPORTANT REQUIREMENTS:

1. Do NOT create a fixed 2-slide lesson.
2. Generate as many slides as necessary to properly teach the topic.
3. Normally create 6-12 slides for a normal lesson.
4. A complex topic can have more slides.
5. Every slide must contain DIFFERENT topic-specific content.
6. Do NOT repeat generic text such as:
   "Understand the concept"
   "Connect it with examples"
   "Apply what you learned"
7. The slide titles must be specifically related to ${topic}.
8. Explain concepts progressively.
9. Include examples relevant to ${topic}.
10. Include a worked example when appropriate.
11. Include a summary.
12. Include checkpoint/practice questions.
13. Adapt explanations to ${level}.
14. Use ${language}.
15. Use uploaded material as the primary source.
16. Do not invent facts that contradict the uploaded material.
17. For programming topics, include code where appropriate.
18. For mathematics, include equations/calculations.
19. For science, include appropriate visual/diagram descriptions.
20. For history/social science, include events, causes, effects and examples where appropriate.

Each slide should contain:

- title
- explanation
- keyPoints
- example
- visual
- teacherScript
- teacherState
- emotion
- checkpointQuestion

Return ONLY valid JSON in this exact structure:

{
  "lessonTitle": "specific title",
  "subject": "${subject}",
  "topic": "${topic}",
  "level": "${level}",
  "language": "${language}",
  "duration": ${duration},
  "slides": [
    {
      "slideNumber": 1,
      "title": "topic-specific title",
      "explanation": "clear explanation",
      "keyPoints": [
        "important point 1",
        "important point 2"
      ],
      "example": "specific example",
      "visual": "description of visual that should appear",
      "teacherScript": "what the AI teacher should say",
      "teacherState": "EXPLAINING",
      "emotion": "friendly",
      "checkpointQuestion": null
    }
  ],
  "finalSummary": [
    "important takeaway 1",
    "important takeaway 2"
  ]
}
`;

    const generated = await generateAnswer({
        question: lessonPrompt,
        context,
        level,
        language,
        lessonMode: true,
        duration,
        goal
    });

    let lesson;

    try {
        lesson = typeof generated === "string"
            ? JSON.parse(generated)
            : generated;
    } catch (error) {
        console.error("Lesson JSON parsing failed:", error);

        lesson = {
            lessonTitle: `${topic} - AI Generated Lesson`,
            subject,
            topic,
            level,
            language,
            duration,
            slides: [
                {
                    slideNumber: 1,
                    title: topic,
                    explanation: generated,
                    keyPoints: [],
                    example: "",
                    visual: "",
                    teacherScript: generated,
                    teacherState: "EXPLAINING",
                    emotion: "encouraging",
                    checkpointQuestion: null
                }
            ],
            finalSummary: []
        };
    }

    return {
        ...lesson,
        sources: context.map(item => ({
            page: item.page,
            text: item.text
        }))
    };
}

module.exports = {
    adaptiveTeach,
    generateAdaptiveLesson
};