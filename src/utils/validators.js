import Joi from 'joi';
import { RELIGIONS } from '../config/constants.js';

export const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name cannot exceed 50 characters',
    'any.required': 'Full name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  religiousPreference: Joi.string()
    .valid(...Object.values(RELIGIONS))
    .required()
    .messages({
      'any.only': 'Religious preference must be Islam, Christianity, or Other',
      'any.required': 'Religious preference is required',
    }),
  preferredLanguage: Joi.string().default('en'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'New password is required',
  }),
});

export const verifyOTPSchema = Joi.object({
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be exactly 6 digits',
    'any.required': 'OTP is required',
  }),
});

export const deleteAccountSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is required to delete your account',
  }),
});