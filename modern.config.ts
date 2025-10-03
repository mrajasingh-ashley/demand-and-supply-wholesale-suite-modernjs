import { appTools, defineConfig } from '@modern-js/app-tools';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  server: {
    port: 3000,
  },
  runtime: {
    router: true,
  },
  source: {
    // This creates a global variable 'process.env.NODE_ENV' in your client-side code
    globalVars: {
      'process.env.NODE_ENV': 'development',
    },
  },
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
  ],
});
