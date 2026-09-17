# 第二章《伊甸园》eden-v1 制作与发布记录

## 授权与范围

用户在收到完整10页43格分镜与逐页摘要后，明确要求“帮我生成，然后直接帮我发布到我的App去”。本次执行包括整章图像、人物细化、现有App接入、测试、GitHub推送与既有Vercel发布。第三章仅有预告，未制作。
正式章名：伊甸园。经文：创世记2:4–25。小昆、小君是虚构观察者。

## 当前状态

10页43格图像已由内建imagegen生成并逐格校对，已接入本地。npm test 21/21通过；Vercel正式构建通过。已通过连接的GitHub通道发布，Vercel正式部署成功，线上验证完成。

## 本地接入

- 新章节id：eden，edition：eden-v1。
- 新数据：app/comic/eden-pages.json；图片public/comics/eden-v1/。
- 目录新增第二章；补充亚当、女人的必要人物介绍；第一章最后一页沿现有导航进入第二章。
- 第一章16页及其edition不变，原有阅读进度保持按章隔离。
- 第二章图片完整展示，无旧页码遮罩。
- PWA缓存更新到pcmc-bible-story-v16-eden。
- 学生阅读页仅有正式图像与既有阅读控件。
- 提示词、原稿与校对素材保留本机；两份原有无关未跟踪文档及WhatsApp海报不加入此次提交。

## 2026-09-17 正式发布验证

- 发布提交：`a1c41e6cf99883563cd7947717016de2f397e354`。
- GitHub Vercel检查为success；部署： https://vercel.com/daniels-projects-ce806524/pcmc-walk-through-bible-story/ybErf6QgpNQFJ52wEYWaXs2qsRKu 。
- 正式阅读入口：https://pcmc-walk-through-bible-story.vercel.app/comic/read?chapter=eden&page=1 。
- 正式域名10张PNG的SHA-256与本地终稿全部一致；10条阅读路由、总目录、第二章人物介绍、第一章末页进入第二章、v16缓存均验证通过。
- 浏览器实测第一页面貌及下一页按钮正常；完整分镜与逐格画面校对见eden-v1-qa.md。
- 本机验证报告：`output/comic/eden-v1/online-verification.json`（创作工作区）。
- 本地原提交353c953保存在备份分支eden-local-validated-353c953；确认树完全相同后对齐线上提交，不改变工作文件。
