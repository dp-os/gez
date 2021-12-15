<template>
    <div class="index">
        <h2>Hello world!</h2>
        <p v-if="show" class="text" @click="close">
            {{
                installed
                    ? 'The client should be installed successfully, click here to close!'
                    : 'Not Installed'
            }}
        </p>

        <router-link to="/about">About Us</router-link>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'index',
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

.index {
    background: rgb(0 0 0 / 10%);
}

.text {
    color: #999;
    font-size: 14px;
    cursor: pointer;
}
</style>
