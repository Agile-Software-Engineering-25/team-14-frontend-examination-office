import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import vitePluginSingleSpa from 'vite-plugin-single-spa';
import vitePluginReactHMR from 'vite-plugin-react-single-spa-hmr';

const PORT = parseInt(process.env.PORT ?? '5173');
const BASE_URL_DEPLOYMENT = `http://localhost:${PORT}/`;

const ENTRY_POINT = 'src/singleSpa.tsx';

const NPM_EXTERNALS: string[] = [
  'react',
  'react-dom',
  '@mui/material',
  '@mui/joy',
  'axios',
  'i18next',
];

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : BASE_URL_DEPLOYMENT,
  plugins: [
    react(),
    command === 'serve' && vitePluginReactHMR(ENTRY_POINT),
    vitePluginSingleSpa({
      type: 'mife',
      serverPort: PORT,
      spaEntryPoints: ENTRY_POINT,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@custom-types': path.resolve(__dirname, './src/@custom-types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
  },
  build: {
    rollupOptions: {
      external: [...NPM_EXTERNALS],
    },
  },
}));
