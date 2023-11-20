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
            'bg-green': '#008848'
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
            green: '#008848',
            666: '#666'
         },
      },
   },
   plugins: [],
}

