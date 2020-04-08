<template>
    <remote-view :key="this.$route.fullPath" :url="renderUrl" />
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    name: 'default-remote-view',
    computed: {
        renderUrl() {
            return (
                `/api/remote${this.$route.path}?renderUrl=` +
                encodeURIComponent(this.$route.fullPath)
            );
        }
    }
});
</script>
