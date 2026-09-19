# 第七章《挪亚的时代》发布批次

日期：2026-09-19。授权：用户「帮我发布」，本批仅第七章。

- 版本：noahs-time-v1，创6:1–22，中文10页44格。
- 原图来自本机审阅稿，10张1024×1536原图完整接入，不裁页脚。
- 目录保留第7章原编号，第6章暂未取得追加发布确认。
- 新增挪亚、闪、含、雅弗、挪亚的妻子、三个儿妇介绍；人物外观为艺术呈现，妻子及儿妇不编造姓名。
- 英文目录仅显示已完成英文版的第1–5章；直接访问新章自动使用中文画面。
- PWA缓存：pcmc-bible-story-v21-noahs-time-zh。

## 发布前检查

- Vercel目标构建通过；本地Vinext构建通过。
- 31项Node测试通过，改动文件ESLint通过。
- 全项目tsc发现原有use-language返回类型及Cloudflare类型声明问题；本批没有新增对应类型错误，未擅改无关平台代码。
- 独立Playwright Chrome验证：首页目录入口→人物介绍→正文10页、上一页、键盘翻页、英文偏好回退、既有第5章英文、390px手机无横向溢出；页面运行错误为空。
- WhatsApp海报、旧草稿、环境文件和生成过程文件不包含在发布提交中。

## 上线状态

已完成 GitHub 主分支推送及 Vercel Git 自动部署。

- 内容提交：418cc04fa6dfc4bd15ce5bdcea948d83e6a1f7d7。
- Vercel：dpl_DoY7SEG3qAMC3aF8hKAsUMr5QVm2，Production，Ready，构建45秒。
- 正式章节：https://pcmc-walk-through-bible-story.vercel.app/comic/chapter/noahs-time
- 直接阅读：https://pcmc-walk-through-bible-story.vercel.app/comic/read?chapter=noahs-time&page=1
- 正式浏览器验证：目录→人物介绍→10页正文全部通过，手机无横向溢出，页面运行错误为空。
- 10张线上图片全部HTTP200，SHA-256与批准图一致；线上sw.js已为v21。
- 本次部署错误级日志查询：未找到错误日志；未配置额外监控或日志转存，不等同于持续监控。
- 第六章仍未发布，未擅自改变章号或添加未经确认的发布内容。
