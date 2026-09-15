/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07080A',
          900: '#0C0D11',
          850: '#121319',
          800: '#171922',
          700: '#20232E',
          600: '#2B2F3D',
        },
        aqua: {
          400: '#5EE7F5',
          500: '#22D3EE',
          600: '#0EA5BE',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 12px 40px -12px rgba(0,0,0,0.9)',
        glow: '0 0 0 1px rgba(94,231,245,0.25), 0 8px 32px -8px rgba(34,211,238,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
