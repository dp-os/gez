export interface ManifestJson {
    client: {
        importmapFilePath: string;
        version: string;
        files: string[];
    };
    server: {
        dts: boolean;
        version: string;
        files: string[];
    };
}
