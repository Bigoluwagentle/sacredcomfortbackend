import { searchScriptureByTags, keywordSearchScripture, getDailyVerse } from '../services/scripture/search.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { Quran, Bible, Hadith, Philosophy } from '../models/postgres/index.js';

export const searchScripture = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ success: false, message: 'Search query is required.' });
  }

  const results = await keywordSearchScripture(q, req.religionFilter);
  successResponse(res, 200, 'Search results fetched successfully.', { results });
});

export const searchByTags = asyncHandler(async (req, res) => {
  const emotions = req.query.emotions ? req.query.emotions.split(',') : [];
  const topics = req.query.topics ? req.query.topics.split(',') : [];

  const results = await searchScriptureByTags({
    emotions,
    topics,
    religionFilter: req.religionFilter,
    limit: 10,
  });

  successResponse(res, 200, 'Scripture fetched successfully.', { results });
});

export const getDailyVerseHandler = asyncHandler(async (req, res) => {
  const verse = await getDailyVerse(req.religionFilter);

  if (!verse) {
    return res.status(404).json({
      success: false,
      message: 'No verse available. Please add scripture to the database.',
    });
  }

  successResponse(res, 200, 'Daily verse fetched successfully.', { verse });
});

export const getQuranVerse = asyncHandler(async (req, res) => {
  if (!req.religionFilter.showQuran) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This content is not available for your religious preference.',
    });
  }

  const verse = await Quran.findOne({
    where: {
      surahNumber: req.params.surah,
      ayahNumber: req.params.ayah,
    },
  });

  if (!verse) {
    return res.status(404).json({ success: false, message: 'Verse not found.' });
  }

  successResponse(res, 200, 'Verse fetched successfully.', { verse });
});

export const getBibleVerse = asyncHandler(async (req, res) => {
  if (!req.religionFilter.showBible) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This content is not available for your religious preference.',
    });
  }

  const verse = await Bible.findOne({
    where: {
      bookName: req.params.book,
      chapterNumber: req.params.chapter,
      verseNumber: req.params.verse,
    },
  });

  if (!verse) {
    return res.status(404).json({ success: false, message: 'Verse not found.' });
  }

  successResponse(res, 200, 'Verse fetched successfully.', { verse });
});