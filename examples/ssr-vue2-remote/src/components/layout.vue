<template>
    <div class="layout">
        <div class="tip">
            我是一个来自于 <a class="menu-list-item-link" href="https://github.com/dp-os/gez/blob/master/examples/ssr-vue2-remote/src/components/layout.vue" rel="noopener" target="_blank">ssr-vue2-remote</a> 服务的组件。
        </div>
        <header class="menu-list">
            <div class="menu-list-item">
                <a class="menu-list-item-link" href="https://github.com/dp-os/gez" target="_blank">github</a>
            </div>
            <div class="menu-list-item">
                <a class="menu-list-item-link" href="https://www.npmjs.com/package/@gez/core" target="_blank">npm</a>
            </div>
        </header>
        <main>
            <slot></slot>
        </main>
    </div>
</template>
<script lang="ts" setup>
defineProps<{}>();
</script>
<style lang="less" scoped>
.tip {
    padding: 10px;
    background: #efefef;
    a {
        color: blue;
    }
}
.menu-list {
    display: flex;
}
.menu-list-item {
    padding: 10px;
    margin: 5px;
    background: #efefef;
    border-radius: 5px;
    &:hover {
        background: blue;
        a {

            color: #fff;
        }
    }
}
.menu-list-item-link {
    text-decoration: none;
    color: #000;
}
</style>