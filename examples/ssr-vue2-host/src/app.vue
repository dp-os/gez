<template>
    <div class="box">
        <layout>
            Hello world!
        </layout>
    </div>
</template>
<script lang="ts">
import layout from 'ssr-vue2-remote/src/components/layout.vue';
import { defineComponent } from 'vue';
import { Define, Setup } from 'vue-class-setup';

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