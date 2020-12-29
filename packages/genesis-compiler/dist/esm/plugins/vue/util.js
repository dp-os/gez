export const isJS = (file) => {
    return /\.js(\?[^.]+)?$/.test(file);
};
export const isCSS = (file) => /\.css(\?[^.]+)?$/.test(file);
