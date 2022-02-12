<template>
    <div>
        <h2>这是流程图12ss22</h2>
        <p class="text">支持</p>
        <img src="../images/framework.jpeg" width="300" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    metaInfo() {
        return {
            title: '首页'
        };
    }
});
</script>
<style lang="less" scoped>
h2 {
    background: red;
}
</style>
<style lang="less" scoped>
.text {
    font-weight: bold;
}
</style>
