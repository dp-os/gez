import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
    root: path.join(__dirname, 'docs'),
    title: 'docs2',
    description: 'Rspack-based Static Site Generator',
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
                content: 'https://github.com/web-infra-dev/rspress'
            }
        ]
    }
});
