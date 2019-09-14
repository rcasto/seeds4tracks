import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'public/scripts/index.js',
  output: {
    file: 'dist/public/index.js',
    format: 'iife',
    name: 'Index'
  },
  plugins: [
    terser(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
  ]
};