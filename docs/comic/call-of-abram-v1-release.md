# 第15章《亚伯兰蒙召》发布记录

日期：2026-11-10。经文：创世记12:1–9。中文版8页36格。

- 用户已确认完整分镜并要求保持原有人物和漫画风格；8页中文图已生成、校对。用户本次明确要求同步GitHub与Vercel，授权接入并发布。
- 新章ID call-of-abram，版次call-of-abram-v1；只声明中文可用，无新增具名人物和重复介绍页。第14章末页可继续进入新章。英文目录保持现有14章，已有英文漫画不变。
- 原图完整1024×1536展示，不裁切。8张图的来源核对哈希及格数见call-of-abram-v1-assets.json。剧本、提示词、初图、OCR与宣传素材不进入学生阅读页。
- 首页最近更新保持3章；中文显示15/14/13，英文保留14/13/12。PWA缓存更新为v36-call-of-abram。
- 当前阶段：内容已推送并在原Vercel正式站部署验证。普通构建、Vercel目标构建、52项测试及本机/正式浏览器验证通过。

## 正式发布结果

- 内容提交：a75f2e77e9d1a27f50458223bb83382c98932f22，原GitHub仓库main。
- 原Vercel检查success，部署：https://vercel.com/daniels-projects-ce806524/pcmc-walk-through-bible-story/PyCUZ44ZofUM2VyKX6aDmaaumoiw 。
- 阅读：https://pcmc-walk-through-bible-story.vercel.app/comic/read?chapter=call-of-abram&page=1 。
- 全部8图HTTP200且SHA-256匹配；首页、目录、新章介绍重定向、第14章末页、新章首末页及巴别塔反思共7入口通过。正式sw.js与本机字节一致。
- 浏览器验证真实翻页、8页末尾结束、390px图片加载完成并保持完整比例、中文15章与英文14章。捕获console error为空；Vercel连接器无原团队权限，未读取生产运行日志。
- 机器证据与截图保存于本机素材工作区output/comic/call-of-abram-v1/release-2026-11-10；不将本机检查脚本、OCR、原始提示词或截图放入学生阅读内容。
