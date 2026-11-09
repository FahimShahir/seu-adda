export interface Track {
  videoId: string;
  title: string;
  artist: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tracks: Track[];
}

export const CAMPUS_PLAYLISTS: Playlist[] = [
  {
    id: 'campus_classics',
    name: '🎸 SEU আনপ্লাগড ও ক্যাম্পাস ব্যান্ড',
    description: 'আর্টসেল, আর্নব, শিরোনামহীন, ওয়ারফেজ ও মাইলস',
    emoji: '🎸',
    tracks: [
      {
        videoId: 'CL97xVw5RgU',
        title: 'অনিকেত প্রান্তর (Oniket Prantor)',
        artist: 'Artcell (আর্টসেল)'
      },
      {
        videoId: 'JkK8g6HM496',
        title: 'আবার হাসিমুখ (Abar Hashimukh)',
        artist: 'Shironamhin (শিরোনামহীন)'
      },
      {
        videoId: '4K5J3W5F7oE',
        title: 'তোমার জন্য (Tomar Jonno)',
        artist: 'Arnob (আর্নব)'
      },
      {
        videoId: 'zN13M5vQ0kQ',
        title: 'পূর্ণতা (Purnota)',
        artist: 'Warfaze (ওয়ারফেজ)'
      },
      {
        videoId: 'aV1k8L0N0-8',
        title: 'সেই তুমি (Shei Tumi)',
        artist: 'LRB (আইয়ুব বাচ্চু)'
      },
      {
        videoId: 'eQ7R9T2-4kE',
        title: 'ফিরিয়ে দাও (Firiye Dao)',
        artist: 'Miles (মাইলস)'
      }
    ]
  },
  {
    id: 'rainy_campus',
    name: '☕ বৃষ্টি ভেজা ক্যাম্পাস ও স্মৃতির ধুন',
    description: 'সফট অ্যাকোস্টিক ও ক্যাফে মেজাজ',
    emoji: '☕',
    tracks: [
      {
        videoId: '4K5J3W5F7oE',
        title: 'সে যে বসে আছে একা একা',
        artist: 'আর্নব'
      },
      {
        videoId: 'P67M2-Fv46U',
        title: 'বন্ধ জানালা (Bondho Janala)',
        artist: 'শিরোনামহীন'
      },
      {
        videoId: 'tB7iQhIuYjU',
        title: 'এ হাওয়া (E Hawa)',
        artist: 'মেঘদল'
      }
    ]
  },
  {
    id: 'evergreen_rock',
    name: '🔥 এভারগ্রিন ৯০ ও ২০০০-এর বাংলা ব্যান্ড',
    description: 'জেমস, আইয়ুব বাচ্চু ও রক আড্ডা',
    emoji: '🔥',
    tracks: [
      {
        videoId: 'aV1k8L0N0-8',
        title: 'রূপালী গিটার (Rupali Guitar)',
        artist: 'LRB'
      },
      {
        videoId: 'CL97xVw5RgU',
        title: 'দুঃখ বিলাস (Dukkho Bilash)',
        artist: 'আর্টসেল'
      },
      {
        videoId: 'zN13M5vQ0kQ',
        title: 'বসে আছি একা (Boshé Achi)',
        artist: 'ওয়ারফেজ'
      }
    ]
  }
];
