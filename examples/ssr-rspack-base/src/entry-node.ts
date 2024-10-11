import { createApp, createServer, defineNode } from '@gez/core';

export default defineNode({
    name: 'ssr-vite-vue3',
    async createDevApp(gez) {
        return () => createApp(gez);
    },
    created(gez) {
        const server = createServer(gez);
        server.listen(3002, () => {
            console.log('http://localhost:3002');
        });
    }
});
