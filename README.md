# GSI-Protocol 演講簡報

用 [Slidev](https://sli.dev/) 製作的 GSI-Protocol 介紹簡報（約 30 分鐘，繁體中文）。

## 環境

- [Bun](https://bun.sh/)
- Node 18+

## 開始

```bash
bun install        # 安裝相依套件
bun run dev        # 本地預覽（自動開瀏覽器，http://localhost:3030）
```

編輯 `slides.md` 即可即時看到變更。

## 簡報操作

- `空白鍵` / `→`：下一步（含逐項動畫）
- `←`：上一步
- `o`：投影片總覽
- `d`：暗色 / 亮色切換
- `g`：跳到指定頁
- 講者備忘稿：每頁 `<!-- -->` 註解，按 `p` 或在 presenter 模式可見（`/presenter`）

## 匯出

```bash
bun run build        # 匯出成靜態網站（dist/），可部署到任何靜態主機
bun run export       # 匯出 PDF / PNG（需要 playwright-chromium）
```

> 匯出 PDF 第一次會提示安裝 `playwright-chromium`，依指示安裝即可。

## 檢查版面破版

`bun run check` 會用 Playwright 載入 Slidev 的 `/export/` 路由（會展開所有 `v-click`，
等於現場按過去後的最壞情況），逐頁量測內容是否超出投影片的 552px 畫布高度，找出會被裁切的頁面。

```bash
bun run check   # 自動起 dev server → 逐頁量測 → 關閉；有破版時印出 ⚠️ OVERFLOW
```

- 自行管理 dev server，跑完即關，不需另開終端機。
- 若已有 dev server 在跑，可用 `BASE=http://localhost:3030 bun run check` 重用它。
- 有任何頁面破版時 exit code 為 `1`，方便接進 CI。

## 內容大綱

1. 開場提問：AI 寫的功能你怎麼知道「對」？
2. AI 輔助開發的痛點
3. GSI = Gherkin · Structure · Implement
4. 核心理念：規格驅動、架構優先
5. 四階段工作流程（PM → 架構師 → 工程師 → QA）
6. Phase 1–3 逐一拆解
7. SpecBridge 專章：是什麼、怎麼運作、範例與輸出（`@api` 驗收引擎）
8. Phase 4 驗證（`@api` → SpecBridge、`@ui` → playwright-bdd）
9. 關鍵創新：讓 Gherkin 可執行
8. 安裝、多平台、指令一覽
9. 自動模式實跑流程
10. GSI vs 傳統 vs BDD 對照
11. 效益總結與首尾呼應
