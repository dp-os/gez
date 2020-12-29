export interface EntryInfo {
    name: string;
    chunks: number[];
    assets: EntryInfoAssets[];
    filteredAssets: number;
    assetsSize: number;
    auxiliaryAssets: {
        name: string;
        size?: number;
    }[];
    filteredAuxiliaryAssets: number;
    auxiliaryAssetsSize: number;
    isOverSizeLimit: boolean;
}
export interface EntryInfoAssets {
    name: string;
    size: number;
}
export declare const isJS: (file: string) => boolean;
export declare const isCSS: (file: string) => boolean;
