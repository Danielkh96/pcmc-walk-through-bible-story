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

本地生成、校对、接入与测试已完成。GitHub推送、Vercel正式部署及线上验证待完成；不以本地构建代替上线结果。
正式阅读入口：https://pcmc-walk-through-bible-story.vercel.app/comic/read?chapter=brothers&page=1
