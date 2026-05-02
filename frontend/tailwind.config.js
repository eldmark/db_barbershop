/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5E57BA",
        accent: "#BA4338",
        content: "#19181E",
        success: "#118039",
        surface: "#F0EEE6",
        surfaceAlt: "#BDA6A4"
      },
      fontFamily: {
        sans: ["Sora", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Sora", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 18px 40px -24px rgba(25, 24, 30, 0.45)",
        float: "0 24px 60px -30px rgba(25, 24, 30, 0.5)"
      }
    }
  },
  plugins: []
};
