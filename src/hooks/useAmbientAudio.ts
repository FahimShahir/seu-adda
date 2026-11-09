import { useRef, useState, useCallback, useEffect } from 'react';

export function useAmbientAudio() {
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(0.25);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

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

  // Toggle ambient evening breeze / gentle rain
  const toggleAmbient = useCallback(() => {
    const ctx = getAudioContext();
    if (isAmbientOn) {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        noiseNodeRef.current?.disconnect();
        noiseNodeRef.current = null;
        setIsAmbientOn(false);
      }, 500);
    } else {
      // Create pink noise generator for rain / breeze
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
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for rain sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(ambientVolume, ctx.currentTime + 0.8);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      gainNodeRef.current = gain;
      setIsAmbientOn(true);
    }
  }, [getAudioContext, isAmbientOn, ambientVolume]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(ambientVolume, audioCtxRef.current.currentTime);
    }
  }, [ambientVolume]);

  return {
    isAmbientOn,
    ambientVolume,
    setAmbientVolume,
    toggleAmbient,
    playGuitarStrum,
    playTeaClink
  };
}

