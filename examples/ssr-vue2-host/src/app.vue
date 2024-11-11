<template>
    <div class="box">
        <layout>
            Hello world!
            <Next />
        </layout>
    </div>
</template>
<script lang="ts" setup>
import layout from 'ssr-vue2-remote/src/components/layout.vue';
import Next from './next.vue';
defineProps();
</script>
<style lang="less">
div,
body,
html,
h2 {
    margin: 0;
    padding: 0;
}
</style>