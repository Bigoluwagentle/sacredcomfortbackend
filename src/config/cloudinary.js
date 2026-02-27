import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sacred-comfort/profile-pictures',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
});


const audioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sacred-comfort/audio',
    allowed_formats: ['mp3', 'wav', 'ogg'],
    resource_type: 'video', 
  },
});

export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
});

export const deleteFile = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;