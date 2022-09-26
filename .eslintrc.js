module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // 禁止空语句块
    'no-empty': 2,
    // 多行尾随逗号
    'comma-dangle': [2, 'always-multiline'],
    // 强制分号
    semi: ['error', 'always'],
    'arrow-parens': 0,
    // 参数后面不允许任何空格
    'space-before-function-paren': 0,
    // 强制 generator 函数中 * 号周围使用一致的空格
    'generator-star-spacing': 0,
    //close lf error
    'import/no-unresolved': [0],
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-router-link-tag-prop': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'no-async-promise-executor': 'off',
    'import/no-extraneous-dependencies': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/html-self-closing': 'off',
    // 'no-console': 'warn',
    // 'no-debugger': 'warn',
    'no-plusplus': 'off',
    'no-useless-escape': 'off',
    'no-bitwise': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    'vue/no-setup-props-destructure': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
    'vue/script-setup-uses-vars': ['off'],
    //can config  to 2 if need more then required
    '@typescript-eslint/no-unused-vars': [0],
    'no-param-reassign': ['off'],
  },
};
