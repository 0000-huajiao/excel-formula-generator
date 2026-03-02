/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#165DFF',
          dark: '#4080FF',
        },
        success: '#00B42A',
        warning: '#FF7D00',
        danger: '#F53F3F',
      },
      fontFamily: {
        sans: ['"Source Han Sans SC"', 'PingFang SC', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
