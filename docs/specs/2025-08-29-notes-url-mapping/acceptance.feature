# language: zh-TW
功能: 筆記網址映射系統
  作為 網站訪問者
  我想要 透過網址直接訪問筆記內容
  以便 快速獲取我需要的筆記資訊

  背景:
    假設 Next.js 應用程式已經啟動
    並且 public/notes-src 目錄包含測試筆記檔案
    並且 系統已設定為靜態輸出模式

  場景: 基本筆記網址映射
    假設 存在筆記檔案 "public/notes-src/00-journal/2025-08.md"
    當 使用者訪問網址 "/notes/00-journal/2025-08"
    那麼 應該顯示該筆記的內容
    並且 頁面狀態碼應該是 200
    並且 內容應該以純文字格式呈現

  場景: 巢狀目錄筆記訪問
    假設 存在筆記檔案 "public/notes-src/30-resources/templates/Project Template.md"
    當 使用者訪問網址 "/notes/30-resources/templates/Project%20Template"
    那麼 應該顯示該筆記的內容
    並且 頁面狀態碼應該是 200

  場景: 中文檔案名稱支援
    假設 存在筆記檔案 "public/notes-src/20-area/Arlo The Deer 角色設定.md"
    當 使用者訪問網址 "/notes/20-area/Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A"
    那麼 應該顯示該筆記的內容
    並且 頁面狀態碼應該是 200
    並且 內容應該正確解碼中文字符

  場景: 深層巢狀目錄支援
    假設 存在筆記檔案 "public/notes-src/40-archives/00-journal/人生待辦事項.md"
    當 使用者訪問網址 "/notes/40-archives/00-journal/%E4%BA%BA%E7%94%9F%E5%BE%85%E8%BE%A6%E4%BA%8B%E9%A0%85"
    那麼 應該顯示該筆記的內容
    並且 頁面狀態碼應該是 200

  場景: 不存在的筆記檔案處理
    假設 不存在筆記檔案對應路徑 "non-existent-note"
    當 使用者訪問網址 "/notes/non-existent-note"
    那麼 應該顯示 404 錯誤頁面
    並且 頁面狀態碼應該是 404

  場景: 開發模式功能驗證
    假設 執行 "npm run dev" 啟動開發伺服器
    當 開發伺服器啟動完成後
    那麼 使用者應該能正常訪問所有筆記路徑
    並且 內容顯示應該與靜態建置版本一致
    並且 熱重載功能應該正常運作

  場景: 靜態建置驗證
    假設 執行 "npm run build" 建置指令
    當 建置完成後
    那麼 應該產生所有筆記的靜態 HTML 檔案
    並且 out 目錄應該包含對應的筆記路徑結構
    並且 建置過程應該沒有錯誤

  場景大綱: 多種檔案路徑格式測試
    假設 存在筆記檔案 "<file_path>"
    當 使用者訪問網址 "<url_path>"
    那麼 應該顯示該筆記的內容
    並且 頁面狀態碼應該是 200

    例子:
      | file_path                                          | url_path                                          |
      | public/notes-src/00-journal/2025-08-22.md         | /notes/00-journal/2025-08-22                      |
      | public/notes-src/00-journal/2025-08-23.md         | /notes/00-journal/2025-08-23                      |
      | public/notes-src/30-resources/templates/monthly-template.md | /notes/30-resources/templates/monthly-template |

  場景: URL 編碼解碼功能驗證
    假設 系統需要處理包含特殊字符的檔案名稱
    當 檔案名稱包含空格、中文字符或其他特殊符號
    那麼 系統應該正確進行 URL 編碼
    並且 能夠正確解碼 URL 以對應實際檔案路徑
    並且 不應該因為編碼問題導致檔案無法找到

  場景: 純文字內容渲染驗證
    假設 筆記檔案包含 Markdown 語法內容
    當 使用者訪問該筆記頁面
    那麼 內容應該以純文字形式顯示
    並且 不應該渲染 Markdown 語法（如 # 標題、**粗體** 等）
    並且 應該保持原始文字格式和換行

  場景: 系統效能測試
    假設 public/notes-src 目錄包含大量筆記檔案
    當 執行靜態建置
    那麼 建置時間應該在合理範圍內
    並且 不應該因為檔案數量過多而導致記憶體不足
    並且 所有檔案都應該成功生成對應的靜態頁面