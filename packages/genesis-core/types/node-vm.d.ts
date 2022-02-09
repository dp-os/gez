export declare class NodeVM {
    filename: string;
    sandbox: Record<string, any>;
    files: Record<string, any>;
    constructor(filename: string, sandbox?: Record<string, any>);
    require(): any;
    destroy(): void;
    private _require;
}
