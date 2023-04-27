module.exports = {
    extends: [
        'stylelint-config-html',
        'stylelint-config-standard',
        'stylelint-config-prettier'
    ],
    plugins: ['stylelint-order'],
    rules: {
        indentation: 4,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep', 'global']
            }
        ],
        'order/properties-order': [],
        'no-descending-specificity': null,
        'no-empty-source': null,
        'declaration-colon-newline-after': null,
        'font-family-no-missing-generic-family-keyword': null,
        'selector-class-pattern': null
    }
};
