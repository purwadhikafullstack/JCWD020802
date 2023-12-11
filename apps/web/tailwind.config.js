const withMT = require('@material-tailwind/react/utils/withMT');

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{html,js}',
    './src/pages/**/*.{html,js}',
    './src/components/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
