const en = {
  title: "Teacher workspace", denied: "Teacher access is required.", login: "Sign in as a teacher", account: "Teacher account",
  students: "Assigned learners", all: "All", student: "Anonymous learner ID", language: "Interface language", level: "HSK level",
  sessions: "Practice sessions", from: "From (UTC)", to: "Through (UTC)", kind: "Practice type",
  filter: "Apply filters", invalidFilter: "Check the learner ID and date filters.", reset: "Clear filters", audioZip: "Original audio ZIP",
  started: "Started (UTC)", ended: "Ended (UTC)", status: "Status", completed: "Completed", open: "Open",
  inspect: "View session", none: "No records match.", unavailable: "The teacher workspace is unavailable.",
  limits: "Showing up to 200 sessions. Use the filters to narrow exports to 5,000 records or 10 recordings.",
  turns: "Turns", detail: "Session details", back: "Back to teacher workspace",
  learner: "Learner reply", assistant: "AI reply", original: "Original transcript", recording: "Original microphone recording",
  download: "Download this recording", feedback: "Feedback", hint: "Hint", revised: "Revises turn", changes: "Correction mode changes",
  summary: "Session feedback", topic: "Topic", noTopic: "Free conversation", scenario: "Scenario", opening: "Opening",
  kinds: { topic: "Topic", chat: "Voice chat", call: "Phone practice" },
};

const zh: typeof en = {
  title: "教师后台", denied: "需要教师权限。", login: "登录教师账户", account: "教师账户",
  students: "已分配的学生", all: "全部", student: "匿名学生 ID", language: "界面语言", level: "HSK 等级",
  sessions: "练习会话", from: "开始日期（UTC）", to: "截止日期（UTC）", kind: "练习方式",
  filter: "筛选", invalidFilter: "请检查学生 ID 和日期筛选。", reset: "清除筛选", audioZip: "原始录音 ZIP",
  started: "开始时间（UTC）", ended: "结束时间（UTC）", status: "状态", completed: "已完成", open: "进行中",
  inspect: "查看会话", none: "没有匹配的记录。", unavailable: "教师后台暂不可用。",
  limits: "最多显示 200 条会话。可通过筛选将数据导出限定在 5,000 条以内、录音导出限定在 10 段以内。",
  turns: "话轮", detail: "会话详情", back: "返回教师后台",
  learner: "学生回复", assistant: "AI 回复", original: "原始转录", recording: "麦克风原始录音",
  download: "下载该录音", feedback: "反馈", hint: "提示", revised: "修正话轮", changes: "纠错模式切换",
  summary: "会话反馈", topic: "话题", noTopic: "自由交流", scenario: "情景", opening: "开场",
  kinds: { topic: "话题", chat: "语音聊天", call: "电话式练习" },
};

export const teacherCopy = { en, zh };
