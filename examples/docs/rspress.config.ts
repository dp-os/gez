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
            title: 'Gez'
        }
    ],
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
