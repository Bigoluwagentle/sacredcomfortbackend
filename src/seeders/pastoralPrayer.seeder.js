import { PastoralPrayer } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const pastoralPrayers = [
  {
    pastorName: 'Pastor E.A Adeboye',
    ministryName: 'RCCG',
    title: 'Prayer for Financial Breakthrough',
    prayerPoints: [
      'Father Lord, every embargo on my finances is destroyed by fire today in Jesus name',
      'Every spirit of poverty assigned against my destiny, die now in Jesus name',
      'Lord, open the windows of heaven and pour out blessings I have no room to contain',
      'Every witchcraft attack on my finances is nullified by the blood of Jesus',
      'I receive divine ideas and supernatural wisdom to generate wealth in Jesus name',
    ],
    declarations: [
      'I am the head and not the tail',
      'I am above only and not beneath',
      'God supplies all my needs according to His riches in glory',
      'The blessing of the Lord makes rich and adds no sorrow',
    ],
    scriptureReferences: ['Deuteronomy 28:12', 'Malachi 3:10', 'Philippians 4:19'],
    themeTags: ['finances', 'breakthrough', 'provision', 'work'],
    emotionTags: ['anxiety', 'fear', 'sadness'],
  },
  {
    pastorName: 'Pastor David Oyedepo',
    ministryName: 'Winners Chapel',
    title: 'Prayer for Healing and Divine Health',
    prayerPoints: [
      'By the stripes of Jesus I am healed, every sickness in my body dies now',
      'Father, let Your healing power flow through every cell of my body right now',
      'I command every organ in my body to function perfectly in Jesus name',
      'Every root of sickness and disease is uprooted from my body by fire',
      'I receive my healing in full manifestation today in Jesus name',
    ],
    declarations: [
      'I am redeemed from sickness and disease',
      'Jesus bore my infirmities and carried my diseases',
      'By His stripes I am healed',
      'I shall live and not die to declare the works of God',
    ],
    scriptureReferences: ['Isaiah 53:5', 'Matthew 8:17', 'Psalm 118:17', '1 Peter 2:24'],
    themeTags: ['health', 'healing', 'faith'],
    emotionTags: ['fear', 'sadness', 'anxiety'],
  },
  {
    pastorName: 'Pastor W.F Kumuyi',
    ministryName: 'Deeper Life',
    title: 'Prayer for Spiritual Strength and Faith',
    prayerPoints: [
      'Lord, strengthen my faith and let it not waver in times of trial',
      'Father, fill me with Your Holy Spirit and power to overcome every temptation',
      'Let Your word be a lamp to my feet and a light to my path',
      'Lord, help me to put on the full armor of God daily',
      'Let my walk with You be deeper and more consistent every day',
    ],
    declarations: [
      'I can do all things through Christ who strengthens me',
      'Greater is He that is in me than he that is in the world',
      'I am more than a conqueror through Christ',
      'No weapon formed against me shall prosper',
    ],
    scriptureReferences: ['Philippians 4:13', '1 John 4:4', 'Romans 8:37', 'Isaiah 54:17'],
    themeTags: ['faith', 'strength', 'spiritual growth'],
    emotionTags: ['confusion', 'fear', 'anxiety'],
  },
  {
    pastorName: 'Pastor Chris Oyakhilome',
    ministryName: 'Christ Embassy',
    title: 'Prayer for Favour and Open Doors',
    prayerPoints: [
      'Father, I thank You for the spirit of favour that surrounds me like a shield',
      'Every closed door in my life is opened now by the mighty hand of God',
      'I declare that I have supernatural favour with God and man',
      'Lord, connect me to the right people at the right time for my destiny',
      'I walk in divine acceleration and supernatural speed in Jesus name',
    ],
    declarations: [
      'Goodness and mercy follow me everywhere I go',
      'I am highly favoured of God',
      'My path shines brighter and brighter unto the perfect day',
      'I operate in realms of endless possibilities',
    ],
    scriptureReferences: ['Psalm 5:12', 'Proverbs 4:18', 'Luke 1:28', 'Genesis 39:21'],
    themeTags: ['favour', 'open doors', 'destiny', 'relationships'],
    emotionTags: ['sadness', 'anxiety', 'hope'],
  },
  {
    pastorName: 'Pastor E.A Adeboye',
    ministryName: 'RCCG',
    title: 'Prayer for Marriage and Family',
    prayerPoints: [
      'Father, let Your peace reign in my home and family in Jesus name',
      'Every spirit of division and strife in my marriage is destroyed by fire',
      'Lord, restore love, trust and unity in my family',
      'I cover my children with the blood of Jesus against every evil assignment',
      'Let my home be a heaven on earth in Jesus name',
    ],
    declarations: [
      'As for me and my house we will serve the Lord',
      'My marriage is blessed and protected by God',
      'My children are taught of the Lord and great is their peace',
      'Love never fails in my home',
    ],
    scriptureReferences: ['Joshua 24:15', 'Isaiah 54:13', '1 Corinthians 13:8', 'Psalm 128'],
    themeTags: ['marriage', 'family', 'relationships', 'children'],
    emotionTags: ['sadness', 'anger', 'loneliness', 'anxiety'],
  },
  {
    pastorName: 'Pastor David Oyedepo',
    ministryName: 'Winners Chapel',
    title: 'Prayer Against Depression and Sadness',
    prayerPoints: [
      'Father, the spirit of heaviness is lifted off my life right now in Jesus name',
      'I receive the garment of praise in exchange for the spirit of despair',
      'Every root of depression and sadness in my life is destroyed by fire',
      'Lord, restore the joy of Your salvation unto me',
      'I declare that the joy of the Lord is my strength today',
    ],
    declarations: [
      'This is the day the Lord has made, I will rejoice and be glad in it',
      'God has not given me a spirit of fear but of power, love and a sound mind',
      'I have the mind of Christ',
      'I am surrounded by songs of deliverance',
    ],
    scriptureReferences: ['Isaiah 61:3', 'Psalm 51:12', 'Nehemiah 8:10', '2 Timothy 1:7'],
    themeTags: ['depression', 'joy', 'mental health', 'sadness'],
    emotionTags: ['sadness', 'grief', 'loneliness', 'fear'],
  },
  {
    pastorName: 'Pastor W.F Kumuyi',
    ministryName: 'Deeper Life',
    title: 'Prayer for Repentance and Forgiveness',
    prayerPoints: [
      'Lord, create in me a clean heart and renew a right spirit within me',
      'Father, forgive me of every known and unknown sin in Jesus name',
      'I receive Your mercy and grace today, wash me with Your precious blood',
      'Lord, help me to turn away completely from every sinful habit',
      'Let Your Holy Spirit convict and guide me in all righteousness',
    ],
    declarations: [
      'If I confess my sins God is faithful and just to forgive me',
      'There is therefore now no condemnation to those in Christ Jesus',
      'Old things have passed away, all things have become new',
      'I am washed, I am sanctified, I am justified in Jesus name',
    ],
    scriptureReferences: ['Psalm 51:10', '1 John 1:9', 'Romans 8:1', '2 Corinthians 5:17'],
    themeTags: ['forgiveness', 'repentance', 'mercy', 'addiction'],
    emotionTags: ['guilt', 'sadness', 'confusion'],
  },
  {
    pastorName: 'Pastor Chris Oyakhilome',
    ministryName: 'Christ Embassy',
    title: 'Prayer for Career and Purpose',
    prayerPoints: [
      'Father, I thank You for the gifts and talents You placed inside me',
      'Lord, align my career and work with Your divine purpose for my life',
      'I receive supernatural wisdom and excellence to excel in my field',
      'Every obstacle blocking my career advancement is removed now',
      'I declare that I am fulfilling my God-given destiny in Jesus name',
    ],
    declarations: [
      'I am created for signs and wonders',
      'My work is excellent and brings glory to God',
      'I have the wisdom of God working mightily in me',
      'I am moving forward and making progress every day',
    ],
    scriptureReferences: ['Jeremiah 29:11', 'Proverbs 22:29', 'Colossians 3:23', 'Psalm 1:3'],
    themeTags: ['career', 'work', 'purpose', 'identity'],
    emotionTags: ['confusion', 'anxiety', 'sadness'],
  },
  {
    pastorName: 'Pastor E.A Adeboye',
    ministryName: 'RCCG',
    title: 'Prayer for Protection',
    prayerPoints: [
      'Father, surround me and my family with Your angels of protection',
      'Every evil arrow fired at my destiny returns to sender in Jesus name',
      'I plead the blood of Jesus over my life, home, and all I possess',
      'No weapon formed against me shall prosper in Jesus name',
      'Lord, let Your fire wall of protection surround me always',
    ],
    declarations: [
      'I dwell in the secret place of the Most High',
      'No evil shall befall me nor any plague come near my dwelling',
      'I am protected by the blood of Jesus',
      'God is my refuge and fortress, in Him I trust',
    ],
    scriptureReferences: ['Psalm 91', 'Isaiah 54:17', 'Zechariah 2:5', 'Exodus 12:13'],
    themeTags: ['protection', 'safety', 'faith'],
    emotionTags: ['fear', 'anxiety'],
  },
  {
    pastorName: 'Pastor David Oyedepo',
    ministryName: 'Winners Chapel',
    title: 'Prayer for Academic Excellence',
    prayerPoints: [
      'Father, open my understanding and give me a retentive memory',
      'I receive the spirit of wisdom and revelation in Jesus name',
      'Every spirit of failure and frustration assigned against my academics is destroyed',
      'Lord, let me excel and stand out among my peers',
      'I receive uncommon results and academic breakthroughs today',
    ],
    declarations: [
      'I have the mind of Christ',
      'I am ten times better than my colleagues',
      'Knowledge and wisdom are given to me by God',
      'I succeed in every examination in Jesus name',
    ],
    scriptureReferences: ['Daniel 1:20', '1 Corinthians 2:16', 'James 1:5', 'Proverbs 2:6'],
    themeTags: ['education', 'wisdom', 'excellence', 'work'],
    emotionTags: ['anxiety', 'fear', 'confusion'],
  },
];

export const seedPastoralPrayers = async () => {
  try {
    const count = await PastoralPrayer.count();
    if (count > 0) {
      logger.info(`Pastoral prayers already seeded (${count} records). Skipping...`);
      return;
    }

    await PastoralPrayer.bulkCreate(
      pastoralPrayers.map((p) => ({ ...p, religion: 'Christianity', isActive: true }))
    );
    logger.info(`✅ Seeded ${pastoralPrayers.length} pastoral prayers successfully.`);
  } catch (error) {
    logger.error(`Pastoral prayer seeding error: ${error.message}`);
  }
};

export default seedPastoralPrayers;