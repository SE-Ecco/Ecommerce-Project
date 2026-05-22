module.exports = {
  root: true, env: { browser: true, es2020: true },
  extends: ['eslint:recommended','plugin:@typescript-eslint/recommended','plugin:react-hooks/recommended','prettier'],
  parser: '@typescript-eslint/parser',
  rules: { 'no-unused-vars': 'off', '@typescript-eslint/no-unused-vars': 'warn', '@typescript-eslint/no-explicit-any': 'warn' }
}
