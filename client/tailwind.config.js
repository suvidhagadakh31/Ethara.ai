/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519'
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        surface: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh': 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
        'aurora': 'linear-gradient(135deg, rgba(244,63,94,0.1) 0%, rgba(245,158,11,0.1) 50%, rgba(244,63,94,0.05) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(244, 63, 94, 0.3)',
        'glow': '0 0 30px -5px rgba(244, 63, 94, 0.4)',
        'glow-lg': '0 0 50px -12px rgba(244, 63, 94, 0.5)',
        'glow-accent': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'card-hover': '0 20px 60px -15px rgba(244, 63, 94, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 6s ease infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'blur-in': 'blurIn 0.4s ease-out',
        'count-up': 'countUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-15px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        blurIn: { '0%': { opacity: '0', filter: 'blur(10px)' }, '100%': { opacity: '1', filter: 'blur(0)' } },
        countUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glow: { '0%': { boxShadow: '0 0 5px rgba(244,63,94,0.2)' }, '100%': { boxShadow: '0 0 30px rgba(244,63,94,0.5)' } },
        float: { '0%, 100%': { transform: 'translateY(0) rotate(0deg)' }, '33%': { transform: 'translateY(-8px) rotate(1deg)' }, '66%': { transform: 'translateY(-4px) rotate(-1deg)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        gradient: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        bounceSubtle: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        wiggle: { '0%, 100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }
    },
  },
  plugins: [],
};
