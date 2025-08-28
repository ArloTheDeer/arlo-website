# 產品需求文件 (PRD): Copy Obsidian Vault 指令

## 簡介/概述

此功能實作一個 npm 腳本指令 `npm run copy-obsidian-vault`，用於從使用者的 Obsidian vault 複製所有筆記檔案到專案的 `public/notes-src` 目錄。這個功能是實現 Obsidian 筆記同步到網站的核心基礎設施，讓開發者能夠快速同步最新的筆記內容到靜態網站專案中。

## 目標

1. 提供簡單的指令來同步 Obsidian vault 內容到專案
2. 自動清理舊的筆記檔案並複製最新內容
3. 排除 Obsidian 系統檔案，只保留實際的筆記內容
4. 確保複製過程的可靠性和錯誤處理

## 使用者故事

**作為一名開發者，我想要執行一個簡單的指令來同步我的 Obsidian 筆記到專案中，這樣我就能夠在網站上看到最新的筆記內容。**

具體流程：
1. 我在專案根目錄有一個 `config.yaml` 設定檔，裡面指定了我的 Obsidian vault 路徑
2. 我執行 `npm run copy-obsidian-vault` 指令
3. 系統自動清理 `public/notes-src` 目錄（如果存在）
4. 系統從我指定的 Obsidian vault 複製所有筆記檔案到 `public/notes-src`
5. 系統自動排除 `.obsidian`、`.trash` 等系統目錄

## 功能需求

### 核心功能
1. **設定檔讀取**：系統必須能夠讀取專案根目錄的 `config.yaml` 檔案
2. **路徑驗證**：系統必須驗證 config 中指定的 Obsidian vault 路徑是否存在
3. **目錄清理**：如果 `public/notes-src` 目錄存在，系統必須完全刪除該目錄
4. **檔案複製**：系統必須從 Obsidian vault 複製所有檔案到 `public/notes-src`，保持原有的資料夾結構
5. **檔案過濾**：系統必須排除所有以 `.` 開頭的檔案和目錄（如 `.obsidian`、`.trash`）

### 設定檔需求
6. **範例設定檔**：必須提供 `config-example.yaml` 作為範本
7. **設定檔結構**：`config.yaml` 必須包含 `obsidian_vault_path` 設定項目

### 錯誤處理
8. **設定檔檢查**：如果 `config.yaml` 不存在，系統必須拋出錯誤並停止執行
9. **路徑檢查**：如果指定的 Obsidian vault 路徑不存在，系統必須拋出錯誤並停止執行
10. **權限檢查**：如果複製過程中遇到權限問題，系統必須拋出錯誤並停止執行

### 技術實作
11. **技術選型**：必須使用 shelljs 函式庫實作
12. **npm 腳本**：必須在 `package.json` 中定義 `copy-obsidian-vault` 腳本
13. **參考文件**：實作時必須參考 `docs/llm/shelljs.md` 文件

## 非目標（超出範圍）

1. **進度顯示**：不需要顯示複製進度或統計資訊
2. **使用者確認**：不需要執行前的確認提示
3. **增量同步**：不需要檢查檔案變更，每次都完整複製
4. **檔案監控**：不需要自動監控 Obsidian vault 變更
5. **進階設定**：不需要複雜的過濾規則或自訂設定
6. **備份功能**：不需要備份舊的 notes-src 內容

## 設計考量

### 目錄結構
```
專案根目錄/
├── config.yaml              # 使用者設定檔（不納入版控）
├── config-example.yaml      # 範例設定檔（納入版控）
├── public/
│   └── notes-src/           # 複製後的筆記檔案
└── scripts/
    └── copy-obsidian-vault.js  # 腳本實作
```

### 設定檔格式
```yaml
# config-example.yaml
obsidian_vault_path: "/path/to/your/obsidian/vault"
```

## 技術考量

1. **shelljs 依賴**：需要安裝 shelljs 和 js-yaml 套件
2. **跨平台支援**：shelljs 提供跨平台的檔案操作支援
3. **錯誤處理**：使用 shelljs 的錯誤回傳機制來檢查操作結果
4. **路徑處理**：正確處理 Windows 和 Unix 系統的路徑差異

## 開放問題

1. 是否需要在 `.gitignore` 中排除 `config.yaml`？（要排除，因為包含個人路徑）
2. 是否需要在 `.gitignore` 中排除 `public/notes-src`？（不排除，因為要順便備份 Obsidian vault 內容）

## 參考資料

- `docs/llm/shelljs.md` - ShellJS 使用說明文件
- `GOALS.md` - 專案整體目標和階段規劃