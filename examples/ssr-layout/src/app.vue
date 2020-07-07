<template>
    <div class="app">
        <header @click="plus" class="header">
            <h2>页面头部{{ count }}</h2>
            <button @click="$router.forward()">前进</button>
            <button @click="$router.back()">后退</button>
            <ul>
                <li>
                    <router-link to="/">首页</router-link>
                    <router-link to="/about">关于我们</router-link>
                    <router-link to="/404">404</router-link>
                </li>
            </ul>
        </header>
        <main>
            <remote-view :fetch="fetch" :key="$route.meta.remoteUrl" />
        </main>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { RemoteView } from '@fmfe/genesis-remote';

export default Vue.extend({
    name: 'app',
    components: {
        RemoteView
    },
    data() {
        return {
            count: 0
        };
    },
    methods: {
        plus() {
            this.count++;
        },
        async fetch() {
            const remoteUrl: string = this.$route.meta.remoteUrl;
            const url = decodeURIComponent(this.$route.fullPath);
            const res = await axios.get(
                `http://localhost:3000${remoteUrl}?renderUrl=${url}`
            );
            if (res.status === 200) {
                return res.data;
            }
            return null;
        },
        onMsg(msg: string) {
            console.log('>>>>>>>>>>>>>', msg);
        }
    }
});
</script>
<style lang="less" scoped>
.header {
    width: 800px;
    margin: 0 auto;
    border-bottom: 1px solid #ccc;
}
</style>
