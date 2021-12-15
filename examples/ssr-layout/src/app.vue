<template>
    <div class="app border-4 border-green-700">
        <span class="text-green-700">#Layout</span>
        <header class="header bg-gray-100" @click="plus">
            <div class="text-gray-700 text-2xl">Page header {{ count }}</div>
            <div class="border m-2 p-2">
                <div class="text-gray-500 text-sm">Router Instance Methods</div>
                <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10"
                    @click="$router.back()"
                >
                    Back
                </button>
                <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    @click="$router.forward()"
                >
                    Forward
                </button>
            </div>
            <div class="text-gray-500 text-sm">Router link</div>
            <ul class="flex justify-center items-center p-2">
                <li v-for="(navItem, index) in nav" :key="index">
                    <router-link :to="navItem.path" class="route-link">{{
                        navItem.label
                    }}</router-link>
                </li>
            </ul>
        </header>
        <main>
            <remote-view :key="$route.meta.remoteUrl" :fetch="fetch" />
        </main>
    </div>
</template>
<script lang="ts">
import { RemoteView } from '@fmfe/genesis-remote';
import axios from 'axios';
import Vue from 'vue';

export default Vue.extend({
    name: 'app',
    components: {
        RemoteView
    },
    data() {
        return {
            count: 0,
            nav: [
                {
                    path: '/',
                    label: 'Home'
                },
                {
                    path: '/about',
                    label: 'About'
                },
                {
                    path: '/404',
                    label: '404'
                }
            ]
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
    text-align: center;
}
</style>
<style>
.route-link {
    @apply text-blue-600 p-3;
}

.route-link:hover {
    @apply text-blue-800;
}
</style>
