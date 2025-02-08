import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/'; // Default to root if undefined

  return {
    server: {
      open: true,
      port: 3000,
    },
    define: {
      global: 'window',
    },
    resolve: {
      alias: [],
    },
    css: {
      preprocessorOptions: {
        scss: { charset: false },
        less: { charset: false },
      },
      charset: false,
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    base: API_URL, // Correctly set base path
    plugins: [react(), jsconfigPaths()],
  };
});
