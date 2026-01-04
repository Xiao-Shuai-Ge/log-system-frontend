<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">
      欢迎使用日志系统
    </h1>
    <p class="text-gray-600 mb-6">
      这是一个基于 Vite + Vue 3 + TS + Tailwind + Element Plus 的基础模板。
    </p>
    
    <div class="space-x-4">
      <el-button type="primary" @click="increment">
        Pinia 计数器: {{ counterStore.count }}
      </el-button>
      <el-button type="success" @click="testElementPlus">
        测试 Element Plus
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '../store/counter'
import { ElMessage } from 'element-plus'

const counterStore = useCounterStore()

const increment = () => {
  counterStore.increment()
}

const testElementPlus = () => {
  ElMessage.success('Element Plus 集成成功！')
}
</script>
