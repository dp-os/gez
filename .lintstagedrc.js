// Template generation, do not manually modify
export default {
    '*.{css,less,vue}': (filenames) => {
        return ['npm run lint:css', 'git add .'];
    },
    '*.{ts,js,mjs,cjs}': (filenames) => {
        return ['npm run lint:js', 'git add .'];
    }
};
