/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'public/index.html',
    'src/**/*.ts',
    'src/**/*.vue'
  ],
  theme: {
    extend: {
      colors: {
        /** Extremely basic colour scheme, should probably use guidelines:  https://solidproject.org/logo-usage-guidelines */
        foreground: '#222222',
        background: '#ffffff',
        accent: '#0088aa',
        highlight: '#00aad4',
        muffled: '#999999'
      }
    }
  },
  plugins: []
}
