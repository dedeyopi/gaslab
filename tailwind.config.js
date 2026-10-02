/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
  floaty: {
    '0%,100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-6px)' },
  },
  fadeUp: {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  ringPulse: {
    '0%':   { boxShadow: '0 0 0 0 rgba(34,211,238,0.55)' },
    '70%':  { boxShadow: '0 0 0 10px rgba(34,211,238,0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(34,211,238,0)' },
  },
},
animation: {
  floaty: 'floaty 4s ease-in-out infinite',
  fadeUp: 'fadeUp .45s ease-out both',
  pulseRing: 'ringPulse 1.6s ease-out infinite',
},
    },
  },
  plugins: [],
};