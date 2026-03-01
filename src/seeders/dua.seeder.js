import axios from 'axios';
import { Dua } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const duas = [
  {
    title: "Du'a for Anxiety and Worry",
    arabicText: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal, wa a'udhu bika minal-jubni wal-bukhl, wa a'udhu bika min ghalabatid-dayni wa qahrir-rijal",
    englishMeaning: "O Allah, I seek refuge in You from grief and sadness, from weakness and laziness, from miserliness and cowardice, from being overcome by debt and overpowered by men.",
    source: "Sahih Bukhari 6369",
    themeTags: ["anxiety", "protection", "strength"],
    emotionTags: ["anxiety", "fear", "sadness"],
  },
  {
    title: "Du'a for Depression",
    arabicText: "لاَ إِلَهَ إِلاَّ اللَّهُ الْعَظِيمُ الْحَلِيمُ، لاَ إِلَهَ إِلاَّ اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لاَ إِلَهَ إِلاَّ اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    transliteration: "La ilaha illallahul-Azimul-Halim, la ilaha illallahu Rabbul-Arshil-Azim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-Arshil-Karim",
    englishMeaning: "There is no deity except Allah, the Great, the Forbearing. There is no deity except Allah, Lord of the Mighty Throne. There is no deity except Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
    source: "Sahih Bukhari 6346",
    themeTags: ["depression", "hope", "trust"],
    emotionTags: ["sadness", "grief", "loneliness"],
  },
  {
    title: "Du'a for Forgiveness (Sayyidul Istighfar)",
    arabicText: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana abduka, wa ana 'ala ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa anta",
    englishMeaning: "O Allah, You are my Lord, there is no deity except You. You created me and I am Your servant, and I am upon Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessing upon me and I acknowledge my sin, so forgive me, for none forgives sins except You.",
    source: "Sahih Bukhari 6306",
    themeTags: ["forgiveness", "repentance", "mercy"],
    emotionTags: ["guilt", "sadness", "confusion"],
  },
  {
    title: "Du'a for Gratitude",
    arabicText: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
    englishMeaning: "O Allah, help me to remember You, to be grateful to You, and to worship You in an excellent manner.",
    source: "Abu Dawud 1522",
    themeTags: ["gratitude", "worship", "remembrance"],
    emotionTags: ["gratitude", "joy"],
  },
  {
    title: "Du'a for Reliance on Allah",
    arabicText: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal-wakil",
    englishMeaning: "Allah is sufficient for us, and He is the best disposer of affairs.",
    source: "Quran 3:173",
    themeTags: ["trust", "reliance", "hardship"],
    emotionTags: ["anxiety", "fear", "confusion"],
  },
  {
    title: "Du'a for Financial Difficulty",
    arabicText: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    transliteration: "Allahummak-fini bi halalika 'an haramika wa aghnini bi fadlika 'amman siwak",
    englishMeaning: "O Allah, suffice me with what You have allowed instead of what You have forbidden, and make me independent of all others besides You.",
    source: "Tirmidhi 3563",
    themeTags: ["finances", "provision", "contentment"],
    emotionTags: ["anxiety", "fear", "sadness"],
  },
  {
    title: "Du'a for Healing",
    arabicText: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِهِ وَأَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا",
    transliteration: "Allahumma Rabban-nasi, adhhibil-ba'sa, ishfi wa Antash-Shafi, la shifa'a illa shifa'uka, shifa'an la yughadiru saqama",
    englishMeaning: "O Allah, Lord of mankind, remove the affliction and heal, for You are the Healer. There is no healing except Your healing, a healing that leaves no illness behind.",
    source: "Sahih Bukhari 5743",
    themeTags: ["health", "healing", "illness"],
    emotionTags: ["fear", "sadness", "anxiety"],
  },
  {
    title: "Du'a for Patience",
    arabicText: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
    englishMeaning: "Our Lord, pour upon us patience and plant firmly our feet and give us victory.",
    source: "Quran 2:250",
    themeTags: ["patience", "perseverance", "strength"],
    emotionTags: ["anger", "sadness", "confusion"],
  },
  {
    title: "Du'a for Family and Relationships",
    arabicText: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama",
    englishMeaning: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.",
    source: "Quran 25:74",
    themeTags: ["family", "relationships", "love"],
    emotionTags: ["loneliness", "sadness", "anxiety"],
  },
  {
    title: "Du'a for Guidance",
    arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    transliteration: "Ihdinas-siratal-mustaqim",
    englishMeaning: "Guide us to the straight path.",
    source: "Quran 1:6",
    themeTags: ["guidance", "faith", "purpose"],
    emotionTags: ["confusion", "anxiety", "fear"],
  },
  {
    title: "Du'a for Relief from Hardship",
    arabicText: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa anta taj'alul-hazna idha shi'ta sahla",
    englishMeaning: "O Allah, there is no ease except what You make easy, and You make the difficult easy if You wish.",
    source: "Ibn Hibban",
    themeTags: ["hardship", "relief", "trust"],
    emotionTags: ["anxiety", "sadness", "fear"],
  },
  {
    title: "Du'a for Success and Progress",
    arabicText: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    transliteration: "Rabbish-rah li sadri wa yassir li amri",
    englishMeaning: "My Lord, expand my breast and ease my task for me.",
    source: "Quran 20:25-26",
    themeTags: ["success", "work", "progress"],
    emotionTags: ["anxiety", "confusion", "hope"],
  },
  {
    title: "Du'a for Protection from Evil",
    arabicText: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
    englishMeaning: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    source: "Sahih Muslim 2708",
    themeTags: ["protection", "faith", "trust"],
    emotionTags: ["fear", "anxiety"],
  },
  {
    title: "Du'a for Loss and Grief",
    arabicText: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
    transliteration: "Inna lillahi wa inna ilayhi raji'un, Allahumma'-jurni fi musibati wa akhlif li khayran minha",
    englishMeaning: "Indeed we belong to Allah and to Him we shall return. O Allah, reward me in my affliction and replace it with something better.",
    source: "Sahih Muslim 918",
    themeTags: ["loss", "grief", "patience"],
    emotionTags: ["grief", "sadness", "loneliness"],
  },
  {
    title: "Du'a for Marriage and Love",
    arabicText: "اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا، وَأَصْلِحْ ذَاتَ بَيْنِنَا، وَاهْدِنَا سُبُلَ السَّلَامِ",
    transliteration: "Allahumma allif bayna qulubina, wa aslih dhata baynina, wahd ina subulas-salam",
    englishMeaning: "O Allah, reconcile our hearts, improve our relationships, and guide us to the paths of peace.",
    source: "Abu Dawud",
    themeTags: ["relationships", "marriage", "love", "family"],
    emotionTags: ["loneliness", "sadness", "anger"],
  },
  {
    title: "Du'a for Knowledge and Wisdom",
    arabicText: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    englishMeaning: "My Lord, increase me in knowledge.",
    source: "Quran 20:114",
    themeTags: ["knowledge", "wisdom", "guidance"],
    emotionTags: ["confusion", "hope"],
  },
  {
    title: "Du'a for Morning (Sabah)",
    arabicText: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
    englishMeaning: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
    source: "Tirmidhi 3391",
    themeTags: ["morning", "worship", "gratitude"],
    emotionTags: ["gratitude", "joy", "hope"],
  },
  {
    title: "Du'a for Evening (Masa)",
    arabicText: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
    englishMeaning: "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the return.",
    source: "Tirmidhi 3391",
    themeTags: ["evening", "worship", "gratitude"],
    emotionTags: ["gratitude", "joy", "hope"],
  },
  {
    title: "Du'a for Istikhara (Seeking Guidance in Decisions)",
    arabicText: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ",
    transliteration: "Allahumma inni astakhiruka bi'ilmika, wa astaqdiruka biqudratika, wa as'aluka min fadlikal-'azim",
    englishMeaning: "O Allah, I seek Your guidance by Your knowledge, and I seek Your help by Your power, and I ask You from Your great bounty.",
    source: "Sahih Bukhari 1166",
    themeTags: ["decisions", "guidance", "trust"],
    emotionTags: ["confusion", "anxiety", "fear"],
  },
  {
    title: "Du'a for Addiction and Bad Habits",
    arabicText: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ مُنْكَرَاتِ الأَخْلاَقِ، وَالأَعْمَالِ، وَالأَهْوَاءِ",
    transliteration: "Allahumma inni a'udhu bika min munkaratil-akhlaqi wal-a'mali wal-ahwa'",
    englishMeaning: "O Allah, I seek refuge in You from evil character, evil deeds and evil desires.",
    source: "Tirmidhi 3591",
    themeTags: ["addiction", "character", "strength"],
    emotionTags: ["guilt", "sadness", "confusion"],
  },
];

export const seedDuas = async () => {
  try {
    const count = await Dua.count();
    if (count > 0) {
      logger.info(`Duas already seeded (${count} records). Skipping...`);
      return;
    }

    await Dua.bulkCreate(duas.map((dua) => ({ ...dua, religion: 'Islam', isActive: true })));
    logger.info(`✅ Seeded ${duas.length} authentic Du'as successfully.`);
  } catch (error) {
    logger.error(`Dua seeding error: ${error.message}`);
  }
};

export default seedDuas;