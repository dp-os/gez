<template>
    <div class="box">
        Count value2:
        {{count}}
        <button @click="count++">Add</button>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const count = ref(0)
</script>
<style lang="less">

.box {
    background: yellow;
}
</style>