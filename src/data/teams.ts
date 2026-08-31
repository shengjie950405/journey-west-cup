export type Gender = 'M' | 'F';

export interface Player {
  name: string;
  gender: Gender;
  num: number;
  captain: boolean;
}

/** [otherTeamId, description of the bond] */
export type Relation = [TeamId, string];

export type TeamId =
  | 'dasheng'
  | 'yuanshuai'
  | 'luohan'
  | 'shengseng'
  | 'aolie'
  | 'rulai'
  | 'meiyao'
  | 'nichang';

export interface Team {
  id: TeamId;
  /** Chinese title, e.g. 大聖 */
  cn: string;
  /** Character name, e.g. Dasheng */
  name: string;
  /** English character title, e.g. The Great Sage */
  title: string;
  /** Jersey ground colour token */
  color: string;
  /** True when the ground is dark and needs light text */
  dark: boolean;
  pool: 'A' | 'B';
  /** Colourway print used on the Teams tab */
  art: string;
  /** Art used on the Story tab (cutout where one exists) */
  story: string;
  /** Card background on the Story tab */
  ground: string;
  bio: string;
  /** Default cheerable English team name */
  en: string;
  lore1: string;
  lore2: string;
  rel: Relation[];
  roster: Player[];
}

const p = (name: string, gender: Gender, num: number, captain = false): Player => ({
  name,
  gender,
  num,
  captain,
});

