import path from 'node:path';
import sitemap from 'rspress-plugin-sitemap';
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
        },
        {
            lang: 'en',
            label: 'English',
            title: 'Gez'
        }
    ],
    icon: '/logo.svg',
    base: '/',
    logo: '/logo.svg',
    builderConfig: {
        html: {
            template: './src/index.html'
        }
    },
    themeConfig: {
        lastUpdated: true,
        socialLinks: [
            {
                icon: 'github',
                mode: 'link',
                content:
                    'https://github.com/open-esm/gez?utm_source=www.jsesm.com'
            }
        ]
    },
    markdown: {
        showLineNumbers: true
    },
    plugins: [
        sitemap({
            domain: 'https://www.jsesm.com',
            defaultChangeFreq: 'monthly',
            defaultPriority: '0.5'
        })
    ]
});
