<template>
    <div>
        <button @click="count.$inc()">+</button>
        <button @click="count.$dec()">-</button>
    </div>
</template>
<script lang="ts" setup>
import { Count } from './store';

const count = Count.use()

</script>