module.exports = {
  content: [
    "./index.html",
    // Ensure all JS/JSX files are included where Tailwind classes are used
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class', // Important: This enables the 'dark:' utility prefix
  plugins: [],
}
