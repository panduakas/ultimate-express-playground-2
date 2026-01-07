const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const jsdocPlugin = require('eslint-plugin-jsdoc');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: ['dist/**'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': ts,
      import: importPlugin,
      prettier: prettierPlugin,
      jsdoc: jsdocPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {}
      }
    },
    rules: {
      'prettier/prettier': 'warn',
      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "VariableDeclaration[kind='let']",
          message: 'Use const instead of let'
        }
      ],
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'jsdoc/require-jsdoc': 'off'
    }
  },
  {
    files: ['src/app/tests/**/*.ts'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'import/order': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];
