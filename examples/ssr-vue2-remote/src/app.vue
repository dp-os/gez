<template>
    <layout>
        <Logo :width="120" :height="60" />
        <p>
            Time: {{time}}
        </p>
        <GezFooter />
    </layout>
</template>
<script lang="ts" setup>
import { GezFooter } from '@gez/vue-ui';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import layout from './components/layout.vue';
import Logo from './components/logo.vue';

defineProps();
let time = ref(new Date().toISOString());
onMounted(() => {
    const timer = setInterval(() => {
        time.value = new Date().toISOString();
    }, 1000);
    onBeforeUnmount(() => {
        clearInterval(timer);
    });
});
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