# 第四章《园外的两兄弟》brothers-v1 发布记录

## 授权与范围

用户在收到12页50格完整分镜、新角色方案以及「绘制，并接入、发布到 App」确认问题后，回复「ok 帮我执行」。
经文：创世记4:1–16。章名：园外的两兄弟；id：brothers；edition：brothers-v1。
角色参考与12页漫画使用内建image_gen生成并逐格校对，参见 brothers-v1-qa.md。

## 本次改动

- 加入第四章目录、12页正式图像及阅读数据。
- 加入该隐、亚伯的首次人物介绍，前面章节不提前显示两兄弟。
- 第三章末页按现有导航进入第四章人物页，然后进入正文。
- 独立保存第四章阅读位置；12页完整显示，不裁切页底。
- PWA缓存更新为pcmc-bible-story-v18-brothers。
- 原有前三章图像、阅读数据和目录顺序保留；作者稿、提示词、角色制作参考不出现在学生阅读页。
- 素材与提示词留存：创作工作区 output/comic/brothers-v1/；正式PNG位于 public/comics/brothers-v1/。

## 已完成验证

- npm test：25/25通过，含前三章回归、第四章全部12页路由、页码边界、角色登场顺序、阅读进度和章节衔接。
- VERCEL=1 npm run build：通过。
- git diff --check：通过。
- 12张本地PNG尺寸均为1024×1536；素材工作区与App图片逐张SHA-256一致。
- 12页50格，逐格图文核对与定向修正详情见QA记录。

## 发布状态

已发布并验证。12页50格已生成、校对、接入并上线；25项测试及Vercel正式构建通过。
正式阅读入口：https://pcmc-walk-through-bible-story.vercel.app/comic/read?chapter=brothers&page=1

## 正式部署与线上验证

- 内容发布提交：`2ef4c8e8222a3c551ee6241eb667b6e681ee18e7`。
- Vercel：https://vercel.com/daniels-projects-ce806524/pcmc-walk-through-bible-story/DFJTGcLZDTzb15wMBciTmxCHrdTe ，状态success。
- 线上验证时间：2026-09-17T17:02:20.150Z（UTC；马来西亚日期2026-09-18）。
- 12张正式PNG的SHA-256与本地终稿全部相同；12个阅读路由、目录、人物页、页码边界及v18缓存全部通过。
- 原前三章入口、第一章→第二章、第二章→第三章及第三章→第四章均核对；该隐与亚伯未提前出现在前章人物页。
- 浏览器实际操作：第三章第14页进入第四章人物页，开始阅读，下一页至第2页，页码选择至第12页，再返回第1页。末页全页截图可见底部文字，未裁切；末页下一页按钮禁用。预览留在第四章第1页。
- 线上报告：创作工作区 output/comic/brothers-v1/online-verification.json。正式发布后仅补充文档记录，不改变已验证的漫画或运行代码。
