/**
 * Tournament sponsors.
 *
 * `logo` points at a file under `public/assets/sponsors/`. If a file is missing
 * the card falls back to the sponsor's name, so the section stays presentable
 * before every asset has been dropped in.
 */

export interface Sponsor {
  id: string;
  /** English / primary name */
  name: string;
  /** Chinese name, shown alongside where the sponsor has one */
  cn?: string;
  logo: string;
  /** Compact label for the logo tile when the image file is missing */
  short: string;
  /** What they are giving players on the day */
  perk: string;
  perkCn?: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export const PERK_SPONSORS: Sponsor[] = [
  {
    id: 'fantuan',
    name: 'Fantuan Delivery',
    cn: '饭团外卖',
    logo: 'assets/sponsors/fantuan.png',
    short: 'Fantuan',
    perk: 'Free bubble tea for everyone',
    perkCn: '免费奶茶',
  },
  {
    id: 'dudu',
    name: 'Dudu Fresh',
    cn: '嘟嘟快送',
    logo: 'assets/sponsors/dudu-fresh.png',
    short: 'Dudu',
    perk: 'Free snacks and drinks on site',
    perkCn: '免费零食与饮品',
  },
  {
    id: 'form-function',
    name: 'Form & Function Physio',
    logo: 'assets/sponsors/form-function.png',
    short: 'F&F',
    perk: 'Sideline physio and massage all evening',
    perkCn: '场边理疗与按摩',
  },
  {
    id: 'j17',
    name: 'J17 Performance',
    logo: 'assets/sponsors/j17-performance.png',
    short: 'J17',
    perk: 'A training gift for every athlete',
    perkCn: '每位运动员一份运动装备礼品',
  },
];

/** The club's season sponsor — top billing, above the per-game perks. */
export const SEASON_SPONSOR = {
  id: 'jessica-yin',
  name: 'Jessica Yin',
  role: 'Broker · RE/MAX Imperial Realty Inc., Brokerage',
  logo: 'assets/sponsors/jessica-yin.png',
  short: 'JY',
  blurb:
    'Our season sponsor. Every Wukong Ultimate event this year — this tournament included — runs with the full backing of the Jessica Yin team.',
  blurbCn: '我们的年度赞助商，俱乐部全年活动均由 Jessica Yin 团队全力支持。',
  ask: 'Buying, selling or renting? Talk to Jessica.',
  askCn: '买房、卖房、租房，欢迎咨询。',
  contacts: [
    { label: 'Call', value: '416.553.9279', href: 'tel:+14165539279' },
    { label: 'Office', value: '905.305.0033', href: 'tel:+19053050033' },
    { label: 'Email', value: 'jessicayhomes@gmail.com', href: 'mailto:jessicayhomes@gmail.com' },
    { label: 'Web', value: 'jessicayinhomes.com', href: 'https://jessicayinhomes.com' },
  ] as ContactLink[],
};
