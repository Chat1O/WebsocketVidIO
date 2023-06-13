/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './Client/**/*.{js,jsx,ts,tsx}', // all files with this extension are covered
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/**/*.js',
  ],
  theme: {
    extend: {},
    colors: {
      'col1': '#e2f3f5',
      'col2': '#22d1ee',
      'col3': '#3d5af1',
      'col4': '#0e153a'
    }
  },
  plugins: [
    require('flowbite/plugin'),
    require('daisyui')
  ],

}

