/**
 * 资源清单
 */
export type ManifestJson = Record<string, string> & {
    client: string;
    server: string;
};
