import path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
    root: path.join(__dirname, 'src'),
    outDir:
        process.env.NODE_ENV === 'production'
            ? path.join(__dirname, 'dist/client')
            : undefined,
    globalStyles: path.join(__dirname, 'src/styles/index.css'),
    lang: 'zh',
    locales: [
        {
            lang: 'zh',
            label: '简体中文',
            title: 'Rspress',
            description: '静态网站生成器'
        }
    ],
    title: 'Gez',
    description:
        'Gez 是一个基于 Rspack 构建的模块链接（Module Link） 解决方案，通过 importmap 将多服务模块映射到具有强缓存，基于内容哈希的 URL 中。',
    icon: '/logo.svg',
    base: '/',
    logo: '/logo.svg',
    themeConfig: {
        lastUpdated: true,
        socialLinks: [
            {
                icon: 'github',
                mode: 'link',
                content:
                    'https://github.com/dp-os/gez?utm_source=www.gez-esm.com'
            }
        ]
    },
    markdown: {
        showLineNumbers: true
    }
});
