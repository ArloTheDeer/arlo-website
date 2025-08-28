# language: zh-TW
功能: Copy Obsidian Vault 指令
  作為 開發者
  我想要 執行 npm run copy-obsidian-vault 指令來同步 Obsidian 筆記
  以便 在網站上看到最新的筆記內容

  背景:
    假設 專案根目錄存在
    並且 package.json 中已定義 copy-obsidian-vault 腳本

  場景: 成功複製 Obsidian vault 內容
    假設 config.yaml 檔案存在並包含有效的 obsidian_vault_path
    並且 指定的 Obsidian vault 路徑存在且包含筆記檔案
    並且 public/notes-src 目錄已存在（包含舊內容）
    當 執行 npm run copy-obsidian-vault 指令
    那麼 public/notes-src 目錄應該被完全清空並重建
    並且 Obsidian vault 中的所有筆記檔案應該被複製到 public/notes-src
    並且 原有的資料夾結構應該被保持
    並且 指令應該成功完成（exit code 0）

  場景: 正確過濾系統檔案和目錄
    假設 config.yaml 檔案存在並包含有效的 obsidian_vault_path
    並且 Obsidian vault 包含以下檔案和目錄:
      | 檔案/目錄名稱    | 類型 | 應被複製 |
      | notes.md        | 檔案 | 是       |
      | .obsidian/      | 目錄 | 否       |
      | .trash/         | 目錄 | 否       |
      | .DS_Store       | 檔案 | 否       |
      | folder/note.md  | 檔案 | 是       |
    當 執行 npm run copy-obsidian-vault 指令
    那麼 public/notes-src 應該包含 notes.md
    並且 public/notes-src 應該包含 folder/note.md
    並且 public/notes-src 不應該包含 .obsidian 目錄
    並且 public/notes-src 不應該包含 .trash 目錄
    並且 public/notes-src 不應該包含 .DS_Store 檔案

  場景: config.yaml 檔案不存在時的錯誤處理
    假設 config.yaml 檔案不存在
    當 執行 npm run copy-obsidian-vault 指令
    那麼 指令應該失敗並顯示錯誤訊息
    並且 錯誤訊息應該提到 config.yaml 檔案不存在
    並且 指令的 exit code 應該不為 0

  場景: Obsidian vault 路徑不存在時的錯誤處理
    假設 config.yaml 檔案存在但包含不存在的 obsidian_vault_path
    當 執行 npm run copy-obsidian-vault 指令
    那麼 指令應該失敗並顯示錯誤訊息
    並且 錯誤訊息應該提到 Obsidian vault 路徑不存在
    並且 指令的 exit code 應該不為 0

  場景: public/notes-src 目錄不存在時的正常運作
    假設 config.yaml 檔案存在並包含有效的 obsidian_vault_path
    並且 public/notes-src 目錄不存在
    當 執行 npm run copy-obsidian-vault 指令
    那麼 public/notes-src 目錄應該被建立
    並且 Obsidian vault 中的檔案應該被複製到 public/notes-src
    並且 指令應該成功完成（exit code 0）

  場景: npm 腳本正確設定
    假設 package.json 檔案存在
    當 檢查 package.json 的 scripts 區段
    那麼 應該存在名為 copy-obsidian-vault 的腳本
    並且 該腳本應該指向正確的腳本檔案路徑

  場景: 必要依賴套件已安裝
    假設 package.json 檔案存在
    當 檢查專案依賴
    那麼 shelljs 套件應該被安裝
    並且 js-yaml 套件應該被安裝
    並且 @types/shelljs 應該被安裝為 devDependency

  場景: .gitignore 正確設定
    假設 .gitignore 檔案存在
    當 檢查 .gitignore 內容
    那麼 config.yaml 應該被排除在版控之外
    並且 public/notes-src 不應該被排除在版控之外

  場景: 設定檔範例正確提供
    假設 config-example.yaml 檔案存在
    當 檢查 config-example.yaml 內容
    那麼 檔案應該包含 obsidian_vault_path 欄位
    並且 應該包含範例路徑值
    並且 檔案格式應該是有效的 YAML