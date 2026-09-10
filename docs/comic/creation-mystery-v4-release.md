# 创造天地：神秘开场版 v4

## 范围与授权

2026-09-11：用户确认16页、78格审核稿，明确授权生成图片、接入 App、上传 GitHub、部署 Vercel，并把不使用的旧漫画集中归档，不直接删除。

## 制作状态

- 16页、78格图片已完成逐格校对并接入 App；15张重制、1张保留。GitHub/Vercel发布及正式域名全页校验已完成。
- 使用内建 imagegen；每页提示词与生成原件保存在本机 `output/comic/creation-mystery-v4/`。
- 新版前15页按精修稿制作；第16页保留符合对白和分镜的批准结尾，只隐藏旧底部页码。所有图片1024×1536，新页无裁剪。
- 正文不向学生显示分镜、提示词或校对说明。

## 本机归档

单一目录：`/Users/danieltan/Desktop/Walk Through Bible Story/archive/comics-before-mystery-v4-2026-09-11/`。

归档在仓库之外，不随 App 发布。已实际移动276个文件：旧制作目录8个、200个文件；App旧图片70张和停用JSON数据6个。逐一 SHA-256 验证通过，记录见 `workspace-manifest.json` 和 `app-manifest.json`。替换前目录/页码快照另行保存。保留版结尾已复制到新版目录，不依赖归档；因此用户以后可将归档整夹移到废纸篓。本次没有永久删除旧素材。

不归档或移除仍在使用的封面与人物设定图。WhatsApp 宣传海报继续本机保留，不加入 GitHub。

## 验证与发布

- `npm test`：19/19通过，含16页资源、尺寸、路由、旧章重定向与归档无依赖测试。
- `VERCEL=1 npm run build`：通过，生成Vercel/Nitro产物。
- 阅读版本改为 `creation-mystery-v4`，旧进度不跳过新前奏；SW缓存改为 `pcmc-bible-story-v15-creation-mystery`。
- GitHub：`4b9d9d562b3ec8398934c0a7e8cd599504066707` 已推送 `main`。
- Vercel：既有GitHub连接自动触发Production部署 `dpl_BJDp6Xd2QKoEDZ1ZE65fyYNoqcyH`，状态Ready，正式域名别名已切换。
- 本机和 `https://pcmc-walk-through-bible-story.vercel.app`：16张PNG逐张SHA-256匹配，16条阅读路由均引用新版图片且总页数16；SW版本正确；抽查旧版图片URL均404。
- 测试/构建无误，代码eslint及diff whitespace检查通过。两份无关未跟踪制作文档和WhatsApp海报未纳入本次提交。
