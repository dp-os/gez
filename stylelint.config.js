module.exports = {
    extends: [require.resolve('@fmfe/genesis-lint/stylelint.config')],
    rules: {
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'extends',
                    'tailwind',
                    'variants',
                    'responsive',
                    'apply',
                    'screen'
                ]
            }
        ],
        'declaration-block-trailing-semicolon': null,
        'no-descending-specificity': null
    }
};
