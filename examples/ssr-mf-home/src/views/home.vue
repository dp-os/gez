<template>
    <div>
        <h2>ssr-mf-home</h2>
        我是首页
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'home',
    metaInfo() {
        return {
            title: '首页'
        };
    }
});
</script>
