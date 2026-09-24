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
