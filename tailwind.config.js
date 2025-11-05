/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./components/**/*.html",
    "./admin/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Smart Scale Purple Theme
        'smart-purple': {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        'smart-cyan': {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
        },
        'smart-dark': {
          DEFAULT: '#0F172A',
          card: '#1E293B',
          lighter: '#334155',
        },
        'smart-text': {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.8)',
          muted: 'rgba(255, 255, 255, 0.6)',
        },
      },
      fontFamily: {
        'body': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'heading': ['Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-purple-cyan': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        'gradient-purple-dark': 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
        'gradient-cyan-light': 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
      },
      boxShadow: {
        'purple': '0 4px 15px rgba(139, 92, 246, 0.5)',
        'purple-lg': '0 8px 32px rgba(139, 92, 246, 0.3)',
        'cyan': '0 4px 15px rgba(6, 182, 212, 0.5)',
        'dark': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable class-based dark mode
}


