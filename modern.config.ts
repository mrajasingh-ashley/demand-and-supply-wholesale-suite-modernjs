import { appTools, defineConfig } from '@modern-js/app-tools';

export default defineConfig({
  server: {
    port: 3000,
  },
  runtime: {
    router: true,
  },
  html: {
    // This tells Modern.js to use our custom HTML file as the base template
    template: './config/html/index.html',
  },
  output: {
    // This tells Modern.js to copy our config folder to the build output
    copy: [
      {
        from: './config',
        to: './',
      },
    ],
  },
  plugins: [
    appTools({
      bundler: 'rspack',
    }),
  ],
});
