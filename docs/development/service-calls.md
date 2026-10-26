---
pageClass: service-calls responsive-tables
---

<script setup>
import MermaidDiagram from '../.vitepress/theme/MermaidDiagram.vue'
import browserEntry from './diagrams/browser-entry.mmd?raw'
import gameControl from './diagrams/game-control.mmd?raw'
import serverData from './diagrams/server-data.mmd?raw'
</script>

# 服务调用关系

本文说明当前 Docker 离线部署的服务调用关系。仓库职责见[架构与仓库边界](./architecture)，安装步骤见[Docker 安装](/deploy/docker)。图中实线箭头表示请求或数据访问方向，响应沿原连接返回；虚线表示一次性初始化，双向箭头表示服务间通信，不表示启动顺序。

图表支持放大、缩小和重置；窄屏可在图内横向滚动。图下文字和表格提供对应说明，图源也可展开查看。

## 浏览器入口

<MermaidDiagram title="玩家与管理员的请求入口" :source="browserEntry" />

玩家打开 Gateway 提供的 PWA，浏览器的页面、资源、游戏连接与冒险工具请求都从这个入口进入。管理员打开 Admin 提供的管理前端，Admin 的 Nginx 将 `/api/*` 代理到 Go API。

| 请求 | 经过的服务 | 用途 |
| --- | --- | --- |
| PWA 页面、图片、地图、音效 | 浏览器 → Gateway → 静态文件与挂载资源 | Gateway 提供页面并读取、解析游戏资源 |
| `/ws/*` | 浏览器 → Gateway → login / char / map | Gateway 将 WebSocket 转为游戏 TCP 连接 |
| `/api/game-session/*` | 浏览器 → Gateway → web-api | 游戏会话相关请求 |
| `/charconfig`、`/emblem`、`/MerchantStore`、`/party`、`/userconfig`、`/get` 及其子路径 | 浏览器 → Gateway → web-api | rAthena 原生 Web 功能 |
| `/api/adventure-tools/*` | 浏览器 → Gateway → Go API | 玩家冒险工具的资料查询与业务操作 |
| 后台 `/api/*` | 管理员浏览器 → Admin / Nginx → Go API | 后台身份认证、管理和资料接口 |

登录、选角、进入地图时，客户端按阶段通过 Gateway 连接相应的 login、char、map。普通移动与战斗封包的路径是 **浏览器 → Gateway → map**，不会逐条经过 Go API、login 和 char。

## 后台和冒险工具如何操作游戏

<MermaidDiagram title="业务接口到实时游戏操作的调用链" :source="gameControl" :max-width="680" />

需要读取或修改实时游戏状态的功能，经 Go API 做身份、权限和业务校验，再通过带 Token 的 `/game-control/v1/*` 请求 web-api。web-api 通过共享目录里的 Unix Socket 转给 map，由 map 校验当前游戏状态并执行；结果沿原请求链返回。

Go API 也直接访问数据库，并读取资料图片和自定义目录。资料查询、管理数据操作等不必全部走 map；不能把每个冒险工具接口都理解成四段转发。

::: info API 与 web-api 的分工
`api` 是 happyro-api 仓库的 Go 后端，服务后台和玩家工具。`web-api` 是 happyro-server 镜像运行的 rAthena `web-server`，承担游戏 Web 功能与受控游戏操作入口。两者是不同服务。
:::

玩家工具调用 Go API，便于与后台共用业务规则、权限与资料查询；移动、战斗等实时游戏逻辑仍由 Server 处理。

## 游戏服务与数据库

<MermaidDiagram title="游戏服务内部通信与数据库访问" :source="serverData" />

login 与 char、char 与 map 通过服务间协议协作。各服务按自身职责访问同一个 MariaDB 实例；图中的 SQL 箭头不表示它们拥有相同的数据库权限。

| 数据库 | 内容 |
| --- | --- |
| `happyro` | 游戏账号、角色和存档等数据 |
| `happyro_log` | 游戏日志 |
| `happyro_admin` | 管理账号、后台会话、业务记录等管理数据 |

`api-init` 使用 API 镜像执行迁移、初始管理账号创建和资料导入，正常完成后退出。它不是常驻 API 服务，也不参与玩家请求转发。默认游戏账号与角色由 Database 首次空库初始化创建。

## 镜像、服务和端口

五类镜像对应八个常驻服务和一个一次性任务；PWA 已构建在 Gateway 镜像中，没有独立 Client 容器。

| 镜像 | Compose 服务 | 主要职责 | 默认端口 |
| --- | --- | --- | --- |
| Gateway | `gateway` | PWA、资源、HTTP / WebSocket 代理 | 宿主机 `3338` → 容器 `3338` |
| Admin | `admin` | 管理前端及 API 反向代理 | 宿主机 `8000` → 容器 `8080` |
| API | `api` | Go 业务接口 | 内部 `8080` |
| API | `api-init` | 一次性初始化 | 不提供常驻入口 |
| Server | `login` | 登录认证 | 内部 `6900` |
| Server | `char` | 角色选择、角色数据 | 内部 `6121` |
| Server | `map` | 地图、战斗、NPC、实时操作 | 内部 `5121`，另有控制 Unix Socket |
| Server | `web-api` | rAthena Web 与 Game Control | 内部 `8889` |
| Database | `database` | MariaDB | 内部 `3306` |

当前 Compose 默认只向宿主机发布 Gateway 与 Admin 两个入口。其余端口用于 Docker 网络内通信；`web-api → map` 控制链使用共享 Unix Socket，不是 TCP 5121。图中未展开日志、自定义配置等全部文件挂载。

`HAPPYRO_GATEWAY_PUBLISH_ADDRESS`、`HAPPYRO_ADMIN_PUBLISH_ADDRESS` 可调整宿主机入口端口。[隔离验收工具](./offline-acceptance)会另选本机端口并绑定回环地址，不一定使用 3338 和 8000。本机源码开发的进程地址以对应环境配置为准。

## 实现依据

- [Compose 服务和端口](https://github.com/happyro/happyro/blob/main/deploy/docker/compose.yml)
- [Gateway 路由与 WebSocket 代理](https://github.com/happyro/happyro-gateway/blob/main/index.js)
- [Admin Nginx API 代理](https://github.com/happyro/happyro-admin/blob/main/deploy/docker/nginx.conf)
- [Go API 游戏控制客户端](https://github.com/happyro/happyro-api/blob/main/internal/game/gateway.go)
- [web-api 到 map 的控制转发](https://github.com/happyro/happyro-server/blob/main/src/web/game_control_controller.cpp)
