<template>
    <div>
        <button class="btn" @click="count.$inc()">+</button>
        <button class="btn" @click="count.$dec()">-</button>
    </div>
</template>
<script lang="ts" setup>
import { Count } from './store';

const count = Count.use()

</script>
<style scoped>
.btn {
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
}
</style>