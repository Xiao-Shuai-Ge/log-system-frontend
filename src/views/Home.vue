<template>
  <div class="h-full flex flex-col">
    <!-- Main Content -->
    <div class="flex-1 p-6 overflow-hidden flex flex-col gap-4">
      <!-- Search & Filter Bar -->
      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div class="flex flex-wrap items-center gap-4">
          <!-- App Selector -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 whitespace-nowrap">应用:</span>
            <el-select 
              v-model="currentAppCode" 
              placeholder="请选择应用" 
              class="!w-48"
              @change="handleAppChange"
            >
              <el-option 
                v-for="app in appList" 
                :key="app.app_id" 
                :label="app.app_name" 
                :value="app.app_code" 
              />
            </el-select>
          </div>

          <!-- Keyword Search -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 whitespace-nowrap">关键词:</span>
            <el-input 
              v-model="searchParams.keyword" 
              placeholder="输入关键词搜索" 
              class="!w-64"
              clearable
              @keyup.enter="fetchLogs"
            />
          </div>

          <div class="flex-1"></div>

          <!-- Metadata Toggle -->
          <el-button @click="showMetadata = !showMetadata" :type="showMetadata ? 'primary' : 'default'" plain>
            {{ showMetadata ? '收起筛选' : '高级筛选' }}
          </el-button>

          <el-button type="primary" @click="fetchLogs" :loading="loading">
            查询
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>

        <!-- Metadata Filters -->
        <div v-show="showMetadata" class="mt-4 pt-4 border-t border-gray-100">
           <div class="text-sm text-gray-500 mb-2">元数据筛选 (Metadata):</div>
           <div v-for="(item, index) in metadataFilters" :key="index" class="flex items-center gap-2 mb-2">
             <el-input v-model="item.key" placeholder="Key" class="!w-40" />
             <span class="text-gray-400">:</span>
             <el-input v-model="item.value" placeholder="Value" class="!w-60" />
             <el-button type="danger" text @click="removeMetadataFilter(index)">删除</el-button>
           </div>
           <el-button type="primary" link @click="addMetadataFilter">+ 添加筛选条件</el-button>
        </div>
      </div>

      <!-- Log List -->
      <div class="flex-1 bg-white p-4 rounded-lg shadow-sm flex flex-col min-h-0 border border-gray-100">
        <el-table 
          :data="logList" 
          style="width: 100%" 
          height="100%" 
          v-loading="loading" 
          stripe
          :header-cell-style="{ background: '#f9fafb', color: '#6b7280' }"
        >
          <el-table-column prop="timestamp" label="时间" width="200">
            <template #default="scope">
              <span class="text-gray-600 font-mono text-xs">{{ scope.row.timestamp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="日志内容" min-width="400">
             <template #default="scope">
                <div class="flex flex-col gap-1 py-1" @click="viewDetail(scope.row)">
                  <!-- Level & Main Content -->
                  <div class="flex items-start gap-2">
                    <el-tag 
                      v-if="getLogLevel(scope.row.content)" 
                      :type="getLevelType(getLogLevel(scope.row.content))" 
                      size="small" 
                      effect="dark"
                      class="flex-none mt-0.5"
                    >
                      {{ getLogLevel(scope.row.content) }}
                    </el-tag>
                    <span class="text-sm text-gray-800 font-medium break-all">
                      {{ getMainContent(scope.row.content) }}
                    </span>
                  </div>
                  
                  <!-- Other Fields -->
                  <div class="flex flex-wrap gap-x-4 gap-y-1 pl-1 text-xs text-gray-500 font-mono">
                    <template v-for="(value, key) in getOtherFields(scope.row.content)" :key="key">
                      <div class="flex items-center gap-1">
                        <span class="text-gray-400">{{ key }}:</span>
                        <span class="text-gray-600 truncate max-w-[200px]" :title="String(value)">{{ value }}</span>
                      </div>
                    </template>
                  </div>
                </div>
             </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
               <el-button link type="primary" size="small" @click="viewDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Pagination -->
        <div class="mt-4 flex justify-between items-center px-2">
          <span class="text-sm text-gray-500">共 {{ total }} 条记录</span>
          <el-pagination
            v-model:current-page="searchParams.page"
            v-model:page-size="searchParams.page_size"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="sizes, prev, pager, next"
            @size-change="fetchLogs"
            @current-change="fetchLogs"
            background
          />
        </div>
      </div>
    </div>
    
    <!-- Detail Dialog -->
    <el-dialog v-model="detailVisible" title="日志详情" width="700px">
      <div v-if="currentLog" class="space-y-4">
        <div class="flex gap-4 text-sm">
          <div class="w-1/2">
            <span class="text-gray-500 block mb-1">时间</span>
            <div class="bg-gray-50 p-2 rounded border border-gray-200 font-mono">{{ currentLog.timestamp }}</div>
          </div>
          <div class="w-1/2">
            <span class="text-gray-500 block mb-1">来源</span>
            <div class="bg-gray-50 p-2 rounded border border-gray-200 font-mono">{{ currentLog.source }}</div>
          </div>
        </div>
        <div>
          <span class="text-gray-500 block mb-1">内容</span>
          <div class="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[400px] font-mono text-xs">
            <pre>{{ JSON.stringify(currentLog.content, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { listApps } from '@/api/app'
import { searchLog } from '@/api/log'
import type { App } from '@/types/app'
import type { Log } from '@/types/log'
import { Delete } from '@element-plus/icons-vue'

const DeleteIcon = Delete

// State
const loading = ref(false)
const appList = ref<App[]>([])
const logList = ref<Log[]>([])
const total = ref(0)
const currentAppCode = ref('')
const showMetadata = ref(false)

const searchParams = reactive({
  page: 1,
  page_size: 20,
  keyword: ''
})

interface MetadataFilter {
  key: string
  value: string
}

const metadataFilters = ref<MetadataFilter[]>([])

// Detail Dialog
const detailVisible = ref(false)
const currentLog = ref<Log | null>(null)

// Methods
const getLogLevel = (content: any): string => {
  if (!content || typeof content !== 'object') return ''
  // Try common level field names
  return content.level || content.LEVEL || content.Level || content.severity || ''
}

const getLevelType = (level: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
  const l = level.toLowerCase()
  if (l.includes('error') || l.includes('fatal') || l.includes('crit')) return 'danger'
  if (l.includes('warn')) return 'warning'
  if (l.includes('info')) return 'primary' // Changed to primary for better visibility than info (gray)
  if (l.includes('debug') || l.includes('trace')) return 'info'
  if (l.includes('success')) return 'success'
  return 'info'
}

const getMainContent = (content: any): string => {
  if (!content) return ''
  if (typeof content === 'string') return content
  // Try common message field names
  return content.content || content.message || content.msg || content.MESSAGE || content.MSG || JSON.stringify(content)
}

const getOtherFields = (content: any): Record<string, any> => {
  if (!content || typeof content !== 'object') return {}
  const result: Record<string, any> = {}
  
  // Fields to exclude from "Other Fields" list
  const excludedKeys = ['level', 'LEVEL', 'Level', 'severity', 'content', 'message', 'msg', 'MESSAGE', 'MSG']
  
  Object.keys(content).forEach(key => {
    if (!excludedKeys.includes(key)) {
      result[key] = content[key]
    }
  })
  
  return result
}


const fetchApps = async () => {
  try {
    const res = await listApps()
    appList.value = res.apps || []
    if (appList.value.length > 0 && !currentAppCode.value) {
      const firstApp = appList.value[0]
      if (firstApp) {
        currentAppCode.value = firstApp.app_code
        fetchLogs()
      }
    }
  } catch (error) {
    console.error('Failed to fetch apps', error)
  }
}

const fetchLogs = async () => {
  if (!currentAppCode.value) {
    // If no app selected, try to select first one, or just warn
    if (appList.value.length > 0) {
      const firstApp = appList.value[0]
      if (firstApp) {
        currentAppCode.value = firstApp.app_code
      }
    } else {
      // No apps available
      return
    }
  }

  loading.value = true
  try {
    // Construct metadata JSON
    let metadataJson: string | undefined = undefined
    if (metadataFilters.value.length > 0) {
      const metaObj: Record<string, any> = {}
      metadataFilters.value.forEach(f => {
        if (f.key) metaObj[f.key] = f.value
      })
      if (Object.keys(metaObj).length > 0) {
        metadataJson = JSON.stringify(metaObj)
      }
    }

    const res = await searchLog({
      source: currentAppCode.value,
      keyword: searchParams.keyword,
      page: searchParams.page,
      page_size: searchParams.page_size,
      metadata: metadataJson
    })
    
    logList.value = res.logs || []
    total.value = res.total || 0
  } catch (error) {
    console.error('Failed to fetch logs', error)
  } finally {
    loading.value = false
  }
}

const handleAppChange = () => {
  searchParams.page = 1
  fetchLogs()
}

const resetSearch = () => {
  searchParams.keyword = ''
  metadataFilters.value = []
  searchParams.page = 1
  fetchLogs()
}

const addMetadataFilter = () => {
  metadataFilters.value.push({ key: '', value: '' })
}

const removeMetadataFilter = (index: number) => {
  metadataFilters.value.splice(index, 1)
}

const viewDetail = (log: Log) => {
  currentLog.value = log
  detailVisible.value = true
}

onMounted(() => {
  fetchApps()
  // Ensure icon is used to avoid TS error
  console.log(DeleteIcon)
})
</script>

<style scoped>
/* Custom scrollbar for log content if needed */
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
