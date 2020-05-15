<template>
    <div v-if="show">
        <h2>关于我们</h2>
        <router-view></router-view>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'app',
    data() {
        return {
            show: false
        };
    },
    mounted() {
        this.show = true;
    },
    methods: {
        back() {
            this.$router.back();
        }
    }
});
</script>
<style lang="less" scoped>
.app {
    padding: 100px;
    text-align: center;
}
</style>
