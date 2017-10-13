import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        copy({
            'src/manifest.json': 'dist/manifest.json',
            'src/popup/index.html': 'dist/popup/index.html',
            'src/popup/script.js': 'dist/popup/script.js',
            'src/background/script.js': 'dist/background/script.js',
            'src/style.css': 'dist/style.css',
            verbose: false
        }),
    ]
};
