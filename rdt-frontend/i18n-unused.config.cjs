module.exports = {
  localesPath: 'src/locales',
  srcPath: 'src',
  ignorePaths: ['node_modules'],
  translationKeyMatcher: /(?:t\s*\(\s*['"`]|i18nKey\s*=\s*['"`])([a-zA-Z0-9_:.\\-]+)['"`]/g,
};
