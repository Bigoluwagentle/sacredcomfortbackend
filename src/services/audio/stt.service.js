import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import logger from '../../utils/logger.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const speechToText = async (audioBuffer, mimeType = 'audio/webm') => {
  try {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, `audio_${Date.now()}.webm`);
    fs.writeFileSync(tempFilePath, audioBuffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
      language: 'en',
    });

    fs.unlinkSync(tempFilePath);

    return transcription.text;
  } catch (error) {
    logger.error(`STT error: ${error.message}`);
    throw new Error('Speech to text conversion failed.');
  }
};