import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

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

  // TypeScript + Unicorn rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      unicorn,
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

      'unicorn/filename-case': [
        'error',
        {
          cases: {
            pascalCase: true,
            camelCase: true,
          },
          ignore: ['^index\\.tsx?$', '^page\\.tsx?$', '^layout\\.tsx?$'],
        },
      ],
    },
  },

  // Disable import resolver noise (Next handles it)
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },

  // Prettier через FlatCompat
  ...compat.extends('prettier'),
];

export default config;
