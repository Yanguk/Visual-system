module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    treatUndefinedAsUnspecified: 0,
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 0,
    'prefer-destructuring': ['error', { object: false, array: false }],
    'no-shadow': ['error', { allow: ['_'] }],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-return-assign': ['error', 'always'],
    'arrow-parens': ['error', 'as-needed'],
    'implicit-arrow-linebreak': ['error', 'beside'],
    'no-console': 'error',
    indent: ['error', 2, { SwitchCase: 1, MemberExpression: 'off' }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'max-len': [
      'error',
      {
        code: 90,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'no-underscore-dangle': 0,
  },
};
