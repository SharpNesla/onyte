import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const external = ['solid-js', 'solid-js/web', 'solid-js/store'];

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: { external },
    target: 'esnext',
    minify: false,
  },
});
