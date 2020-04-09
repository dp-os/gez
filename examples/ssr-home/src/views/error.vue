<template>
    <div></div>
</template>
<script lang="ts">
import Vue from 'vue';

throw new TypeError('jest test error');

// eslint-disable-next-line no-unreachable
export default Vue.extend({
    name: 'error'
});
</script>
