<template>
    <div class="index">
        <remote-view
            :url="`/api/remote/common-header/?_renderUrl=${$route.fullPath}`"
        />
        <h2>你好世界！</h2>
        <p v-if="show" @click="clsoe" class="text">
            {{ installed ? '在客户端应该安装成功，点击我关闭!' : '未安装' }}
        </p>
        <ul>
            <li>
                <router-link to="/about">关于我们</router-link>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'index',
    data() {
        return {
            installed: false,
            show: true
        };
    },
    mounted() {
        this.installed = true;
    },
    methods: {
        clsoe() {
            this.show = false;
        }
    }
});
</script>
<style lang="less" scoped>
.app {
    padding: 100px;
    text-align: center;
}
.text {
    color: #999;
    font-size: 14px;
    cursor: pointer;
}
</style>
