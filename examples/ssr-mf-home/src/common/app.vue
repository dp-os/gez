<template>
    <div class="app">
        <div>
            <img src="../images/logo.svg" width="120" />
        </div>
        <ul>
            <li>
                <router-link to="/">首页</router-link>
            </li>
            <li>
                <router-link to="/about">关于</router-link>
            </li>
        </ul>
        <router-view />
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>
