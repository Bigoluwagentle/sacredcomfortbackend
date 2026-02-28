import * as favoritesService from '../services/favorites.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const saveFavorite = asyncHandler(async (req, res) => {
  const favorite = await favoritesService.saveFavorite({
    userId: req.user._id,
    ...req.body,
  });
  successResponse(res, 201, 'Verse saved to favorites.', { favorite });
});

export const getMyFavorites = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const religion = req.query.religion;

  const result = await favoritesService.getUserFavorites(
    req.user._id,
    religion,
    page,
    limit
  );
  successResponse(res, 200, 'Favorites fetched successfully.', result);
});

export const updateFavorite = asyncHandler(async (req, res) => {
  const favorite = await favoritesService.updateFavorite(
    req.user._id,
    req.params.favoriteId,
    req.body
  );
  successResponse(res, 200, 'Favorite updated successfully.', { favorite });
});

export const deleteFavorite = asyncHandler(async (req, res) => {
  await favoritesService.deleteFavorite(req.user._id, req.params.favoriteId);
  successResponse(res, 200, 'Favorite removed successfully.');
});

export const createCollection = asyncHandler(async (req, res) => {
  const collection = await favoritesService.createCollection({
    userId: req.user._id,
    ...req.body,
  });
  successResponse(res, 201, 'Collection created successfully.', { collection });
});

export const getMyCollections = asyncHandler(async (req, res) => {
  const collections = await favoritesService.getUserCollections(req.user._id);
  successResponse(res, 200, 'Collections fetched successfully.', { collections });
});

export const getCollection = asyncHandler(async (req, res) => {
  const collection = await favoritesService.getCollection(
    req.user._id,
    req.params.collectionId
  );
  successResponse(res, 200, 'Collection fetched successfully.', { collection });
});

export const addToCollection = asyncHandler(async (req, res) => {
  const collection = await favoritesService.addToCollection(
    req.user._id,
    req.params.collectionId,
    req.body.verseId
  );
  successResponse(res, 200, 'Verse added to collection.', { collection });
});

export const removeFromCollection = asyncHandler(async (req, res) => {
  const collection = await favoritesService.removeFromCollection(
    req.user._id,
    req.params.collectionId,
    req.params.verseId
  );
  successResponse(res, 200, 'Verse removed from collection.', { collection });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const collection = await favoritesService.updateCollection(
    req.user._id,
    req.params.collectionId,
    req.body
  );
  successResponse(res, 200, 'Collection updated successfully.', { collection });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  await favoritesService.deleteCollection(req.user._id, req.params.collectionId);
  successResponse(res, 200, 'Collection deleted successfully.');
});