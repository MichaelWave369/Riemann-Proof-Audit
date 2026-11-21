import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Riemann-Proof-Audit/',
  build: { outDir: 'dist', sourcemap: false },
});
