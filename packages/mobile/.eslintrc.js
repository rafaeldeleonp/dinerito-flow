// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:import/recommended', 'plugin:import/typescript'],
  plugins: ['import'],
  ignorePatterns: ['/dist/*'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Sort imports
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
    // No duplicate imports
    'import/no-duplicates': 'error',
  },
};
