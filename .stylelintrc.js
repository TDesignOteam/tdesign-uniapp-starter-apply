module.exports = {
  extends: ['stylelint-config-common'],
  plugins: ['stylelint-scss'],
  customSyntax: 'postcss-scss',
  rules: {
    'no-empty-source': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'selector-class-pattern': null,
  },
  ignoreFiles: [
    'node_modules/**/*',
    'dist/**/*',
  ],
};
