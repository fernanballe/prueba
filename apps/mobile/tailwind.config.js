/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Paleta WorldDex
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8d090',
          dark: '#9c7c2e',
        },
        paper: {
          DEFAULT: '#f5f0e8',
          dark: '#e8e0d0',
        },
        ink: {
          DEFAULT: '#0e0e0e',
          light: '#2a2a2a',
          muted: '#5a5a5a',
        },
        stamp: {
          DEFAULT: '#7a7060',
          light: '#a09880',
        },
        // Colores de rareza
        rarity: {
          common: '#9E9E9E',
          uncommon: '#4CAF50',
          rare: '#2196F3',
          epic: '#9C27B0',
          legendary: '#FF9800',
        },
        // Ligas
        league: {
          bronze: '#CD7F32',
          silver: '#C0C0C0',
          gold: '#FFD700',
          diamond: '#B9F2FF',
          elite: '#FF6B6B',
        },
      },
      fontFamily: {
        display: ['PlayfairDisplay_700Bold'],
        'display-italic': ['PlayfairDisplay_700BoldItalic'],
        body: ['DMSans_400Regular'],
        'body-medium': ['DMSans_500Medium'],
        'body-bold': ['DMSans_700Bold'],
        mono: ['DMMono_400Regular'],
      },
    },
  },
  plugins: [],
};
