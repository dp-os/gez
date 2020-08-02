<template>
    <div class="app border-4 border-blue-700">
        <span class="text-blue-700 text-left">#Home</span>
        <div class="content">
            <div class="flex justify-center">
                <img
                    src="./images/logo.svg"
                    alt="LOGO"
                    height="100"
                    width="100"
                />
            </div>
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'app'
});
</script>
<style lang="less" scoped>
.content {
    text-align: center;
}
</style>
