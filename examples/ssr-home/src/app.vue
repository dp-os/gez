<template>
    <router-view />
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    metaInfo() {
        return {
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
                }
            ]
        };
    },
    name: 'app'
});
</script>
