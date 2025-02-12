import './layout.css';
import * as images from 'ssr-html/src/images';

interface LayoutOptions {
    url?: string;
}

export function layout(slot: string, options: LayoutOptions = {}) {
    // 判断链接是否激活
    const isActive = (path: string) => {
        if (!options.url) {
            return '';
        }

        // 移除开头和结尾的斜杠，统一格式
        const normalizedUrl = options.url.replace(/^\/|\/$/g, '');
        const normalizedPath = path.replace(/^\/|\/$/g, '');

        // 对于首页的特殊处理
        if (path === '/' && !normalizedUrl) {
            return 'active';
        }

        return normalizedUrl === normalizedPath ? 'active' : '';
    };

    return `
<div class="layout">
    <header class="header">
        <div>
            <h1><img src="${images.svg}" alt="Gez Logo" width="48" height="48"></h1>
            <nav class="nav">
                <a href="{{__HTML_BASE__}}/" class="${isActive('/')}">首页</a>
                <a href="{{__HTML_BASE__}}/about" class="${isActive('about')}">关于我们</a>
            </nav>
        </div>
    </header>
    <main class="main">
    ${slot}
    </main>
</div>
`;
}
