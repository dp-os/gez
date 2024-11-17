export type SpecifierMap = Record<string, string>;

export type ScopesMap = Record<string, SpecifierMap>;

export interface ImportMap {
    imports?: SpecifierMap;
    scopes?: ScopesMap;
}
