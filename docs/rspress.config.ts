import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
    root: path.join(__dirname, 'docs'),
    title: 'Gez',
    description:
        'Gez 是一个基于 Rspack 构建的 Pure ESM Like 解决方案，通过 importmap 将多服务的模块链接到具有哈希缓存的文件中。',
    icon: '/rspress-icon.png',
    base: '/gez/',
    logo: {
        light: '/rspress-light-logo.png',
        dark: '/rspress-dark-logo.png'
    },
    themeConfig: {
        lastUpdated: true,
        socialLinks: [
            {
                icon: 'github',
                mode: 'link',
                content: 'https://github.com/dp-os/gez'
            }
        ]
    }
});
