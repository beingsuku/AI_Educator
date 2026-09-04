const fs = require("fs");
const crypto = require("crypto");
const pdfParse = require("pdf-parse");

const documents = new Map();

function chunkText(text, chunkSize = 1000, overlap = 150) {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(
      start + chunkSize,
      text.length
    );

    const chunk = text.slice(start, end).trim();

    if (chunk.length > 50) {
      chunks.push(chunk);
    }

    start = end - overlap;
  }

  return chunks;
}

async function ingestDocument(filePath, fileName) {

  const buffer = fs.readFileSync(filePath);

  let text = "";

  if (fileName.toLowerCase().endsWith(".pdf")) {

    const data = await pdfParse(buffer);

    text = data.text;

  } else if (
    fileName.toLowerCase().endsWith(".txt")
  ) {

    text = buffer.toString("utf8");

  } else {

    throw new Error(
      "Currently supported: PDF and TXT"
    );
  }

  if (!text.trim()) {
    throw new Error(
      "Could not extract text from document"
    );
  }

  const chunks = chunkText(text);

  const documentId = crypto
    .randomUUID();

  const records = chunks.map(
    (chunk, index) => ({
      id: `${documentId}-${index}`,
      documentId,
      chunkIndex: index,
      page: Math.floor(index / 3) + 1,
      text: chunk
    })
  );

  documents.set(
    documentId,
    records
  );

  console.log(
    `📚 Indexed ${records.length} chunks`
  );

  return {
    documentId,
    chunks: records.length
  };
}

function getDocument(documentId) {
  return documents.get(documentId) || [];
}

module.exports = {
  ingestDocument,
  getDocument
};