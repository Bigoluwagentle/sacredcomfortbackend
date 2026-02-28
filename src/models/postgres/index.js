import sequelize from '../../config/db.postgres.js';
import Quran from './Quran.model.js';
import Hadith from './Hadith.model.js';
import Bible from './Bible.model.js';
import Philosophy from './Philosophy.model.js';
import Therapist from './Therapist.model.js';
import TherapistAvailability from './TherapistAvailability.model.js';
import AudioFile from './AudioFile.model.js';
import CrisisResource from './CrisisResource.model.js';
import Dua from './Dua.model.js';
import PastoralPrayer from './PastoralPrayer.model.js';

Therapist.hasMany(TherapistAvailability, { foreignKey: 'therapistId', as: 'availability' });
TherapistAvailability.belongsTo(Therapist, { foreignKey: 'therapistId' });

Quran.hasMany(AudioFile, { foreignKey: 'verseId', constraints: false, scope: { religion: 'Islam' } });
Bible.hasMany(AudioFile, { foreignKey: 'verseId', constraints: false, scope: { religion: 'Christianity' } });

export {
  sequelize,
  Quran,
  Hadith,
  Bible,
  Philosophy,
  Therapist,
  TherapistAvailability,
  AudioFile,
  CrisisResource,
  Dua,
  PastoralPrayer,
};