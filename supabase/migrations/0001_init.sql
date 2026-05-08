-- 1% Discipline Habit Tracker — Phase 1 schema
-- Single-user MVP. RLS off for now; enable in Phase 2 when adding auth.

create extension if not exists "uuid-ossp";

-- ---------- profiles (single row for self-use) ----------
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  display_name text default 'You',
  level int not null default 1,
  xp int not null default 0,
  created_at timestamptz not null default now()
);

-- Seed the single self-user with a stable id.
-- The app reads this id from NEXT_PUBLIC_SELF_USER_ID.
insert into profiles (id, display_name)
values ('00000000-0000-0000-0000-000000000001', 'You')
on conflict (id) do nothing;

-- ---------- habits ----------
create type habit_type as enum ('daily_must', 'weekly_target');
create type habit_difficulty as enum ('tiny', 'normal', 'stretch');

create table if not exists habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  type habit_type not null,
  target_qty numeric not null default 1,
  unit text not null default '次',
  if_then text not null check (length(if_then) >= 6),  -- forced
  cue_time time,
  difficulty habit_difficulty not null default 'tiny',
  weekly_goal int not null default 5 check (weekly_goal between 1 and 7),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);

create index if not exists habits_user_active_idx on habits(user_id) where active;

-- ---------- habit_logs ----------
create table if not exists habit_logs (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid not null references habits(id) on delete cascade,
  log_date date not null default current_date,
  qty numeric not null default 1,
  note text,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create index if not exists habit_logs_habit_date_idx
  on habit_logs(habit_id, log_date desc);

-- ---------- streak_state ----------
create type streak_status as enum ('on_track', 'missed_once', 'alert');

create table if not exists streak_state (
  habit_id uuid primary key references habits(id) on delete cascade,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_completed_date date,
  status streak_status not null default 'on_track',
  updated_at timestamptz not null default now()
);

-- ---------- draw_cards ----------
create type card_rarity as enum ('common', 'rare', 'epic', 'legendary');

create table if not exists draw_cards (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  rarity card_rarity not null default 'common',
  title text not null,
  copy text not null,
  weight numeric not null default 1
);

-- Seed: identity / progress / encouragement cards (NOT tangible bribes)
insert into draw_cards (code, rarity, title, copy, weight) values
  ('id_writer',   'common',    '寫字嘅人',     '你今日又坐低寫，呢個就係作家嘅樣。', 30),
  ('id_lifter',   'common',    '舉鐵嘅人',     '你今日抵抗咗惰性，肌肉記得你呢個選擇。', 30),
  ('id_reader',   'common',    '閱讀嘅人',     '你嘅大腦今日多咗一條神經連結。', 30),
  ('id_builder',  'common',    'Builder',     '你今日係 build something 嘅人。', 30),
  ('milestone_3', 'rare',      '三日定型',     '研究話 21 日成 habit。你已經行咗 3 日。', 12),
  ('milestone_7', 'rare',      '一星期身份',   '一星期。你開始唔再係嗰個冇完成嘅自己。', 10),
  ('reframe_1',   'rare',      '重寫劇本',     '昨日嘅你 vs 今日嘅你 — 而家係 1.01x。', 12),
  ('quiet_win',   'common',    '靜悄悄嘅勝利', '冇人為你鼓掌，但你自己知道。', 25),
  ('compound_1',  'epic',      '複利登場',     '1.01 ^ 100 = 2.7。你已經行咗第一日。', 4),
  ('streak_30',   'epic',      '三十日嘅人',   '你而家係一個堅持咗 30 日嘅人。呢個唔細。', 3),
  ('legend_id',   'legendary', '身份重啟',     '你已經唔係去年嗰個你。新名稱由你定。', 1)
on conflict (code) do nothing;

-- ---------- draw_log ----------
create table if not exists draw_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  card_id uuid not null references draw_cards(id),
  trigger text not null,  -- 'daily_complete' | 'weekly_target' | 'streak_milestone'
  drawn_at timestamptz not null default now()
);

create index if not exists draw_log_user_time_idx
  on draw_log(user_id, drawn_at desc);

-- ---------- helper view: today completion ----------
create or replace view today_completion as
select
  h.id as habit_id,
  h.name,
  h.type,
  h.target_qty,
  h.unit,
  h.difficulty,
  h.weekly_goal,
  l.qty as completed_qty,
  l.note,
  (l.id is not null) as completed_today
from habits h
left join habit_logs l
  on l.habit_id = h.id and l.log_date = current_date
where h.active = true;
