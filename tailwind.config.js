/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        seu: {
          blue: '#003366',
          gold: '#C5A059',
          light: '#F4F7F6',
          dark: '#0c1829',
          card: '#16243b'
        }
      },
      keyframes: {
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0.8' },
          '50%': { transform: 'translateY(-10px) scaleX(1.3)', opacity: '0.4' },
          '100%': { transform: 'translateY(-20px) scaleX(1.6)', opacity: '0' },
        },
        pop: {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '80%': { transform: 'scale(1.05) translateY(-2px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
          '52%': { opacity: '0.95' },
          '54%': { opacity: '0.7' },
          '56%': { opacity: '1' },
        },
        floatNote: {
          '0%': { transform: 'translateY(0) rotate(0deg) scale(0.8)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(-40px) rotate(20deg) scale(1.2)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 18px rgba(255, 215, 0, 0.9))' },
        }
      },
      animation: {
        steam: 'steam 2s infinite ease-out',
        pop: 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        flicker: 'flicker 4s infinite ease-in-out',
        floatNote: 'floatNote 2.5s infinite linear',
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
