import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/ui/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
});
