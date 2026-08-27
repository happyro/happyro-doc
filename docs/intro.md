# 项目简介

HappyRO 是一个基于 [roBrowserLegacy](https://github.com/MrAntares/roBrowserLegacy) 的开源中文 RO 项目，致力于提供完整的中文体验和简单易用的部署方式，让玩家打开浏览器即可进入游戏，省去安装桌面客户端的麻烦，也让开发者能够更轻松地部署、维护和参与项目。

## 项目基线

| 项目 | 基线 |
| --- | --- |
| kRO 客户端资源 | 2021-11-05（`RAG_SETUP_211105.exe`） |
| `PACKETVER` | `20211103` |
| 服务端模式 | Renewal |

## 项目架构

HappyRO 由一个编排仓库和三个应用仓库组成。根仓库负责配置、中文运行时覆盖、构建脚本和运行编排；`happyro-client` 维护 roBrowserLegacy 派生客户端；`happyro-server` 维护 rAthena 派生服务端；`happyro-gateway` 维护浏览器客户端与服务端之间的 Node.js 网关。

| 仓库 | 职责 |
| --- | --- |
| [happyro](https://github.com/happyro/happyro) | 配置、部署编排、资源覆盖和维护脚本 |
| [happyro-client](https://github.com/happyro/happyro-client) | roBrowserLegacy 派生客户端和 PWA |
| [happyro-server](https://github.com/happyro/happyro-server) | rAthena 派生服务端 |
| [happyro-gateway](https://github.com/happyro/happyro-gateway) | Node.js 静态资源、WebSocket 和 Web API 网关 |

四个仓库分别维护自己的 Git 历史，并只推送到各自的 `origin`。

## 请求链路

```text
浏览器 / PWA
      │ HTTPS 或 HTTP
      ▼
反向代理（生产环境可选）
      │
      ▼
HappyRO Gateway
      ├── PWA 与 kRO 运行资源
      ├── WebSocket ──────────────┐
      └── HTTP API ───────────────┤
                                  ▼
                       rAthena login / char / map / web
                                  │
                                  ▼
                              MariaDB
```

浏览器只访问 Gateway 或其前方的反向代理。Gateway 发布 `happyro-client` 构建的 PWA，读取 kRO 资源和中文覆盖文件，将浏览器 WebSocket 请求转发到 rAthena 的 login、char 和 map 服务，并在同一来源代理 rAthena Web API。生产环境应只公开 Gateway 或反向代理的 HTTP/HTTPS 端口，数据库和 rAthena 端口限制在容器网络、本机或受控网络中。

## 根仓库目录

| 路径 | 职责 |
| --- | --- |
| `configs/` | 客户端运行配置 |
| `deploy/` | Docker、MariaDB、rAthena 和 Gateway 部署配置 |
| `inputs/official/` | 只读的官方输入材料 |
| `inputs/runtime/kro-20211105/client/` | 本地准备且不进入 Git 的 kRO 运行资源 |
| `localization/client/data/` | 当前发布使用的客户端中文覆盖 |
| `repos/happyro-client/` | HappyRO roBrowserLegacy 派生仓库与 PWA 构建产物 |
| `repos/happyro-server/` | HappyRO rAthena 派生仓库 |
| `repos/happyro-gateway/` | HappyRO Gateway 独立仓库 |
| `deploy/docker/` | 数据库、服务端和 Gateway 镜像及 Compose 配置 |
| `deploy/mariadb/` | 物理部署使用的 MariaDB 配置和初始化脚本 |
| `deploy/rathena/` | 物理部署使用的 rAthena 运行配置 |
| `deploy/remote-client/` | 物理部署使用的 Gateway 环境配置 |
| `scripts/` | 配置、构建、启动、停止和验证脚本 |
| `tools/` | 翻译、资源审计和维护工具 |
| `versions/` | 客户端、服务端和 Gateway 的锁定基线 |
| `changelog/` | 根仓库的变更记录 |
| `artifacts/` | 可交付的生成结果 |
| `work/` | 物理部署的数据库数据、构建目录、日志和运行时密钥 |

`repos/`、`inputs/runtime/`、`artifacts/` 和 `work/` 均不由根仓库提交。
