import crypto from 'crypto';

export function md5(content: string) {
    const md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
}
