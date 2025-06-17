/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk color palette
        neon: {
          pink: '#ff00ff',
          cyan: '#00ffff',
          green: '#00ff00',
          purple: '#8b00ff',
          blue: '#0080ff',
        },
        cyber: {
          dark: '#0a0a0a',
          darker: '#050505',
          gray: '#1a1a1a',
          light: '#2a2a2a',
        }
      },
      fontFamily: {
        'cyber': ['Courier New', 'monospace'],
        'matrix': ['consolas', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'neon-pulse': 'neon-pulse 2s infinite',
        'terminal-cursor': 'terminal-cursor 1s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'neon-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '50%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
        'terminal-cursor': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)",
        'neon-gradient': 'linear-gradient(45deg, #ff00ff, #00ffff, #8b00ff)',
        'matrix-code': "url('data:image/svg+xml;charset=utf-8,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff00' fill-opacity='0.1'%3E%3Ctext x='5' y='15' font-family='monospace' font-size='12'%3E01%3C/text%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
        'neon-strong': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'cyber': '0 4px 15px rgba(0, 255, 255, 0.4)',
      }
    },
  },
  plugins: [],
} 