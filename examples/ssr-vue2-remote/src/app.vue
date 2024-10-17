<template>
    <layout>
        <Logo />
        <p>
            Time: {{time}}
        </p>
    </layout>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Define, PassOnTo, Setup } from 'vue-class-setup';
import layout from './components/layout.vue';
import Logo from './components/logo.vue';

@Setup
class App extends Define {
    public time = new Date().toISOString();
    @PassOnTo(onMounted)
    public mounted() {
        const timer = setInterval(() => {
            this.time = new Date().toISOString();
        }, 1000);
        onBeforeUnmount(() => {
            clearInterval(timer);
        });
    }
}

export default defineComponent({
    name: 'app',
    ...App.inject()
});
</script>
<script lang="ts" setup>
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