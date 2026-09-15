/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm near-black, so the rose accent never reads as magenta on cold grey.
        ink: {
          950: '#0A0908',
          900: '#100E0E',
          850: '#171414',
          800: '#1F1B1B',
          700: '#2C2626',
          600: '#3D3535',
        },
        blush: {
          200: '#FBDDD8',
          300: '#F7C5BE',
          400: '#F2A9A0',
          500: '#E8918A',
          600: '#D1756E',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'Segoe UI', 'sans-serif'],
        display: ['Cormorant Garamond', 'Didot', 'Georgia', 'serif'],
      },
      boxShadow: {
        lift: '0 12px 40px -12px rgba(0,0,0,0.9)',
        glow: '0 0 0 1px rgba(242,169,160,0.22), 0 8px 30px -10px rgba(242,169,160,0.3)',
      },
    },
  },
  plugins: [],
}
