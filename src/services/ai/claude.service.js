import Anthropic from '@anthropic-ai/sdk';
import logger from '../../utils/logger.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const generateChatResponse = async ({
  systemPrompt,
  conversationHistory,
  userMessage,
  maxTokens = 1500,
}) => {
  try {
    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    });

    return response.content[0].text;
  } catch (error) {
    logger.error(`Claude API error: ${error.message}`);
    throw new Error('AI service is temporarily unavailable. Please try again.');
  }
};

export const extractMemoryFromConversation = async (conversationText) => {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Based on this conversation, extract key facts about the user to remember for future conversations. Return ONLY a valid JSON object with no extra text:

${conversationText}

Return this exact format:
{
  "personalContext": [],
  "recurringIssues": [],
  "progressNotes": [],
  "relationshipContext": []
}`,
        },
      ],
    });

    const text = response.content[0].text.trim();
    return JSON.parse(text);
  } catch (error) {
    logger.error(`Memory extraction error: ${error.message}`);
    return {
      personalContext: [],
      recurringIssues: [],
      progressNotes: [],
      relationshipContext: [],
    };
  }
};

export const detectEmotionsAndTopics = async (message) => {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Analyze this message and return ONLY a valid JSON object with no extra text:

"${message}"

Return this exact format:
{
  "emotions": ["anxiety"],
  "topics": ["work"],
  "distressLevel": 5,
  "crisisDetected": false
}

emotions must be from: anxiety, sadness, anger, joy, confusion, gratitude, fear, loneliness, hope, grief
topics must be from: relationships, health, work, faith, family, finances, loss, identity, addiction, purpose
distressLevel is 1-10
crisisDetected is true only if there are signs of suicidal ideation or self harm`,
        },
      ],
    });

    const text = response.content[0].text.trim();
    return JSON.parse(text);
  } catch (error) {
    logger.error(`Emotion detection error: ${error.message}`);
    return {
      emotions: [],
      topics: [],
      distressLevel: 0,
      crisisDetected: false,
    };
  }
};