# HappyRO 文档站

[HappyRO](https://github.com/happyro/happyro) 的公开产品与安装文档，使用 VitePress 构建。

- 项目站点：[happyro.kugarocks.com](https://happyro.kugarocks.com)
- GitHub Pages：[happyro.org](https://happyro.org)

## 本地开发

文档目录与侧栏分类对应；新增或移动页面时，同步维护导航、正文链接及首页轮播引用。

| 目录 | 侧栏分类 |
| --- | --- |
| `docs/guide/` | 文档：项目简介、管理后台、关于汉化、资源下载 |
| `docs/game/` | 游戏画面：电脑桌面、手机平板 |
| `docs/container/` | 容器化部署 |
| `docs/native/` | 原生部署 |
| `docs/community/` | 社区 |
| `docs/changelog/` | 更新日志，按年／月归档 |

首页位于 `docs/index.md`。图片位于 `docs/public/images/`，按 `brand/`、`admin/`、`game/desktop/` 和 `game/mobile/` 分类。

```bash
npm ci
npm run docs:dev
```

构建检查：

```bash
npm run docs:build
```

## 内容维护

- docs 是公开站点正文；根 README 保存仓库开发说明，.vitepress 保存导航与主题。当前分类已与读者任务对应，不为减少文件数合并安装和玩家操作页。
- changelog 日期页与版本摘要的唯一来源是 HappyRO 根仓库；在根仓库执行 `python3 tools/changelog/manage.py sync`，再执行 `check`，不要在本站单独改写镜像正文。
- 页面移动时同步侧栏、首页、正文、图片及锚点引用；删除已过时页面前将有效规则并入当前页面，不建 archive 或保留无用转向页。
- 已发布版本的下载和 Release 保持原事实，开发中功能明确标记未发布；旧截图不能作为最新布局验收证据。
- 本地验证运行 docs:build，再核对生成页面的站内链接、锚点和 public 图片。生成的 dist、缓存与临时审计结果不提交。
- 推送 main 会触发 GitHub Pages 工作流；本地构建不等于部署完成。提交与发布仍遵守 AGENTS。
