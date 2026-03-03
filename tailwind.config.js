/** @type {import('tailwindcss').Config} */
export default {
content: ['./index.html', './src/**/*.{js,jsx}'],
theme: {
  extend: {
    colors: {
      'globe-bg': '#040d21',
      'card-bg': '#0d1b2a',
      'card-border': '#1b2d45',
      'accent': '#00d4ff',
      'accent-dim': '#0097b2'
    }
  }
},
plugins: []
};
