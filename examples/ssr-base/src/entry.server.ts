import type { ServerContext } from '@gez/core';

export default async (ctx: ServerContext, params: any) => {
    ctx.html = `
  <!doctype html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Rspack</title>
	</head>
	<body>
		<div id="root">
      <div class="content">
        <h1>Vanilla Rspack</h1>
        <p>Start building amazing things with Rspack.</p>
      </div>
    </div>
	</body>
</html>
`;
};
