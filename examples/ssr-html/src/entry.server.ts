// 这里必须使用 import type，否则开发阶段会报错
import type { RenderContext } from '@gez/core';

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
    <h2>Hello world!</h2>
    <p>URL: ${rc.params.url}</p>
    <time>${time}</time>
    ${script}
</body>
</html>
`;
};
