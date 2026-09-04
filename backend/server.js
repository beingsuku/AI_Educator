require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { ingestDocument } = require("./rag/ingest");
const { retrieveContext } = require("./rag/retrieve");
const { generateAnswer } = require("./rag/generate");
const {
  adaptiveTeach,
  generateAdaptiveLesson
} = require("./services/adaptiveTeacher");

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "AdaptiveAI RAG Backend",
    status: "running"
  });
});

// ============================================================
// UPLOAD + INGEST DOCUMENT
// ============================================================

app.post("/api/rag/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    console.log("📄 Document received:", req.file.originalname);

    const result = await ingestDocument(
      req.file.path,
      req.file.originalname
    );

    // Remove temporary uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Document successfully indexed",
      documentId: result.documentId,
      fileName: req.file.originalname,
      chunks: result.chunks
    });

  } catch (error) {
    console.error("❌ RAG upload error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// ASK QUESTION
// ============================================================

app.post("/api/rag/ask", async (req, res) => {
  try {
    const {
      question,
      documentId,
      level = "Intermediate",
      language = "English"
    } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required"
      });
    }

    console.log("🧠 RAG question:", question);

    const context = await retrieveContext(
      question,
      documentId
    );

    const answer = await generateAnswer({
      question,
      context,
      level,
      language
    });

    res.json({
      success: true,
      answer,
      sources: context.map(item => ({
        page: item.page,
        text: item.text
      }))
    });

  } catch (error) {
    console.error("❌ RAG answer error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================
// GENERATE LESSON FROM DOCUMENT
// ============================================================

app.post("/api/rag/lesson", async (req, res) => {
  try {
    const {
      documentId,
      topic,
      level,
      language,
      duration,
      goal
    } = req.body;

    const question = `
Create a complete educational lesson about:

${topic || "the uploaded document"}

Learner level: ${level}
Language: ${language}
Duration: ${duration} minutes
Goal: ${goal}

Use only information supported by the uploaded document.
`;

    const context = await retrieveContext(
      question,
      documentId
    );

    const lesson = await generateAnswer({
      question,
      context,
      level,
      language,
      lessonMode: true,
      duration,
      goal
    });

    res.json({
      success: true,
      lesson,
      sources: context
    });

  } catch (error) {
    console.error("❌ Lesson generation error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// ============================================================
// ADAPTIVE AI TEACHER
// ============================================================

app.post("/api/teacher/teach", async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required"
      });
    }

    console.log("👩‍🏫 Adaptive Teacher:");
    console.log("Subject:", subject);
    console.log("Topic:", topic);
    console.log("Level:", level);
    console.log("Language:", language);
    console.log("Difficulty:", difficulty);

    const result = await adaptiveTeach({
      question,
      documentId,
      subject,
      topic,
      level,
      language,
      difficulty,
      previousScore,
      recentMistakes,
      learningStyle
    });

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error("❌ Adaptive Teacher error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// ============================================================
// DYNAMIC AI LESSON GENERATION
// ============================================================

app.post("/api/teacher/lesson", async (req, res) => {
  try {
    const {
      documentId,
      subject = "General",
      topic = "General",
      level = "Intermediate",
      language = "English",
      duration = 30,
      goal = "Understand the topic",
      difficulty = "medium",
      learningStyle = "visual"
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: "Topic is required"
      });
    }

    console.log("📚 Generating dynamic lesson:");
    console.log("Subject:", subject);
    console.log("Topic:", topic);
    console.log("Level:", level);
    console.log("Language:", language);

    const lesson = await generateAdaptiveLesson({
      documentId,
      subject,
      topic,
      level,
      language,
      duration,
      goal,
      difficulty,
      learningStyle
    });

    res.json({
      success: true,
      ...lesson
    });

  } catch (error) {
    console.error("❌ Dynamic lesson generation error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log("====================================");
  console.log(" AdaptiveAI Teacher RAG Backend");
  console.log("====================================");
  console.log(` Server: http://localhost:${PORT}`);
  console.log(" RAG: ENABLED");
  console.log("====================================");
});