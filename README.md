# 1% — 自律打卡 (Habit Tracker)

每日 1% 進步。以行為心理學為基礎嘅 habit tracker，避開 rigid streak、Day 1
overload、self-tangible bribe 三大 anti-pattern。

## 設計哲學（已 lock 喺 Plan）

- **Day 1 cap = 2 habits**（21 日後解鎖加），符合 Lally (2010) 共識
- **Streak = never miss twice**（James Clear），missed once 顯示中性 grey dot
- **強制 if-then planning**（Gollwitzer meta d=.61，最高 ROI 介入）
- **Reward = system-VR 抽卡**，內容係 identity / progress card，**唔係**「睇一集劇」呢類 tangible bribe
- **冇「You broke streak!」shame copy**

完整研究 references 見 `/Users/yeehowong/.claude/plans/i-want-to-crystalline-ritchie.md`。

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind v4 + 自家 design tokens
- Supabase (Postgres) — single-user MVP，無 Auth
- canvas-confetti / lucide-react / zod / date-fns
- PWA (manifest)，可加 home screen

## Setup（5 分鐘）

```bash
# 1. 安裝
npm install

# 2. Supabase 設定
cp .env.local.example .env.local
# 開 supabase.com → 新建 project → 複製 URL + anon key 入 .env.local

# 3. 跑 schema migration
# 落 Supabase Dashboard → SQL Editor → 貼晒 supabase/migrations/0001_init.sql 跑

# 4. 啟動
npm run dev
# 訪問 http://localhost:3000
```

未設定 Supabase 會自動 redirect 到 `/setup` 頁有 step-by-step 指引。

## 路由

| 路徑 | 用途 |
|---|---|
| `/today` | 今日 habits、tap 完成、即時抽卡 |
| `/calendar` | 月曆 heatmap |
| `/stats` | 30 日統計 + 抽卡記錄 + weekly retro prompt |
| `/onboarding/new` | 強制 if-then 嘅新增 habit form |
| `/setup` | env 缺嘅 fallback 教學 |

## 文件結構

```
src/
├── app/
│   ├── (main)/           # 有底部 nav 嘅頁面
│   │   ├── layout.tsx
│   │   ├── today/
│   │   ├── calendar/
│   │   └── stats/
│   ├── onboarding/new/   # 強制 if-then form
│   ├── setup/            # env 缺 fallback
│   ├── layout.tsx        # root
│   ├── page.tsx          # / → redirect
│   ├── manifest.ts       # PWA
│   └── globals.css       # design tokens
├── components/           # BottomNav, HabitCard, MonthlyHeatmap, ConfettiBurst, CardReveal
└── lib/
    ├── supabase/         # config + server + browser
    ├── types.ts          # TS types matching schema
    ├── domain.ts         # streak / xp / weekly target logic
    ├── identity.ts       # level → identity title
    ├── db.ts             # query functions
    └── actions.ts        # Server Actions (createHabit, completeHabit, archiveHabit)

supabase/
└── migrations/
    └── 0001_init.sql     # Phase 1 full schema + seed cards
```

## Phase Roadmap

- ✅ **Phase 1** Core loop + onboarding + heatmap + 抽卡（呢個 commit）
- ⏳ **Phase 2** Supabase Auth + RLS、多裝置 sync
- ⏳ **Phase 3** PWA service worker + offline queue + Web Push 提示
- ⏳ **Phase 4** 30 日真正用，記錄 friction，再決定加 feature

## 單用戶 MVP 注意

- DB 已 seed 一個 `00000000-0000-0000-0000-000000000001` profile，係你自己
- 目前**無 RLS**（schema 預留位）。你個 Supabase project 唔好開放畀其他人
- 加 Auth 之前，唔好 deploy 出公開 internet
