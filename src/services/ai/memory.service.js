import Memory from '../../models/mongo/Memory.model.js';
import { extractMemoryFromConversation } from './claude.service.js';
import { buildMemorySummary } from './prompt.service.js';
import logger from '../../utils/logger.js';
import { PERSISTENT_ISSUE_THRESHOLD } from '../../config/constants.js';

export const loadUserMemory = async (userId) => {
  try {
    let memory = await Memory.findOne({ userId });

    if (!memory) {
      memory = await Memory.create({ userId });
    }

    return {
      memory,
      memorySummary: buildMemorySummary(memory),
      recurringIssues: memory.recurringIssues || [],
    };
  } catch (error) {
    logger.error(`Memory load error: ${error.message}`);
    return { memory: null, memorySummary: null, recurringIssues: [] };
  }
};

export const updateUserMemory = async (userId, conversationId, messages) => {
  try {
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const extracted = await extractMemoryFromConversation(conversationText);

    let memory = await Memory.findOne({ userId });
    if (!memory) {
      memory = await Memory.create({ userId });
    }

    const mergeUnique = (existing, newItems) => {
      const combined = [...existing, ...newItems];
      return [...new Set(combined)];
    };

    memory.personalContext = mergeUnique(
      memory.personalContext,
      extracted.personalContext
    );
    memory.recurringIssues = mergeUnique(
      memory.recurringIssues,
      extracted.recurringIssues
    );
    memory.progressNotes = mergeUnique(
      memory.progressNotes,
      extracted.progressNotes
    );
    memory.relationshipContext = mergeUnique(
      memory.relationshipContext,
      extracted.relationshipContext
    );

    if (!memory.conversationIds.includes(conversationId)) {
      memory.conversationIds.push(conversationId);
    }

    await memory.save();
    return memory;
  } catch (error) {
    logger.error(`Memory update error: ${error.message}`);
  }
};

export const updateTopicPatterns = async (userId, conversationId, topics) => {
  try {
    const memory = await Memory.findOne({ userId });
    if (!memory) return;

    topics.forEach((topic) => {
      const existing = memory.topicPatterns.find((t) => t.topic === topic);

      if (existing) {
        existing.frequency += 1;
        existing.lastDetected = new Date();
        existing.conversationIds.push(conversationId);
      } else {
        memory.topicPatterns.push({
          topic,
          frequency: 1,
          lastDetected: new Date(),
          conversationIds: [conversationId],
        });
      }
    });

    await memory.save();

    const persistentTopics = memory.topicPatterns.filter(
      (t) => t.frequency >= PERSISTENT_ISSUE_THRESHOLD
    );

    return persistentTopics.map((t) => t.topic);
  } catch (error) {
    logger.error(`Topic pattern update error: ${error.message}`);
    return [];
  }
};

export const getUserMemoryEntries = async (userId) => {
  const memory = await Memory.findOne({ userId });
  if (!memory) return null;
  return memory;
};

export const deleteMemoryEntry = async (userId, memoryType, index) => {
  const memory = await Memory.findOne({ userId });
  if (!memory) return null;

  const validTypes = [
    'personalContext',
    'recurringIssues',
    'progressNotes',
    'relationshipContext',
  ];

  if (!validTypes.includes(memoryType)) {
    throw new Error('Invalid memory type.');
  }

  memory[memoryType].splice(index, 1);
  await memory.save();
  return memory;
};

export const clearAllMemory = async (userId) => {
  const memory = await Memory.findOne({ userId });
  if (!memory) return null;

  memory.personalContext = [];
  memory.recurringIssues = [];
  memory.progressNotes = [];
  memory.relationshipContext = [];
  memory.topicPatterns = [];
  memory.emotionalPatterns = [];

  await memory.save();
  return memory;
};