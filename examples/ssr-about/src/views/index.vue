<template>
    <div class="about">关于我们</div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    metaInfo() {
        return {
            title: '关于我们'
        };
    }
});
</script>
<style lang="less" scoped>
.about {
    padding: 15px;
    background: #ccc;
}
</style>
