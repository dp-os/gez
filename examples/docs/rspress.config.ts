import path from 'node:path';
import { defineConfig } from 'rspress/config';
import { generateDts } from './generate-dts';

generateDts();

export default defineConfig({
    root: path.join(__dirname, 'src'),
    outDir: path.join(__dirname, 'dist/client'),
    globalStyles: path.join(__dirname, 'src/styles/index.css'),
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
                content: 'https://github.com/dp-os/gez'
            }
        ]
    },
    markdown: {
        showLineNumbers: true
    }
});
