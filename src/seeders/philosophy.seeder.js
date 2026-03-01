import { Philosophy } from '../models/postgres/index.js';
import logger from '../utils/logger.js';

const philosophyQuotes = [
  {
    philosopher: 'Marcus Aurelius',
    philosophyType: 'Stoicism',
    quoteText: 'You have power over your mind, not outside events. Realize this, and you will find strength.',
    themeTags: ['strength', 'mindfulness', 'control'],
    emotionTags: ['anxiety', 'fear', 'confusion'],
  },
  {
    philosopher: 'Marcus Aurelius',
    philosophyType: 'Stoicism',
    quoteText: 'The obstacle is the way. What stands in the way becomes the way.',
    themeTags: ['perseverance', 'hardship', 'growth'],
    emotionTags: ['sadness', 'confusion', 'anxiety'],
  },
  {
    philosopher: 'Marcus Aurelius',
    philosophyType: 'Stoicism',
    quoteText: 'Accept the things to which fate binds you, and love the people with whom fate brings you together.',
    themeTags: ['acceptance', 'relationships', 'love'],
    emotionTags: ['sadness', 'anger', 'loneliness'],
  },
  {
    philosopher: 'Epictetus',
    philosophyType: 'Stoicism',
    quoteText: 'Make the best use of what is in your power, and take the rest as it happens.',
    themeTags: ['control', 'acceptance', 'wisdom'],
    emotionTags: ['anxiety', 'confusion', 'fear'],
  },
  {
    philosopher: 'Epictetus',
    philosophyType: 'Stoicism',
    quoteText: 'It is not what happens to you, but how you react to it that matters.',
    themeTags: ['resilience', 'mindfulness', 'growth'],
    emotionTags: ['anger', 'sadness', 'confusion'],
  },
  {
    philosopher: 'Seneca',
    philosophyType: 'Stoicism',
    quoteText: 'It is not that I am brave, it is just that I am busy. True happiness is to enjoy the present.',
    themeTags: ['joy', 'mindfulness', 'gratitude'],
    emotionTags: ['anxiety', 'sadness', 'loneliness'],
  },
  {
    philosopher: 'Seneca',
    philosophyType: 'Stoicism',
    quoteText: 'We suffer more in imagination than in reality.',
    themeTags: ['anxiety', 'mindfulness', 'peace'],
    emotionTags: ['anxiety', 'fear', 'confusion'],
  },
  {
    philosopher: 'Buddha',
    philosophyType: 'Buddhism',
    quoteText: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.',
    themeTags: ['self-love', 'compassion', 'identity'],
    emotionTags: ['sadness', 'loneliness', 'grief'],
  },
  {
    philosopher: 'Buddha',
    philosophyType: 'Buddhism',
    quoteText: 'Peace comes from within. Do not seek it without.',
    themeTags: ['peace', 'mindfulness', 'inner strength'],
    emotionTags: ['anxiety', 'confusion', 'sadness'],
  },
  {
    philosopher: 'Buddha',
    philosophyType: 'Buddhism',
    quoteText: 'In the middle of difficulty lies opportunity.',
    themeTags: ['growth', 'hardship', 'hope'],
    emotionTags: ['sadness', 'anxiety', 'confusion'],
  },
  {
    philosopher: 'Aristotle',
    philosophyType: 'Ancient Greek',
    quoteText: 'Happiness depends upon ourselves.',
    themeTags: ['happiness', 'purpose', 'identity'],
    emotionTags: ['sadness', 'confusion', 'loneliness'],
  },
  {
    philosopher: 'Aristotle',
    philosophyType: 'Ancient Greek',
    quoteText: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    themeTags: ['excellence', 'work', 'growth'],
    emotionTags: ['confusion', 'anxiety'],
  },
  {
    philosopher: 'Plato',
    philosophyType: 'Ancient Greek',
    quoteText: 'Be kind, for everyone you meet is fighting a harder battle.',
    themeTags: ['compassion', 'relationships', 'kindness'],
    emotionTags: ['anger', 'sadness', 'loneliness'],
  },
  {
    philosopher: 'Viktor Frankl',
    philosophyType: 'Existentialism',
    quoteText: 'When we are no longer able to change a situation, we are challenged to change ourselves.',
    themeTags: ['growth', 'acceptance', 'purpose'],
    emotionTags: ['sadness', 'grief', 'confusion'],
  },
  {
    philosopher: 'Viktor Frankl',
    philosophyType: 'Existentialism',
    quoteText: 'Everything can be taken from a man but one thing: the last of the human freedoms — to choose one\'s attitude in any given set of circumstances.',
    themeTags: ['freedom', 'strength', 'purpose'],
    emotionTags: ['sadness', 'grief', 'fear'],
  },
  {
    philosopher: 'Lao Tzu',
    philosophyType: 'Taoism',
    quoteText: 'Life is a series of natural and spontaneous changes. Don\'t resist them; that only creates sorrow.',
    themeTags: ['acceptance', 'peace', 'change'],
    emotionTags: ['sadness', 'anxiety', 'anger'],
  },
  {
    philosopher: 'Lao Tzu',
    philosophyType: 'Taoism',
    quoteText: 'Knowing others is intelligence; knowing yourself is true wisdom.',
    themeTags: ['wisdom', 'identity', 'self-awareness'],
    emotionTags: ['confusion', 'anxiety'],
  },
  {
    philosopher: 'Friedrich Nietzsche',
    philosophyType: 'Existentialism',
    quoteText: 'That which does not kill us makes us stronger.',
    themeTags: ['strength', 'resilience', 'hardship'],
    emotionTags: ['sadness', 'grief', 'fear'],
  },
  {
    philosopher: 'Socrates',
    philosophyType: 'Ancient Greek',
    quoteText: 'The unexamined life is not worth living.',
    themeTags: ['purpose', 'self-awareness', 'growth'],
    emotionTags: ['confusion', 'sadness'],
  },
  {
    philosopher: 'Ralph Waldo Emerson',
    philosophyType: 'Transcendentalism',
    quoteText: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    themeTags: ['inner strength', 'purpose', 'hope'],
    emotionTags: ['sadness', 'confusion', 'fear'],
  },
  {
    philosopher: 'Rumi',
    philosophyType: 'Sufism',
    quoteText: 'The wound is the place where the Light enters you.',
    themeTags: ['healing', 'growth', 'hope'],
    emotionTags: ['grief', 'sadness', 'pain'],
  },
  {
    philosopher: 'Rumi',
    philosophyType: 'Sufism',
    quoteText: 'Stop acting so small. You are the universe in ecstatic motion.',
    themeTags: ['identity', 'purpose', 'confidence'],
    emotionTags: ['sadness', 'loneliness', 'confusion'],
  },
  {
    philosopher: 'Rumi',
    philosophyType: 'Sufism',
    quoteText: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
    themeTags: ['wisdom', 'growth', 'change'],
    emotionTags: ['confusion', 'anger', 'sadness'],
  },
  {
    philosopher: 'Albert Camus',
    philosophyType: 'Absurdism',
    quoteText: 'In the midst of winter, I found there was, within me, an invincible summer.',
    themeTags: ['resilience', 'hope', 'inner strength'],
    emotionTags: ['sadness', 'grief', 'loneliness'],
  },
  {
    philosopher: 'Thich Nhat Hanh',
    philosophyType: 'Buddhism',
    quoteText: 'The present moment is the only moment available to us, and it is the door to all moments.',
    themeTags: ['mindfulness', 'peace', 'present'],
    emotionTags: ['anxiety', 'confusion', 'sadness'],
  },
];

export const seedPhilosophy = async () => {
  try {
    const count = await Philosophy.count();
    if (count > 0) {
      logger.info(`Philosophy already seeded (${count} records). Skipping...`);
      return;
    }

    await Philosophy.bulkCreate(
      philosophyQuotes.map((q) => ({ ...q, religion: 'Other', isActive: true }))
    );
    logger.info(`✅ Seeded ${philosophyQuotes.length} philosophy quotes successfully.`);
  } catch (error) {
    logger.error(`Philosophy seeding error: ${error.message}`);
  }
};

export default seedPhilosophy;