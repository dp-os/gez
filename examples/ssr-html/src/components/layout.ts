import './layout.css';
import * as images from 'ssr-html/src/images';

interface LayoutOptions {
    url?: string;
}

export function layout(slot: string, options: LayoutOptions = {}) {
    // 判断链接是否激活
    const isActive = (path: string) => {
        // 对于空路径的特殊处理
        if (!path) {
            return '';
        }

        // 如果 options.url 不存在，返回空字符串
        if (!options.url) {
            return '';
        }

        // 从 URL 中移除查询参数
        const urlWithoutQuery = options.url.split('?')[0];
        const pathWithoutQuery = path.split('?')[0];

        // 移除开头和结尾的斜杠，统一格式
        const normalizedUrl = urlWithoutQuery.replace(/^\/|\/$/g, '');
        const normalizedPath = pathWithoutQuery.replace(/^\/|\/$/g, '');

        // 对于首页的特殊处理
        if (path === '/' && !normalizedUrl) {
            return 'active';
        }

        return normalizedUrl === normalizedPath ? 'active' : '';
    };

    // 添加随机参数到链接
    const addRandomParam = (path: string) => {
        const param = Math.random().toString(36).substring(2, 8);
        return `${path}?_=${param}`;
    };

    return `
<div class="layout">
    <header class="header">
        <div>
            <h1><img src="${images.svg}" alt="Gez Logo" width="48" height="48"></h1>
            <nav class="nav">
                <a href="{{__HTML_BASE__}}${addRandomParam('/')}" class="${isActive('/')}">首页</a>
                <a href="{{__HTML_BASE__}}${addRandomParam('/about')}" class="${isActive('about')}">关于我们</a>
            </nav>
        </div>
    </header>
    <main class="main">
    ${slot}
    </main>
</div>
`;
}
