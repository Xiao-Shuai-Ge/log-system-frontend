# 前端开发规范

## 目录结构
- `src/api`: 接口请求定义
- `src/assets`: 静态资源（图片、全局样式等）
- `src/components`: 通用业务组件
- `src/hooks`: 组合式 API (Composition API) 逻辑复用
- `src/router`: 路由配置
- `src/store`: Pinia 状态管理
- `src/utils`: 工具函数
- `src/views`: 页面级组件
- `src/types`: TypeScript 类型定义

## 规范要求
- **命名规范**:
  - 组件文件：大驼峰（PascalCase），如 `UserCard.vue`
  - 普通文件/目录：小写横杠（kebab-case），如 `user-api.ts`
  - 变量/函数：小驼峰（camelCase）
- **TypeScript**:
  - 严禁使用 `any`，必须定义明确的接口或类型
  - 优先使用 `interface` 定义对象结构
- **Vue**:
  - 统一使用 `<script setup lang="ts">`
  - 优先使用 Tailwind CSS 处理样式，复杂的样式使用 `scoped` CSS
- **组件开发**:
  - 页面级组件放在 `views/`，通用组件放在 `components/`
  - 逻辑尽量抽离到 `hooks/` 以保持组件简洁
- **面向中文**
  - 页面的内容应该都是中文的
  - 代码的注释也应该是中文的