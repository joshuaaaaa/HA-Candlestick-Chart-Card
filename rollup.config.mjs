import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/candlestick-chart-card.js',
  output: {
    file: 'dist/candlestick-chart-card.js',
    format: 'iife',
    name: 'CandlestickChartCard',
    sourcemap: false
  },
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
};
