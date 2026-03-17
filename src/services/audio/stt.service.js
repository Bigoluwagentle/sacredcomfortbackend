import OpenAI from 'openai';
import { Readable } from 'stream';
import logger from '../../utils/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const speechToText = async (audioBuffer, mimeType = 'audio/webm') => {
  try {
    const blob = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });

    const transcription = await openai.audio.transcriptions.create({
      file: blob,
      model: 'whisper-1',
      language: 'en',
    });

    return transcription.text;
  } catch (error) {
    logger.error(`STT error: ${error.message}`);
    throw new Error('Speech to text conversion failed.');
  }
};