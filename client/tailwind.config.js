/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors :{
        //  primary : "#00acb4",
         primary : "#2563eb",
         secondary : "#058187",
         third : "#2563eb",
         fourth :"#4338ca",
         msgbg :"#93c5fd"
      }
    },
  },
  plugins: [],
}

