/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'index.html',
    'src/**/*.ts',
    'src/**/*.vue'
  ],
  theme: {
    extend: {
      colors: {
        /** https://solidproject.org/logo-usage-guidelines */
        solidblue: 'rgb(32, 37, 66)',
        royallavender: 'rgb(124, 77, 255)',
        geysergrey: 'rgb(218, 224, 230)',
        calatinablue: 'rgb(8, 53, 117)',
        flamengopink: 'rgb(255, 105, 105)',
        headerblue: 'rgb(53, 72, 102)',
        bodygrey: 'rgb(102, 102, 102)',
        warningorange: 'rgb(255, 166, 0)',
        errorred: 'rgb(208, 2, 27)'
      }
    }
  },
  plugins: []
}
