<template>
    <div class="app border-4 border-blue-700">
        <span class="text-blue-700 text-left">#Home</span>
        <div class="content">
            <div class="flex justify-center">
                <Logo />
            </div>
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { Logo } from './logo';

export default Vue.extend({
    name: 'app',
    components: {
        Logo
    }
});
</script>
<style lang="less" scoped>
.content {
    text-align: center;
}
</style>
<style lang="scss" scoped>
$--color-primary: #409eff;

.content {
    color: $--color-primary;
}
</style>
