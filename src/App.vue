<template>
  <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">
    <!-- Global Navigation -->
    <nav v-if="showNav" class="bg-white shadow-sm px-6 py-4 flex-none z-20">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2">
            <img src="/vite.svg" class="w-8 h-8" alt="Logo" />
            <span class="text-xl font-bold text-gray-800">日志系统</span>
          </div>
          <div class="flex gap-6 text-sm text-gray-600">
            <router-link to="/" class="hover:text-blue-600 transition-colors" :class="{ 'text-blue-600 font-medium': route.name === 'Home' }">日志查询</router-link>
            <a href="#" class="hover:text-blue-600 transition-colors" @click.prevent="ElMessage.info('功能开发中')">应用管理</a>
            <a href="#" class="hover:text-blue-600 transition-colors" @click.prevent="ElMessage.info('API 文档请查看 swagger.json')">API 文档</a>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex flex-col items-end">
            <span class="text-sm font-medium text-gray-800">{{ userStore.username || '用户' }}</span>
          </div>
          <el-button type="danger" plain size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </div>
    </nav>
    
    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-h-0 overflow-hidden relative">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const userStore = useUserStore()
const showNav = computed(() => route.name !== 'Login')

const handleLogout = () => {
  userStore.logout()
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
