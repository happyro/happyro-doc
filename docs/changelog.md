# 更新日志

## 2026-08-28

- 增加 GitHub Pages 自动构建部署，并配置 `happyro.org` 自定义域名。

## 2026-08-27

- 补充 Docker kRO 资源目录权限设置，避免 Gateway 因非 root 用户无法读取资源而启动失败。
- 将 Docker 部署的数据库持久化目录统一为 `data/database`。
- 增加文档仓库 README，并将 AGENTS.md 更新为文档站专用规则。
- 删除与 Docker 安装重复的生产部署页面，首页部署入口改为直接打开 Docker 安装指南。
- 更新项目架构，补充 HappyRO Gateway 职责并移除旧的 `vendor/RemoteClient-JS` 目录说明。
- 将项目简介页面从 `architecture.md` 重命名为 `intro.md`，并同步更新站内导航链接。
- 将项目简介页面的侧栏名称从“项目架构”更新为“项目简介”。
- 将首页主要入口调整为在线演示和项目简介。
- 删除站内在线演示页面，将演示入口改为直接打开 HappyRO 演示站。
- 复核 Docker、Linux、macOS 和 Windows 安装流程，补齐 macOS 内部服务账号、Gateway 依赖和跨平台构建说明。
- 新增 Docker、Linux、macOS 和 Windows 安装分类，补充 macOS 原生启动流程、Docker 预构建镜像和本地构建方式，并改用独立的 HappyRO Gateway 仓库（锁定 `400dad7`）。
- 将社区文档整理到独立的 `docs/community/` 目录。

## 2026-08-26

- 按当前三仓库、HappyRO Gateway、rAthena 和 MariaDB 架构重写文档。
- 删除局域网专属地址、主机路径和固定环境版本等机器专属信息。
- 增加 Windows WSL2 安装指南、生产发布流程和公开演示说明。
- 更新汉化流程、归档边界、kRO 资源版权与获取说明。
- 固定页面滚动条占位，避免长短页面切换时发生横向抖动。

## 2026-08-23

- 建立 HappyRO VitePress 文档站点。
- 增加中文页面、本地搜索和项目导航。
- 接入 Ragnarok Online 图标与透明 Logo。
