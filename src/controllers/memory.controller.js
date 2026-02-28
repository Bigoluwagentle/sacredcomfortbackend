import * as memoryService from '../services/ai/memory.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const getMyMemory = asyncHandler(async (req, res) => {
  const memory = await memoryService.getUserMemoryEntries(req.user._id);
  successResponse(res, 200, 'Memory entries fetched successfully.', { memory });
});

export const deleteMemoryEntry = asyncHandler(async (req, res) => {
  const { memoryType, index } = req.params;
  const memory = await memoryService.deleteMemoryEntry(
    req.user._id,
    memoryType,
    Number(index)
  );
  successResponse(res, 200, 'Memory entry deleted successfully.', { memory });
});

export const clearAllMemory = asyncHandler(async (req, res) => {
  await memoryService.clearAllMemory(req.user._id);
  successResponse(res, 200, 'All memory entries cleared successfully.');
});