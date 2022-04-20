import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

const name = 'RollupTypeScriptBabel';

const config = {
  input: 'code/rdp_nodefetch.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    nodeResolve({extensions }),
    commonjs(),
    typescript(),
    //babel({ extensions, include: ['src/**/*'] })
    babel({ extensions, include: ['src/**/*'], babelHelpers: 'bundled' })
    ]
};

export default config;