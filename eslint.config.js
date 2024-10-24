const typeScriptEslintParser = require('@typescript-eslint/parser');
const eslintPlugin = require('@typescript-eslint/eslint-plugin');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');
const imports = require('eslint-plugin-import');

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: typeScriptEslintParser,
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module"
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      eslintPlugin: eslintPlugin,
      import: imports
    },
    ignores: ["./.github/*", "./.vscode/*", "./.dist/*", "./.infrastructure/*", "./.node_modules/*", "./eslint.config.js"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "interface",
          "format": ["PascalCase"],
          "custom": {
            "regex": "^I[A-Z]",
            "match": true
          }
        }
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          "groups": [
            "type",
            "object",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ]
        }
      ]
    }
  }
];
  