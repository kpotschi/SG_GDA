import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const options = {
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: 'dist/main.js',
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    sourcemap: true,
    minify: !watch,
};

if (watch) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    console.log('Watching for changes…');
} else {
    await esbuild.build(options);
    console.log('Build complete.');
}
