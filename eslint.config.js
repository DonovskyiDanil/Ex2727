// @ts-check
// ESLint configuration based on react-app, adapted for ESLint v9+
// https://eslint.org/docs/latest/use/configure/migration-guide

import eslintConfigPrettier from 'eslint-config-prettier';
import reactAppConfig from 'eslint-config-react-app';

export default [
  ...reactAppConfig,
  eslintConfigPrettier,
  {
    // Add any custom rules or overrides here
    rules: {
      // Example: disable a rule if necessary
      // 'no-unused-vars': 'warn',
    },
  },
];