<template>
    <div class="about">
        Try about us
        <router-link to="/">Home Page</router-link>
        <button @click="$router.back()">Back</button>
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
        this.$root.$emit('msg', '我是子服务发射的事件内容');
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
