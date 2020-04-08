<template>
    <div @click="plus">
        <h2>页面头部{{ count }}</h2>
        <button @click="$router.forward()">前进</button>
        <button @click="$router.back()">后退</button>
        <ul>
            <li>
                <router-link to="/">首页</router-link>
                <router-link to="/about">关于我们</router-link>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'common-header',
    data() {
        return {
            count: 0
        };
    },
    methods: {
        plus() {
            this.count++;
        }
    }
});
</script>
<style lang="less" scoped></style>
