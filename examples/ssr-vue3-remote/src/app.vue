<template>
    <div class="app">
        <button class="btn" @click="click">Click me</button>
    <AsyncHeader />
    Hello World!{{ count }}</div>
</template>
<script setup lang="ts">
import { defineAsyncComponent }  from 'vue';

import { ref } from 'vue'
const AsyncHeader = defineAsyncComponent(async () => import('./common-header.vue'));

const count = ref(0);

function click () {
    count.value++;
}

</script>
<style scoped>
.btn {
    padding: 5px 10px;
    margin: 0;
    border: 1px solid #ccc;
    cursor: pointer;
    background: transparent;
}
</style>