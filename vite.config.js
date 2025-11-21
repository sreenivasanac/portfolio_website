import { defineConfig } from 'vite';
import htmlInject from 'vite-plugin-html-inject';
import { resolve } from 'path';
import postcssImport from 'postcss-import';
import noModulePlugin from './vite-plugin-no-module.js';

export default defineConfig({
  plugins: [htmlInject(), noModulePlugin()],
  base: '/portfolio_website/',
  css: {
    postcss: {
      plugins: [postcssImport()]
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        format: 'iife',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        inlineDynamicImports: true,
      }
    }
  }
});
