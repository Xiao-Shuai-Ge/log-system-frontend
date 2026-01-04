import request from '@/utils/request'
import type { 
  App, 
  CreateAppRequest, 
  CreateAppResponse, 
  UpdateAppRequest, 
  DeleteAppRequest, 
  ListAppsResponse 
} from '@/types/app'

export function createApp(data: CreateAppRequest) {
  return request<CreateAppResponse>({
    url: '/app/create',
    method: 'post',
    data,
  })
}

export function deleteApp(data: DeleteAppRequest) {
  return request<void>({
    url: '/app/delete',
    method: 'post',
    data,
  })
}

export function updateApp(data: UpdateAppRequest) {
  return request<void>({
    url: '/app/update',
    method: 'post',
    data,
  })
}

export function listApps() {
  return request<ListAppsResponse>({
    url: '/app/list',
    method: 'get',
  })
}

export function getApp(appId: string) {
  return request<App>({
    url: `/app/${appId}`,
    method: 'get',
  })
}
