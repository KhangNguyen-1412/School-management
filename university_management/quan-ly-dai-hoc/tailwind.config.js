/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Dòng này quan trọng
  ],
  darkMode: 'class', // Thêm dòng này để chế độ Dark Mode hoạt động
  theme: {
    extend: {},
  },
  plugins: [],
}