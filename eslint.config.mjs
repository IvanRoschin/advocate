import prettier from 'eslint-config-prettier';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  // Next.js + TypeScript
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Ignore build artifacts
  {
    ignores: [
      '.next/**/*',
      'node_modules/**/*',
      'out/**/*',
      'dist/**/*',
      'next-env.d.ts',
    ],
  },
  {
    files: ['**/route.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },

  // TypeScript rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },

  // Disable import resolver noise (Next handles it)
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },

  // Turn off ESLint rules that conflict with Prettier
  prettier,
];

export default config;
