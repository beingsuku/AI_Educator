const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});


async function generateAnswer({
  question,
  context,
  level,
  language,
  lessonMode = false,
  duration,
  goal
}) {
  const contextText = context
    .map(
      (item, index) =>
        `[Source ${index + 1}]\n${item.text}`
    )
    .join("\n\n");

  const systemPrompt = `
You are AdaptiveAI Teacher.

You are an intelligent human-like educational AI teacher.

IMPORTANT RULES:

1. Use the provided CONTEXT as the primary source.
2. Do not invent facts that contradict the CONTEXT.
3. Adapt explanations to the learner level.
4. Respond in ${language}.
5. Make the teaching specific to the requested topic.
6. Avoid generic repeated slides.
7. Each slide must teach a different part of the topic.
`;

  let userPrompt;

  if (lessonMode) {
    userPrompt = `
Create a complete, topic-specific educational lesson.

Duration:
${duration} minutes

Learning goal:
${goal}

The lesson MUST contain multiple slides.

Create approximately 6-12 slides depending on the complexity of the topic.

Every slide must have DIFFERENT educational content.

Include where appropriate:

- Topic introduction
- Core concepts
- Important definitions
- Step-by-step explanation
- Examples
- Real-world applications
- Visual explanation
- Common mistakes or misconceptions
- Practice/checkpoint question
- Summary

Do NOT create generic slides such as:
"Understand the concept"
"Connect it with examples"
"Apply what you learned"

Instead, every slide must specifically refer to and teach the requested topic.

Return ONLY valid JSON.

Use exactly this structure:

{
  "lessonTitle": "string",
  "learningObjectives": [
    "string"
  ],
  "slides": [
    {
      "slideNumber": 1,
      "title": "string",
      "narrationText": "string",
      "keyPoints": [
        "string"
      ],
      "example": "string",
      "visualType": "diagram",
      "visualContent": {
        "subtitle": "string",
        "formula": "string",
        "codeSnippet": "string",
        "items": [
          "string"
        ],
        "analogyText": "string"
      },
      "hasCheckpoint": false,
      "checkpoint": {
        "question": "string",
        "options": [
          "string"
        ],
        "correctAnswer": "string",
        "explanation": "string"
      }
    }
  ],
  "finalSummary": [
    "string"
  ],
  "assessmentQuestions": [
    {
      "question": "string",
      "options": [
        "string"
      ],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}

IMPORTANT:

- Generate enough slides for the requested duration.
- A 30-minute lesson should normally have around 8-12 slides.
- A shorter lesson can have fewer.
- Complex topics may require more slides.
- Make examples specific to the topic.
- Make checkpoint questions specific to the topic.
- Make visualContent specific to the topic.
- Do not repeat the same explanation across slides.
- Use the retrieved context as the factual foundation.

Retrieved context:

${contextText}

Requested lesson:

${question}
`;
  } else {
    userPrompt = `
Student question:

${question}

Answer the student using the retrieved context.

Retrieved context:

${contextText}
`;
  }

  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",

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

    temperature: 0.4,

    response_format: lessonMode
      ? { type: "json_object" }
      : undefined
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateAnswer
};