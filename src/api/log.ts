import request from '@/utils/request'
import type { 
  SearchLogRequest, 
  SearchLogResponse, 
  WriteLogRequest, 
  WriteLogResponse 
} from '@/types/log'

export function searchLog(params: SearchLogRequest) {
  return request<SearchLogResponse>({
    url: '/log/search',
    method: 'get',
    params,
  })
}

export function writeLog(data: WriteLogRequest) {
  return request<WriteLogResponse>({
    url: '/log/write',
    method: 'post',
    data,
  })
}
