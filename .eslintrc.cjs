module.exports = {
  root: true,
  env: { node: true, es2022: true, jest: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'prettier', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: { project: false, sourceType: 'module' },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'prettier/prettier': 'error',
    'import/order': [
      'error',
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
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'jsdoc/require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: true
        }
      }
    ]
  }
};
