/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
      '../index.html',
      '../wordSearch.js'
    ],
    theme: {
      extend: {
        screens: {
          'min-1860': '1860px',
        }
      },
    },
    plugins: [],
}