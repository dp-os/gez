<template>
    <div v-if="show" class="app border-4 border-purple-700">
        <span class="text-purple-700">#About</span>
        <div class="content">
            <h2>About Us Page</h2>
            <router-view />
        </div>
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
.content {
    padding: 100px 0;
    text-align: center;
}
</style>
