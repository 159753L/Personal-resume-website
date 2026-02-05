/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(10, 10, 15)',
        surface: 'rgb(20, 20, 25)',
        primary: 'rgb(0, 200, 255)',
        secondary: 'rgb(0, 255, 150)',
        accent: 'rgb(255, 100, 200)',
        text: 'rgb(240, 240, 245)',
        muted: 'rgb(150, 150, 170)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'typewriter': 'typewriter 3s steps(40, end)',
        'blink-caret': 'blink-caret .75s step-end infinite',
      },
      keyframes: {
        glow: {
          'from': {
            textShadow: '0 0 10px rgba(0, 200, 255, 0.5), 0 0 20px rgba(0, 200, 255, 0.3)',
          },
          'to': {
            textShadow: '0 0 20px rgba(0, 200, 255, 0.8), 0 0 30px rgba(0, 200, 255, 0.6), 0 0 40px rgba(0, 200, 255, 0.4)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        typewriter: {
          'from': {
            width: '0',
          },
          'to': {
            width: '100%',
          },
        },
        blinkCaret: {
          'from, to': {
            borderColor: 'transparent',
          },
          '50%': {
            borderColor: 'rgb(0, 200, 255)',
          },
        },
      },
    },
  },
  plugins: [],
}