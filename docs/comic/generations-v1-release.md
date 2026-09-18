# 第五章《一代又一代》发布记录

发布日期：2026-09-18

经文范围：创世记4:17–26

版本：`generations-v1`

提交：`4f6a06977fc2841e504b7f0890ed3e7634a745f0`

## 已发布内容

- 中文正式漫画9页、39格。
- 新增拉麦、亚大、洗拉、雅八、犹八、土八·该隐、拿玛和塞特的人物资料。
- 中文首页和目录显示5章。
- 英文界面保持已有4章；第5章英文图片完成前不显示本章。
- 同批部署包括英文封面，以及人物介绍中“夏娃 / Eve”的名称修正。

## 验证结果

- `npm test`：28项全部通过。
- Vinext正式构建通过。
- Vercel提交状态：success。
- 正式首页、目录、第5章人物介绍、阅读第1页和第9页均返回HTTP 200。
- `page-01.png`至`page-09.png`全部返回HTTP 200；线上SHA-256与仓库源文件一致。

正式网站：https://pcmc-walk-through-bible-story.vercel.app/

章节入口：https://pcmc-walk-through-bible-story.vercel.app/comic/chapter/generations
