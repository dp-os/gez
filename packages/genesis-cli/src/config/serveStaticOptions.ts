import { ServeStaticOptions } from 'serve-static';

export const serveStaticOptions: ServeStaticOptions = {
    immutable: true,
    maxAge: '31536000000'
}
