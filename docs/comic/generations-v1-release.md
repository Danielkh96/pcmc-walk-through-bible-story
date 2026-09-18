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

## 英文版发布（2026-09-19）

- 英文正式漫画9页，发布目录：`public/comics/generations-v1-en/`。
- 正式提交：`acc39592cc3c7b3848ca8b73e3027e35028ae01d`（`Publish English edition of chapter 5`）。
- 英文界面现在显示5章，章节人物介绍与阅读器均按已保存语言载入英文内容。
- 第6页使用跨世代的生活方式表述，不宣称所有职业发生在以诺城。
- 第7页保留拉麦话语中“一个人”与“一个年轻人”的分别；第9页保持“塞特有了儿子 → 给他起名以挪士”的顺序。

### 验证结果

- `npm test`：28项全部通过；Vinext正式构建通过。
- GitHub `main` 推送成功。
- Vercel提交状态：success（Deployment has completed）。
- 英文首页显示5章；英文人物介绍、阅读第1页和第9页均通过实际浏览器验证。
- `page-01.png`至`page-09.png`全部返回HTTP 200；线上SHA-256与发布源文件一致。

英文阅读入口：https://pcmc-walk-through-bible-story.vercel.app/comic/read?chapter=generations&page=1

