/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0F19',
          card: '#131B2E',
          surface: '#1E293B',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        brand: {
          cyan: '#06B6D4',
          violet: '#8B5CF6',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
        'glow-violet': 'glowViolet 2s ease-in-out infinite alternate',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(6, 182, 212, 0.7)' },
        },
        glowViolet: {
          '0%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(139, 92, 246, 0.7)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.2)' },
        }
      }
    },
  },
  plugins: [],
}
