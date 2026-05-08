-- Translate the 11 system draw_cards from Cantonese to standard Traditional Chinese (Taiwan Mandarin).
-- User-defined cards (code starts with 'u_') are not touched.

update draw_cards set title = 'Builder',           copy = '你今天是 build something 的人。'                                where code = 'id_builder';
update draw_cards set title = '舉鐵的人',          copy = '你今天抵抗了惰性，肌肉記得你這個選擇。'                       where code = 'id_lifter';
update draw_cards set title = '閱讀的人',          copy = '你的大腦今天多了一條神經連結。'                               where code = 'id_reader';
update draw_cards set title = '寫字的人',          copy = '你今天又坐下來寫，這就是作家的樣子。'                          where code = 'id_writer';
update draw_cards set title = '靜悄悄的勝利',      copy = '沒有人為你鼓掌，但你自己知道。'                                where code = 'quiet_win';

update draw_cards set title = '三日定型',          copy = '研究說 21 天養成一個 habit。你已經走了 3 天。'                  where code = 'milestone_3';
update draw_cards set title = '一星期身份',        copy = '一星期。你開始不再是那個沒完成的自己。'                         where code = 'milestone_7';
update draw_cards set title = '重寫劇本',          copy = '昨天的你 vs 今天的你 — 現在是 1.01x。'                          where code = 'reframe_1';

update draw_cards set title = '複利登場',          copy = '1.01 ^ 100 = 2.7。你已經走完了第一天。'                         where code = 'compound_1';
update draw_cards set title = '三十天的人',        copy = '你現在是一個堅持了 30 天的人。這不算小。'                       where code = 'streak_30';

update draw_cards set title = '身份重啟',          copy = '你已經不是去年那個你。新名稱由你定。'                          where code = 'legend_id';
