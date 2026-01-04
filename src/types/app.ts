export interface App {
  app_id: string
  app_code: string
  app_name: string
  description: string
  app_secret: string
  created_at?: number
}

export interface CreateAppRequest {
  app_code: string
  app_name: string
  description: string
}

export interface CreateAppResponse {
  app_id: string
  app_secret: string
}

export interface UpdateAppRequest {
  app_id: string
  app_name: string
  description: string
}

export interface DeleteAppRequest {
  app_id: string
}

export interface ListAppsResponse {
  apps: App[]
}
