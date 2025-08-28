# 專案目標

## 概述
使用 Next.js 建立靜態網站，並部署到 Cloudflare Pages。網站主要功能是同步 Obsidian vault 內容，提供線上瀏覽筆記的功能。

## 技術架構
- **前端框架**: Next.js (已設定)
- **部署平台**: Cloudflare Pages
- **網站類型**: 靜態網站

## 核心功能需求

### 1. Notes 功能 (首要目標)
- 完整同步 Obsidian vault 內容到網站
- 基礎 URL: `https://www.arlothedeer.xyz/notes/`
- 檔案路徑對應:
  - 網址: `https://www.arlothedeer.xyz/notes/00-journal/2025-08`
  - 實際檔案: `/00-journal/2025-08.md`

### 2. 使用者介面
- **左側邊欄**: 檔案導覽樹狀結構
- **右側內容區**: Markdown 渲染後的網頁內容
- 點選檔案後在右側顯示對應內容

### 3. Obsidian Vault 同步
- **複製指令**: `npm run copy-obsidian-vault`
- 從指定路徑複製 Obsidian vault 所有檔案
- 自動略過以 `.` 開頭的檔案和目錄（如 `.obsidian`、`.trash` 等）
- 保持原有的資料夾結構

## 未來功能擴展

### 進階 Markdown 支援
- [ ] **Obsidian Canvas** 支援
- [ ] **Syntax Highlighting** 程式碼高亮
- [ ] **Mermaid** 圖表渲染
- [ ] **LaTeX** 數學公式支援

## 開發階段規劃

### Phase 1: 基礎架構
- 設定 Next.js 靜態網站生成
- 實作 `npm run copy-obsidian-vault` 複製指令
- 建立基本的檔案路由系統
- 實作 Markdown 基礎渲染

### Phase 2: 核心功能
- 實作檔案導覽側邊欄
- 建立靜態生成系統，在 build 時將 Obsidian 檔案結構對應到網站的 URL 結構
- 完成基本的筆記瀏覽功能

### Phase 3: 功能增強
- 新增 Syntax Highlighting
- 整合 Mermaid 圖表
- 支援 LaTeX 數學公式

### Phase 4: 進階功能
- Obsidian Canvas 支援
- 搜尋功能
- 標籤系統