# 實作計畫

## PRD 參考

**PRD 文件路徑：** `docs/specs/2025-09-13-notes-navigation-sidebar/prd.md`

> **重要提醒：** 實作過程中請經常參考 PRD 文件以了解：
>
> - 功能的商業目標和用戶價值
> - 完整的用戶故事和使用場景
> - 非功能性需求（性能、安全性等）
> - 系統架構和技術決策的背景脈絡

## 相關檔案

- `lib/notes.ts` - 現有的筆記檔案掃描和路由生成工具，需擴展以支援樹狀結構
- `app/notes/[...slug]/page.tsx` - 現有的筆記頁面元件，需整合側邊欄
- `app/layout.tsx` - 根布局檔案，可能需要調整以支援側邊欄
- `components/NotesTree.tsx` - 新建的樹狀導覽元件（需創建）
- `components/SidebarLayout.tsx` - 新建的側邊欄布局元件（需創建）
- `components/TreeNode.tsx` - 新建的樹狀節點元件（需創建）
- `hooks/useSidebarState.ts` - 新建的側邊欄狀態管理 hook（需創建）
- `hooks/useTreeState.ts` - 新建的樹狀結構狀態管理 hook（需創建）
- `lib/tree-utils.ts` - 新建的樹狀結構處理工具（需創建）
- `__tests__/components/NotesTree.test.tsx` - NotesTree 元件測試檔案
- `__tests__/components/SidebarLayout.test.tsx` - SidebarLayout 元件測試檔案
- `__tests__/components/TreeNode.test.tsx` - TreeNode 元件測試檔案（簡單測試即可）
- `__tests__/hooks/useSidebarState.test.ts` - 側邊欄狀態 hook 測試檔案
- `__tests__/hooks/useTreeState.test.ts` - 樹狀結構狀態 hook 測試檔案
- `__tests__/lib/tree-utils.test.ts` - 樹狀結構工具測試檔案
- `acceptance.feature` - Gherkin 格式的驗收測試場景

## 任務

- [ ] 1. 擴展筆記掃描功能以支援樹狀結構 - 使用 TDD 開發流程
  - 1.1 擴展 `scanNotesFiles()` 函數，返回包含資料夾和檔案的樹狀結構資料
  - 1.2 建立 `TreeNode` 介面定義樹狀節點的資料結構（包含名稱、類型、路徑、子節點等）
  - 1.3 實作 `buildNotesTree()` 函數，將檔案路徑列表轉換為樹狀結構
  - 1.4 確保支援中文檔名和深層巢狀結構
  - 1.5 為所有新函數編寫完整的單元測試

- [ ] 2. 建立樹狀結構工具函數 - 使用 TDD 開發流程
  - 2.1 實作樹狀節點的折疊/展開狀態管理邏輯
  - 2.2 建立路徑匹配函數，用於高亮目前頁面的筆記項目
  - 2.3 實作樹狀結構的搜尋和遍歷函數
  - 2.4 建立 URL 生成函數，將樹狀節點轉換為正確的筆記 URL
  - 2.5 為所有工具函數編寫完整的測試

- [ ] 3. 建立側邊欄狀態管理 hooks - 使用 TDD 開發流程
  - 3.1 實作 `useSidebarState` hook，管理側邊欄的展開/收合狀態
  - 3.2 實作 `useTreeState` hook，管理樹狀結構節點的折疊/展開狀態
  - 3.3 整合 localStorage 或 sessionStorage 來記住使用者偏好設定
  - 3.4 實作響應式邏輯，根據螢幕尺寸自動調整預設狀態
  - 3.5 為所有 hooks 編寫測試，包含邊界情況和錯誤處理

- [ ] 4. 建立樹狀導覽元件 - 使用 TDD 開發流程
  - 4.1 建立 `TreeNode` 元件，顯示單一樹狀節點（資料夾或檔案）
  - 4.2 實作資料夾的折疊/展開圖示和互動邏輯
  - 4.3 建立 `NotesTree` 元件，渲染完整的樹狀結構
  - 4.4 實作層級縮排和視覺化層級關係
  - 4.5 加入目前頁面的高亮顯示功能
  - 4.6 確保點擊筆記項目能正確導覽到對應頁面
  - 4.7 為所有元件編寫 React Testing Library 測試（TreeNode 可以是簡單測試）

- [ ] 5. 建立側邊欄布局元件 - 使用 TDD 開發流程
  - 5.1 建立 `SidebarLayout` 元件，包含側邊欄和主要內容區域
  - 5.2 實作側邊欄的收合/展開功能和動畫效果
  - 5.3 建立響應式設計，支援桌面版和手機版的不同行為
  - 5.4 實作手機版的覆蓋層模式和外部點擊關閉功能
  - 5.5 加入收合/展開按鈕和漢堡選單圖示
  - 5.6 確保側邊欄寬度符合設計需求（280-320px）
  - 5.7 為元件編寫完整的測試，包含響應式行為

- [ ] 6. 整合側邊欄到現有的筆記頁面
  - 6.1 修改 `app/notes/[...slug]/page.tsx`，使用新的側邊欄布局
  - 6.2 確保側邊欄在伺服器端正確生成樹狀結構資料
  - 6.3 整合現有的路由系統和安全性檢查
  - 6.4 優化效能，避免重複的檔案掃描
  - 6.5 確保所有現有功能繼續正常運作

- [ ] 7. 樣式設計和使用者體驗優化
  - 7.1 使用 Tailwind CSS 實作簡潔的視覺設計
  - 7.2 確保與現有頁面的設計語言一致
  - 7.3 實作平滑的收合/展開動畫
  - 7.4 優化手機版的使用體驗
  - 7.5 確保無障礙性（keyboard navigation、screen reader 支援）
  - 7.6 測試不同螢幕尺寸和瀏覽器的相容性

- [ ] 8. 執行驗收測試
  - 8.1 使用 AI 讀取 acceptance.feature 檔案
  - 8.2 透過指令或 MCP 瀏覽器操作執行每個場景
  - 8.3 驗證所有場景通過並記錄結果