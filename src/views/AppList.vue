<template>
  <div class="h-full flex flex-col p-6 gap-4">
    <!-- Header -->
    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
      <h2 class="text-lg font-bold text-gray-800">应用管理</h2>
      <el-button type="primary" @click="handleCreate">
        创建应用
      </el-button>
    </div>

    <!-- App List -->
    <div class="flex-1 bg-white p-4 rounded-lg shadow-sm flex flex-col min-h-0 border border-gray-100">
      <el-table 
        :data="appList" 
        style="width: 100%" 
        height="100%" 
        v-loading="loading" 
        stripe
        :header-cell-style="{ background: '#f9fafb', color: '#6b7280' }"
      >
        <el-table-column prop="app_name" label="应用名称" min-width="150" />
        <el-table-column prop="app_code" label="应用代码" min-width="150">
          <template #default="scope">
            <el-tag size="small">{{ scope.row.app_code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="app_id" label="App ID" min-width="200" show-overflow-tooltip />
        <el-table-column prop="app_secret" label="App Secret" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <span class="font-mono text-xs text-gray-500">{{ scope.row.app_secret }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="scope">
            <span class="text-gray-600 font-mono text-xs">{{ formatDate(scope.row.created_at) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '创建应用' : '编辑应用'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="formData.app_name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="应用代码" prop="app_code" v-if="dialogType === 'create'">
          <el-input v-model="formData.app_code" placeholder="请输入应用代码 (唯一标识)" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            placeholder="请输入应用描述"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { listApps, createApp, updateApp, deleteApp } from '@/api/app'
import type { App, CreateAppRequest, UpdateAppRequest } from '@/types/app'

const loading = ref(false)
const appList = ref<App[]>([])

// Dialog
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const submitting = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  app_id: '',
  app_name: '',
  app_code: '',
  description: ''
})

const rules = reactive<FormRules>({
  app_name: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  app_code: [
    { required: true, message: '请输入应用代码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '只能包含字母、数字、下划线和连字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ]
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await listApps()
    appList.value = res.apps || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  dialogType.value = 'create'
  formData.app_id = ''
  formData.app_name = ''
  formData.app_code = ''
  formData.description = ''
  dialogVisible.value = true
}

const handleEdit = (row: App) => {
  dialogType.value = 'edit'
  formData.app_id = row.app_id
  formData.app_name = row.app_name
  formData.app_code = row.app_code
  formData.description = row.description
  dialogVisible.value = true
}

const handleDelete = (row: App) => {
  ElMessageBox.confirm(
    `确定要删除应用 "${row.app_name}" 吗？此操作不可恢复。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await deleteApp({ app_id: row.app_id })
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error(error)
      }
    })
    .catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'create') {
          const req: CreateAppRequest = {
            app_name: formData.app_name,
            app_code: formData.app_code,
            description: formData.description
          }
          await createApp(req)
          ElMessage.success('创建成功')
        } else {
          const req: UpdateAppRequest = {
            app_id: formData.app_id,
            app_name: formData.app_name,
            description: formData.description
          }
          await updateApp(req)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error(error)
      } finally {
        submitting.value = false
      }
    }
  })
}

const formatDate = (timestamp?: number) => {
  if (!timestamp) return '-'
  return new Date(timestamp * 1000).toLocaleString()
}

onMounted(() => {
  fetchData()
})
</script>
