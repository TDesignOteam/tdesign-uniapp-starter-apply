const { getESLintImportOrderRule, getESLintImportSettings } = require('t-comm');

module.exports = {
  root: true,
  extends: ['eslint-config-light-vue3'],
  globals: {
    getCurrentPages: true,
    globalThis: true,
    uni: true,
    qq: true,
    wx: true,
    requirePlugin: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    extraFileExtensions: ['.vue'],
  },
  overrides: [
    {
      files: ['*.js', '*.ts'],
      excludedFiles: ['*.test.js', '*.spec.js'],
      parserOptions: {
        project: 'tsconfig.eslint.json',
      },
    },
  ],
  settings: {
    ...getESLintImportSettings(),
  },
  rules: {
    ...getESLintImportOrderRule(),
    'light/valid-file-name': [2, {
      exclude: [
        'src/App.vue',
      ],
    }],
    'light/no-js-file': 2,
    'light/valid-spelling': 2,
    'light/classname-per-line': 2,
  },
};
