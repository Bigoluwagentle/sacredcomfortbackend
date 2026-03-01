import { ElevenLabsClient } from 'elevenlabs';
import logger from '../../utils/logger.js';

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const VOICE_IDS = {
  default: 'EXAVITQu4vr4xnSDxMaL', 
  male: 'TxGEqnHWrfWFTfGW9XjX',     
  arabic: 'EXAVITQu4vr4xnSDxMaL',   
};

export const textToSpeech = async (text, voiceId = VOICE_IDS.default) => {
  try {
    const audioStream = await elevenlabs.generate({
      voice: voiceId,
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true,
      },
    });

    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    const base64Audio = audioBuffer.toString('base64');
    return base64Audio;
  } catch (error) {
    logger.error(`TTS error: ${error.message}`);
    throw new Error('Text to speech conversion failed.');
  }
};

export const getAvailableVoices = async () => {
  try {
    const voices = await elevenlabs.voices.getAll();
    return voices;
  } catch (error) {
    logger.error(`Get voices error: ${error.message}`);
    return [];
  }
};