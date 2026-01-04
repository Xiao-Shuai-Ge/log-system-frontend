import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi } from '@/api/user'
import type { LoginRequest, RegisterRequest } from '@/types/user'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userId = ref('')
  const router = useRouter()

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearToken() {
    token.value = ''
    userId.value = ''
    localStorage.removeItem('token')
  }

  async function login(data: LoginRequest) {
    const res = await loginApi(data)
    if (res.token) {
      setToken(res.token)
    }
    return res
  }

  async function register(data: RegisterRequest) {
    const res = await registerApi(data)
    return res
  }

  function logout() {
    clearToken()
    // router.push('/login') // router is not available inside store setup directly usually unless provided or used inside component.
    // However, we can handle redirect in the component or use router instance if imported (but circular dependency risk).
    // Better to just clear state and let component handle redirect or app-level watcher.
    window.location.href = '/login'
  }

  return {
    token,
    userId,
    login,
    register,
    logout
  }
})
