<template>
    <div class="logo">
        <img :width="width" :height="height" src="./logo.svg" />
    </div>
</template>
<script lang="ts" setup>
interface Props {
    width: number;
    height: number;
}
defineProps<Props>();
</script>
<style lang="less" scoped>
.logo {
    border: 1px solid red;
    padding: 5px;
}
</style>