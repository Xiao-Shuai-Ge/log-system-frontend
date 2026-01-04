<template>
  <div class="h-full flex flex-col p-6 gap-4 overflow-y-auto">
    <!-- Header -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">日志上报 API 文档</h2>
      <p class="text-gray-600">
        本文档描述了如何通过 HTTP API 将日志数据上报到日志系统。适用于第三方服务或应用的日志接入。
      </p>
    </div>

    <!-- Base Info -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div class="w-1 h-6 bg-blue-500 rounded-full"></div>
        基本信息
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <span class="text-sm text-gray-500">接口地址 (Endpoint)</span>
          <div class="flex items-center gap-2 bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm">
            <span class="text-green-600 font-bold">POST</span>
            <span class="text-gray-700">/log/write</span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-sm text-gray-500">Content-Type</span>
          <div class="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm text-gray-700">
            application/json
          </div>
        </div>
      </div>
    </div>

    <!-- Request Parameters -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div class="w-1 h-6 bg-blue-500 rounded-full"></div>
        请求参数
      </h3>
      
      <el-table :data="params" border style="width: 100%" class="mb-4">
        <el-table-column prop="name" label="参数名" width="150">
          <template #default="scope">
            <span class="font-mono font-bold text-gray-700">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="必填" width="100">
          <template #default="scope">
            <span v-if="scope.row.required" class="text-red-500">是</span>
            <span v-else class="text-gray-400">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="说明" />
      </el-table>
    </div>

    <!-- Example -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div class="w-1 h-6 bg-blue-500 rounded-full"></div>
        请求示例
      </h3>

      <div class="mb-6">
        <div class="text-sm font-bold text-gray-700 mb-2">JSON Body</div>
        <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{{ jsonExample }}</pre>
        </div>
      </div>

      <div>
        <div class="text-sm font-bold text-gray-700 mb-2">curl 命令</div>
        <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
          {{ curlExample }}
        </div>
      </div>
    </div>

    <!-- Response -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div class="w-1 h-6 bg-blue-500 rounded-full"></div>
        响应结果
      </h3>
      <div class="flex gap-6 flex-col md:flex-row">
        <div class="flex-1">
          <div class="text-sm font-bold text-gray-700 mb-2">成功响应 (200 OK)</div>
          <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
<pre>{
  "ok": true
}</pre>
          </div>
        </div>
        <div class="flex-1">
          <div class="text-sm font-bold text-gray-700 mb-2">失败响应</div>
          <div class="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
<pre>{
  "ok": false,
  "error": "错误信息描述"
}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const params = [
  { name: 'source', type: 'string', required: true, desc: '日志来源，通常为应用名称或服务标识' },
  { name: 'level', type: 'string', required: true, desc: '日志级别 (info, warn, error, debug)' },
  { name: 'content', type: 'string', required: true, desc: '日志主要内容' },
  { name: 'metadata', type: 'object', required: false, desc: '额外的元数据 (JSON 对象)，用于存储上下文信息' },
]

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const jsonExample = computed(() => `{
  "source": "payment-service",
  "level": "error",
  "content": "Payment failed for order #12345",
  "metadata": {
    "order_id": "12345",
    "user_id": "u_888",
    "error_code": "INSUFFICIENT_FUNDS"
  }
}`)

const curlExample = computed(() => `curl -X POST ${baseUrl}/log/write \\
  -H "Content-Type: application/json" \\
  -d '${jsonExample.value.replace(/\n/g, '').replace(/\s+/g, ' ')}'`)

</script>
