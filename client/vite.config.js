import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';

export default defineConfig({
  plugins: [
    {
      name: 'transform-js-to-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null;
        }

        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
  ],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://server-dev:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    target: browserslistToEsbuild([
      '>0.2%',
      'not dead',
      'not ie <= 11',
      'not op_mini all',
    ]),
    rollupOptions: {
      output: {
        manualChunks(id) {
          const packageName = id.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1];
          if (!packageName) return;

          if (['react', 'react-dom', 'react-is', 'scheduler', 'use-sync-external-store'].includes(packageName)) {
            return 'react-vendor';
          }
          if (['react-router', 'react-router-dom', '@remix-run/router', 'history'].includes(packageName)) {
            return 'router-vendor';
          }
          if (['@reduxjs/toolkit', 'redux', 'react-redux', 'immer', 'reselect'].includes(packageName)) {
            return 'state-vendor';
          }
          if (['framer-motion', 'motion-dom', 'motion-utils'].includes(packageName)) {
            return 'motion-vendor';
          }
          if (packageName === 'react-icons') return 'icons-vendor';
          if (['formik', 'yup', 'react-hook-form', '@hookform/resolvers'].includes(packageName)) {
            return 'forms-vendor';
          }
          if (['flickity', 'react-flickity-component'].includes(packageName)) {
            return 'carousel-vendor';
          }
          if (['card-validator', 'react-credit-cards-2'].includes(packageName)) {
            return 'payment-vendor';
          }
          if (['axios', 'lodash', 'moment', 'date-fns', 'query-string', 'classnames'].includes(packageName)) {
            return 'utilities-vendor';
          }
          return 'vendor';
        },
      },
    },
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
