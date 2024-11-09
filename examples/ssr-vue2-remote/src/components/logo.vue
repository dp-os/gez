<template>
    <div class="logo">
        <img :width="width" :height="height" src="./logo.svg" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Define, Setup } from 'vue-class-setup';

interface Props {
    width: number;
    height: number;
}

@Setup
class App extends Define<Props> {}

export default defineComponent({
    ...App.inject()
});
</script>
<script lang="ts" setup>
defineProps<Props>()
</script>
<style lang="less" scoped>
.logo {
    border: 1px solid red;
    padding: 5px;
}
</style>