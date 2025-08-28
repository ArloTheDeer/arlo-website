# 實作計畫

## PRD 參考

**PRD 文件路徑：** `docs/specs/2025-08-28-copy-obsidian-vault/prd.md`

> **重要提醒：** 實作過程中請經常參考 PRD 文件以了解：
>
> - 功能的商業目標和用戶價值
> - 完整的用戶故事和使用場景
> - 非功能性需求（性能、安全性等）
> - 系統架構和技術決策的背景脈絡

## 相關檔案

- `package.json` - 需要新增 shelljs 和 js-yaml 依賴，以及 copy-obsidian-vault 腳本
- `config-example.yaml` - 範例設定檔，包含 Obsidian vault 路徑設定
- `scripts/copy-obsidian-vault.js` - 核心複製腳本實作，使用 shelljs 進行檔案操作
- `.gitignore` - 需要排除 config.yaml 檔案
- `docs/llm/shelljs.md` - ShellJS API 參考文件
- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [ ] 1. 安裝並設定專案依賴
  - 1.1 安裝 `shelljs` 套件作為專案依賴
  - 1.2 安裝 `js-yaml` 套件用於讀取 YAML 設定檔
  - 1.3 安裝 `@types/shelljs` 作為 TypeScript 類型定義（devDependencies）

- [ ] 2. 建立設定檔範本和目錄結構
  - 2.1 建立 `scripts/` 目錄（如果不存在）
  - 2.2 建立 `config-example.yaml` 範例設定檔，包含 `obsidian_vault_path` 欄位
  - 2.3 更新 `.gitignore` 檔案，新增 `config.yaml` 到排除清單

- [ ] 3. 實作核心複製腳本
  - 3.1 建立 `scripts/copy-obsidian-vault.js` 腳本檔案
  - 3.2 實作設定檔讀取功能，檢查 `config.yaml` 是否存在
  - 3.3 實作 Obsidian vault 路徑驗證功能
  - 3.4 實作 `public/notes-src` 目錄清理功能（如果存在則完全刪除）
  - 3.5 實作檔案複製功能，排除以 `.` 開頭的檔案和目錄
  - 3.6 實作錯誤處理機制，確保操作失敗時拋出錯誤並停止執行
  - 3.7 加入適當的日誌輸出，指示操作開始和完成

- [ ] 4. 設定 npm 腳本和整合測試
  - 4.1 在 `package.json` 的 `scripts` 區段新增 `copy-obsidian-vault` 指令
  - 4.2 測試腳本在沒有 `config.yaml` 時的錯誤處理
  - 4.3 測試腳本在 Obsidian vault 路徑不存在時的錯誤處理
  - 4.4 使用範例設定檔進行功能測試，驗證檔案複製和過濾邏輯

- [ ] 5. 執行驗收測試
  - 5.1 使用 AI 讀取 acceptance.feature 檔案
  - 5.2 透過指令執行每個場景中的步驟
  - 5.3 驗證所有場景通過並記錄結果