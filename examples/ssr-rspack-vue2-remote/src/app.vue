<template>
    <div class="box">
        <h2>rspack + vue2 _ remote</h2>
        Count value:
        {{ count }}
        <button @click="count++">Add</button>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { Define, PassOnTo, Setup } from 'vue-class-setup';

import { log } from 'ssr-rspack-vue2_remote/src/utils';

@Setup
class App extends Define {
    public count = 1;

    @PassOnTo()
    setup() {
        log('setup');
        onMounted(() => {
            log('onMounted');
        });
    }
}

export default defineComponent({
    name: 'app',
    ...App.inject()
});
</script>
<script lang="ts" setup>
defineProps();
</script>
<style lang="less">
div,
body,
html,
h2 {
    margin: 0;
    padding: 0;
}

.box {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
    min-width: @--lg;
}
</style>