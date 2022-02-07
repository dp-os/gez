<template>
    <el-container>
        <el-header>
            <ul class="list">
                <li class="list-item">
                    <router-link to="/">首页</router-link>
                </li>
                <li class="list-item">
                    <router-link to="/about">关于我们</router-link>
                </li>
            </ul>
        </el-header>
        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    metaInfo() {
        return {
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
                }
            ]
        };
    },
    name: 'app',
    data() {
        return {
            activeIndex: '1'
        };
    }
});
</script>
<style lang="less" scoped>
.list {
    display: flex;
    margin: 0;
    padding: 0;
}

.list-item {
    padding: 0 5px;
    list-style: none;
}
</style>
