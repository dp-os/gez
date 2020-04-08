<template>
    <div>
        <remote-view
            :url="`/api/remote/common-header/?renderUrl=${$route.fullPath}`"
        />
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
