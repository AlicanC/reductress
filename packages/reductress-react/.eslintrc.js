module.exports = {
  plugins: ['react'],
  extends: ['../../.eslintrc.js', 'plugin:react/recommended'],
  rules: {
    // Overrides for "plugin:react/recommended"
    'react/display-name': 0,
  },
};
