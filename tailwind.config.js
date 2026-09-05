/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { navy: '#102A43', ink: '#17212B', muted: '#64748B', line: '#DCE3E8', paper: '#F8FAF9', teal: '#0F766E', gold: '#C59642', soft: '#EAF3F1' },
    fontFamily: { display: ['DM Serif Display', 'Georgia', 'serif'], sans: ['Manrope', 'system-ui', 'sans-serif'] },
    maxWidth: { site: '1180px' },
    boxShadow: { soft: '0 12px 35px rgba(16,42,67,.09)', float: '0 20px 55px rgba(16,42,67,.16)' },
    keyframes: { rise: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }, drift: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } } },
    animation: { rise: 'rise .75s cubic-bezier(.22,1,.36,1) both', drift: 'drift 7s ease-in-out infinite' },
  } },
  plugins: [],
}
