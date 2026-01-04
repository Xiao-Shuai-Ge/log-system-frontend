import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi } from '@/api/user'
import type { LoginRequest, RegisterRequest } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const username = ref(localStorage.getItem('username') || '')
  const userId = ref('')

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUsername(newUsername: string) {
    username.value = newUsername
    localStorage.setItem('username', newUsername)
  }

  function clearUser() {
    token.value = ''
    username.value = ''
    userId.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  async function login(data: LoginRequest) {
    const res = await loginApi(data)
    if (res.token) {
      setToken(res.token)
      setUsername(data.username)
    }
    return res
  }

  async function register(data: RegisterRequest) {
    const res = await registerApi(data)
    return res
  }

  function logout() {
    clearUser()
    window.location.href = '/login'
  }

  return {
    token,
    username,
    userId,
    login,
    register,
    logout
  }
})
