/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      container: {
        center: true
      },
      dropShadow: {
        '3xl': '0 2px 3px rgb(0 0 0 / 0.9)',
        '4xl': [
            '0 35px 35px rgba(0, 0, 0, 0.25)',
            '0 45px 65px rgba(0, 0, 0, 0.15)'
        ]
      },
      backgroundImage: {
        'texture': "url('/assets/images/tekstur-bg.png')",
        // 'footer-texture': "url('/img/footer-texture.png')",
      },
      keyframes: {
        wave: {
          '0%': { marginLeft: '-80px' },
          '50%': { marginLeft: '5px' },
          '75%': { marginLeft: '-20px' },
          '100%': { marginLeft: '0px' }
        }
      },
      animation: {
        'l-to-r': 'wave 0.5s ease'
      }
    }
  },
  plugins: []
};
