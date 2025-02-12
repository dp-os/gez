import { layout } from 'ssr-html/src/components/layout';
import { Page } from 'ssr-html/src/page';
import { title } from '../title';

export default class Home extends Page {
    public state = {
        time: ''
    };
    public title = title.about;
    public render(): string {
        const { url } = this.props;
        return layout(
            `<div class="about-page">
                <div class="about-header">
                    <h2>关于 Gez</h2>
                    <p class="subtitle">现代化的微前端模块共享解决方案</p>
                </div>
                
                <div class="about-content">
                    <div class="feature-card">
                        <div class="icon">⚡️</div>
                        <h3>极速构建</h3>
                        <p>基于 Rust 开发的 Rspack 构建引擎，提供比传统工具快 10-100 倍的构建性能。</p>
                    </div>

                    <div class="feature-card">
                        <div class="icon">🔄</div>
                        <h3>模块共享</h3>
                        <p>创新的 Module Link 技术，实现多个微前端应用间无缝共享和按需加载模块，降低重复依赖。</p>
                    </div>

                    <div class="feature-card">
                        <div class="icon">🚀</div>
                        <h3>性能优化</h3>
                        <p>基于内容哈希的智能缓存策略，配合 HTTP/3 和 ESM，显著提升应用加载性能。</p>
                    </div>

                    <div class="feature-card">
                        <div class="icon">🛠️</div>
                        <h3>简单易用</h3>
                        <p>零配置的 importmap 模块映射，开箱即用的构建优化，让开发者专注于业务逻辑。</p>
                    </div>
                </div>

                <div class="about-footer">
                    <p class="timestamp">最后更新：${new Date(
                        this.state.time
                    ).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                </div>
            </div>`,
            { url, title: this.title }
        );
    }
    /**
     * 模拟服务端请求数据
     */
    public async onServer() {
        this.importMetaSet.add(import.meta);
        super.onServer();
        this.state.time = new Date().toISOString();
    }
}
