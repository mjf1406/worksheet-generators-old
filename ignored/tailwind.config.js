/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    // darkMode: 'class',
    content: [
      '../index.html',
      '../html/bit-maze.html',
      '../html/word-search.html',
      '../html/crossword.html'
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