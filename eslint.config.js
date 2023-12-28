import path from 'path'
import { fileURLToPath } from 'url'
import * as globals from 'globals'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import eslintConfigPrettier from 'eslint-plugin-prettier/recommended.js'
import tsParser from '@typescript-eslint/parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type { Array<import("eslint").Linter.FlatConfig> } */
export default [
  js.configs.recommended,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
      },
    },
  },
  eslintConfigPrettier,
  {
    ignores: ['**/node_modules', '**/.github/actions/scripts/dist'],
  },
]
