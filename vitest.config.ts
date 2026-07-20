import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // Next.js strips/aliases this at bundle time depending on whether the
      // importing module runs on the client or server. Vitest has no such
      // step, so point it at a no-op stub instead of the real package (which
      // unconditionally throws when required).
      'server-only': path.resolve(__dirname, 'vitest.setup/server-only-stub.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
