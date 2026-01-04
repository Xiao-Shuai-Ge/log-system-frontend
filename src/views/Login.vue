<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const loading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (!isLogin.value && value !== formData.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
  confirmPassword: [
    { validator: validatePass2, trigger: 'blur' }
  ]
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  formRef.value?.resetFields()
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        if (isLogin.value) {
          await userStore.login({
            username: formData.username,
            password: formData.password
          })
          router.push('/')
        } else {
          await userStore.register({
            username: formData.username,
            password: formData.password
          })
          isLogin.value = true
          formData.username = ''
          formData.password = ''
          formData.confirmPassword = ''
          // Optionally show success message, but interceptor or user store might not handle "success" toast. 
          // Let's rely on user finding out they can login now.
          // Or auto login? Usually register -> login.
        }
      } catch (error) {
        // Error handled by request interceptor
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">日志系统</h2>
        <p class="text-gray-500 mt-2">{{ isLogin ? '登录您的账号' : '注册新账号' }}</p>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        size="large"
      >
        <el-form-item prop="username" label="用户名">
          <el-input 
            v-model="formData.username" 
            placeholder="请输入用户名"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input 
            v-model="formData.password" 
            type="password" 
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item 
          v-if="!isLogin" 
          prop="confirmPassword" 
          label="确认密码"
        >
          <el-input 
            v-model="formData.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-button 
          type="primary" 
          class="w-full mt-4" 
          :loading="loading"
          @click="handleSubmit(formRef)"
        >
          {{ isLogin ? '登录' : '注册' }}
        </el-button>

        <div class="mt-4 text-center">
          <el-button link type="primary" @click="toggleMode">
            {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles if needed, but Tailwind handles most */
</style>
