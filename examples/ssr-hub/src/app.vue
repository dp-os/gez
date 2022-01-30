<template>
    <div>
        <vs-navbar v-model="activeItem" class="nabarx">
            <template v-slot:title>
                <vs-navbar-title> Genesis </vs-navbar-title>
            </template>
            <vs-navbar-item index="0">
                <router-link to="/">Home</router-link>
            </vs-navbar-item>
            <vs-navbar-item index="1">
                <router-link to="/about">About</router-link>
            </vs-navbar-item>
        </vs-navbar>
        <router-view />
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Vuesax from 'vuesax';

Vue.use(Vuesax);

export default Vue.extend({
    name: 'app',
    data() {
        return {
            activeItem: 0,
            search: ''
        };
    }
});
</script>
<style src="vuesax/dist/vuesax.css"></style>