export const TEAMS: Team[] = [
  {
    id: 'dasheng',
    cn: '大聖',
    name: 'Dasheng',
    title: 'The Great Sage',
    color: 'var(--way-cream)',
    dark: false,
    pool: 'A',
    art: 'assets/art/dasheng-cream.jpg',
    story: 'assets/art/wukong-cutout.png',
    ground: 'var(--way-cream)',
    bio: 'Sun Wukong, the Monkey King — born from stone, master of 72 transformations, armed with the golden staff. Fast hands, faster mouth.',
    en: 'Monkey Kings',
    lore1:
      'Born from a stone egg on the Mountain of Flowers and Fruit, the monkey taught himself the 72 transformations, stole the golden staff from the Dragon King’s armory, and struck his own name from the Book of Death. Heaven offered him a title to keep him quiet; he ate the peaches instead.',
    lore2:
      'After wrecking the Heavenly Peach Banquet he was pinned under Five Elements Mountain for 500 years — until a monk on a westward road peeled back the seal, gave him a second chance, and a golden headband to keep him honest.',
    rel: [
      ['shengseng', 'his master, and the only person who can (painfully) rein him in.'],
      ['yuanshuai', 'second brother — they bicker every mile of the road.'],
      ['rulai', 'the palm he never escaped. Respect, grudgingly.'],
      ['meiyao', 'his sworn enemy; the one gaze that pierces every disguise.'],
    ],
    roster: [
      p('Kai Zhang', 'M', 1, true),
      p('Leo Wen', 'M', 7),
      p('Marcus Lam', 'M', 10),
      p('Devin Choi', 'M', 23),
      p('Amy Xu', 'F', 4),
      p('Tina Guo', 'F', 11),
      p('Sara Lin', 'F', 88),
    ],
  },
  {
    id: 'yuanshuai',
    cn: '元帥',
    name: 'Yuanshuai',
    title: 'The Marshal',
    color: 'var(--way-navy)',
    dark: true,
    pool: 'B',
    art: 'assets/art/yuanshuai-navy.jpg',
    story: 'assets/art/yuanshuai-navy.jpg',
    ground: 'var(--way-navy)',
    bio: 'Zhu Bajie, once Marshal of the Heavenly Canopy, banished for flirting with the Moon Fairy. Big body, big blocks, bigger lunch.',
    en: 'Sky Marshals',
    lore1:
      'Once Marshal Tianpeng, commander of 80,000 heavenly river troops, he drank too deep at the Peach Banquet and flirted with the Moon Fairy. The sentence: banishment, a pig’s body, and a new name — Zhu Bajie.',
    lore2:
      'He carries a nine-toothed rake, an appetite that empties villages, and more heart than he will ever admit. When it truly matters, the Marshal shows up.',
    rel: [
      ['nichang', 'the flirtation that cost him heaven. It is still awkward.'],
      ['dasheng', 'first brother, chief rival, best friend.'],
      ['shengseng', 'his master, whose patience he tests daily.'],
    ],
    roster: [
      p('Ben Tian', 'M', 8, true),
      p('Oscar Peng', 'M', 32),
      p('Ray Zhong', 'M', 5),
      p('Tom Hu', 'M', 44),
      p('Jia Chen', 'F', 9),
      p('Mona Li', 'F', 21),
      p('Eva Song', 'F', 3),
    ],
  },
  {
    id: 'luohan',
    cn: '羅漢',
    name: 'Luohan',
    title: 'The Arhat',
    color: 'var(--way-green)',
    dark: true,
    pool: 'B',
    art: 'assets/art/luohan-green.jpg',
    story: 'assets/art/luohan-green.jpg',
    ground: 'var(--way-green)',
    bio: 'Sha Wujing, the river spirit who carries the luggage and the marks. Steady, silent, always in the right spot.',
    en: 'River Guards',
    lore1:
      'Sha Wujing was a general of the Curtain-Raising Hall until he shattered a crystal goblet at the Peach Banquet and was cast into the River of Flowing Sands, where he haunted travelers for 800 years.',
    lore2:
      'The pilgrimage gave him a monk’s robe, a crescent staff and the luggage. He carried all three to the very end and was named an arhat for it — the steadiest player on any line.',
    rel: [
      ['dasheng', 'third brother; follows the plan while others improvise.'],
      ['yuanshuai', 'fellow fallen general, opposite temperament.'],
      ['rulai', 'named him arhat when the journey was done.'],
    ],
    roster: [
      p('Stone Sha', 'M', 26, true),
      p('Gary Heng', 'M', 11),
      p('Bruce Kang', 'M', 58),
      p('Neil Cang', 'M', 40),
      p('Fiona Qin', 'F', 14),
      p('Hana Mo', 'F', 33),
      p('Ella Wei', 'F', 7),
    ],
  },
  {
    id: 'shengseng',
    cn: '聖僧',
    name: 'Shengseng',
    title: 'The Holy Monk',
    color: 'var(--way-blush)',
    dark: false,
    pool: 'B',
    art: 'assets/art/shengseng-pink.jpg',
    story: 'assets/art/shengseng-pink.jpg',
    ground: 'var(--way-blush)',
    bio: 'Tang Sanzang, the pilgrim monk the whole journey protects. Patient possession offense — 81 passes if that is what it takes.',
    en: 'Holy Monk',
    lore1:
      'Tang Sanzang, the Tang emperor’s sworn brother, sent west with nothing but faith, a robe and a horse. Every demon in the wilderness believes one bite of him grants immortality — hence the bodyguards.',
    lore2:
      'He cannot fight, fly, or throw a flick huck. But without him there is no journey at all: eighty-one trials, one calm center.',
    rel: [
      ['dasheng', 'his hot-headed first disciple, held by the golden band.'],
      ['meiyao', 'she has tried to eat him three times.'],
      ['aolie', 'his white horse — secretly a prince.'],
    ],
    roster: [
      p('Sam Tang', 'M', 14, true),
      p('Jerry Kwok', 'M', 19),
      p('Chris Mo', 'M', 55),
      p('Max Luo', 'M', 42),
      p('Iris Shen', 'F', 8),
      p('Joy Zhu', 'F', 16),
      p('Vivian He', 'F', 24),
    ],
  },
  {
    id: 'aolie',
    cn: '敖烈',
    name: 'Aolie',
    title: 'The Dragon Prince',
    color: 'var(--way-sky)',
    dark: false,
    pool: 'A',
    art: 'assets/art/aolie-sky.jpg',
    story: 'assets/art/aolie-sky.jpg',
    ground: 'var(--way-sky)',
    bio: 'Third prince of the West Sea, who burned the pearl and became the White Dragon Horse. Carries the team all day, never complains.',
    en: 'White Dragons',
    lore1:
      'Third prince of the West Sea Dragon King. He burned his father’s pearl of wisdom, was sentenced to die under heaven’s blade, and was spared on one condition: serve the pilgrimage.',
    lore2:
      'He became the White Dragon Horse and carried the monk 108,000 li without a word of complaint — then revealed the dragon whenever the road demanded it.',
    rel: [
      ['shengseng', 'carries him west — the quietest devotion on the road.'],
      ['dasheng', 'big brother in arms, who wakes the dragon in him.'],
      ['rulai', 'the mercy that spared his life.'],
    ],
    roster: [
      p('Alex Ao', 'M', 25, true),
      p('Ryan Long', 'M', 4),
      p('Felix Hai', 'M', 38),
      p('Sean Bo', 'M', 63),
      p('Zoe Jiang', 'F', 10),
      p('Kelly Duan', 'F', 28),
      p('May Xiong', 'F', 5),
    ],
  },
  {
    id: 'rulai',
    cn: '如來',
    name: 'Rulai',
    title: 'The Buddha',
    color: 'var(--way-brown)',
    dark: true,
    pool: 'A',
    art: 'assets/art/rulai-brown.jpg',
    story: 'assets/art/buddha-cutout.png',
    ground: 'var(--way-brown)',
    bio: 'The Tathagata, whose palm no somersault can escape. Calm under pressure; the zone defense of the heavens.',
    en: 'Golden Palms',
    lore1:
      'The Tathagata Buddha of the Western Paradise, keeper of the scriptures the whole pilgrimage exists to fetch. When Heaven’s hundred thousand soldiers failed to contain the Monkey King, they sent for him.',
    lore2:
      'He turned his hand over. Five fingers became a mountain range, and the sage who could somersault 108,000 li landed exactly where he started. Every road west ends at his palm.',
    rel: [
      ['dasheng', 'pinned him for 500 years — then pardoned him.'],
      ['shengseng', 'the pilgrimage runs to his doorstep.'],
      ['luohan', 'rewarded his long penance with arhat-hood.'],
    ],
    roster: [
      p('Victor Shi', 'M', 18, true),
      p('Alan Du', 'M', 2),
      p('Ken Bai', 'M', 66),
      p('Paul Jin', 'M', 30),
      p('Grace Yao', 'F', 12),
      p('Lily Fang', 'F', 27),
      p('Nina Wu', 'F', 6),
    ],
  },
  {
    id: 'meiyao',
    cn: '魅妖',
    name: 'Meiyao',
    title: 'The Enchantress',
    color: 'var(--way-maroon)',
    dark: true,
    pool: 'B',
    art: 'assets/art/meiyao-maroon.jpg',
    story: 'assets/art/enchantress-cutout.png',
    ground: 'var(--way-maroon)',
    bio: 'The shapeshifting temptress of the bone-white wastes. You never guard the same look twice.',
    en: 'White Bone Spirit',
    lore1:
      'The White Bone Demon of the wastes, who can wear any face: a village girl with a food basket, a weeping grandmother, a frail old man. Three disguises — and three times struck down by the Monkey King’s staff.',
    lore2:
      'She is the road’s hardest lesson: things are not what they seem, and kindness without judgment gets your master kidnapped.',
    rel: [
      ['dasheng', 'the only eyes that see through every disguise.'],
      ['shengseng', 'her prize — immortality in a single bite, they say.'],
      ['nichang', 'mirror opposites in the same moonlight.'],
    ],
    roster: [
      p('Mia Bo', 'F', 17, true),
      p('Luna Xie', 'F', 31),
      p('Coco Deng', 'F', 9),
      p('Anna Pan', 'F', 22),
      p('Eric Gu', 'M', 45),
      p('Hank Yu', 'M', 3),
      p('Owen Zou', 'M', 12),
    ],
  },
  {
    id: 'nichang',
    cn: '霓裳',
    name: 'Nichang',
    title: 'The Moon Fairy',
    color: 'var(--way-celadon)',
    dark: false,
    pool: 'A',
    art: 'assets/art/nichang-celadon.jpg',
    story: 'assets/art/nichang-celadon.jpg',
    ground: 'var(--way-celadon)',
    bio: 'The rainbow-robed fairy of the Moon Palace. Graceful in the air — expect layout catches in silk sleeves.',
    en: 'Moon Fairy',
    lore1:
      'A fairy of the Moon Palace who dances in robes of rainbow feathers — the melody “Rainbow Skirts and Feathered Coats” is named for her art. From Chang’e’s cold palace she watched the road west unfold below.',
    lore2:
      'One clumsy toast from a heavenly marshal changed two destinies: he fell to earth in a pig’s body, and she learned that even immortals get tangled in mortal stories.',
    rel: [
      ['yuanshuai', 'the marshal who toasted her once — and fell from heaven for it. Still awkward.'],
      ['meiyao', 'mirror opposites caught in the same moonlight.'],
    ],
    roster: [
      p('Cindy Ni', 'F', 13, true),
      p('Rita Chang', 'F', 20),
      p('Wendy Cao', 'F', 35),
      p('Elaine Ma', 'F', 7),
      p('Jack Feng', 'M', 29),
      p('Ivan Su', 'M', 15),
      p('Dan Qiu', 'M', 50),
    ],
  },
];

/** Display order on the Teams and Story tabs. */
export const ORDER: TeamId[] = [
  'dasheng',
  'yuanshuai',
  'luohan',
  'shengseng',
  'aolie',
  'rulai',
  'meiyao',
  'nichang',
];

const BY_ID = new Map(TEAMS.map((t) => [t.id, t]));

export function team(id: TeamId): Team {
  const t = BY_ID.get(id);
  if (!t) throw new Error(`Unknown team: ${id}`);
  return t;
}

export const ORDERED_TEAMS: Team[] = ORDER.map(team);
