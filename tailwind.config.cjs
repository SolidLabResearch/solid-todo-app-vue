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
        /** Extremely basic colour scheme, should probably use guidelines:  https://solidproject.org/logo-usage-guidelines */
        foreground: '#000000',
        background: '#ffffff',
        accent: '#7c4dff',
        muffled: '#aaaaaa'
      }
    }
  },
  plugins: []
}
