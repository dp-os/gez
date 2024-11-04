// 这里必须使用 import type，否则开发阶段会报错
import type { RenderContext } from '@gez/core';
import { cat, jpg, loading, sun, svg } from './images';

export default async (rc: RenderContext) => {
    // 获取注入的代码
    const script = await rc.script();
    const time = new Date().toISOString();
    rc.html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gez</title>
</head>
<body>
    <h1>Gez</h1>
    <p>你好世界！</p>
    <h2>模拟客户端水合</h2>
    <time>${time}</time>
    <h2>请求参数</h2>
    <pre>
    ${rc.serialize(rc.params, { isJSON: true })}
    </pre>
    ${script}
    <h2>格式支持</h2>
    <ul>
        <li>${rc.base + svg} <br>
            <img height="100" src="${rc.base + svg}">
        </li>
        <li>${rc.base + jpg} <br>
            <img height="100" src="${rc.base + jpg}">
        </li>
        <li>${rc.base + cat} <br>
            <img height="100" src="${rc.base + cat}">
        </li>
        <li>${rc.base + loading} <br>
            <img height="100" src="${rc.base + loading}">
        </li>
        <li>${rc.base + sun} <br>
            <img height="100" src="${rc.base + sun}">
        </li>
    </ul>
</body>
</html>
`;
};
