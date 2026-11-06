export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { brand: { 50:'#fbf2f5',100:'#f5e1e8',200:'#e9bfce',500:'#a63a5f',600:'#8c2a4d',700:'#741f3f',800:'#5c1832' } },
    fontFamily: { sans: ['Inter','system-ui','sans-serif'], serif: ['Fraunces','Georgia','serif'] },
  } },
  plugins: [],
};
