import CrisisLog from '../models/mongo/CrisisLog.model.js';
import { CrisisResource } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
  'self harm', 'self-harm', 'hurt myself', 'cutting', 'overdose',
  'no reason to live', 'better off dead', 'can\'t go on', 'give up on life',
];

export const detectCrisis = (message) => {
  const lowerMessage = message.toLowerCase();
  const triggeredKeywords = CRISIS_KEYWORDS.filter((keyword) =>
    lowerMessage.includes(keyword)
  );
  return {
    crisisDetected: triggeredKeywords.length > 0,
    triggerKeywords: triggeredKeywords,
  };
};

export const getCrisisResources = async (country = 'Global') => {
  try {
    const resources = await CrisisResource.findAll({
      where: { isActive: true },
      limit: 5,
    });
    return resources;
  } catch (error) {
    logger.error(`Crisis resources error: ${error.message}`);
    return [];
  }
};

export const logCrisisEvent = async ({
  userId,
  conversationId,
  triggerKeywords,
  severity = 'medium',
  resourcesProvided = [],
}) => {
  try {
    await CrisisLog.create({
      userId,
      conversationId,
      triggerKeywords,
      severity,
      resourcesProvided,
      therapyRecommended: true,
    });
  } catch (error) {
    logger.error(`Crisis log error: ${error.message}`);
  }
};

export const buildCrisisResponse = (resources) => {
  const resourceList = resources.length > 0
    ? resources.map((r) => `• ${r.name}: ${r.phoneNumber || r.website}`).join('\n')
    : '• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/';

  return `\n\n---\n🆘 **If you are in crisis, please reach out immediately:**\n${resourceList}\n\nYou are not alone. Please speak to someone who can help right now.`;
};