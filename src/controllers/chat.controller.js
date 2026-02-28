import * as chatService from '../services/chat.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';


export const sendMessage = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Message cannot be empty.',
    });
  }

  const result = await chatService.processChat({
    user: req.user,
    religionFilter: req.religionFilter,
    message: message.trim(),
    conversationId,
  });

  successResponse(res, 200, 'Message processed successfully.', result);
});


export const getConversations = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await chatService.getUserConversations(
    req.user._id,
    page,
    limit
  );

  successResponse(res, 200, 'Conversations fetched successfully.', result);
});


export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await chatService.getConversationHistory(
    req.user._id,
    req.params.conversationId
  );

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found.',
    });
  }

  successResponse(res, 200, 'Conversation fetched successfully.', {
    conversation,
  });
});


export const archiveConversation = asyncHandler(async (req, res) => {
  const conversation = await chatService.archiveConversation(
    req.user._id,
    req.params.conversationId
  );

  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found.',
    });
  }

  successResponse(res, 200, 'Conversation archived successfully.', {
    conversation,
  });
});