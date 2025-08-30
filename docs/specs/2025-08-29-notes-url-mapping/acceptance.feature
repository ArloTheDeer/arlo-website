# language: zh-TW
功能: 筆記網址映射功能
  作為網站訪問者
  我想要透過直觀的網址訪問筆記內容
  以便快速找到我需要的資訊

  背景:
    假設 筆記檔案已存放在 public/notes-src 目錄下
    並且 Next.js 應用程式已設定為靜態輸出模式
    並且 所有筆記路由已正確生成

  場景: 基本筆記檔案映射
    假設 存在檔案 "public/notes-src/00-journal/2025-08.md"
    當 我訪問網址 "http://localhost/notes/00-journal/2025-08"
    那麼 頁面應該成功載入
    並且 應該顯示該筆記檔案的純文字內容
    並且 頁面標題應該包含筆記檔案名稱

  場景: 深層巢狀目錄映射
    假設 存在檔案 "public/notes-src/30-resources/templates/Project Template.md"
    當 我訪問網址 "http://localhost/notes/30-resources/templates/Project%20Template"
    那麼 頁面應該成功載入
    並且 應該顯示該筆記檔案的純文字內容

  場景: 中文檔案名稱支援
    假設 存在檔案 "public/notes-src/20-area/Arlo The Deer 角色設定.md"
    當 我訪問網址 "http://localhost/notes/20-area/Arlo%20The%20Deer%20%E8%A7%92%E8%89%B2%E8%A8%AD%E5%AE%9A"
    那麼 頁面應該成功載入
    並且 應該顯示該筆記檔案的純文字內容
    並且 URL 編碼應該正確解碼為對應的檔案名稱

  場景: 靜態建置生成測試
    假設 執行指令 "npm run build"
    當 建置過程完成
    那麼 應該在 out 目錄生成對應的靜態 HTML 檔案
    並且 每個筆記檔案都應該有對應的靜態頁面
    並且 生成的 HTML 檔案應該包含正確的筆記內容

  場景: 404 錯誤處理
    假設 不存在檔案 "public/notes-src/non-existent/file.md"
    當 我訪問網址 "http://localhost/notes/non-existent/file"
    那麼 應該顯示 404 錯誤頁面
    並且 HTTP 狀態碼應該為 404

  場景大綱: 多種檔案路徑映射驗證
    假設 存在檔案 "<file_path>"
    當 我訪問網址 "<url>"
    那麼 頁面應該成功載入
    並且 應該顯示對應的筆記內容

    例子:
      | file_path                                              | url                                                      |
      | public/notes-src/00-journal/2025-08-22.md            | http://localhost/notes/00-journal/2025-08-22            |
      | public/notes-src/00-journal/2025-08-29.md            | http://localhost/notes/00-journal/2025-08-29            |
      | public/notes-src/30-resources/templates/daily-template.md | http://localhost/notes/30-resources/templates/daily-template |
      | public/notes-src/30-resources/templates/文獻筆記範本.md | http://localhost/notes/30-resources/templates/%E6%96%87%E7%8D%BB%E7%AD%86%E8%A8%98%E7%AF%84%E6%9C%AC |

  場景: URL 編碼解碼正確性驗證
    假設 筆記檔案包含各種特殊字符在檔案名稱中
    當 這些檔案名稱被轉換為 URL 路徑
    那麼 URL 編碼應該正確處理中文字符
    並且 空格應該編碼為 %20
    並且 解碼後應該能正確對應到檔案系統路徑

  場景: 跨平台路徑處理
    假設 應用程式運行在不同作業系統上
    當 處理檔案路徑和 URL 映射時
    那麼 路徑分隔符應該正確處理
    並且 Windows 和 Unix 路徑格式都應該被支援
    並且 生成的靜態檔案結構應該在所有平台上一致