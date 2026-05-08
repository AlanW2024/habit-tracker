-- 1% Discipline — 系統 Reset Script
-- 用法：Supabase Dashboard → SQL Editor → New query → 貼晒 → Run
--
-- 會清：habit、habit_logs、streak、draw 歷史、XP、level
-- 會保留：你自己加嘅獎勵卡（code 以 'u_' 開頭）+ 系統 seed 卡
-- 跑之前確認你係故意 reset。

begin;

-- 1. 清晒 habit + 對應 logs + streak（cascade）
delete from habits where user_id = '00000000-0000-0000-0000-000000000001';

-- 2. 清晒抽卡歷史
delete from draw_log where user_id = '00000000-0000-0000-0000-000000000001';

-- 3. Reset profile：XP 歸 0，level 歸 1
update profiles
set xp = 0, level = 1
where id = '00000000-0000-0000-0000-000000000001';

-- 注意：draw_cards 唔動。你嘅 reward 卡（code='u_...'）同系統 seed 卡都保留。
-- 如果連你嘅獎勵卡都想清，去 Table Editor → draw_cards → 手動篩 code 開頭 'u_' delete。

commit;

-- 確認清完。應該返：
--   habits = 0 行
--   habit_logs = 0 行
--   streak_state = 0 行
--   draw_log = 0 行
--   profiles.xp = 0
select
  (select count(*) from habits) as habits_count,
  (select count(*) from habit_logs) as logs_count,
  (select count(*) from streak_state) as streak_count,
  (select count(*) from draw_log) as draws_count,
  (select xp from profiles where id = '00000000-0000-0000-0000-000000000001') as profile_xp;
