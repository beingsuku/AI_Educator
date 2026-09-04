const { getDocument } = require("./ingest");

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function similarity(query, text) {

  const queryWords = new Set(
    tokenize(query)
  );

  const textWords = tokenize(text);

  let matches = 0;

  for (const word of textWords) {
    if (queryWords.has(word)) {
      matches++;
    }
  }

  if (queryWords.size === 0) {
    return 0;
  }

  return matches / queryWords.size;
}

async function retrieveContext(
  question,
  documentId,
  topK = 5
) {

  const chunks = getDocument(documentId);

  if (!chunks.length) {
    return [];
  }

  const ranked = chunks
    .map(chunk => ({
      ...chunk,
      score: similarity(
        question,
        chunk.text
      )
    }))
    .sort(
      (a, b) => b.score - a.score
    );

  return ranked
    .slice(0, topK)
    .filter(item => item.score > 0);
}

module.exports = {
  retrieveContext
};