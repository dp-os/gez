<template>
    <div class="box">
        <h2>rspack + vue2</h2>
        Count value:
        {{ count }}
        <button @click="count++">Add</button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Define, PassOnTo, Setup } from 'vue-class-setup';

@Setup
class App extends Define {
    public count = 1;
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