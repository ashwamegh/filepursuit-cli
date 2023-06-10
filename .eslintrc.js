export default {
  extends: ['eslint:recommended', 'google'],
  plugins: ['prettier'],
  env: {
    browser: true,
    commonjs: false,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'object-curly-spacing': 'off',
    camelcase: 'off',
    indent: 'off',
    'max-len': 'off',
    'no-tabs': 'off',
    'operator-linebreak': 'off',
    'quote-props': ['error', 'as-needed'],
    'new-cap': 'off',
    'one-var': 'off',
  },
};