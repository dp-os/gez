<template>
    <div class="logo">
        <img width="120" height="120" src="./logo.svg" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Define, Setup } from 'vue-class-setup';

@Setup
class App extends Define {}

export default defineComponent({
    ...App.inject()
});
</script>
<script lang="ts" setup>
defineProps<{}>()
</script>
<style lang="less">
.logo {
    border: 1px solid red;
    padding: 5px;
}
</style>