import request from '@/utils/request'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/user'

export function login(data: LoginRequest) {
  return request<LoginResponse>({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export function register(data: RegisterRequest) {
  return request<RegisterResponse>({
    url: '/user/register',
    method: 'post',
    data,
  })
}
