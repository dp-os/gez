module.exports = {
    extends: [
        'stylelint-config-html',
        'stylelint-config-standard',
        'stylelint-config-rational-order',
        'stylelint-config-prettier'
    ],
    plugins: ['stylelint-order', 'stylelint-config-rational-order/plugin'],
    rules: {
        indentation: 4,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep']
            }
        ],
        'order/properties-order': [],
        'plugin/rational-order': [
            true,
            {
                'border-in-box-model': false,
                'empty-line-between-groups': false
            }
        ],
        'no-descending-specificity': null,
        'no-empty-source': null,
        'declaration-colon-newline-after': null,
        'font-family-no-missing-generic-family-keyword': null,
        'selector-class-pattern': null
    }
};
