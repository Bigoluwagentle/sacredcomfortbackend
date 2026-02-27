import sgMail from '@sendgrid/mail';
import logger from '../../utils/logger.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await sgMail.send({
      to,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error(`Email failed to ${to}: ${error.message}`);
    throw new Error('Email could not be sent. Please try again later.');
  }
};

export const sendPasswordResetEmail = async (email, resetToken, fullName) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4A90A4;">Sacred Comfort</h2>
      <p>Dear ${fullName},</p>
      <p>You requested a password reset. Click the button below to reset your password.</p>
      <p>This link expires in <strong>10 minutes</strong>.</p>
      <a href="${resetUrl}" 
         style="background-color: #4A90A4; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">
        Reset My Password
      </a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Blessings,<br/>The Sacred Comfort Team</p>
    </div>
  `;

  await sendEmail({ to: email, subject: 'Password Reset Request - Sacred Comfort', html });
};

export const sendWelcomeEmail = async (email, fullName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4A90A4;">Welcome to Sacred Comfort 🕌</h2>
      <p>Dear ${fullName},</p>
      <p>We are so glad you joined us. Sacred Comfort is here to provide you with 
         spiritual support, wisdom from your sacred texts, and a safe space to reflect.</p>
      <p>Here is what you can do:</p>
      <ul>
        <li>Chat with our AI for spiritual guidance</li>
        <li>Explore verses from your sacred texts</li>
        <li>Generate personalized prayer points</li>
        <li>Book a session with a licensed therapist</li>
      </ul>
      <p>Blessings,<br/>The Sacred Comfort Team</p>
    </div>
  `;

  await sendEmail({ to: email, subject: 'Welcome to Sacred Comfort', html });
};

export const sendVerificationOTPEmail = async (email, fullName, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4A90A4;">Sacred Comfort - Email Verification</h2>
      <p>Dear ${fullName},</p>
      <p>Thank you for registering. Use the OTP below to verify your email address.</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; 
                  border-radius: 8px; margin: 20px 0;">
        <h1 style="color: #4A90A4; letter-spacing: 8px; font-size: 36px;">${otp}</h1>
      </div>
      <p>This code expires in <strong>10 minutes</strong>.</p>
      <p>If you did not create an account, please ignore this email.</p>
      <p>Blessings,<br/>The Sacred Comfort Team</p>
    </div>
  `;

  await sendEmail({ to: email, subject: 'Verify Your Email - Sacred Comfort', html });
};

export default sendEmail;

