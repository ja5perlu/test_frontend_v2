# OpenAPI Generator 使用指南

本專案使用 `@openapitools/openapi-generator-cli` 自動生成 TypeScript API 客戶端。

## 前置需求

- Java 17+ (已安裝 OpenJDK 17)
- Node.js 和 pnpm

## 可用指令

```bash
# 下載最新的 OpenAPI spec
pnpm api:download

# 生成 TypeScript API 客戶端
pnpm api:generate

# 下載並生成 (一次完成)
pnpm api:update
```

## 使用方式

生成的 API 客戶端位於 `api/generated/` 目錄，可透過 `useApi` composable 使用：

```typescript
// 在 Vue 組件或 composable 中
const api = useApi()

// 取得用戶列表
const users = await api.getUsers()

// 創建用戶
await api.createUser({ name: 'John', age: 30 })

// 更新用戶
await api.updateUser({ id: 1, name: 'John Doe', age: 31 })

// 刪除用戶
await api.deleteUser({ id: 1 })
```

## 配置

OpenAPI Generator 的配置位於 `openapitools.json`：

- **inputSpec**: OpenAPI spec 檔案路徑 (`./openapi.json`)
- **output**: 生成檔案的輸出目錄 (`./api/generated`)
- **generatorName**: 生成器類型 (`typescript-axios`)

## 自動更新

當 API 規格變更時：

1. 執行 `pnpm api:update` 重新生成客戶端
2. 檢查 `composables/useApi.ts` 是否需要更新
3. 執行 `pnpm vue-tsc --noEmit` 確認類型無誤

## 注意事項

- `api/generated/` 目錄已加入 `.gitignore`，不會提交到版本控制
- `openapi.json` 是從 API server 下載的規格檔案
- 每次重新生成會覆蓋 `api/generated/` 目錄內的所有檔案
