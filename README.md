# BUILDMODE GEN-AI HACKATHON 2026 資訊站

無框架、無建置步驟的靜態網站。以任一靜態檔案伺服器發布專案根目錄即可。頁面透過 jsDelivr 載入 Anime.js 4.2.2；若套件載入失敗，所有資訊與主要互動仍可正常使用。

## 本機預覽

```bash
python3 -m http.server 8000
```

開啟 `http://localhost:8000`。

## 正式網站

- GitHub repository：<https://github.com/sitcon-tw/hackathon2026>
- GitHub Pages：<https://hackathon2026.sitcon.org>

## 更新活動資料

主要資料都位於 `script.js` 頂部：

- `SITE_CONFIG.links.lightningTalk`：閃電講表單 URL
- `SITE_CONFIG.links.submission`：作品繳交表單 URL
- `announcements`：最新公告
- `schedule`：三日時程與高亮時間區間
- `teams`：正式隊伍名單
- `resources`：下載項目與檔案路徑
- `finalists.js` 的 `finalistTeams`：總排名前 10 名
- `finalists.js` 的 `waitlistTeams`：候補名單

隊伍格式：

```js
{ id: "T001", name: "Team Name", track: "01", members: 4 }
```

表單 URL 設定完成後，按鈕會在 `SITE_CONFIG.actionRelease` 指定時間開放。若 URL 仍為空字串，按鈕會安全維持停用並顯示「連結待主辦補上」。

要上架廠商資源時，將檔案放入 `resources/`，再於 `resources` 陣列填入相對路徑。個人兌換碼、API Key 或含個資的檔案不應放入公開下載區。
