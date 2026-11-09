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
  // 1. Central Campus Guitarist
  {
    id: 'guitarist_main',
    name: 'ক্যাম্পাস গিটারিস্ট (সৌম্য)',
    title: 'গিটার বাজাও ও গান শুনুন',
    emoji: '🎸',
    x: 54.0,
    y: 74.0,
    width: 15.4,
    height: 16.6,
    actionType: 'music',
    dialogues: [
      'সবাই একসাথে গলা মেলাবি কিন্তু— "অনিকেত প্রান্তর" নাকি "আবার হাসিমুখ"?',
      'দোস্ত, গিটারের ৩ নম্বর তারটা হালকা লুজ হয়ে গেছে... দাঁড়া একটু সুর ধরি!',
      'পরের গানটা উৎসর্গ করলাম আমাদের পুরো ব্যাচের শেষ বিকেলের আড্ডাকে!',
      'গান চলবে নন-স্টপ! আড্ডার মেজাজ কোনোভাবেই মিস দেওয়া যাবে না।'
    ]
  },

  // 2. Presentation Partner (Blue shirt guy to the left of guitarist)
  {
    id: 'blue_shirt_guy_talking',
    name: 'প্রেজেন্টেশন পার্টনার (ফাহিম)',
    title: 'গ্রুপ স্টাডির প্ল্যানিং',
    emoji: '🗣️',
    x: 41.0,
    y: 74.4,
    width: 12.0,
    height: 16.6,
    actionType: 'dialogue',
    dialogues: [
      'শোন মামা, প্রেজেন্টেশনে তুই ভূমিকা দিবি, আমি কনক্লুশন টানব। মাঝখানের স্লাইডগুলা ওরে দিয়ে দে!',
      'মিডটার্মের রেজাল্ট দিল নাকি রে? পোর্টালে লগইন করতে হাত কাঁপতেছে!',
      'দোস্ত, একটু পরে তো ল্যাব ক্লাস... এটেন্ডেন্সে প্রক্সি দেওয়া যাবে কোনোভাবে?',
      'চা শেষ কইরা চল লাইব্রেরির সামনে যাই, বাতাসটা সেই লাগতেছে।'
    ]
  },

  // 3. Music Loving Friend (Cyan shirt guy to the right of guitarist)
  {
    id: 'listener_cyan_shirt',
    name: 'গানপ্রেমী বন্ধু (আসিফ)',
    title: 'গানের অনুরোধকারী',
    emoji: '🎵',
    x: 66.2,
    y: 74.6,
    width: 9.0,
    height: 16.2,
    actionType: 'dialogue',
    dialogues: [
      'দোস্ত, আর্টসেলের "দুঃখ বিলাস" বা শিরোনামহীনের "পাখি" গানটা একটু বাজাও না রে!',
      'ক্যাম্পাসের এই বিকেলটার মতো শান্তি আর কোথাও পাওয়া যাবে না।',
      'তোর গিটার বাজানো শুনলে এমনিতেই মন ভালো হয়ে যায় রে দোস্ত।'
    ]
  },

  // 4. White Panjabi Guy (Tour Organizer)
  {
    id: 'panjabi_guy',
    name: 'ট্যুর উদ্যোক্তা (তানভীর)',
    title: 'সাজেক ট্যুরের প্ল্যানিং',
    emoji: '🏔️',
    x: 77.2,
    y: 74.2,
    width: 14.3,
    height: 17.0,
    actionType: 'dialogue',
    dialogues: [
      'দোস্ত, সেমিস্টার ফাইনাল শেষ হইলেই কিন্তু সাজেক ট্যুর! চাঁদের গাড়ির ভাড়া কনফার্ম করছি!',
      'সিজিপিএ দিয়া কি হইব মামা? ক্যাম্পাসের এই আড্ডার দিনগুলাই সারাজীবন মনে থাকবে!',
      'মামা, এক কাপ রং চা পাঠাও তো এদিক! চিনি একটু কম দিও।'
    ]
  },

  // 5. Plaid Shirt Junior Boy
  {
    id: 'plaid_shirt_boy',
    name: 'জুনিয়র শিক্ষার্থী (সজীব)',
    title: 'নোট ও সাজেশনের খোঁজে',
    emoji: '📚',
    x: 84.0,
    y: 77.3,
    width: 7.0,
    height: 12.3,
    actionType: 'dialogue',
    dialogues: [
      'ভাইয়া, গত সেমিস্টারের মিডটার্মের প্রশ্ন বা ক্লাস নোটস কি আপনাদের কাছে আছে?',
      'স্যার ল্যাব রিপোর্টে অনেক কড়া মার্কিং করে শুনলাম... কীভাবে লিখলে ভালো হবে?',
      'আপনাদের আড্ডা দেখে ভালো লাগল ভাইয়া, আমাদের ব্যাচ তো শুধু এসাইনমেন্ট নিয়েই থাকে!'
    ]
  },

  // 6. Front Seated Blue T-Shirt Guy (Back facing us)
  {
    id: 'front_blue_guy_seated',
    name: 'একনিষ্ঠ শ্রোতা (রাকিব)',
    title: 'চায়ের আড্ডায় মগ্ন',
    emoji: '☕',
    x: 68.3,
    y: 82.3,
    width: 15.4,
    height: 17.4,
    actionType: 'dialogue',
    dialogues: [
      'আমার লাল চা তো ঠান্ডা হয়ে বরফ হয়ে গেছে গানের মধ্যে ডুইবা!',
      'ক্যাম্পাসের এই সিঁড়িতে বইসা গিটারের গান শোনার কোনো তুলনা নাই।',
      'ক্যান্টিনের শিংগাড়াটা সেই ছিল আজকে, কে কে খাইলি?'
    ]
  },

  // 7. Red Shirt Guy on Far Right (Mobile & Crush Researcher)
  {
    id: 'red_shirt_mobile_guy',
    name: 'ক্রাশ গবেষক (ইমরান)',
    title: 'ফেসবুক ও ডিপার্টমেন্ট আপডেট',
    emoji: '📱',
    x: 92.3,
    y: 74.8,
    width: 13.7,
    height: 16.6,
    actionType: 'dialogue',
    dialogues: [
      'দোস্ত, ওই যে লাইব্রেরির সামনে দিয়ে গেল, ও কোন ডিপার্টমেন্টের বলতে পারিস?',
      'ক্যাম্পাস কনফেশন পেইজে নাকি কে তোর নামে পোস্ট দিসে রে! চেক কর তাড়াতাড়ি!',
      'ইনবক্সে মেসেজ সিন কইরা রাইখা দিল রে দোস্ত... রিপ্লাই দিল না!'
    ]
  },

  // 8. Bottom-Left Girls in Saree (Red & Green Saree)
  {
    id: 'left_girls_red_green',
    name: 'শাড়ি পরা বান্ধবীদ্বয় (মিতু ও তানিয়া)',
    title: 'উৎসব ও ক্যাম্পাসের স্মৃতি',
    emoji: '🥻',
    x: 9.5,
    y: 73.6,
    width: 13.1,
    height: 16.6,
    actionType: 'dialogue',
    dialogues: [
      'আজকে ডিপার্টমেন্টাল ফেস্টে কত সুন্দর লাগতেছে পুরো ক্যাম্পাসটাকে!',
      'ক্যাম্পাসের প্রথম দিনটার কথা মনে আছে? কত অচেনা লাগছিল সবাইকে, আর আজ তোরাই পরিবার!',
      'গ্র্যাজুয়েশনের পর যখন ক্যাম্পাসে আসব, এই সিঁড়িটা খুব মিস করব রে।'
    ]
  },

  // 9. Bottom-Left Girls in Pink & Cyan Dresses
  {
    id: 'left_girls_pink_cyan',
    name: 'বান্ধবীদ্বয় (রিয়া ও নাবিলা)',
    title: 'এসাইনমেন্ট ও ক্লাস নোটস',
    emoji: '👭',
    x: 21.4,
    y: 73.8,
    width: 14.3,
    height: 16.2,
    actionType: 'dialogue',
    dialogues: [
      'আরে দোস্ত, এসাইনমেন্ট সাবমিট করছিস? ডেডলাইন কিন্তু রাত ১১:৫৯ এ!',
      'কালকে সকালে নাকি সারপ্রাইজ কুইজ নেবে ম্যাম! আমি তো একটা স্লাইডও দেখি নাই!',
      'তোর কোর্সটা তো ড্রপ করার কথা ছিল রে... শেষে ভালো রেজাল্ট করে দিলি!'
    ]
  },

  // 10. Standing Trio on Left (Near Column/Pillar)
  {
    id: 'standing_couple_left',
    name: 'পিলারের পাশের ত্রয়ী (সাকিব, মেহজাবিন ও অনন্যা)',
    title: 'ক্লাসের ফাঁকে আড্ডা',
    emoji: '👫',
    x: 15.4,
    y: 63.3,
    width: 14.3,
    height: 14.2,
    actionType: 'dialogue',
    dialogues: [
      'ক্লাসের ব্রেক মাত্র ১৫ মিনিট, এই সময়ের মধ্যে ক্যান্টিনের ভিড় ঠেলে চা নেওয়া এক বিরাট যুদ্ধ!',
      'স্যার আজকে ক্লাসে এত জটিল অংক করাল, মাথার উপর দিয়া গেল পুরোটা!',
      'চল আমরাও গিয়ে ওদের গিটারের গানের আসরে বসি।'
    ]
  },

  // 11. Girls Sitting on Left Stairs (Yellow & Purple Dress)
  {
    id: 'stairs_girls_sitting',
    name: 'সিঁড়ির আড্ডা (জেরিন ও সাবা)',
    title: 'সিঁড়ির আরামের হাওয়া',
    emoji: '💛',
    x: 36.2,
    y: 62.3,
    width: 11.0,
    height: 9.0,
    actionType: 'dialogue',
    dialogues: [
      '৪র্থ তলার লিফটের সামনে যে ভিড়... তার চেয়ে এই সিঁড়ি বেয়ে ওঠাই শান্তির!',
      'উপর থেকে পুরো ক্যাম্পাস চত্বর আর আড্ডা দেখতে দারুণ লাগে।'
    ]
  },

  // 12. Friends Sitting on Right Stairs (Red, Blue, Dark dresses)
  {
    id: 'stairs_group_right',
    name: 'সিঁড়ির ডানপাশের বন্ধুদল',
    title: 'সিজিপিএ ও পরীক্ষার গল্প',
    emoji: '🎉',
    x: 79.6,
    y: 62.5,
    width: 21.4,
    height: 10.0,
    actionType: 'dialogue',
    dialogues: [
      'সিজিপিএ যা-ই আসুক, দোস্তদের সাথে এই মুহূর্তগুলাই তো আসল জীবন!',
      'আজকে ক্যাম্পাস ছেড়ে বাসায় যেতে একদম ইচ্ছা করতেছে না রে!',
      'পরের ক্লাসের এটেন্ডেন্স কে দিবি বল? একজন গিয়ে প্রক্সি দিয়ে আয়!'
    ]
  },

  // 13. Security Guard by the Turnstile Entrance
  {
    id: 'turnstile_guard',
    name: 'সিকিউরিটি গার্ড মামা (কাসেম মামা)',
    title: 'আইডি কার্ড চেকার',
    emoji: '👮',
    x: 34.4,
    y: 56.6,
    width: 6.0,
    height: 10.0,
    actionType: 'dialogue',
    dialogues: [
      'মামা, আইডি কার্ডটা গলায় ঝুলাইয়া ক্লাসে যান! নিয়ম সবার জন্য এক!',
      'সকালে এত দৌড়াদৌড়ি করেন ক্যান? ক্লাস কি ভাগি যাবে?',
      'আপনারা হাসিখুশি থাকলে আমাদের এই ডিউটি করতেই ভালো লাগে।'
    ]
  },

  // 14. Students passing through the Turnstile Gate
  {
    id: 'turnstile_students',
    name: 'টার্নস্টাইল পেরোনো শিক্ষার্থীদল',
    title: 'দেরি করে ক্লাসের তাড়া',
    emoji: '🏃‍♂️',
    x: 60.0,
    y: 56.4,
    width: 15.4,
    height: 11.0,
    actionType: 'dialogue',
    dialogues: [
      'তাড়াতাড়ি চ কার্ড পাঞ্চ কর! ক্লাসের আর মাত্র ২ মিনিট বাকি!',
      'স্যার কিন্তু ১০ মিনিট পার হলে আর ঢুকতে দেবে না রে দোস্ত!',
      'আইডি কার্ড ভুলে বাসায় রেখে আসছি... মামা প্লিজ ঢুকতে দেন আজকে!'
    ]
  },

  // 15. Student walking on far right into building
  {
    id: 'standing_guy_right',
    name: 'লাইব্রেরিমুখী শিক্ষার্থী (অপু)',
    title: 'শান্ত পড়ার খোঁজে',
    emoji: '🚶‍♂️',
    x: 95.6,
    y: 64.5,
    width: 6.5,
    height: 13.0,
    actionType: 'dialogue',
    dialogues: [
      'আমি একটু লাইব্রেরিতে যাচ্ছি ভাই, কালকে থিসিসের ড্রাফট সাবমিট করতে হবে!',
      'ক্যাম্পাসের এই গান-বাজনার পরিবেশটা আসলেই সুন্দর।'
    ]
  },

  // 16. Southeast University Signboard
  {
    id: 'seu_signboard',
    name: 'Southeast University সাইনবোর্ড',
    title: 'আমাদের ক্যাম্পাস গর্ব',
    emoji: '🎓',
    x: 51.4,
    y: 38.6,
    width: 17.0,
    height: 4.5,
    actionType: 'dialogue',
    dialogues: [
      'Southeast University — জ্ঞানের আলোয় প্রদীপ্ত এক ভালোবাসার নাম।',
      'ক্যাম্পাস তো শুধু পড়ার জায়গা না, এইটা আজীবনের স্মৃতির আলবাম।'
    ]
  },

  // 17. Canteen Tea Cups & Shingara Plate (Foreground)
  {
    id: 'tea_cups_plate',
    name: 'ক্যান্টিনের লাল চা ও গরম সিঙ্গাড়া',
    title: 'চিয়ার্স! এক কাপ লাল চা',
    emoji: '☕',
    x: 51.4,
    y: 83.1,
    width: 16.0,
    height: 6.0,
    actionType: 'cheers',
    dialogues: [
      'চিয়ার্স! ☕ লাল চা আর গরম সিঙ্গাড়ায় জমে উঠুক ক্যাম্পাস আড্ডা!',
      'চা ফুটছে ধোঁয়া ওঠা গরম! আরেক কাপ লাগবে নাকি মামা?',
      'ক্যাম্পাস লাইফের আসল ফুয়েল হইলো এই এক কাপ লাল চা!'
    ]
  },

  // 18. Hanging Lamp (Day/Night Light Switch)
  {
    id: 'hanging_lamp_day_night',
    name: 'সিলিং লাইট',
    title: 'দিন ও সন্ধ্যার ক্যাম্পাস আলো পরিবর্তন করো',
    emoji: '💡',
    x: 45.7,
    y: 11.7,
    width: 8.0,
    height: 6.0,
    actionType: 'lamp',
    dialogues: [
      'ট্যাপ করে দিন ও সন্ধ্যার ক্যাম্পাস মুড পরিবর্তন করো!',
      'সন্ধ্যা নামলে ক্যাম্পাসের চত্বর আরও স্নিগ্ধ ও মায়াবী হয়ে ওঠে।'
    ]
  },

  // 19. Laptop and Notebook Backpacks on Ground
  {
    id: 'campus_bags',
    name: 'ল্যাপটপ ও নোটখাতার ব্যাগ',
    title: 'স্টুডেন্ট লাইফের বোঝা',
    emoji: '🎒',
    x: 39.8,
    y: 87.8,
    width: 21.4,
    height: 7.5,
    actionType: 'dialogue',
    dialogues: [
      'ব্যাগটা সামলা দোস্ত, ভিতরে ল্যাপটপ, চার্জার আর স্যারের অ্যাসাইনমেন্ট নোট আছে!',
      'এই ব্যাগে বই খাতার চেয়ে ক্যান্টিনের নাস্তা আর চিপসের প্যাকেটই বেশি থাকে!'
    ]
  }
];
