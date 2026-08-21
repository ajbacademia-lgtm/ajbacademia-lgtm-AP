import * as esbuild from 'esbuild';

/**
 * esbuild script to bundle server.ts into CommonJS dist/server.cjs
 * Executed as part of `npm run build`
 */
async function buildServer() {
  try {
    await esbuild.build({
      entryPoints: ['server.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      packages: 'external',
      sourcemap: true,
      outfile: 'dist/server.cjs',
    });
    console.log(' Successfully compiled server.ts to dist/server.cjs');
  } catch (error) {
    console.error(' Build failed:', error);
    process.exit(1);
  }
}

buildServer();
