export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bubble: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          primary: '#4F46E5',   // Indigo
          secondary: '#0EA5E9', // Sky
          accent: '#10B981',    // Emerald
          text: '#0F172A',
          muted: '#64748B'
        }
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
        }
      }
    }
  }
}