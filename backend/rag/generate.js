const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateAnswer({
    question,
    context = [],
    level = "Intermediate",
    language = "English",
    lessonMode = false,
    duration = 20,
    goal = "Concept Mastery"
}) {
    // ============================================================
    // RAG CONTEXT
    // ============================================================

    const contextText = Array.isArray(context)
        ? context
            .map((item, index) => {
                return `[Source ${index + 1}]\n${item.text || ""}`;
            })
            .join("\n\n")
        : "";

    // ============================================================
    // NORMAL RAG QUESTION
    // ============================================================

    if (!lessonMode) {
        const systemPrompt = `
You are AdaptiveAI Teacher.

Answer the student's question using the retrieved context.

Rules:
- Use the context as the primary source.
- Do not contradict the retrieved context.
- Explain according to the learner level.
- Use examples when useful.
- If the context does not contain the answer, say that clearly.
- Respond in ${language}.
- Learner level: ${level}.
`;

        const userPrompt = `
Student question:

${question}

Retrieved context:

${contextText || "No retrieved context was provided."}
`;

        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            temperature: 0.3
        });

        return response.choices[0].message.content;
    }

    // ============================================================
    // LESSON GENERATION
    // ============================================================

    const systemPrompt = `
You are AdaptiveAI Teacher.

Create a high-quality personalized educational lesson.

The lesson must be based on the requested topic and, when available,
the retrieved source material.

IMPORTANT RULES:

1. Teach the ACTUAL topic.
2. Do not create generic filler content.
3. Do not simply repeat the topic name in every slide.
4. Decide the lesson structure according to the topic.
5. Create 6, 7, or 8 slides.
6. Make every slide teach a different useful concept.
7. Progress from basic understanding to deeper understanding.
8. Use examples relevant to the actual topic.
9. For technical topics, include technical details.
10. For mathematics, include formulas or calculations when appropriate.
11. For programming, include logic, algorithms, examples, or code concepts.
12. For science, explain mechanisms and processes.
13. For theoretical subjects, use examples and analogies.
14. Generate questions from the ACTUAL lesson content.
15. Do not generate generic questions such as "What is the purpose of studying X?"
16. Wrong MCQ options must be plausible.
17. Include explanations for answers.
18. Create 5 to 8 assessment questions.
19. Create 3 to 5 modules.
20. Add checkpoints to important slides.
21. Add adaptive remediation for checkpoint questions.
22. Adapt difficulty to ${level}.
23. Adapt depth to ${duration} minutes.
24. Adapt the lesson to the goal: ${goal}.

LANGUAGE:

English:
Use natural English.

Hindi:
Use natural Hindi.

Hinglish:
Use natural conversational Hinglish.
Mix Hindi and English naturally.
Do NOT translate English word-for-word.

Marathi:
Use natural Marathi.

IMPORTANT:

The main lesson language is ${language}.

However, every slide MUST contain translations for:
- English
- Hindi
- Hinglish
- Marathi

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
`;

    const userPrompt = `
Create a lesson for this topic:

${question}

Learner level:
${level}

Preferred language:
${language}

Duration:
${duration} minutes

Learning goal:
${goal}

Retrieved source material:

${contextText || "No source document was provided. Generate the lesson from the requested topic using your educational knowledge."}

The lesson should be useful for a real student.

Choose the number of slides yourself:
6, 7, or 8.

Choose the modules yourself:
3, 4, or 5.

Choose the appropriate visual type for every slide.

Possible visual types:
- concept
- diagram
- process
- formula
- comparison
- example
- code
- summary

Return this JSON structure:

{
  "topicTitle": "Actual lesson title",
  "level": "${level}",
  "language": "${language}",
  "duration": ${Number(duration) || 20},
  "goal": "${goal}",

  "modules": [
    {
      "id": "m1",
      "title": "Module title",
      "description": "Module explanation",
      "conceptsCovered": [
        "Actual concept 1",
        "Actual concept 2"
      ],
      "realWorldExample": "Relevant example",
      "estimatedMinutes": 5
    }
  ],

  "slides": [
    {
      "id": 1,
      "title": "Topic-specific slide title",
      "narrationText": "Explanation in the requested language",

      "narrationTextTranslations": {
        "English": "Natural English explanation",
        "Hindi": "Natural Hindi explanation",
        "Hinglish": "Natural Hinglish explanation",
        "Marathi": "Natural Marathi explanation"
      },

      "visualType": "concept",

      "visualContent": {
        "subtitle": "Useful subtitle",
        "items": [
          "Important point 1",
          "Important point 2",
          "Important point 3"
        ],
        "analogyText": "Useful analogy if appropriate"
      },

      "hasCheckpoint": false,

      "checkpoint": null
    }
  ],

  "assessmentQuestions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Topic-specific question",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "conceptTested": "Specific concept",
      "explanation": "Why the answer is correct"
    }
  ]
}
`;

    // ============================================================
    // OPENAI REQUEST
    // ============================================================

    let response;

    try {
        response = await client.chat.completions.create({
            model: "gpt-4.1-mini",

            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],

            temperature: 0.7
        });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error("Failed to generate lesson using OpenAI.");
    }

    // ============================================================
    // GET RESPONSE
    // ============================================================

    const rawContent = response &&
        response.choices &&
        response.choices[0] &&
        response.choices[0].message &&
        response.choices[0].message.content;

    if (!rawContent) {
        console.error("OpenAI response was empty.");
        throw new Error("OpenAI returned an empty lesson.");
    }

    // ============================================================
    // CLEAN RESPONSE
    // ============================================================

    let cleanedContent = rawContent.trim();

    // Remove ```json
    if (cleanedContent.startsWith("```json")) {
        cleanedContent = cleanedContent.substring(7);
    }

    // Remove ```
    if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent.substring(3);
    }

    if (cleanedContent.endsWith("```")) {
        cleanedContent = cleanedContent.substring(
            0,
            cleanedContent.length - 3
        );
    }

    cleanedContent = cleanedContent.trim();

    // ============================================================
    // PARSE JSON
    // ============================================================

    let lesson;

    try {
        lesson = JSON.parse(cleanedContent);
    } catch (error) {
        console.error("====================================");
        console.error("AI JSON PARSE ERROR");
        console.error("====================================");
        console.error(rawContent);

        throw new Error(
            "AI returned invalid lesson JSON."
        );
    }

    // ============================================================
    // BASIC VALIDATION
    // ============================================================

    if (!lesson || typeof lesson !== "object") {
        throw new Error(
            "AI returned an invalid lesson object."
        );
    }

    if (!lesson.topicTitle) {
        lesson.topicTitle = question || "Generated Lesson";
    }

    if (!Array.isArray(lesson.modules)) {
        lesson.modules = [];
    }

    if (!Array.isArray(lesson.slides)) {
        lesson.slides = [];
    }

    if (!Array.isArray(lesson.assessmentQuestions)) {
        lesson.assessmentQuestions = [];
    }

    // ============================================================
    // NORMALIZE SLIDES
    // ============================================================

    lesson.slides = lesson.slides.map((slide, index) => {
        if (!slide || typeof slide !== "object") {
            slide = {};
        }

        if (!slide.id) {
            slide.id = index + 1;
        }

        if (!slide.title) {
            slide.title = `Concept ${index + 1}`;
        }

        if (!slide.narrationText) {
            slide.narrationText = slide.title;
        }

        if (!slide.narrationTextTranslations) {
            slide.narrationTextTranslations = {};
        }

        if (!slide.narrationTextTranslations.English) {
            slide.narrationTextTranslations.English =
                slide.narrationText;
        }

        if (!slide.narrationTextTranslations.Hindi) {
            slide.narrationTextTranslations.Hindi =
                slide.narrationText;
        }

        if (!slide.narrationTextTranslations.Hinglish) {
            slide.narrationTextTranslations.Hinglish =
                slide.narrationText;
        }

        if (!slide.narrationTextTranslations.Marathi) {
            slide.narrationTextTranslations.Marathi =
                slide.narrationText;
        }

        if (!slide.visualType) {
            slide.visualType = "concept";
        }

        if (!slide.visualContent) {
            slide.visualContent = {
                subtitle: "",
                items: [],
                analogyText: ""
            };
        }

        if (!Array.isArray(slide.visualContent.items)) {
            slide.visualContent.items = [];
        }

        if (typeof slide.hasCheckpoint !== "boolean") {
            slide.hasCheckpoint = false;
        }

        if (!slide.hasCheckpoint) {
            slide.checkpoint = null;
        }

        return slide;
    });

    // ============================================================
    // NORMALIZE ASSESSMENT
    // ============================================================

    lesson.assessmentQuestions =
        lesson.assessmentQuestions.map((q, index) => {
            if (!q || typeof q !== "object") {
                q = {};
            }

            if (!q.id) {
                q.id = `q${index + 1}`;
            }

            q.type = "mcq";

            if (!q.question) {
                q.question = `Question ${index + 1}`;
            }

            if (!Array.isArray(q.options)) {
                q.options = [
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
                ];
            }

            if (
                typeof q.correctAnswer !== "number" ||
                q.correctAnswer < 0 ||
                q.correctAnswer >= q.options.length
            ) {
                q.correctAnswer = 0;
            }

            if (!q.conceptTested) {
                q.conceptTested = "Lesson concept";
            }

            if (!q.explanation) {
                q.explanation =
                    "This answer is supported by the lesson content.";
            }

            return q;
        });

    // ============================================================
    // FINAL LESSON METADATA
    // ============================================================

    lesson.id = `custom-lesson-${Date.now()}`;

    lesson.level = level;
    lesson.language = language;
    lesson.duration = Number(duration) || 20;
    lesson.goal = goal;

    lesson.sourceType = "topic";
    lesson.sourceName = lesson.topicTitle;

    lesson.createdAt = new Date()
        .toISOString()
        .split("T")[0];

    // ============================================================
    // LOG RESULT
    // ============================================================

    console.log("====================================");
    console.log("✅ AI LESSON GENERATED");
    console.log("Topic:", lesson.topicTitle);
    console.log("Slides:", lesson.slides.length);
    console.log(
        "Modules:",
        lesson.modules.length
    );
    console.log(
        "Questions:",
        lesson.assessmentQuestions.length
    );
    console.log("Language:", lesson.language);
    console.log("====================================");

    return lesson;
}

module.exports = {
    generateAnswer
};