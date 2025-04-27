// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'i18n.generated.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      import: importPlugin,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/require-await': 'off',

      // Import sorting rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Built-in imports (come from NodeJS)
            'external', // External imports
            'internal', // Absolute imports
            ['sibling', 'parent'], // Relative imports
            'index', // Index imports
            'unknown',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc', // Sort in ascending order
            caseInsensitive: true, // Ignore case
          },
        },
      ],
      'import/no-duplicates': 'error',
    },
  },
  {
    // This section is for TypeScript files specifically
    files: ['**/*.ts', '**/*.tsx'],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  }
);
