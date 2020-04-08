<template>
    <div @click="plus">页面头部{{ count }}</div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'common-header',
    data() {
        return {
            count: 0
        };
    },
    methods: {
        plus() {
            this.count++;
        }
    }
});
</script>
<style lang="less" scoped></style>
