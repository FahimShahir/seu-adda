import { useRef, useCallback, useEffect } from 'react';

export function useAmbientAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Rain nodes
  const rainSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const rainStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Night nodes
  const nightSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nightGainRef = useRef<GainNode | null>(null);
  const nightStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get or initialize AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // Generate pink noise buffer for realistic rain sound
  const createRainBuffer = useCallback((ctx: AudioContext): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
      b6 = white * 0.115926;
    }

    return noiseBuffer;
  }, []);

  // Generate natural night crickets & tranquil evening air buffer
  const createNightBuffer = useCallback((ctx: AudioContext): AudioBuffer => {
    const sampleRate = ctx.sampleRate;
    const duration = 6.0; // 6 seconds seamless loop
    const buffer = ctx.createBuffer(2, Math.floor(sampleRate * duration), sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // Helper: Add synthesized cricket chirp burst
    const addChirp = (startSec: number, freq: number, volume: number, pan: number) => {
      const pulses = 4;
      const pulseLen = 0.022; // 22ms syllable
      const gapLen = 0.014;   // 14ms inter-syllable gap

      for (let p = 0; p < pulses; p++) {
        const pStart = startSec + p * (pulseLen + gapLen);
        const startSample = Math.floor(pStart * sampleRate);
        const pulseSamples = Math.floor(pulseLen * sampleRate);

        for (let i = 0; i < pulseSamples; i++) {
          const idx = startSample + i;
          if (idx >= left.length) break;
          const t = i / sampleRate;
          // Half-sine window envelope for natural chirp strike and decay
          const env = Math.sin((Math.PI * i) / pulseSamples);
          const val = Math.sin(2 * Math.PI * freq * t) * env * volume;

          // Subtle stereo panning across the campus
          left[idx] += val * (1 - pan * 0.4);
          right[idx] += val * (1 + pan * 0.4);
        }
      }
    };

    // Realistic cricket polyphony across the night campus lawn
    addChirp(0.3, 4650, 0.065, -0.3);
    addChirp(1.1, 4350, 0.045, 0.35);
    addChirp(2.0, 4720, 0.060, -0.2);
    addChirp(3.1, 4420, 0.050, 0.25);
    addChirp(4.2, 4680, 0.070, -0.4);
    addChirp(5.0, 4380, 0.045, 0.15);

    // Gentle late-night air breeze (subtle filtered noise)
    let b0 = 0, b1 = 0;
    for (let i = 0; i < left.length; i++) {
      const white = (Math.random() * 2 - 1) * 0.01;
      b0 = 0.985 * b0 + white * 0.015;
      b1 = 0.980 * b1 + (Math.random() * 2 - 1) * 0.0003;
      left[i] += b0;
      right[i] += b0 * 0.92 + b1 * 0.08;
    }

    return buffer;
  }, []);

  // Toggle or set Rain ambient sound
  const setRainAudio = useCallback((enabled: boolean) => {
    try {
      const ctx = getAudioContext();

      if (rainStopTimerRef.current) {
        clearTimeout(rainStopTimerRef.current);
        rainStopTimerRef.current = null;
      }

      if (enabled) {
        if (!rainSourceRef.current) {
          const rainBuf = createRainBuffer(ctx);
          const src = ctx.createBufferSource();
          src.buffer = rainBuf;
          src.loop = true;

          // Low-pass filter for cozy outdoor rain texture
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(850, ctx.currentTime);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.0);

          src.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          src.start();
          rainSourceRef.current = src;
          rainGainRef.current = gain;
        } else if (rainGainRef.current) {
          rainGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
          rainGainRef.current.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.8);
        }
      } else {
        if (rainGainRef.current) {
          rainGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
          rainGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
        }
        rainStopTimerRef.current = setTimeout(() => {
          try {
            rainSourceRef.current?.stop();
            rainSourceRef.current?.disconnect();
          } catch (_) {}
          rainSourceRef.current = null;
          rainGainRef.current = null;
          rainStopTimerRef.current = null;
        }, 650);
      }
    } catch (e) {
      console.warn('Rain audio error:', e);
    }
  }, [getAudioContext, createRainBuffer]);

  // Toggle or set Night ambient sound (crickets & peaceful late-night breeze)
  const setNightAudio = useCallback((enabled: boolean) => {
    try {
      const ctx = getAudioContext();

      if (nightStopTimerRef.current) {
        clearTimeout(nightStopTimerRef.current);
        nightStopTimerRef.current = null;
      }

      if (enabled) {
        if (!nightSourceRef.current) {
          const nightBuf = createNightBuffer(ctx);
          const src = ctx.createBufferSource();
          src.buffer = nightBuf;
          src.loop = true;

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.2);

          src.connect(gain);
          gain.connect(ctx.destination);

          src.start();
          nightSourceRef.current = src;
          nightGainRef.current = gain;
        } else if (nightGainRef.current) {
          nightGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
          nightGainRef.current.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.8);
        }
      } else {
        if (nightGainRef.current) {
          nightGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
          nightGainRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
        }
        nightStopTimerRef.current = setTimeout(() => {
          try {
            nightSourceRef.current?.stop();
            nightSourceRef.current?.disconnect();
          } catch (_) {}
          nightSourceRef.current = null;
          nightGainRef.current = null;
          nightStopTimerRef.current = null;
        }, 750);
      }
    } catch (e) {
      console.warn('Night audio error:', e);
    }
  }, [getAudioContext, createNightBuffer]);

  // Play an acoustic guitar harmonic chord strum
  const playGuitarStrum = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // D minor 9 campus chord (D3, A3, F4, C5, E5)
      const freqs = [146.83, 220.00, 349.23, 523.25, 659.25];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now + idx * 0.04);
        filter.frequency.exponentialRampToValueAtTime(300, now + idx * 0.04 + 1.8);

        gain.gain.setValueAtTime(0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 2.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 2.1);
      });
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }, [getAudioContext]);

  // Play tea cup glass clink sound
  const playTeaClink = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const clinkFreqs = [2400, 3100];

      clinkFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.02);

        gain.gain.setValueAtTime(0.18, now + i * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.02 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.02);
        osc.stop(now + i * 0.02 + 0.45);
      });
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }, [getAudioContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        rainSourceRef.current?.stop();
        nightSourceRef.current?.stop();
        audioCtxRef.current?.close();
      } catch (_) {}
    };
  }, []);

  return {
    setRainAudio,
    setNightAudio,
    playGuitarStrum,
    playTeaClink
  };
}
