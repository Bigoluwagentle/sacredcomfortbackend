import Favorite from '../models/mongo/Favorite.model.js';
import Collection from '../models/mongo/Collection.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const saveFavorite = async ({ userId, verseId, sourceReligion, reference, text, savedFrom, conversationId }) => {

  const existing = await Favorite.findOne({ userId, verseId });
  if (existing) {
    throw new AppError('Verse already saved to favorites.', 400);
  }

  const favorite = await Favorite.create({
    userId,
    verseId,
    sourceReligion,
    reference,
    text,
    savedFrom: savedFrom || 'reading',
    relatedConversationId: conversationId,
  });

  return favorite;
};

export const getUserFavorites = async (userId, religion, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const query = religion ? { userId, sourceReligion: religion } : { userId };

  const favorites = await Favorite.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Favorite.countDocuments(query);
  return { favorites, total, page, totalPages: Math.ceil(total / limit) };
};

export const updateFavorite = async (userId, favoriteId, updateData) => {
  const allowedFields = ['personalNotes', 'tags'];
  const filteredData = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const favorite = await Favorite.findOneAndUpdate(
    { _id: favoriteId, userId },
    filteredData,
    { new: true }
  );

  if (!favorite) throw new AppError('Favorite not found.', 404);
  return favorite;
};

export const deleteFavorite = async (userId, favoriteId) => {
  const favorite = await Favorite.findOneAndDelete({ _id: favoriteId, userId });
  if (!favorite) throw new AppError('Favorite not found.', 404);
  return true;
};

export const createCollection = async ({ userId, name, description, colorTheme, isPrivate }) => {
  const collection = await Collection.create({
    userId,
    name,
    description,
    colorTheme: colorTheme || '#4A90A4',
    privacySetting: isPrivate ? 'private' : 'shareable',
  });
  return collection;
};

export const getUserCollections = async (userId) => {
  const collections = await Collection.find({ userId }).sort({ createdAt: -1 });
  return collections;
};

export const getCollection = async (userId, collectionId) => {
  const collection = await Collection.findOne({ _id: collectionId, userId });
  if (!collection) throw new AppError('Collection not found.', 404);
  return collection;
};

export const addToCollection = async (userId, collectionId, verseId) => {
  const collection = await Collection.findOne({ _id: collectionId, userId });
  if (!collection) throw new AppError('Collection not found.', 404);

  if (collection.verseIds.includes(verseId)) {
    throw new AppError('Verse already in collection.', 400);
  }

  collection.verseIds.push(verseId);
  await collection.save();
  return collection;
};

export const removeFromCollection = async (userId, collectionId, verseId) => {
  const collection = await Collection.findOne({ _id: collectionId, userId });
  if (!collection) throw new AppError('Collection not found.', 404);

  collection.verseIds = collection.verseIds.filter((id) => id !== verseId);
  await collection.save();
  return collection;
};

export const updateCollection = async (userId, collectionId, updateData) => {
  const collection = await Collection.findOneAndUpdate(
    { _id: collectionId, userId },
    updateData,
    { new: true }
  );
  if (!collection) throw new AppError('Collection not found.', 404);
  return collection;
};

export const deleteCollection = async (userId, collectionId) => {
  const collection = await Collection.findOneAndDelete({ _id: collectionId, userId });
  if (!collection) throw new AppError('Collection not found.', 404);
  return true;
};