/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f6f4',
          100: '#ebe8e4',
          200: '#d6d0c8',
          300: '#b8aea1',
          400: '#9a8d7b',
          500: '#8a7c6a',
          600: '#7d6f5d',
          700: '#675b4e',
          800: '#564d43',
          900: '#494038',
          950: '#2a2420',
        },
        gold: {
          50: '#fdf9ed',
          100: '#f9eecd',
          200: '#f2da94',
          300: '#e9c258',
          400: '#e2a82e',
          500: '#d9901a',
          600: '#bf6f14',
          700: '#995214',
          800: '#7d4218',
          900: '#6a3719',
          950: '#3d1b0a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
