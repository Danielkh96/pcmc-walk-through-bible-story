# 第十三章《巴别塔》中英文发布

2026-10-24，用户要求“帮我生成英文版，然后同步上传 github 和 vercel”。创11:1–9，中英文各8页34格。

- 英文由内置imagegen按中文最终成图逐页替换文字，保留人物、分镜及已校正的空置工地；逐页视觉校对完成。
- 仅本章新增群体“造城的人们”/The city builders，一份中英文人物资料；不重复旧人物，不添加具名首领。
- 第12章末页接第13章介绍；首页最新3章为13/12/11，完整目录保留13章；全书中英各135页、合计270张故事图片。
- 仅16张最终图片进入public/comics；脚本、提示词、初稿和宣传素材留在本机。PWA缓存v33-tower-of-babel，品牌图标保持v26。
- 当前已接入隔离发布副本；构建、测试、浏览器及正式发布验证尚待完成。

## 发布前验证

普通构建、Vercel目标构建、48项测试、定向ESLint与git diff --check通过。本地浏览器验证双语新人物页、英文首末图、中文末图、页码选择及末页切换保留第8页；未见浏览器控制台错误或横向溢出。8张英文逐页视觉校对完成，正文OCR辅助核对；第6页ago的a被OCR漏识别，已目视确认成图正确。16张最终图的尺寸与SHA-256清单已保存。

接下来通过既有GitHub main→Vercel Git集成发布；当前线上仍为第1–12章，不提前声称已上线。

## 正式发布验证结果

2026-10-24，《巴别塔》创11:1–9，中英文各8页34格。

- 内容提交：2b8a11299aabf54a822db1041b37a63c6dfdcf65。本机既有GitHub SSH身份推送Danielkh96/pcmc-walk-through-bible-story的main成功，原daniels-projects-ce806524/pcmc-walk-through-bible-story项目Vercel状态success；部署：https://vercel.com/daniels-projects-ce806524/pcmc-walk-through-bible-story/4qynqWSd3AK8qr1QPhdLcNXA5CRM。
- 普通构建、Vercel目标构建、48项测试、定向ESLint及git diff --check通过。浏览器实际验证中英文新群体介绍、英文首末图、中文末图、页码选择及末页语言切换保留第8页；未见控制台错误。
- 16张新线上图片SHA-256全部与最终本地图匹配；7个首页/目录/人物/阅读入口HTTP200。第12章末页接第13章新人物介绍，越界页99归到第8页。PWA缓存v33-tower-of-babel，品牌图标v26。
- 首页最近更新只展示第13、12、11章；完整目录保留13章。仅新增“造城的人们”一份双语资料，全书42份人物资料各首次介绍一次。
- 全书中英各135页，共270张故事图片。原稿、提示词、修改初稿与宣传海报留在本机；public/comics只加入本章16张最终图。
- 使用内置imagegen进行英文文字本地化，保留中文最终画面与剧情。正文OCR辅助核对，page6的ago被OCR漏识别a，已目视确认成图正确。
- 连接器不能读取该既有Vercel项目，因此生产运行日志未扫描，不声称日志为空；部署成功由GitHub上的原Vercel检查确认，并以正式域名HTTP、图片哈希和浏览器结果验证。
- 正式入口：https://pcmc-walk-through-bible-story.vercel.app/comic/chapter/tower-of-babel
- 机器证据：release-online-verification.json；浏览器证据：browser-verification.json，英文目录内production-preview.jpg。
