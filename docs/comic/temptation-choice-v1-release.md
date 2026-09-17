# 第三章《试探与选择》制作与发布记录

## 授权与内容

用户审核稿入口已提供后，明确回复“帮我执行”，授权14页62格、新美术方案、生成、接入及发布。
经文：创世记3:1–24。章名：试探与选择；id：temptation；edition：temptation-choice-v1。
造型参考与14页漫画已由内建imagegen生成并校对；详见temptation-choice-v1-qa.md。
第四章仅有《园外的两兄弟》预告，未制作。

## 本地接入

- 第三章目录与14页数据已加入；第二章末页沿既有导航进入第三章。
- 必要人物介绍新增蛇，依据创3:1；基路伯在故事末页的经文画面中呈现，不在章前透露离园结局。
- 女人仍以既有名称进入章前介绍，命名“夏娃”留在第12页。
- 第一章16页、第二章10页图片与edition保持；第三章有独立edition用于阅读进度验证。
- 新图1024×1536完整展示，不启用旧页码遮罩；无分镜或制作备注出现在阅读页。
- PWA缓存更新pcmc-bible-story-v17-temptation。
- 本机提示词、设计参考、选图清单保存于创作工作区；无关草稿和WhatsApp海报不加入提交。

## 验证状态

图片与本地接入已完成。npm test 23/23通过，VERCEL=1 npm run build通过；GitHub发布、Vercel正式部署及全部14页线上验证已完成。

## 正式发布验证

- 发布提交：`304c7ebbe95fe159785497fc88d2cddbcbd7de14`。
- Vercel检查success；正式部署：https://vercel.com/daniels-projects-ce806524/pcmc-walk-through-bible-story/BZJr1XJstmexScHgRVkbv1dWrsms 。
- 阅读入口：https://pcmc-walk-through-bible-story.vercel.app/comic/read?chapter=temptation&page=1 。
- 14张PNG的SHA-256与本地终稿全部一致；14个阅读路由、目录、第三章人物介绍、第一章→第二章与第二章→第三章、v17缓存全部核对通过。
- 浏览器实际点击第二章末页进入第三章介绍，再进入正文；下一页按钮与页码跳到第14页正常；末页底部预告完整，没有裁切。
- 验证时间：2026-09-17T13:29:07.652Z。本机报告：创作工作区output/comic/temptation-choice-v1/online-verification.json。
- 上传前比较Git树，与本地测试版本完全一致；第一、二章PNG未改变。
