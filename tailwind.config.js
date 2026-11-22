/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFF5F7',
          pinkDark: '#FCE7F3',
          lavender: '#F5F3FF',
          lavenderDark: '#EDE9FE',
          rose: '#FDA4AF',
          roseDark: '#F43F5E',
          purple: '#C084FC',
          purpleDark: '#9333EA',
          mint: '#ECFDF5',
          mintDark: '#10B981',
          amber: '#FFFBEB',
          amberDark: '#F59E0B',
          coral: '#FFF1F2',
          coralDark: '#E11D48'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
