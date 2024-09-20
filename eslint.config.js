import globals from 'globals'
import pluginJs from '@eslint/js'
import { configs as tsConfigs } from '@typescript-eslint/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: ['@typescript-eslint'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json', // Tu archivo de configuración de TypeScript
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['warn', 'single'],
      semi: ['warn', 'never'],
      '@typescript-eslint/semi': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-case-declarations': 'off',
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  tsConfigs.recommended,
  eslintConfigPrettier,
]
