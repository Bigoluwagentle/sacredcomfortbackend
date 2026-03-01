import { CrisisResource } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const crisisResources = [

  {
    name: 'Nigeria Suicide Prevention Initiative',
    country: 'Nigeria',
    phoneNumber: '0800-000-0000',
    website: 'https://www.nspinigeria.org',
    description: 'Nigerian suicide prevention and mental health support',
    availableHours: '24/7',
    religion: null,
    isActive: true,
  },
  {
    name: 'ASUPE Mental Health Support Nigeria',
    country: 'Nigeria',
    phoneNumber: '+234-806-210-6493',
    website: null,
    description: 'Mental health support and crisis intervention in Nigeria',
    availableHours: '24/7',
    religion: null,
    isActive: true,
  },
  {
    name: 'Mentally Aware Nigeria Initiative (MANI)',
    country: 'Nigeria',
    phoneNumber: '+234-808-198-0779',
    website: 'https://www.mani.ng',
    description: 'Mental health awareness and crisis support in Nigeria',
    availableHours: 'Mon-Fri 9am-5pm',
    religion: null,
    isActive: true,
  },

  {
    name: 'International Association for Suicide Prevention',
    country: 'Global',
    phoneNumber: null,
    website: 'https://www.iasp.info/resources/Crisis_Centres',
    description: 'International crisis center directory',
    availableHours: '24/7',
    religion: null,
    isActive: true,
  },
  {
    name: 'Crisis Text Line',
    country: 'Global',
    phoneNumber: 'Text HOME to 741741',
    website: 'https://www.crisistextline.org',
    description: 'Free crisis counseling via text message',
    availableHours: '24/7',
    religion: null,
    isActive: true,
  },

  {
    name: 'Muslim Youth Helpline',
    country: 'Global',
    phoneNumber: '0808-808-2008',
    website: 'https://www.myh.org.uk',
    description: 'Faith-sensitive support for Muslims in crisis',
    availableHours: 'Fri-Sun 4pm-10pm',
    religion: 'Islam',
    isActive: true,
  },
  {
    name: 'Islamic Helpline',
    country: 'Global',
    phoneNumber: '+44-207-247-7474',
    website: 'https://www.islamichelpline.net',
    description: 'Muslim mental health and crisis support',
    availableHours: 'Daily 10am-10pm',
    religion: 'Islam',
    isActive: true,
  },

  {
    name: 'Focus on the Family Nigeria',
    country: 'Nigeria',
    phoneNumber: '+234-1-740-1000',
    website: 'https://www.focusnigeria.org',
    description: 'Christian family and crisis counseling',
    availableHours: 'Mon-Fri 9am-5pm',
    religion: 'Christianity',
    isActive: true,
  },
  {
    name: 'Christian Helplines',
    country: 'Global',
    phoneNumber: null,
    website: 'https://www.christianhelplines.com',
    description: 'Christian faith-based crisis support',
    availableHours: '24/7',
    religion: 'Christianity',
    isActive: true,
  },

  {
    name: 'National Suicide Prevention Lifeline',
    country: 'United States',
    phoneNumber: '988',
    website: 'https://www.988lifeline.org',
    description: 'Free and confidential support for people in distress',
    availableHours: '24/7',
    religion: null,
    isActive: true,
  },

  {
    name: 'Samaritans',
    country: 'United Kingdom',
    phoneNumber: '116 123',
    website: 'https://www.samaritans.org',
    description: 'Confidential support for people experiencing distress',
    availableHours: '24/7',
    religion: null,
    isActive: true,
  },
];

export const seedCrisisResources = async () => {
  try {
    const count = await CrisisResource.count();
    if (count > 0) {
      logger.info(`Crisis resources already seeded (${count} records). Skipping...`);
      return;
    }

    await CrisisResource.bulkCreate(crisisResources);
    logger.info(`✅ Seeded ${crisisResources.length} crisis resources successfully.`);
  } catch (error) {
    logger.error(`Crisis resource seeding error: ${error.message}`);
  }
};

export default seedCrisisResources;