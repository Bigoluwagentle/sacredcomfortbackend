import OpenAI from 'openai';
import { Quran, Bible, Hadith, Philosophy } from '../../models/postgres/index.js';
import logger from '../../utils/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    logger.error(`Embedding generation error: ${error.message}`);
    return null;
  }
};

export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

export const semanticSearch = async (query, religionFilter, limit = 5) => {
  try {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) return [];

    const results = [];

    if (religionFilter.showQuran) {
      const verses = await Quran.findAll({
        where: {
          embeddingVector: { $ne: [] },
        },
        limit: 100,
      });

      verses.forEach((verse) => {
        if (verse.embeddingVector && verse.embeddingVector.length > 0) {
          const similarity = cosineSimilarity(queryEmbedding, verse.embeddingVector);
          results.push({
            similarity,
            reference: `${verse.surahNameEnglish} ${verse.surahNumber}:${verse.ayahNumber}`,
            text: verse.translationEnglishSahih,
            source: 'Quran',
            religion: 'Islam',
          });
        }
      });
    }

    if (religionFilter.showBible) {
      const verses = await Bible.findAll({
        limit: 100,
      });

      verses.forEach((verse) => {
        if (verse.embeddingVector && verse.embeddingVector.length > 0) {
          const similarity = cosineSimilarity(queryEmbedding, verse.embeddingVector);
          results.push({
            similarity,
            reference: `${verse.bookName} ${verse.chapterNumber}:${verse.verseNumber}`,
            text: verse.textNIV || verse.textKJV,
            source: 'Bible',
            religion: 'Christianity',
          });
        }
      });
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

  } catch (error) {
    logger.error(`Semantic search error: ${error.message}`);
    return [];
  }
};

export const updateVerseEmbedding = async (model, verseId, text) => {
  try {
    const embedding = await generateEmbedding(text);
    if (!embedding) return false;

    await model.update(
      { embeddingVector: embedding },
      { where: { id: verseId } }
    );
    return true;
  } catch (error) {
    logger.error(`Embedding update error: ${error.message}`);
    return false;
  }
};