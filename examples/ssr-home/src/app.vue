<template>
    <div>
        <img src="./images/logo.svg" alt="LOGO" />
        <router-view class="app" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'app'
});
</script>
<style lang="less" scoped>
.app {
    padding: 100px;
    text-align: center;
}
</style>
