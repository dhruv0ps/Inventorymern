/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F3F4F6',   // Light Gray
        card: '#FFFFFF',          // White
        text: '#1F2937',          // Dark Slate
        muted: '#6B7280',         // Slate Gray
        success: '#228B22',       // Forest Green
        warning: '#FFD700',       // Golden Yellow
        error: '#B22222',         // Firebrick Red
        navbar: {
          DEFAULT: '#F5F5F5',     // Navbar Background Color
          text: 'Black',        // Original text color
          hover: '#E5E7EB',       // Lighter Gray for hover
          active: '#FFFFFF',      // White for active state
        },
      },
    },
  },
  plugins: [],
}
