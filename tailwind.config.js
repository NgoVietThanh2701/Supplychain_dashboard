/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './src/**/*.{js,jsx,ts,tsx}',
   ],
   theme: {
      fontFamily: {
         display: ['Open Sans', 'sans-serif'],
         body: ['Open Sans', 'sans-serif'],
      },
      extend: {
         fontSize: {
            14: '14px'
         },
         backgroundColor: {
            'main-bg': '#FAFBFB',
            'light-gray': '#F7F7F7',
            'half-transparent': 'rgba(0, 0, 0, 0.5)',
            'bg-blue': '#3B71CA',
            'bg-green': '#209E2E',
            'bg-red': '#E73E33'
         },
         borderWidth: {
            1: '1px',
         },
         borderColor: {
            color: 'rgba(0, 0, 0, 0.1)',
         },
         textColor: {
            primary: '#262626', // back
            primary2: '#333', // low back 
            green: '#209E2E',
            666: '#666',
            333: '#333333', // web user
            444: '#444'
         },
         backgroundImage: {
            'background-slide': "url('./utils/images/background.png')",
            'background-shop': "url('./utils/images/bg-shop.jpg')"
         }
      },
   },
   plugins: [],
}

