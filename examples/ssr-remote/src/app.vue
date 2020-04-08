<template>
    <router-view class="app" />
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'app'
});
</script>
<style lang="less" scoped>
.app {
    text-align: center;
}
</style>
