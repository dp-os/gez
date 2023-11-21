<template>
    <div class="app">
        <Child />
        <p>{{ count.value }}</p>
    </div>
</template>
<script setup lang="ts">
// Vue3 没有 set, del，只需要传入 reactive 即可
import { provide, reactive, set, del } from 'vue';
import { createState } from 'class-state';

import { PROVIDE_STORE_KEY, Count } from './store'
import Child from './child.vue';


const state = createState({
    // 如果你使用了服务端渲染，那么这里需要从服务端获取初始状态，例如：
    // state: globalThis.__INITIAL_STATE__ ?? {},
    proxy: reactive,
    set,
    del
})
provide(PROVIDE_STORE_KEY, state)


const count = Count.use(state)

</script>