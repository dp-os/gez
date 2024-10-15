<template>
    <layout>
        <Logo />
    </layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Define, Setup } from 'vue-class-setup';
import Logo from './components/logo.vue';
import layout from './components/layout.vue';

@Setup
class App extends Define {}

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