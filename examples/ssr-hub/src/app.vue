<template>
    <div class="app">
        <CommonHeader />
    </div>
</template>
<script lang="ts">
import CommonHeader from 'ssr-shared/common-header.vue';
import Vue from 'vue';

export default Vue.extend({
    name: 'app',
    components: {
        CommonHeader
    },
    data() {
        return {
            installed: false,
            show: true
        };
    },
    mounted() {
        this.installed = true;
    },
    methods: {
        close() {
            this.show = false;
        }
    }
});
</script>
<style lang="less" scoped>
.app {
    padding: 100px;
    text-align: center;
}

.text {
    color: #999;
    font-size: 14px;
    cursor: pointer;
}
</style>
