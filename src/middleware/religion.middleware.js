import { RELIGIONS } from '../config/constants.js';

const religionFilter = (req, res, next) => {
  if (!req.user) return next();

  const { religiousPreference } = req.user;

  switch (religiousPreference) {
    case RELIGIONS.ISLAM:
      req.religionFilter = {
        allowedReligions: ['Islam'],
        showQuran: true,
        showHadith: true,
        showBible: false,
        showPhilosophy: false,
        aiReligionContext: 'Muslim',
        scriptureSource: 'Quran and Hadith only',
        prayerFormat: 'Islamic du\'a format with Arabic',
      };
      break;

    case RELIGIONS.CHRISTIANITY:
      req.religionFilter = {
        allowedReligions: ['Christianity'],
        showQuran: false,
        showHadith: false,
        showBible: true,
        showPhilosophy: false,
        aiReligionContext: 'Christian',
        scriptureSource: 'Bible only',
        prayerFormat: 'Christian prayer format',
      };
      break;

    case RELIGIONS.OTHER:
      req.religionFilter = {
        allowedReligions: ['Islam', 'Christianity', 'Other'],
        showQuran: true,
        showHadith: true,
        showBible: true,
        showPhilosophy: true,
        aiReligionContext: 'Spiritual but not religious',
        scriptureSource: 'Quran, Bible, and Philosophy',
        prayerFormat: 'General meditation and reflection format',
      };
      break;

    default:
      req.religionFilter = {
        allowedReligions: [],
        showQuran: false,
        showHadith: false,
        showBible: false,
        showPhilosophy: false,
        aiReligionContext: 'General',
        scriptureSource: 'None',
        prayerFormat: 'General',
      };
  }

  next();
};

export default religionFilter;