<template>
    <div class="app">
        <Child />
        <p>{{ count.value }}</p>
    </div>
</template>
<script setup lang="ts">
// Vue3 没有 set, del，只需要传入 reactive 即可
import { provide, reactive } from 'vue';
import { createState } from 'class-state';

import { PROVIDE_STORE_KEY, Count } from './store'
import Child from './child.vue';


const state = createState({
    proxy: reactive
})
provide(PROVIDE_STORE_KEY, state)


const count = Count.use(state)

</script>