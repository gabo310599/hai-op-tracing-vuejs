<script setup>
  import  Home  from './components/pages/Home.vue'
  import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped>
  .container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform:  translate(-50%, -50%);
    width: 400px;
    text-align: center;
    border-radius: 10px;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
</style>
