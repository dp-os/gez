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
        h1{color:var(--primary);margin:0 0 30px;text-align:center;font-size:2rem;display:flex;align-items:center;justify-content:center;gap:1rem}
        .logo{width:40px;height:40px;vertical-align:middle}
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
        <h1>
            <img src="https://www.gez-esm.com/logo.svg" alt="Gez Logo" class="logo" />
            Gez SSR Base
        </h1>
        <p class="intro">
            Gez 是一个基于 ESM 的 SSR 框架，支持多种前端框架，这是一个基础示例。
        </p>
        <div class="grid">
            <div class="box">
                <h3>开发</h3>
                <p>npm run dev</p>
            </div>
            <div class="box">
                <h3>构建</h3>
                <p>npm run build</p>
            </div>
            <div class="box">
                <h3>预览</h3>
                <p>npm run preview</p>
            </div>
        </div>
        <a href="https://github.com/dp-os/gez" target="_blank" class="link">在 GitHub 上查看</a>
        <pre>
<span class="k">import</span> { <span class="f">createServer</span> } <span class="k">from</span> <span class="p">'</span><span class="v">@gez/core</span><span class="p">'</span>

<span class="k">const</span> <span class="v">server</span> = <span class="f">createServer</span>()
<span class="v">server</span>.<span class="f">start</span>()
        </pre>
    </div>
    ${rc.modulePreload()}
</body>
</html>`;
};
