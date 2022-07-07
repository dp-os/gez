export class Logger {
    public static requestFailed(url: string) {
        return this.log(`${url} request failed`);
    }
    public static noConfig(url: string) {
        return this.log(`${url} Baseurl is not configured`);
    }
    public static decompressionFailed(url: string) {
        return this.log(`${url} decompression failed`);
    }
    public static reload(url: string) {
        return this.log(`Hot update to ${url} code`);
    }
    public static readCache(url: string) {
        return this.log(`${url} read local cache`);
    }
    public static ready(name: string) {
        return this.log(`${name} is ready`);
    }
    public static log(text: string) {
        return console.log(`genesis ${text}`);
    }
}
