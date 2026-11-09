export interface Playlist {
  id: string;
  name: string;
  description: string;
  emoji: string;
  isNightTheme?: boolean;
}

export const CAMPUS_PLAYLISTS: Playlist[] = [
  {
    id: 'PLOPZkRWRrUEk',
    name: '🎸 SEU আনপ্লাগড ও ক্যাম্পাস ব্যান্ড',
    description: 'আর্নব, আর্টসেল, শিরোনামহীন, মেঘদল, অর্থহীন ও মাইলসের গান',
    emoji: '🎸',
    isNightTheme: false
  },
  {
    id: 'PLEdkhGESsVjk',
    name: '🔥 এভারগ্রিন ৯০ ও ২০০০-এর বাংলা ব্যান্ড',
    description: 'জেমস, আইয়ুব বাচ্চু, ওয়ারফেজ, ব্ল্যাক ও রক আড্ডা',
    emoji: '🔥',
    isNightTheme: true
  },
  {
    id: 'PLFMUKwKpE43A',
    name: '☕ বৃষ্টি ভেজা ক্যাম্পাস ও স্মৃতির ধুন',
    description: 'সফট অ্যাকোস্টিক, পুরোনো দিনের সুর ও চা খাওয়ার মেজাজ',
    emoji: '☕',
    isNightTheme: true
  },
  {
    id: 'PLTMo9paCqCmA',
    name: '🎧 আধুনিক গান ও ক্যাম্পাস আড্ডা',
    description: 'কোক স্টুডিও বাংলা, প্রীতম, হাবিব ও তরুণ প্রজন্মের সুর',
    emoji: '🎧',
    isNightTheme: false
  },
  {
    id: 'PL1z-qnmuvvTXVR1aaYvsOs_kVmSa9s6Us',
    name: '🎉 মাস্ত গান ও ক্যাম্পাসের হৈচৈ',
    description: 'আনন্দ, নাচ ও হইহুল্লোড়ের জন্য সেরা ট্র্যাকলিস্ট',
    emoji: '🎉',
    isNightTheme: false
  }
];

