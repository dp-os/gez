class UrlObject {
    public instance: URL;
    private searchParams: URLSearchParams;
    constructor(href: string) {
        this.instance = new URL(href);
        this.searchParams = new URLSearchParams(this.instance.search);
    }
    public get hash() {
        return this.instance.hash;
    }
    public get host() {
        return this.instance.host;
    }
    public get hostname() {
        return this.instance.hostname;
    }
    public get href() {
        return this.instance.href;
    }
    public get origin() {
        return this.instance.origin;
    }
    public get password() {
        return this.instance.password;
    }
    public get pathname() {
        return this.instance.pathname;
    }
    public get port() {
        return this.instance.port;
    }
    public get protocol() {
        return this.instance.protocol;
    }
    public get search() {
        return this.instance.search;
    }
    get username() {
        return this.instance.username;
    }
    public toString() {
        return this.instance.toString();
    }
    public toJSON() {
        return this.instance.toJSON();
    }
    public updateSearchParams() {
        const search = this.searchParams.toString();
        this.instance.search = search ? `?${search}` : '';
    }
    public appendQuery(key: string, value: string) {
        this.searchParams.append(key, value);
        this.updateSearchParams();
    }
    public deleteQuery(key: string) {
        this.searchParams.delete(key);
        this.updateSearchParams();
    }
    public getQuery(key: string) {
        return this.searchParams.get(key);
    }
    public hasQuery(key: string) {
        return this.searchParams.has(key);
    }
    public setQuery(key: string, value: string) {
        this.searchParams.set(key, value);
        this.updateSearchParams();
    }
}

export function toUrlObject(url: string) {
    return new UrlObject(url);
}
