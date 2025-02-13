import type { RenderContext } from '@gez/core';

export default async (rc: RenderContext) => {
    // 提交模块依赖收集
    await rc.commit();

    rc.html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    ${rc.preload()}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gez SSR Base</title>
    <link rel="icon" type="image/svg+xml" href="https://www.gez-esm.com/logo.svg">
    <style>
        :root {
            --primary: #FFC107;
            --primary-dark: #FFA000;
            --bg: #FFFAF4;
            --bg-box: #FFF;
            --text: #2C3E50;
            --text-light: #34495E;
            --border: #FFE0B2;
            --shadow: rgba(255,152,0,0.1);
        }
        body{margin:0;font:14px -apple-system,system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
        .wrap{max-width:800px;margin:40px auto;padding:0 20px}
        h1{color:var(--primary);margin:0 0 30px;text-align:center;font-size:2rem}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:30px}
        .box{background:var(--bg-box);padding:20px;border-radius:8px;border:1px solid var(--border);transition:all .2s}
        .box:hover{box-shadow:0 4px 12px var(--shadow);transform:translateY(-2px)}
        .box h3{margin:0 0 8px;color:var(--primary-dark)}
        .box p{margin:0;color:var(--text-light)}
        pre{position:relative;background:#1e1e1e;color:#d4d4d4;padding:15px;border-radius:8px;font:13px ui-monospace,monospace;white-space:pre;box-shadow:0 2px 8px var(--shadow)}
        pre:hover .copy{opacity:1}
        .copy{position:absolute;right:8px;top:8px;background:var(--bg-box);border:1px solid var(--border);color:var(--text-light);padding:4px 8px;border-radius:4px;font-family:inherit;font-size:12px;cursor:pointer;opacity:0;transition:all .2s}
        .copy:hover{background:var(--primary);color:var(--bg-box);border-color:var(--primary)}
        .link{display:block;text-align:center;margin-bottom:30px;color:var(--text-light);text-decoration:none}
        .link:hover{color:var(--primary)}
        .intro{text-align:center;margin:-20px 0 40px;color:var(--text-light);max-width:600px;margin-left:auto;margin-right:auto;line-height:1.8}
        .k{color:#569cd6}.f{color:#dcdcaa}.p{color:#d4d4d4}.v{color:#9cdcfe}
    </style>
    ${rc.css()}
</head>
<body>
    <div class="wrap">
        <h1>Gez SSR Base</h1>
        <p class="intro">一个轻量级的服务端渲染框架，专注于提供简单、高效的开发体验。基于 Rust 构建，具有极致的性能表现，同时保持约定优于配置的设计理念，让开发者可以快速上手并构建现代化的 Web 应用。</p>
        <a href="https://github.com/dp-os/gez/tree/master/examples/ssr-base" class="link" target="_blank">View on GitHub</a>
        <div class="grid">
            <div class="box">
                <h3>🚀 高性能</h3>
                <p>基于 Rust 构建，极致性能</p>
            </div>
            <div class="box">
                <h3>💡 易用</h3>
                <p>约定优于配置，开箱即用</p>
            </div>
            <div class="box">
                <h3>🛠 可扩展</h3>
                <p>支持中间件和插件系统</p>
            </div>
        </div>
        <pre id="code"><button class="copy">复制代码</button><span class="k">const</span> <span class="v">server</span> <span class="p">=</span> http<span class="p">.</span><span class="f">createServer</span><span class="p">((</span><span class="v">req</span><span class="p">,</span> <span class="v">res</span><span class="p">) =></span> <span class="p">{</span>
    gez<span class="p">.</span><span class="f">middleware</span><span class="p">(</span>req<span class="p">,</span> res<span class="p">,</span> <span class="k">async</span> <span class="p">()</span> <span class="p">=></span> <span class="p">{</span>
        <span class="k">const</span> <span class="v">rc</span> <span class="p">=</span> <span class="k">await</span> gez<span class="p">.</span><span class="f">render</span><span class="p">({</span>
            params<span class="p">:</span> <span class="p">{</span> url<span class="p">:</span> req<span class="p">.</span>url <span class="p">}</span>
        <span class="p">});</span>
        res<span class="p">.</span><span class="f">end</span><span class="p">(</span>rc<span class="p">.</span>html<span class="p">);</span>
    <span class="p">});</span>
<span class="p">});</span></pre>
    </div>
    ${rc.importmap()}
    ${rc.moduleEntry()}
    ${rc.modulePreload()}
</body>
</html>`;
};
