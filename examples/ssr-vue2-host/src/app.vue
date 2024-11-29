<template>
    <div class="box">
        <layout>
            Hello world!

            <br>
            <Next />
            <p class="tip">
                我的 <a href="https://github.com/dp-os/gez/blob/master/examples/ssr-vue2-host/src/entry.node.ts" rel="noopener" target="_blank">Vue</a> 实例，被指向到了 ssr-vue2-remote/vue
            </p>
            <GezFooter />
        </layout>
    </div>
</template>
<script lang="ts" setup>
import { GezFooter } from '@gez/vue-ui';
import layout from 'ssr-vue2-remote/src/components/layout.vue';
import Next from './next.vue';
defineProps();
</script>
<style lang="less" scoped>
.tip {
    padding: 10px;
    margin: 0;
    background: #efef;
}
</style>
<style lang="less">
div,
body,
html,
h2 {
    margin: 0;
    padding: 0;
}
</style>