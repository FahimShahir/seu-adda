import { useState, useEffect } from 'react';

export interface DhakaWeather {
  temperature: number;
  isDay: boolean;
  isRaining: boolean;
  description: string;
  icon: string;
}

// Convert English digits to Bengali digits
export function toBengaliNumerals(str: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
}

export function useDhakaClockAndWeather() {
  const [dhakaTime, setDhakaTime] = useState<string>('');
  const [weather, setWeather] = useState<DhakaWeather | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);

  // Live Dhaka Clock (UTC+6)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format in Asia/Dhaka timezone
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      // Convert to Bengali numerals
      setDhakaTime(toBengaliNumerals(formatted));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Dhaka Weather from Open-Meteo API
  useEffect(() => {
    let isCancelled = false;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code&timezone=Asia%2FDhaka'
        );
        if (!res.ok) throw new Error('Weather API error');
        const data = await res.json();
        if (isCancelled || !data.current) return;

        const current = data.current;
        const temp = Math.round(current.temperature_2m);
        const isDay = current.is_day === 1;
        const code = current.weather_code;
        const precip = current.precipitation || 0;

        // Is it raining? (Codes 51-67, 80-82, 95-99, or precip > 0.1mm)
        const isRaining = precip > 0.1 || (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;

        let description = 'পরিষ্কার';
        let icon = isDay ? '☀️' : '🌙';

        if (isRaining) {
          description = 'বৃষ্টি হচ্ছে';
          icon = '🌧️';
        } else if (code === 1 || code === 2 || code === 3) {
          description = 'আংশিক মেঘলা';
          icon = isDay ? '⛅' : '☁️';
        } else if (code === 45 || code === 48) {
          description = 'কুয়াশা';
          icon = '🌫️';
        }

        setWeather({
          temperature: temp,
          isDay,
          isRaining,
          description,
          icon
        });
      } catch (err) {
        console.warn('Could not fetch Dhaka weather, using fallback:', err);
        // Fallback based on hour
        const now = new Date();
        const bdHour = (now.getUTCHours() + 6) % 24;
        const isDayFallback = bdHour >= 6 && bdHour < 18;
        setWeather({
          temperature: 28,
          isDay: isDayFallback,
          isRaining: false,
          description: isDayFallback ? 'রোদ' : 'রাত',
          icon: isDayFallback ? '☀️' : '🌙'
        });
      } finally {
        if (!isCancelled) setIsLoadingWeather(false);
      }
    };

    fetchWeather();
    // Re-check weather every 20 minutes
    const interval = setInterval(fetchWeather, 20 * 60 * 1000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  return {
    dhakaTime,
    weather,
    isLoadingWeather
  };
}
