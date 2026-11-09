export interface Hotspot {
  id: string;
  name: string;
  title: string;
  emoji: string;
  // Normalized percentage coordinates (0 - 100%)
  x: number; // center x %
  y: number; // center y %
  width: number; // hit area %
  height: number; // hit area %
  dialogues: string[];
  actionType?: 'music' | 'dialogue' | 'cheers' | 'lamp' | 'gate';
}

export const CAMPUS_HOTSPOTS: Hotspot[] = [
  // 1. Central Guitarist
  {
    id: 'guitarist',
    name: 'ক্যাম্পাস গিটারিস্ট',
    title: 'গিটার বাজাও ও গান চালু করো',
    emoji: '🎸',
    x: 54,
    y: 73,
    width: 14,
    height: 12,
    actionType: 'music',
    dialogues: [
      'এই গানটা সবাই একসাথে গাইবি— "আবার হাসিমুখ" নাকি "সেই তুমি"?',
      'দোস্ত, গিটারের ৩ নম্বর তারটা হালকা লুজ হয়ে গেছে... দাঁড়া একটু সুর ধরি!',
      'ক্যান্টিনের চা শেষ কইরা আসলি? আমার জন্য তো এক কাপ আনলি না!',
      'পরের গানটা কার জন্য উৎসর্গ? ওই কোনায় যে বসে আছে তার জন্য নাকি?',
      'গান চলবে নন-স্টপ! আড্ডার মেজাজ কোনোভাবেই মিস দেওয়া যাবে না।'
    ]
  },

  // 2. Boy in Blue Shirt (Left of guitarist)
  {
    id: 'blue_shirt_friend',
    name: 'প্রেজেন্টেশন পার্টনার (নীল শার্ট)',
    title: 'গ্রুপ স্টাডির প্ল্যানিং',
    emoji: '🗣️',
    x: 40,
    y: 73,
    width: 10,
    height: 12,
    actionType: 'dialogue',
    dialogues: [
      'শোন মামা, প্রেজেন্টেশনে তুই ভূমিকা দিবি, আমি কনক্লুশন টানব। মাঝখানের জটিল স্লাইডগুলা ওরে দিয়ে দে!',
      'মিডটার্মের রেজাল্ট দিল নাকি রে? পোর্টালে লগইন করতে হাত কাঁপতেছে!',
      'দোস্ত, একটু পরে তো ল্যাব ক্লাস... এটেন্ডেন্সে প্রক্সি দেওয়া যাবে কোনোভাবে?',
      'চা শেষ কইরা চল লাইব্রেরির সামনে যাই, বাতাসটা সেই লাগতেছে।'
    ]
  },

  // 3. Listener with back facing us (Foreground center)
  {
    id: 'front_blue_guy',
    name: 'একনিষ্ঠ শ্রোতা (সামনে বসা)',
    title: 'গানের সুর উপভোগকারী',
    emoji: '🎵',
    x: 68,
    y: 83,
    width: 11,
    height: 12,
    actionType: 'dialogue',
    dialogues: [
      'আহ! আর্টসেলের "অনিকেত প্রান্তর" গানটা একটু বাজাও না ভাই!',
      'এই ক্যাম্পাসের মাটিতে বইসা গান শোনার অনুভূতির কোনো তুলনা নাই।',
      'আমার চা ঠান্ডা হয়ে গেছে গানের মধ্যে ডুইবা!',
      'এই বিকেলটা যদি কখনো শেষ না হতো রে দোস্ত!'
    ]
  },

  // 4. White Panjabi Friend (Right of guitarist)
  {
    id: 'white_panjabi_guy',
    name: 'পাঞ্জাবি পরা বন্ধু',
    title: 'ট্যুর আর আড্ডার আলাপ',
    emoji: '✨',
    x: 75,
    y: 73,
    width: 11,
    height: 13,
    actionType: 'dialogue',
    dialogues: [
      'দোস্ত, সেমিস্টার ফাইনাল শেষ হইলেই কিন্তু সাজেক ট্যুর! নো মিস!',
      'সিজিপিএ দিয়া কি হইব মামা? ক্যাম্পাসের এই আড্ডার দিনগুলাই সারাজীবন মনে থাকবে!',
      'মামা, এক কাপ রং চা পাঠাও তো এদিক! চিনি একটু কম দিও।',
      'আজকে ক্যাম্পাস ছাইড়া বাসায় যাইতে মন চাইতেছে না রে!'
    ]
  },

  // 5. Plaid Shirt Friend (Beside Panjabi guy)
  {
    id: 'plaid_shirt_guy',
    name: 'ল্যাব পার্টনার (চেক শার্ট)',
    title: 'পরীক্ষার টেনশন',
    emoji: '📚',
    x: 82,
    y: 74,
    width: 8,
    height: 11,
    actionType: 'dialogue',
    dialogues: [
      'কালকে কি ল্যাব টেস্ট আছে নাকি রে? কোড তো কিচ্ছু রান করতেছে না!',
      'স্যাররে বলিস না আরেকটু সময় দিতে! পুরো ব্যাচের অবস্থা খারাপ!',
      'আরে ভাই টেনশন বাদ দে, আগে গিটারের গানটা শেষ হোক।'
    ]
  },

  // 6. Red Shirt Guy on Right Ledge
  {
    id: 'red_shirt_guy',
    name: 'ফোনে ব্যস্ত বন্ধু (লাল টি-শার্ট)',
    title: 'ফোন ও টেক্সটের আলাপ',
    emoji: '📱',
    x: 93,
    y: 74,
    width: 10,
    height: 13,
    actionType: 'dialogue',
    dialogues: [
      'আম্মু ফোন দিসিল, কইসি লাইব্রেরিতে বইসা পড়তেছি... আর আমি আছি গানের আড্ডায়!',
      'নেটওয়ার্ক পাইতেছে না রে! ওয়াইফাই পাসওয়ার্ড আবার চেঞ্জ করল নাকি কর্তৃপক্ষ?',
      'দোস্ত, একটু আস্তে হাস, ফোনে কথা বলতেছি তো!'
    ]
  },

  // 7. Green Saree Girl (Left circle)
  {
    id: 'green_saree_girl',
    name: 'শাড়ি পরা আপু (সবুজ ও লাল শাড়ি)',
    title: 'উৎসবের আমেজ',
    emoji: '🥻',
    x: 8,
    y: 73,
    width: 9,
    height: 13,
    actionType: 'dialogue',
    dialogues: [
      'কিরে, ডিপার্টমেন্টের র‍্যাগ ডের শাড়িটা কেমন হইছে বল তো?',
      'আজকে ক্যাম্পাসে এত ছবি তুললাম, ফোনে স্টোরেজ ফুল হয়ে গেছে!',
      'এক কাপ লাল চা দেও তো মামা, গলা শুকায় গেছে কথা বলতে বলতে!'
    ]
  },

  // 8. Pink Salwar Girl (Left circle)
  {
    id: 'pink_salwar_girl',
    name: 'অ্যাসাইনমেন্ট লিডার (গোলাপি সালোয়ার)',
    title: 'পড়াশোনার আপডেট',
    emoji: '📑',
    x: 16,
    y: 74,
    width: 10,
    height: 13,
    actionType: 'dialogue',
    dialogues: [
      'আরে দোস্ত, অ্যাসাইনমেন্ট সাবমিট করছিস? ডেডলাইন কিন্তু রাত ১১:৫৯ এ!',
      'আমি কাল সারারাত জাইগা স্লাইড বানাইলাম, আর বাকিরা নাক ডেকে ঘুমাইলো!',
      'স্যার নাকি কালকে সারপ্রাইজ কুইজ নেবে! আমি তো একটা চ্যাপ্টারও দেখি নাই!'
    ]
  },

  // 9. Cyan Salwar Girl (Left circle)
  {
    id: 'cyan_salwar_girl',
    name: 'আড্ডার মধ্যমণি (আকাশি পোশাক)',
    title: 'ক্যাম্পাস গসিপ',
    emoji: '💬',
    x: 23,
    y: 73,
    width: 8,
    height: 12,
    actionType: 'dialogue',
    dialogues: [
      'শুনছিস, ওই ব্যাচের নাকি ফেয়ারওয়েল প্রোগ্রাম সামনের সপ্তাহে?',
      'ক্যান্টিনের গরম পেঁয়াজু আর রং চা ছাড়া এই বিকেল জমেই না!',
      'গ্রুপ ফটো তো তোলা শেষ, এবার চল গান শুনি শান্তিমতো।'
    ]
  },

  // 10. Cream Dress Girl (Left circle)
  {
    id: 'cream_dress_girl',
    name: 'নোট সংগ্রাহক (হলুদ ও লাল ওড়না)',
    title: 'ক্লাস নোট ও ইনফো',
    emoji: '📝',
    x: 29,
    y: 74,
    width: 8,
    height: 12,
    actionType: 'dialogue',
    dialogues: [
      'ক্লাসের লেকচার নোট কার কাছে আছে রে? একটু ইনবক্সে ছবি পাঠাস তো!',
      'তোর কোর্সটা তো ড্রপ দেওয়ার কথা ছিল, শেষে ফাইট দিতে আসলি!',
      'চা ঠান্ডা হয়ে গেছে রে, আরেক কাপ আনা লাগবে!'
    ]
  },

  // 11. Standing Friends by Left Pillar
  {
    id: 'standing_trio',
    name: 'পিলারের পাশের আড্ডা',
    title: 'ক্লাসের ফাঁকের আলাপ',
    emoji: '🎒',
    x: 13,
    y: 62,
    width: 12,
    height: 14,
    actionType: 'dialogue',
    dialogues: [
      'আজকে লাইব্রেরিতে যাবা? প্রজেক্টের গ্রুপ মিটিং আছে তো!',
      '৪র্থ তলার লিফটের সামনে যে ভিড়... তার চেয়ে সিঁড়ি বেয়ে ওঠাই শান্তি!',
      'ক্লাস শেষ, এখন শুধু ক্যাম্পাসে বসে হাওয়া খাওয়ার সময়।'
    ]
  },

  // 12. Stairs Crowd (Right stairs)
  {
    id: 'stairs_crowd',
    name: 'সিঁড়ির আড্ডা দল',
    title: 'উঁচু সিঁড়ির দৃশ্য',
    emoji: '🏛️',
    x: 84,
    y: 62,
    width: 16,
    height: 11,
    actionType: 'dialogue',
    dialogues: [
      'সিঁড়িতে বইসা পুরো ক্যাম্পাস দেখা যায়! উপর থেকে নিচের আড্ডাটা দেখতে জোস লাগে।',
      'বাতাসটা সেই বইতেছে রে ভাই! ক্যাম্পাস ছেড়ে বাসায় যাইতে মন চায় না।',
      'ফার্স্ট সেমিস্টারের দিনগুলোর কথা মনে আছে? কত ভয় লাগত ক্যাম্পাসে ঢুকতে!'
    ]
  },

  // 13. Entrance Gate & Security
  {
    id: 'gate_turnstile',
    name: 'ক্যাম্পাস গেট ও টার্নস্টাইল',
    title: 'সাউথইস্ট ইউনিভার্সিটি মেইন গেট',
    emoji: '🏢',
    x: 58,
    y: 57,
    width: 16,
    height: 8,
    actionType: 'gate',
    dialogues: [
      'স্বাগতম Southeast University ক্যাম্পাসে! আইডি কার্ডটা পাঞ্চ করেছেন তো ভাই?',
      'আরে দোস্ত, আইডি কার্ড তো বাসায় ভুইলা আসছি! গার্ড মামা ঢুকতে দেবে তো?',
      'গেটের গার্ড মামার হাসিটা প্রতিদিনের ফ্রেশনেস!'
    ]
  },

  // 14. Paper Tea Cups & Food Plate
  {
    id: 'tea_cups',
    name: 'রং চায়ের কাপ ও সিঙ্গাড়া',
    title: 'চিয়ার্স! এক কাপ লাল চা',
    emoji: '☕',
    x: 53,
    y: 82,
    width: 12,
    height: 6,
    actionType: 'cheers',
    dialogues: [
      'চিয়ার্স! ☕ লাল চা আর মুড়ালি-সিঙ্গাড়ায় জমে উঠুক ক্যাম্পাস আড্ডা!',
      'চা ফুটছে গরম গরম! আরেক কাপ লাগবে নাকি মামা?',
      'ক্যাম্পাস লাইফের আসল জ্বালানি হইলো ক্যান্টিনের এই লাল চা!'
    ]
  },

  // 15. Southeast University Signboard
  {
    id: 'seu_signboard',
    name: 'Southeast University সাইনবোর্ড',
    title: 'আমাদের ক্যাম্পাস গর্ব',
    emoji: '🎓',
    x: 53,
    y: 39,
    width: 18,
    height: 6,
    actionType: 'dialogue',
    dialogues: [
      'Southeast University — জ্ঞানের আলোয় প্রদীপ্ত এক ভালোবাসার নাম।',
      'গ্র্যাজুয়েশন হলেও ক্যাম্পাসের এই চত্বরের মায়া কখনো কমে না।'
    ]
  },

  // 16. Hanging Ceiling Lamp
  {
    id: 'hanging_lamp',
    name: 'সিলিং লাইট',
    title: 'দিন ও সন্ধ্যার ক্যাম্পাস আলো পরিবর্তন করো',
    emoji: '💡',
    x: 46,
    y: 12,
    width: 10,
    height: 8,
    actionType: 'lamp',
    dialogues: [
      'লাইট সুইচ! দিন ও সন্ধ্যার ক্যাম্পাস মুড পরিবর্তন করো।',
      'সন্ধ্যার আলো নামলে ক্যাম্পাস চত্বর আরও বেশি মায়াবী হয়ে ওঠে।'
    ]
  }
];
