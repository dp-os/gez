<template>
    <div class="box">
        <h2>rspack + vue3</h2>
        Count value:
        {{ count }}
        <button @click="count++">Add</button>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
defineProps<{}>();
const count = ref(1);
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