# 项目架构

HappyRO 由三个独立 Git 仓库和一个固定版本的网关依赖组成。根仓库负责配置、中文运行时覆盖、构建脚本和运行编排；`happyro-client` 维护 roBrowserLegacy 派生客户端；`happyro-server` 维护 rAthena 派生服务端。

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
      ├── WebSocket ───────────────┐
      └── 同源 HTTP API ──────────┤
                                  ▼
                       rAthena login / char / map / web
                                  │
                                  ▼
                              MariaDB
```

浏览器只访问网关或其前方的反向代理。网关发布 `repos/happyro-client/dist/Web` 中的 PWA，通过 WebSocket 连接 rAthena，并在同一来源代理 rAthena Web API。生产环境应只公开反向代理的 HTTP/HTTPS 端口，数据库、rAthena 和网关端口均限制在本机或受控网络中。

## 仓库与目录

| 路径 | 职责 |
| --- | --- |
| `configs/` | 客户端运行配置 |
| `deploy/` | MariaDB、rAthena、网关及演示环境配置 |
| `inputs/official/` | 只读的官方输入材料 |
| `inputs/runtime/kro-20211105/client/` | 本地准备且不进入 Git 的 kRO 运行资源 |
| `localization/client/data/` | 当前发布使用的客户端中文覆盖 |
| `repos/happyro-client/` | HappyRO roBrowserLegacy 派生仓库与 PWA 构建产物 |
| `repos/happyro-server/` | HappyRO rAthena 派生仓库 |
| `vendor/robrowserlegacy-remote-client-js/` | 固定上游版本并应用 HappyRO 补丁的网关 |
| `scripts/` | 配置、构建、启动、停止和验证脚本 |
| `work/` | 数据库数据、日志及其他本地生成内容 |

`repos/`、`vendor/`、`inputs/runtime/` 和 `work/` 均不由根仓库提交。根仓库、客户端和服务端分别推送到各自的 `origin`。

## 固定协议

客户端与服务端固定使用 `PACKETVER=20211103`、Renewal 模式和一致的封包设置。官方 kRO 2021-11-05 输入资源保持只读，产品翻译只维护在客户端、服务端和 `localization/client/data/` 的当前源码中。

## 运行方式

本地开发使用 Docker Compose 启动 MariaDB，并使用 systemd transient units 管理 rAthena 与网关。演示发布使用 `demo` 分支生成生产包，在目标 Linux 主机上由持久化 systemd unit、物理 MariaDB 和反向代理管理。
