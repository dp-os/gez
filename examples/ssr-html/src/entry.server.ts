// 这里必须使用 import type，否则开发阶段会报错
import type { ServerContext } from '@gez/core';

export default async (ctx: ServerContext, params: { url: string }) => {
    // 获取注入的代码
    const script = await ctx.getInjectScript();
    const time = new Date().toISOString();
    ctx.html = `
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
    <p>URL: ${params.url}</p>
    <time>${time}</time>
    ${script}
</body>
</html>
`;
};
