import cron from 'node-cron';
import Memory from '../models/mongo/Memory.model.js';
import logger from '../utils/logger.js';

const memoryConsolidationJob = cron.schedule('0 0 * * 0', async () => {
  logger.info('Running memory consolidation job...');

  try {
    const memories = await Memory.find({
      $or: [
        { lastConsolidated: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        { lastConsolidated: null },
      ],
    });

    for (const memory of memories) {

      if (memory.personalContext.length > 20) {
        memory.personalContext = memory.personalContext.slice(-20);
      }
      if (memory.recurringIssues.length > 20) {
        memory.recurringIssues = memory.recurringIssues.slice(-20);
      }
      if (memory.progressNotes.length > 20) {
        memory.progressNotes = memory.progressNotes.slice(-20);
      }
      if (memory.relationshipContext.length > 20) {
        memory.relationshipContext = memory.relationshipContext.slice(-20);
      }

      memory.lastConsolidated = new Date();
      await memory.save();
    }

    logger.info(`Memory consolidation completed for ${memories.length} users.`);
  } catch (error) {
    logger.error(`Memory consolidation job error: ${error.message}`);
  }
}, { scheduled: false });

export default memoryConsolidationJob;