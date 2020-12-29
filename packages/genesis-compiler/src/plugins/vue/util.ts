export interface EntryInfo {
    name: string;
    chunks: number[];
    assets: EntryInfoAssets[];
    filteredAssets: number;
    assetsSize: number;
    auxiliaryAssets: { name: string; size?: number }[];
    filteredAuxiliaryAssets: number;
    auxiliaryAssetsSize: number;
    isOverSizeLimit: boolean;
}

export interface EntryInfoAssets {
    name: string;
    size: number;
}

export const isJS = (file: string) => {
    return /\.js(\?[^.]+)?$/.test(file);
};

export const isCSS = (file: string): boolean => /\.css(\?[^.]+)?$/.test(file);
