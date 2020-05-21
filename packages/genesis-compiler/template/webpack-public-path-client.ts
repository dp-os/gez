const getPublicPath = () => {
    const name = process.env.GENESIS_NAME;
    const el: any = document.querySelector(`[data-ssr-genesis-name="${name}"]`);
    const baseUrl = decodeURIComponent(
        el?.dataset?.ssrGenesisBaseUrl || `/${name}/`
    );
    return baseUrl;
};
/* eslint-disable no-undef */
// @ts-ignore
__webpack_public_path__ = getPublicPath();
