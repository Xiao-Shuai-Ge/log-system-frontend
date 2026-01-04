<template>
  <div class="min-h-screen bg-gray-50">
    <nav v-if="showNav" class="bg-white shadow-sm p-4 mb-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img src="/vite.svg" class="w-8 h-8" alt="Vite logo" />
          <span class="text-xl font-bold text-gray-800">日志系统</span>
        </div>
        <div class="space-x-4">
          <router-link to="/" class="text-gray-600 hover:text-blue-600">首页</router-link>
        </div>
      </div>
    </nav>
    
    <main :class="{'max-w-7xl mx-auto': showNav}">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showNav = computed(() => route.name !== 'Login')
</script>

<style>
/* Global styles if needed */
</style>
