import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/mongo/User.model.js';
import Analytics from '../models/mongo/Analytics.model.js';
import Memory from '../models/mongo/Memory.model.js';
import logger from '../utils/logger.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value },
          ],
        });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = 'google';
            await user.save({ validateBeforeSave: false });
          }
          return done(null, user);
        }

        user = await User.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: 'google',
          isEmailVerified: true, 
          profilePicture: {
            url: profile.photos[0]?.value || '',
            publicId: '',
          },
          religiousPreference: 'Other',
        });

        await Analytics.create({ userId: user._id });
        await Memory.create({ userId: user._id });

        logger.info(`New user registered via Google: ${user.email}`);
        return done(null, user);
      } catch (error) {
        logger.error(`Google OAuth error: ${error.message}`);
        return done(error, null);
      }
    }
  )
);

export default passport;