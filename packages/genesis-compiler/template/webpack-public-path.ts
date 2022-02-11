/* eslint-disable */
// @ts-nocheck
if (process.env.VUE_ENV === 'client') {
    __webpack_public_path__ = window[process.env.PUBLIC_PATH_VAR_NAME];
} else {
    __webpack_public_path__ = global[process.env.PUBLIC_PATH_VAR_NAME];
}
