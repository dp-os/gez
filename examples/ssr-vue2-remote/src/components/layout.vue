<template>
    <div class="layout">
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
<script lang="ts">
import { defineComponent } from 'vue';
import { Define, Setup } from 'vue-class-setup';

@Setup
class App extends Define {}

export default defineComponent({
    ...App.inject()
});
</script>
<script lang="ts" setup>
defineProps<{}>()
</script>
<style lang="less" scoped>
.menu-list {
    display: flex;
}
.menu-list-item {
    padding: 10px;
    margin: 5px;
    &:hover {
        border-radius: 5px;
        background: #efefef;
    }
}
.menu-list-item-link {
    text-decoration: none;
    color: #000;
}
</style>