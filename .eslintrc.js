module.exports = {
    root: true,
    extends: ['plugin:@typescript-eslint/recommended'],
    plugins: ['unused-imports', 'simple-import-sort'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
        ecmaVersion: 'latest',
    },
    rules: {
        eqeqeq: ['error', 'always'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'error',
            { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
    },
};
