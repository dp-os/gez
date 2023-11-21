<template>
    <div class="app">
        <p>Current Time: {{ count.serverTime }}</p>
        <Child />
        <p>Click Count: {{ count.value }}</p>
    </div>
</template>
<script setup lang="ts">
import { onServerPrefetch, onMounted, onBeforeUnmount } from 'vue';
import { Count } from './store'
import Child from './child.vue';

const count = Count.use()

// 模拟服务端请求调用
onServerPrefetch(() => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            count.$setTime()
            resolve()
        }, 200)
    })
})

// 客户端接管服务端状态后，继续更新状态
onMounted(() => {
    const timer = setInterval(count.$setTime, 1000)
    onBeforeUnmount(() => {
        clearInterval(timer)
    })
})
</script>