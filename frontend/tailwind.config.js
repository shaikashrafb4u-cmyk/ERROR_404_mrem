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
        background: '#0A0A0A',
        surface: {
          DEFAULT: '#141414',
          card: '#141414',
          secondary: '#1C1C1C',
          hover: '#222222',
        },
        border: {
          DEFAULT: '#2A2A2A',
          subtle: '#242424',
          strong: '#3A3A3A',
        },
        primary: {
          DEFAULT: '#3B82F6', // Modern electric blue
          hover: '#2563EB',
          muted: '#1D4ED8',
          glow: 'rgba(59, 130, 246, 0.15)',
        },
        accent: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          purple: '#8B5CF6',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card-glow': '0 0 20px -5px rgba(59, 130, 246, 0.1)',
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
