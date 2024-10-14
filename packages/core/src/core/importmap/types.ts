/**
 * 资源清单
 */
export interface ManifestJson {
    version: string;
    importmapFilePath: string;
    dts: boolean;
    files: string[];
}
